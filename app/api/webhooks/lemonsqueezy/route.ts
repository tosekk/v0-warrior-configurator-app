import crypto from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET

  if (!secret) {
    console.error('[v0] Missing LEMONSQUEEZY_WEBHOOK_SECRET')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  // Get the raw body
  const rawBody = await request.text()
  const signature = Buffer.from(request.headers.get('X-Signature') ?? '', 'hex')

  if (signature.length === 0 || rawBody.length === 0) {
    console.error('[v0] Invalid webhook request: missing signature or body')
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  // Verify the webhook signature
  const hmac = Buffer.from(
    crypto.createHmac('sha256', secret).update(rawBody).digest('hex'),
    'hex'
  )

  if (!crypto.timingSafeEqual(hmac, signature)) {
    console.error('[v0] Invalid webhook signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Parse the webhook data
  const data = JSON.parse(rawBody)
  const eventName = data['meta']['event_name']
  const attributes = data['data']['attributes']
  const customData = attributes['custom_data'] || {}

  console.log('[v0] Received Lemon Squeezy webhook:', eventName)

  // Handle order_created event
  if (eventName === 'order_created') {
    const userEmail = attributes['user_email']
    const productId = customData['product_id']
    const productType = customData['product_type']
    const bundleItems = customData['bundle_items'] ? JSON.parse(customData['bundle_items']) : null
    const orderId = data['data']['id']
    const amountPaid = attributes['total']

    console.log('[v0] Processing order for:', userEmail, 'product:', productId)

    // Get user from database by email
    const supabase = await createClient()
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', userEmail)
      .single()

    if (profileError || !profileData) {
      console.error('[v0] User not found for email:', userEmail)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userId = profileData.id

    // Handle bundle purchases - record all items in the bundle
    let purchasesToInsert = []

    if (productType === 'bundle' && bundleItems && Array.isArray(bundleItems)) {
      // Themed bundle - record each item separately
      purchasesToInsert = bundleItems.map((itemId: string) => ({
        user_id: userId,
        product_id: itemId,
        stripe_session_id: orderId,
        amount_paid: 0,
      }))
    } else if (productType === 'complete_bundle') {
      // Complete bundle - record the bundle itself
      purchasesToInsert = [{
        user_id: userId,
        product_id: productId,
        stripe_session_id: orderId,
        amount_paid: amountPaid || 0,
      }]
    } else {
      // Individual item purchase
      purchasesToInsert = [{
        user_id: userId,
        product_id: productId,
        stripe_session_id: orderId,
        amount_paid: amountPaid || 0,
      }]
    }

    // Record the purchase(s)
    const { error: purchaseError } = await supabase
      .from('user_purchases')
      .insert(purchasesToInsert)

    if (purchaseError) {
      console.error('[v0] Error recording purchase:', purchaseError)
      return NextResponse.json({ error: 'Error recording purchase' }, { status: 500 })
    }

    console.log('[v0] Purchase recorded successfully:', purchasesToInsert.length, 'item(s)')
  }

  return NextResponse.json({ message: 'Webhook processed' }, { status: 200 })
}
