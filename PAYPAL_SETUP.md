# PayPal Integration Setup

This application uses PayPal for payment processing. Follow these steps to configure PayPal for your warrior configurator.

## Prerequisites

1. A PayPal Business account
2. Access to the PayPal Developer Dashboard

## Setup Steps

### 1. Get PayPal Credentials

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Navigate to **Apps & Credentials**
3. Select **Sandbox** for testing or **Live** for production
4. Create a new app or use an existing one
5. Copy your **Client ID** and **Secret**

### 2. Configure Environment Variables

Add the following environment variables to your Vercel project (or `.env.local` for local development):

```env
# PayPal Configuration
PAYPAL_CLIENT_ID=your_client_id_here
PAYPAL_CLIENT_SECRET=your_secret_here
PAYPAL_MODE=sandbox  # Use 'live' for production

# Public keys for frontend
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_client_id_here
```

**Note:** The `NEXT_PUBLIC_PAYPAL_CLIENT_ID` should be the same as `PAYPAL_CLIENT_ID`.

### 3. Test with Sandbox

PayPal provides sandbox test accounts for testing payments:

1. In the [Developer Dashboard](https://developer.paypal.com/dashboard/), go to **Sandbox** → **Accounts**
2. You'll see test buyer and seller accounts
3. Use these credentials to test purchases without real money

**Sandbox Buyer Account:**
- Login to PayPal during checkout with sandbox credentials
- All transactions are simulated

### 4. Go Live

When ready for production:

1. Switch to **Live** in the PayPal Developer Dashboard
2. Get your **Live** credentials (Client ID and Secret)
3. Update environment variables:
   - Set `PAYPAL_MODE=live`
   - Use live Client ID and Secret
4. Complete PayPal's business verification process

## Payment Flow

1. **User clicks purchase** → `createPayPalOrder` action is called
2. **Order created** → PayPal returns order details
3. **User approves payment** → PayPal processes the transaction
4. **Payment captured** → `capturePayPalOrder` action is called
5. **Purchase recorded** → Database is updated with ownership

## Product Pricing

All prices are set in `/lib/products.ts`:
- Individual items: $1.99
- Themed bundles (3 items): $4.99
- Complete bundles (all items): $23.99

## Testing Checklist

- [ ] Individual item purchase
- [ ] Themed bundle purchase (Knight Set/Raider Set)
- [ ] Complete bundle purchase (all items)
- [ ] User sees purchased items unlocked
- [ ] Configuration save works after purchase
- [ ] Payment cancellation handled gracefully

## Troubleshooting

**"PayPal SDK not loading"**
- Check that `NEXT_PUBLIC_PAYPAL_CLIENT_ID` is set correctly
- Verify the Client ID is valid for your selected mode (sandbox/live)

**"Order creation failed"**
- Verify `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` are correct
- Check `PAYPAL_MODE` matches your credentials (sandbox vs live)

**"Purchase not recorded"**
- Check Supabase database tables exist
- Verify RLS policies allow inserts
- Check server logs for errors

## Security Notes

- Never expose `PAYPAL_CLIENT_SECRET` to the client
- All order creation and capture happens server-side
- PayPal handles payment processing securely
- Purchases are verified before being recorded in the database

## Support

- [PayPal Developer Documentation](https://developer.paypal.com/docs/)
- [PayPal Checkout Integration Guide](https://developer.paypal.com/docs/checkout/)
- [PayPal SDK Reference](https://developer.paypal.com/sdk/js/reference/)
