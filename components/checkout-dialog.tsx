'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { Checkout } from './checkout'
import { paypalConfig } from '@/lib/paypal'

interface CheckoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId: string | null
}

export function CheckoutDialog({ open, onOpenChange, productId }: CheckoutDialogProps) {
  if (!productId) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Your Purchase</DialogTitle>
          <DialogDescription>
            Secure checkout powered by PayPal. Complete your purchase to unlock your selected items.
          </DialogDescription>
        </DialogHeader>
        <PayPalScriptProvider
          options={{
            clientId: paypalConfig.clientId,
            currency: paypalConfig.currency,
            intent: paypalConfig.intent,
          }}
        >
          <Checkout 
            productId={productId} 
            onSuccess={() => onOpenChange(false)}
          />
        </PayPalScriptProvider>
      </DialogContent>
    </Dialog>
  )
}
