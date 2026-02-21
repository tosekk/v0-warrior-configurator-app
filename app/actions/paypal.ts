'use server'

import { getProductById } from '@/lib/products'

export async function createPayPalOrder(productId: string) {
  try {
    const product = getProductById(productId)
    
    if (!product) {
      throw new Error('Product not found')
    }

    // Return order data for PayPal SDK
    return {
      purchase_units: [
        {
          description: product.description,
          amount: {
            currency_code: 'USD',
            value: (product.priceInCents / 100).toFixed(2),
          },
          custom_id: JSON.stringify({
            productId: product.id,
            productType: product.type,
            race: product.race || '',
            slot: product.slot || '',
            itemId: product.itemId || '',
            bundleItems: product.bundleItems || [],
          }),
        },
      ],
    }
  } catch (error) {
    console.error('[v0] Error creating PayPal order:', error)
    throw error
  }
}

export async function capturePayPalOrder(orderId: string) {
  try {
    const { paypalServerConfig } = await import('@/lib/paypal')
    const base = paypalServerConfig.mode === 'live' 
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com'

    // Get access token
    const authResponse = await fetch(`${base}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${paypalServerConfig.clientId}:${paypalServerConfig.clientSecret}`
        ).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    })

    const { access_token } = await authResponse.json()

    // Capture the order
    const captureResponse = await fetch(`${base}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    })

    const captureData = await captureResponse.json()
    
    if (captureData.status === 'COMPLETED') {
      return { success: true, order: captureData }
    }

    throw new Error('Payment capture failed')
  } catch (error) {
    console.error('[v0] Error capturing PayPal order:', error)
    throw error
  }
}
