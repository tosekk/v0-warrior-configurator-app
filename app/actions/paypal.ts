'use server'

import { getProductById } from '@/lib/products'

export async function createPayPalOrder(productId: string) {
  try {
    const product = getProductById(productId)
    
    if (!product) {
      throw new Error('Product not found')
    }

    const customId = JSON.stringify({
      productId: product.id,
      productType: product.type,
      race: product.race || '',
      slot: product.slot || '',
      itemId: product.itemId || '',
      bundleItems: product.bundleItems || [],
    })

    // Return order data for PayPal API
    return {
      intent: 'CAPTURE',
      purchase_units: [
        {
          description: product.name,
          custom_id: customId,
          amount: {
            currency_code: 'USD',
            value: (product.priceInCents / 100).toFixed(2),
          },
        },
      ],
      application_context: {
        brand_name: 'Warrior Configurator',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/return`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}`,
      },
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
