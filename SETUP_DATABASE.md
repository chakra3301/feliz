# Setup Database - Quick Guide

## The Problem

Your frontend is using hardcoded product data, but the checkout API needs to fetch products from the database. If the database is empty, you'll get a 500 error.

## Quick Fix: Add Products to Database

### Step 1: Create Database Tables

1. Go to **Supabase Dashboard** → Your Project
2. Click **SQL Editor**
3. Click **New Query**
4. Copy and paste the entire contents of `server/database/schema.sql`
5. Click **Run** (or press Cmd/Ctrl + Enter)

This creates:
- `products` table
- `product_variants` table
- `orders` table
- `order_items` table

### Step 2: Add Sample Products

1. In **SQL Editor**, create a **New Query**
2. Copy and paste the entire contents of `server/database/seed.example.sql`
3. Click **Run**

This adds:
- 12 products (matching your frontend products)
- Multiple variants for each product (sizes, etc.)
- Stock counts and prices

### Step 3: Verify Data

1. Go to **Table Editor** in Supabase
2. Check `products` table - should have 12 products
3. Check `product_variants` table - should have many variants

## Important: Product ID Mismatch

⚠️ **The frontend uses hardcoded product IDs (1, 2, 3...), but the checkout needs database variant IDs.**

### Current Issue

- Frontend product ID: `1` (Classic Tee)
- Database variant IDs: `1, 2, 3, 4, 5` (XS, S, M, L, XL variants)

The cart is sending `variantId: 1` (product ID), but variant ID `1` in the database is the XS size of Classic Tee.

### Solution Options

#### Option A: Quick Test (Use First Variant)

For testing, the seed data creates variants in order, so:
- Product 1 (Classic Tee) → Variant IDs: 1, 2, 3, 4, 5
- Product 2 (Hoodie) → Variant IDs: 6, 7, 8, 9, 10

If you select the first size of each product, it should work. But this is not ideal for production.

#### Option B: Update Frontend (Recommended)

The frontend should:
1. Fetch products from the API (`/api/products`)
2. Include `variantId` when adding to cart
3. Pass the correct `variantId` to checkout

This requires updating:
- `src/components/ProductPage.jsx` - Include variantId when adding to cart
- `src/components/ProductGrid.jsx` - Fetch from API instead of hardcoded data
- `src/data/products.js` - Either remove or use as fallback

## Test After Setup

1. **Test health endpoint:**
   ```bash
   curl https://www.feliznavidadstore.com/health
   ```
   Should return: `{"status":"ok","database":"connected"}`

2. **Test products endpoint:**
   ```bash
   curl https://www.feliznavidadstore.com/api/products
   ```
   Should return a list of products with variants

3. **Try checkout:**
   - Add a product to cart
   - Click checkout
   - Should work if variant IDs match

## Next Steps

After adding data to the database:

1. ✅ Database tables created
2. ✅ Sample products added
3. ⚠️ Frontend still uses hardcoded data
4. 🔄 Need to update frontend to use database products (or at least map variant IDs correctly)

## Quick Test Query

To see what variant IDs exist:

```sql
SELECT 
  pv.id as variant_id,
  p.name as product_name,
  pv.size,
  pv.price,
  pv.stock_count
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
ORDER BY p.id, pv.id;
```

This shows all variants with their IDs, so you can see what IDs to use in checkout.

