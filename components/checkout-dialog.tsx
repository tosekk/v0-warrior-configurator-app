'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Checkout } from './checkout'

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
        </DialogHeader>
        <Checkout productId={productId} />
      </DialogContent>
    </Dialog>
  )
}
