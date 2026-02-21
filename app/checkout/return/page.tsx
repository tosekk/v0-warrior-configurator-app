import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutReturnPage() {
  // Lemon Squeezy handles payment confirmation via webhooks
  // This page just shows a success message
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="p-8 max-w-md text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Payment Complete!</h1>
        <p className="text-muted-foreground mb-6">
          Thank you for your purchase! Your new items will be available in the configurator shortly.
          Please refresh the page if they don't appear immediately.
        </p>
        <Button asChild>
          <Link href="/">Return to Configurator</Link>
        </Button>
      </Card>
    </div>
  )
}
