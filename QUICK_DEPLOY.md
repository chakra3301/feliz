# Quick Vercel Deployment Guide (No Stripe Required)

## Fastest Way to Deploy for Testing

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)
   - Click **"Deploy"**

### Step 3: Add Environment Variables

After first deployment, go to **Settings → Environment Variables**:

Add these (you already have Supabase filled in):

```
VITE_API_URL=https://your-project.vercel.app/api
```

Or if you want to test locally first:
```
VITE_API_URL=http://localhost:3001/api
```

### Step 4: Redeploy

Click **"Redeploy"** after adding environment variables.

## What Works Without Stripe

✅ **Product browsing** - All pages work  
✅ **Cart** - Add/remove items  
✅ **Admin dashboard** - View orders (if you add test data)  
✅ **Database** - Supabase connection works  
⚠️ **Checkout** - Will show "Payment not configured" message (expected)

## Testing the Admin Dashboard

To see orders in the admin dashboard, add test data in Supabase:

1. Go to Supabase → SQL Editor
2. Run:
```sql
INSERT INTO orders (
  stripe_session_id,
  customer_email,
  customer_name,
  total_amount,
  payment_status,
  order_status
) VALUES 
  ('test_001', 'test@example.com', 'Test User', 7800, 'paid', 'pending'),
  ('test_002', 'user@example.com', 'Another User', 11300, 'paid', 'shipped');
```

## That's It!

Your site is now live on Vercel. You can:
- Browse products
- Test the cart
- View admin dashboard (with test data)
- Add Stripe later when ready

## Next Steps

When you're ready to add Stripe:
1. Get Stripe API keys
2. Add them to Vercel environment variables
3. Redeploy
4. Test checkout with test cards

