# Lemon Squeezy Setup Guide

This application uses Lemon Squeezy for payment processing. Follow these steps to configure your store.

## Required Environment Variables

Add these to your Vercel project or `.env.local` file:

```env
# Lemon Squeezy API Key (from Settings > API)
LEMONSQUEEZY_API_KEY=your_api_key_here

# Store ID (from your store URL or API)
LEMONSQUEEZY_STORE_ID=your_store_id_here

# Webhook Secret (created when setting up webhook)
LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_secret_here

# Product Variant IDs - create a product variant for each item/bundle
# Individual Items - Human
LEMONSQUEEZY_VARIANT_HUMAN_HELMET_KNIGHT=variant_id_here
LEMONSQUEEZY_VARIANT_HUMAN_HELMET_ROYAL=variant_id_here
LEMONSQUEEZY_VARIANT_HUMAN_HELMET_BARBARIAN=variant_id_here
LEMONSQUEEZY_VARIANT_HUMAN_HELMET_ARCHER=variant_id_here

LEMONSQUEEZY_VARIANT_HUMAN_ARMOR_PLATE=variant_id_here
LEMONSQUEEZY_VARIANT_HUMAN_ARMOR_LEATHER=variant_id_here
LEMONSQUEEZY_VARIANT_HUMAN_ARMOR_CHAINMAIL=variant_id_here
LEMONSQUEEZY_VARIANT_HUMAN_ARMOR_CLOTH=variant_id_here

LEMONSQUEEZY_VARIANT_HUMAN_WEAPON_AXE=variant_id_here
LEMONSQUEEZY_VARIANT_HUMAN_WEAPON_SWORD=variant_id_here
LEMONSQUEEZY_VARIANT_HUMAN_WEAPON_SPEAR=variant_id_here
LEMONSQUEEZY_VARIANT_HUMAN_WEAPON_BOW=variant_id_here

LEMONSQUEEZY_VARIANT_HUMAN_FACIAL_HAIR_FULL_BEARD=variant_id_here
LEMONSQUEEZY_VARIANT_HUMAN_FACIAL_HAIR_GOATEE=variant_id_here
LEMONSQUEEZY_VARIANT_HUMAN_FACIAL_HAIR_MUSTACHE=variant_id_here
LEMONSQUEEZY_VARIANT_HUMAN_FACIAL_HAIR_STUBBLE=variant_id_here

# Individual Items - Goblin
LEMONSQUEEZY_VARIANT_GOBLIN_HELMET_SPIKED=variant_id_here
LEMONSQUEEZY_VARIANT_GOBLIN_HELMET_HORNED=variant_id_here
LEMONSQUEEZY_VARIANT_GOBLIN_HELMET_BONE=variant_id_here
LEMONSQUEEZY_VARIANT_GOBLIN_HELMET_SKULL=variant_id_here

LEMONSQUEEZY_VARIANT_GOBLIN_ARMOR_TRIBAL=variant_id_here
LEMONSQUEEZY_VARIANT_GOBLIN_ARMOR_SCRAP=variant_id_here
LEMONSQUEEZY_VARIANT_GOBLIN_ARMOR_BONE=variant_id_here
LEMONSQUEEZY_VARIANT_GOBLIN_ARMOR_RAGGED=variant_id_here

LEMONSQUEEZY_VARIANT_GOBLIN_WEAPON_CLUB=variant_id_here
LEMONSQUEEZY_VARIANT_GOBLIN_WEAPON_DAGGER=variant_id_here
LEMONSQUEEZY_VARIANT_GOBLIN_WEAPON_SPEAR=variant_id_here
LEMONSQUEEZY_VARIANT_GOBLIN_WEAPON_SLING=variant_id_here

LEMONSQUEEZY_VARIANT_GOBLIN_FACIAL_HAIR_SCRAGGLY=variant_id_here
LEMONSQUEEZY_VARIANT_GOBLIN_FACIAL_HAIR_WARTS=variant_id_here
LEMONSQUEEZY_VARIANT_GOBLIN_FACIAL_HAIR_TUSKS=variant_id_here
LEMONSQUEEZY_VARIANT_GOBLIN_FACIAL_HAIR_CHIN_HAIR=variant_id_here

# Bundles
LEMONSQUEEZY_VARIANT_HUMAN_KNIGHT_SET=variant_id_here
LEMONSQUEEZY_VARIANT_GOBLIN_RAIDER_SET=variant_id_here
LEMONSQUEEZY_VARIANT_HUMAN_COMPLETE_BUNDLE=variant_id_here
LEMONSQUEEZY_VARIANT_GOBLIN_COMPLETE_BUNDLE=variant_id_here
```

## Setup Steps

### 1. Create Products in Lemon Squeezy

1. Go to your Lemon Squeezy dashboard
2. Navigate to Products
3. Create products for each item and bundle with these prices:
   - Individual items: $1.99
   - Themed bundles (Knight Set, Raider Set): $4.99
   - Complete bundles: $23.99

### 2. Get Variant IDs

Each product will have a variant ID. You can find these:
- In the product URL when editing
- Via the Lemon Squeezy API
- In the product variant settings

### 3. Configure Webhook

1. Go to Settings > Webhooks
2. Create a new webhook
3. Set the URL to: `https://your-domain.com/api/webhooks/lemonsqueezy`
4. Select the `order_created` event
5. Copy the webhook secret and add it to your environment variables

### 4. Test Mode

Use test mode API keys while developing. Create separate products in test mode for testing.

## How It Works

1. User clicks purchase button
2. App creates a Lemon Squeezy checkout session with custom data
3. User is redirected to Lemon Squeezy checkout
4. After payment, webhook receives `order_created` event
5. Webhook records purchase in Supabase database
6. User's owned items are updated automatically

## Custom Data

The checkout includes custom data for tracking:
- `product_id`: Our internal product ID
- `product_type`: item, bundle, or complete_bundle
- `race`: human or goblin
- `slot`: helmet, armor, weapon, or facial_hair
- `bundle_items`: Array of item IDs for bundles
