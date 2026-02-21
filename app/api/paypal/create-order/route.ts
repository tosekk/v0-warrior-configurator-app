import { NextRequest, NextResponse } from 'next/server'

const PAYPAL_API_URL = process.env.PAYPAL_MODE === 'live' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com'

async function getAccessToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64')

  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  const data = await response.json()
  return data.access_token
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()
    console.log('[v0] Creating PayPal order with data:', JSON.stringify(orderData, null, 2))
    
    const accessToken = await getAccessToken()
    console.log('[v0] Got PayPal access token')

    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderData),
    })

    const order = await response.json()
    console.log('[v0] PayPal API response:', JSON.stringify(order, null, 2))
    
    if (!response.ok) {
      console.error('[v0] PayPal API error:', order)
      return NextResponse.json(
        { error: order.message || 'Failed to create order' },
        { status: response.status }
      )
    }
    
    return NextResponse.json(order)
  } catch (error) {
    console.error('[v0] Error creating PayPal order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
