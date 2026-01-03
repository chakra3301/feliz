# Debug: 500 Error on Checkout

## The Problem

You're getting a 500 error when trying to create a checkout session. This means the server encountered an error processing your request.

## Step 1: Check Vercel Function Logs

The most important step is to see the actual error:

1. Go to **Vercel Dashboard** → Your Project
2. Click **Functions** tab
3. Click on **api/index.js**
4. Look at the **Logs** section
5. Find the error message (look for red text or "Error:")

Common errors you might see:

### Error 1: "Failed to fetch product variants"
**Cause:** Database connection issue or tables don't exist

**Fix:**
1. Check that `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set in Vercel
2. Verify your Supabase credentials are correct
3. Make sure you've run the database schema:
   - Go to Supabase Dashboard → SQL Editor
   - Run the SQL from `server/database/schema.sql`
   - This creates the `products` and `product_variants` tables

### Error 2: "Product data missing for variant"
**Cause:** The `product_variants` table exists but the join with `products` is failing

**Fix:**
1. Check that both tables exist
2. Verify the foreign key relationship exists
3. Make sure products exist for your variants

### Error 3: "Failed to create Stripe checkout session"
**Cause:** Stripe API error

**Fix:**
1. Check that `STRIPE_SECRET_KEY` is set in Vercel
2. Verify your Stripe key is valid (test mode vs live mode)
3. Check your Stripe account status

## Step 2: Test Database Connection

Test if your database is accessible:

```bash
curl https://www.feliznavidadstore.com/health
```

Should return:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "..."
}
```

If it says `"database": "disconnected"`, your Supabase credentials are wrong or the tables don't exist.

## Step 3: Verify Database Tables Exist

1. Go to **Supabase Dashboard** → Your Project
2. Click **Table Editor**
3. Verify these tables exist:
   - ✅ `products`
   - ✅ `product_variants`
   - ✅ `orders`
   - ✅ `order_items`

If they don't exist:
1. Go to **SQL Editor**
2. Create a new query
3. Copy and paste the contents of `server/database/schema.sql`
4. Click **Run**

## Step 4: Check Environment Variables in Vercel

Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

Make sure these are set:
- ✅ `SUPABASE_URL` - Your Supabase project URL
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service_role key (NOT anon key)
- ✅ `STRIPE_SECRET_KEY` - Your Stripe secret key (if using Stripe)
- ✅ `FRONTEND_URL` - Your frontend URL

**Important:** 
- Select **all environments** (Production, Preview, Development)
- Use the **service_role** key, not the anon key
- Redeploy after adding/updating variables

## Step 5: Check What Items Are Being Sent

In your browser console, you should see:
```
Creating checkout session: { url: "...", items: [...] }
```

Check that:
- `items` is an array
- Each item has a `variantId` (number)
- Each item has a `quantity` (number)

## Step 6: Verify Products Exist in Database

1. Go to **Supabase Dashboard** → **Table Editor**
2. Check the `products` table - should have at least one product
3. Check the `product_variants` table - should have variants with:
   - `product_id` that matches a product
   - `price` (in cents, e.g., 2000 = $20.00)
   - `stock_count` (number)
   - `sku` (string)

## Step 7: Test with Sample Data

If your database is empty, add sample data:

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Create a new query
3. Copy and paste the contents of `server/database/seed.example.sql`
4. Click **Run**

This adds sample products and variants you can test with.

## Common Issues

### Issue: "No variants found"
**Cause:** The variant IDs in your cart don't exist in the database

**Fix:** Make sure your frontend is using the correct variant IDs from the database, not hardcoded IDs.

### Issue: Database connection works but query fails
**Cause:** Tables exist but schema is wrong

**Fix:** Re-run the schema SQL to ensure all columns and relationships are correct.

### Issue: Stripe error
**Cause:** Invalid Stripe key or account issue

**Fix:** 
- Verify your Stripe key starts with `sk_test_` (test mode) or `sk_live_` (live mode)
- Check your Stripe dashboard for account status
- Make sure you're using the secret key, not the publishable key

## Still Not Working?

1. **Check Vercel Logs** - This is the most important step!
2. **Test the health endpoint** - Verify database connection
3. **Verify environment variables** - Make sure all are set correctly
4. **Check database tables** - Ensure they exist and have data
5. **Redeploy** - After making changes, always redeploy

## Quick Checklist

- [ ] Checked Vercel function logs for actual error
- [ ] Tested `/health` endpoint (returns "connected")
- [ ] Verified all environment variables are set
- [ ] Confirmed database tables exist
- [ ] Checked that products and variants exist in database
- [ ] Verified Stripe key is set (if using Stripe)
- [ ] Redeployed after making changes

