'use client'

import { useEffect, useState } from 'react'
import { createCheckoutSession } from '@/app/actions/lemonsqueezy'
import { Loader2 } from 'lucide-react'

interface CheckoutProps {
  productId: string
}

export function Checkout({ productId }: CheckoutProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function initiateCheckout() {
      try {
        const { url } = await createCheckoutSession(productId)
        // Redirect to Lemon Squeezy checkout
        window.location.href = url
      } catch (err) {
        console.error('[v0] Checkout error:', err)
        setError('Failed to create checkout session. Please try again.')
        setIsLoading(false)
      }
    }

    initiateCheckout()
  }, [productId])

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="ml-3 text-muted-foreground">Redirecting to checkout...</p>
    </div>
  )
}
