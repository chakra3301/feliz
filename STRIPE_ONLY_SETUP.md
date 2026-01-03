# Stripe-Only Setup Guide

## Overview

This setup uses **only Stripe** - no database required! Products are defined in the frontend code, and Stripe handles all payment processing and order storage.

## What Changed

✅ **Removed:**
- Supabase database dependency
- Product/variant database tables
- Order storage in database
- Stock tracking
- Database API routes

✅ **Simplified:**
- Checkout uses Stripe Price IDs directly
- Products defined in `src/data/products.js`
- Webhook handler just logs events (Stripe stores orders)
- No database setup needed

## Setup Steps

### 1. Create Stripe Products

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → **Products**
2. Click **"Add product"**
3. For each product:
   - Enter product name
   - Add description
   - Set price (in dollars)
   - Add image (optional)
   - Click **"Save product"**

### 2. Get Stripe Price IDs

After creating a product:
1. Click on the product
2. Find the **Price ID** (starts with `price_`)
3. Copy it

**For products with sizes:**
- Create a separate Price for each size
- Or create one Price and handle sizes in metadata

### 3. Update Product Data

Edit `src/data/products.js` and replace `price_XXXXX` with your actual Stripe Price IDs:

```javascript
{
  id: 1,
  name: "Classic Tee",
  price: 35,
  priceId: "price_1AbC2dEfGhIjKlMnOpQrStUv", // ← Replace with your Price ID
  sizes: ["XS", "S", "M", "L", "XL"],
  variants: [
    { size: "XS", priceId: "price_1AbC2dEfGhIjKlMnOpQrStUv" }, // ← Replace
    { size: "S", priceId: "price_1XyZ789AbC012DeF345GhI678" }, // ← Replace
    // ... etc
  ]
}
```

### 4. Environment Variables

In Vercel (or `.env` file), you only need:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (optional, for webhooks)
FRONTEND_URL=https://yourdomain.com
```

**No Supabase variables needed!**

### 5. Deploy

That's it! No database setup required.

## How It Works

1. **Products**: Defined in `src/data/products.js` with Stripe Price IDs
2. **Checkout**: Frontend sends Price IDs to backend
3. **Backend**: Creates Stripe Checkout Session using Price IDs
4. **Payment**: Stripe handles everything
5. **Orders**: Stored in Stripe Dashboard (no database needed)

## Viewing Orders

All orders are in Stripe Dashboard:
- Go to **Payments** → See all successful payments
- Click a payment → View customer details, items, shipping address
- Export data if needed

## Limitations

⚠️ **What you lose without a database:**
- Stock/inventory tracking
- Custom order management UI
- Order history in your app
- Stock decrementing on purchase

✅ **What you gain:**
- Simpler setup (no database)
- One less service to manage
- Stripe handles everything
- Lower costs (no database hosting)

## Testing

1. Add products to Stripe Dashboard
2. Update `src/data/products.js` with Price IDs
3. Test checkout flow
4. Check Stripe Dashboard for orders

## Next Steps

If you need stock tracking or custom order management later, you can:
- Add Supabase back
- Or use Stripe's inventory features (if available)
- Or build a simple database for just orders

For now, this Stripe-only setup is perfect for getting started quickly!

