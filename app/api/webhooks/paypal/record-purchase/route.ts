import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getProductById } from '@/lib/products'

export async function POST(request: NextRequest) {
  try {
    const { userId, orderId, customId, amount } = await request.json()

    if (!userId || !orderId || !customId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { productId, productType, bundleItems } = customId

    // Determine which products to record
    let purchasesToInsert = []

    if (productType === 'bundle' && bundleItems && Array.isArray(bundleItems)) {
      // Themed bundle - record each item separately
      purchasesToInsert = bundleItems.map((itemId: string) => ({
        user_id: userId,
        product_id: itemId,
        paypal_order_id: orderId,
        amount_paid: 0, // Individual items don't have separate prices
      }))
    } else if (productType === 'complete_bundle') {
      // Complete bundle - record the bundle itself
      purchasesToInsert = [
        {
          user_id: userId,
          product_id: productId,
          paypal_order_id: orderId,
          amount_paid: parseFloat(amount) || 0,
        },
      ]
    } else {
      // Individual item
      purchasesToInsert = [
        {
          user_id: userId,
          product_id: productId,
          paypal_order_id: orderId,
          amount_paid: parseFloat(amount) || 0,
        },
      ]
    }

    // Insert purchases
    const { error } = await supabase
      .from('user_purchases')
      .insert(purchasesToInsert)

    if (error) {
      console.error('[v0] Error recording purchase:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    console.log('[v0] Purchase recorded:', purchasesToInsert.length, 'item(s)')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Error in record-purchase webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
