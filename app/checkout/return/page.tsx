import { getCheckoutSession } from '@/app/actions/stripe'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle2, XCircle } from 'lucide-react'
import Link from 'next/link'

export default async function CheckoutReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const params = await searchParams
  const sessionId = params.session_id

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 max-w-md text-center">
          <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Invalid Session</h1>
          <p className="text-muted-foreground mb-6">
            No checkout session found.
          </p>
          <Button asChild>
            <Link href="/">Return to Configurator</Link>
          </Button>
        </Card>
      </div>
    )
  }

  const session = await getCheckoutSession(sessionId)

  if (session.payment_status === 'paid') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 max-w-md text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-6">
            Your purchase has been completed. Your new items are now available in
            the configurator!
          </p>
          <Button asChild>
            <Link href="/">Return to Configurator</Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="p-8 max-w-md text-center">
        <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
        <p className="text-muted-foreground mb-6">
          Your payment could not be processed. Please try again.
        </p>
        <Button asChild>
          <Link href="/">Return to Configurator</Link>
        </Button>
      </Card>
    </div>
  )
}
