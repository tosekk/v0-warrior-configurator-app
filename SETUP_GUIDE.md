# Warrior Configurator Setup Guide

Complete setup guide for authentication, email confirmation, and payment integration.

## Table of Contents
1. [Environment Variables](#environment-variables)
2. [Supabase Email Configuration](#supabase-email-configuration)
3. [PayPal Integration](#paypal-integration)
4. [Testing](#testing)

---

## Environment Variables

### Required Environment Variables

Add these to your Vercel project or `.env.local` file:

```env
# Supabase (automatically set by Vercel integration)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App URL (IMPORTANT: Set this to your production URL)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox  # Use 'live' for production
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
```

### Setting Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with appropriate values for:
   - **Production** (live site)
   - **Preview** (pull request previews)
   - **Development** (local development)

---

## Supabase Email Configuration

### Step 1: Configure Email Redirect URL

The app uses `NEXT_PUBLIC_APP_URL` to set the email confirmation redirect URL. This ensures confirmation emails link to your production site instead of localhost.

**In Vercel:**
1. Go to **Settings** → **Environment Variables**
2. Add `NEXT_PUBLIC_APP_URL` with your production URL
   ```
   NEXT_PUBLIC_APP_URL=https://your-warrior-app.vercel.app
   ```

**For Local Development:**
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 2: Configure Supabase Allowed Redirect URLs

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **URL Configuration**
4. Add these URLs to **Redirect URLs**:
   ```
   http://localhost:3000/auth/callback
   https://your-app.vercel.app/auth/callback
   https://*.vercel.app/auth/callback
   ```

### Step 3: Customize Email Templates (Optional)

1. In Supabase Dashboard, go to **Authentication** → **Email Templates**
2. Edit the **Confirm signup** template
3. Customize the message but keep the `{{ .ConfirmationURL }}` token

**Example Custom Template:**
```html
<h2>Welcome to Warrior Configurator!</h2>
<p>Click the link below to confirm your account and start creating your warrior:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
<p>This link expires in 24 hours.</p>
```

### How It Works

1. User signs up with Instagram username, email, and password
2. Supabase sends confirmation email with link to `/auth/callback`
3. User clicks link → redirected to app → auto-signed in
4. Profile is automatically created with Instagram username via database trigger

---

## PayPal Integration

### Step 1: Create PayPal App

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Click **Apps & Credentials**
3. Select **Sandbox** tab (for testing)
4. Click **Create App**
5. Name your app (e.g., "Warrior Configurator")
6. Click **Create App**

### Step 2: Get Your Credentials

After creating the app, you'll see:
- **Client ID** - Use for both `PAYPAL_CLIENT_ID` and `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
- **Secret** - Use for `PAYPAL_CLIENT_SECRET` (never expose publicly)

### Step 3: Add Environment Variables to Vercel

1. Go to Vercel Dashboard → Your Project
2. **Settings** → **Environment Variables**
3. Add the following:

```
PAYPAL_CLIENT_ID = <your_sandbox_client_id>
PAYPAL_CLIENT_SECRET = <your_sandbox_secret>
PAYPAL_MODE = sandbox
NEXT_PUBLIC_PAYPAL_CLIENT_ID = <your_sandbox_client_id>
```

### Step 4: Test with Sandbox Accounts

PayPal provides test accounts for sandbox mode:

1. In Developer Dashboard, go to **Sandbox** → **Accounts**
2. You'll see test Personal (buyer) and Business (seller) accounts
3. Click **View/Edit Account** to see test credentials

**Test Purchase Flow:**
1. User clicks purchase button
2. PayPal popup appears
3. Log in with sandbox Personal account credentials
4. Complete payment
5. Ownership is recorded in database

### Step 5: Go Live (Production)

When ready for real payments:

1. Switch to **Live** tab in PayPal Developer Dashboard
2. Create a new app or use existing
3. Get **Live** credentials (Client ID & Secret)
4. Update Vercel environment variables:
   ```
   PAYPAL_MODE = live
   PAYPAL_CLIENT_ID = <your_live_client_id>
   PAYPAL_CLIENT_SECRET = <your_live_secret>
   NEXT_PUBLIC_PAYPAL_CLIENT_ID = <your_live_client_id>
   ```
5. Complete PayPal business verification

### PayPal Pricing Structure

All prices are defined in `/lib/products.ts`:

**Individual Items** - $1.99 each
- Helmets (Knight, Horned, Spiked, Crown)
- Armor (Plate, Leather, Tribal, Scale)
- Weapons (Axe, Sword, Club, Dagger)
- Facial Hair (Full Beard, Goatee, Tusks, None)

**Themed Bundles** - $4.99 each
- **Human: Knight Set** - Knight Helmet + Plate Armor + Battle Axe
- **Goblin: Raider Set** - Spiked Helmet + Tribal Armor + Spiked Club

**Complete Bundles** - $23.99 each
- **Human Complete** - All 8 human items
- **Goblin Complete** - All 8 goblin items

---

## Testing

### Test Email Confirmation

1. Sign up with a real email you can access
2. Check inbox for confirmation email
3. Click confirmation link
4. Should redirect to your app at `/auth/callback`
5. Should auto-sign in and show "Welcome Back, Warrior!" notification

### Test Save Configuration

1. Sign in to the app
2. Customize your warrior (change helmet, armor, etc.)
3. Click **Save** button
4. Should see "Configuration Saved!" notification
5. Refresh page - configuration should persist

### Test PayPal Purchases

**Individual Item:**
1. Sign in
2. Try to select a locked item
3. Click **Purchase** ($1.99)
4. PayPal dialog opens
5. Log in with sandbox Personal account
6. Complete payment
7. Item should unlock immediately

**Bundle Purchase:**
1. Click **Knight Set** or **Raider Set** bundle ($4.99)
2. Complete PayPal payment
3. All 3 items in bundle should unlock

**Complete Bundle:**
1. Click **Complete Bundle** ($23.99)
2. Complete payment
3. All items for that race should unlock

### Verify Database Records

After purchases, check Supabase:
1. Go to **Table Editor** → `user_purchases`
2. Should see record with:
   - `user_id` (your user)
   - `product_id` (item purchased)
   - `paypal_order_id` (PayPal transaction ID)
   - `amount_paid` (price paid)

---

## Troubleshooting

### Email Not Sending

**Problem:** User doesn't receive confirmation email

**Solutions:**
- Check Supabase email settings (Authentication → Email)
- Verify email isn't in spam folder
- Ensure user's email is valid
- Check Supabase logs for errors

### Email Links to Localhost

**Problem:** Confirmation email links to localhost instead of production URL

**Solutions:**
- Verify `NEXT_PUBLIC_APP_URL` is set in Vercel
- Redeploy after adding environment variable
- Check variable is available in production environment

### PayPal Not Loading

**Problem:** PayPal buttons don't appear

**Solutions:**
- Verify `NEXT_PUBLIC_PAYPAL_CLIENT_ID` is set correctly
- Check browser console for errors
- Ensure Client ID matches the selected mode (sandbox/live)
- Check PayPal SDK is loading (Network tab)

### Purchase Not Recording

**Problem:** Payment completes but item doesn't unlock

**Solutions:**
- Check database RLS policies allow inserts
- Verify `user_purchases` table exists
- Check server logs for errors
- Ensure PayPal order capture succeeded

### Configuration Not Saving

**Problem:** Configuration doesn't persist after refresh

**Solutions:**
- Verify user is signed in
- Check `warrior_configurations` table exists
- Verify RLS policies allow upsert
- Check browser console for errors
- Ensure Supabase connection is working

---

## Security Checklist

- [ ] `PAYPAL_CLIENT_SECRET` is never exposed to client
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is server-side only
- [ ] All Supabase tables have RLS enabled
- [ ] Email redirect URLs are whitelisted in Supabase
- [ ] PayPal is in sandbox mode until ready for production
- [ ] Environment variables are set in Vercel for all environments

---

## Support Resources

- **Supabase Docs:** https://supabase.com/docs
- **PayPal Developer Docs:** https://developer.paypal.com/docs/
- **Next.js Docs:** https://nextjs.org/docs
- **Vercel Support:** https://vercel.com/help

---

## Quick Start Summary

1. **Set Environment Variables in Vercel:**
   - `NEXT_PUBLIC_APP_URL` (your production URL)
   - PayPal credentials (4 variables)
   
2. **Configure Supabase:**
   - Add redirect URLs in Authentication settings
   - (Optional) Customize email templates

3. **Test Everything:**
   - Sign up → Check email → Confirm account
   - Sign in → Save configuration
   - Purchase item → Verify unlock

4. **Go Live:**
   - Switch PayPal to live mode
   - Update live credentials in Vercel
   - Test one more time!
