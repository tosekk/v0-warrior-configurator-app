'use client'

import { useState } from 'react'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { createPayPalOrder, capturePayPalOrder } from '@/app/actions/paypal'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface CheckoutProps {
  productId: string
  onSuccess?: () => void
}

export function Checkout({ productId, onSuccess }: CheckoutProps) {
  const [{ isPending }] = usePayPalScriptReducer()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleCreateOrder() {
    try {
      console.log('[v0] Creating order for product:', productId)
      const orderData = await createPayPalOrder(productId)
      console.log('[v0] Order data prepared:', orderData)
      
      // Create order with PayPal API
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create order')
      }
      
      const order = await response.json()
      console.log('[v0] PayPal order created:', order.id)
      
      if (!order.id) {
        throw new Error('No order ID returned from PayPal')
      }
      
      return order.id
    } catch (err) {
      console.error('[v0] Error creating order:', err)
      setError('Failed to create order. Please try again.')
      throw err
    }
  }

  async function handleApprove(data: { orderID: string }) {
    try {
      // Capture the payment on the server
      const result = await capturePayPalOrder(data.orderID)
      
      if (result.success) {
        // Record purchase in database
        const supabase = createClient()
        const { data: userData } = await supabase.auth.getUser()
        
        if (userData.user) {
          const customId = JSON.parse(
            result.order.purchase_units[0].payments.captures[0].custom_id || '{}'
          )
          
          await fetch('/api/webhooks/paypal/record-purchase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: userData.user.id,
              orderId: data.orderID,
              customId,
              amount: result.order.purchase_units[0].payments.captures[0].amount.value,
            }),
          })
        }
        
        if (onSuccess) {
          onSuccess()
        }
        router.push('/checkout/return?status=success')
      }
    } catch (err) {
      console.error('[v0] Error approving payment:', err)
      setError('Payment failed')
    }
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading PayPal...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <PayPalButtons
        createOrder={handleCreateOrder}
        onApprove={handleApprove}
        onError={(err) => {
          console.error('[v0] PayPal error:', err)
          setError('Payment failed. Please try again.')
        }}
        style={{
          layout: 'vertical',
          shape: 'rect',
        }}
      />
    </div>
  )
}
