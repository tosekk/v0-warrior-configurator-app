'use server'

import { stripe } from '@/lib/stripe'
import { PRODUCTS } from '@/lib/products'
import { headers } from 'next/headers'

export async function startCheckoutSession(productId: string) {
  // Look up the product on the server to prevent price manipulation
  const product = PRODUCTS.find((p) => p.id === productId)

  if (!product) {
    throw new Error('Product not found')
  }

  const headersList = await headers()
  const origin = headersList.get('origin') || 'http://localhost:3000'

  // Create a checkout session
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.priceInCents,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    return_url: `${origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
    metadata: {
      productId: product.id,
      productType: product.type,
      race: product.race || '',
      slot: product.slot || '',
      itemId: product.itemId || '',
      bundleItems: product.bundleItems ? JSON.stringify(product.bundleItems) : '',
    },
  })

  return session.client_secret
}

export async function getCheckoutSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  return {
    status: session.status,
    customer_email: session.customer_details?.email,
    payment_status: session.payment_status,
    metadata: session.metadata,
  }
}
