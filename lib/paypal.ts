export const paypalConfig = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
  currency: 'USD',
  intent: 'capture',
}

// PayPal server-side config (for order verification)
export const paypalServerConfig = {
  clientId: process.env.PAYPAL_CLIENT_ID!,
  clientSecret: process.env.PAYPAL_CLIENT_SECRET!,
  mode: process.env.PAYPAL_MODE || 'sandbox', // 'sandbox' or 'live'
}
