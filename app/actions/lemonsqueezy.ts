'use server'

import { createCheckout } from '@lemonsqueezy/lemonsqueezy.js'
import { getProductById } from '@/lib/products'

export async function createCheckoutSession(productId: string) {
  try {
    // Get product details from our catalog
    const product = getProductById(productId)
    
    if (!product) {
      throw new Error('Product not found')
    }

    // Get the store and variant IDs from environment
    const storeId = process.env.LEMONSQUEEZY_STORE_ID
    const variantId = process.env[`LEMONSQUEEZY_VARIANT_${productId.toUpperCase().replace(/-/g, '_')}`]
    
    if (!storeId) {
      throw new Error('Store ID not configured')
    }

    if (!variantId) {
      throw new Error(`Variant ID not configured for product: ${productId}`)
    }

    // Create checkout session
    const checkout = await createCheckout(storeId, variantId, {
      checkoutData: {
        custom: {
          product_id: product.id,
          product_type: product.type,
          race: product.race || '',
          slot: product.slot || '',
          item_id: product.itemId || '',
          bundle_items: product.bundleItems ? JSON.stringify(product.bundleItems) : '',
        },
      },
    })

    if (!checkout?.data?.data?.attributes?.url) {
      throw new Error('Failed to create checkout session')
    }

    return { url: checkout.data.data.attributes.url }
  } catch (error) {
    console.error('[v0] Error creating checkout:', error)
    throw error
  }
}
