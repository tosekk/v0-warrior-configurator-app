import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js'

// Initialize Lemon Squeezy
lemonSqueezySetup({
  apiKey: process.env.LEMONSQUEEZY_API_KEY!,
  onError: (error) => {
    console.error('[v0] Lemon Squeezy Error:', error)
  },
})

export { lemonSqueezySetup }
