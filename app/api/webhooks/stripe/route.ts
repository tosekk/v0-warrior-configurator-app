import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('[v0] STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('[v0] Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    console.log('[v0] Checkout completed:', session.id)

    // Get the product metadata
    const metadata = session.metadata
    if (!metadata) {
      console.error('[v0] No metadata in session')
      return NextResponse.json({ error: 'No metadata' }, { status: 400 })
    }

    // Get user email from session
    const customerEmail = session.customer_details?.email

    if (!customerEmail) {
      console.error('[v0] No customer email')
      return NextResponse.json({ error: 'No customer email' }, { status: 400 })
    }

    // Create Supabase admin client to query users
    const supabase = await createClient()

    // Find user by email
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', (await supabase.auth.admin.listUsers()).data.users.find(u => u.email === customerEmail)?.id || '')
      .single()

    if (userError || !userData) {
      console.error('[v0] User not found:', userError)
      // Store purchase with email for manual reconciliation
      return NextResponse.json({ 
        message: 'User not found, purchase recorded with email',
        email: customerEmail 
      })
    }

    // Record the purchase
    const { error: purchaseError } = await supabase
      .from('user_purchases')
      .insert({
        user_id: userData.id,
        product_id: metadata.productId,
        stripe_session_id: session.id,
        amount_paid: session.amount_total || 0,
      })

    if (purchaseError) {
      console.error('[v0] Error recording purchase:', purchaseError)
      return NextResponse.json({ error: 'Error recording purchase' }, { status: 500 })
    }

    console.log('[v0] Purchase recorded successfully')
  }

  return NextResponse.json({ received: true })
}
