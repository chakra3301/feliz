# API Setup Guide - Step by Step

This guide will help you set up the backend API server for your Feliz store.

## Prerequisites

- ✅ Node.js installed (v18 or higher)
- ✅ Supabase account and project
- ✅ Supabase credentials ready

## Step 1: Install Dependencies

```bash
cd server
npm install
```

This will install:
- Express (web server)
- Stripe (payment processing)
- Supabase client (database)
- CORS (cross-origin requests)
- dotenv (environment variables)

## Step 2: Configure Environment Variables

Your `.env` file should already exist in the `server/` directory. Open it and fill in:

### Required Variables:

```env
# Supabase (REQUIRED)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe (Optional for now - can add later)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Server Config
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### How to Get Supabase Credentials:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings → API**
4. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role key** (secret) → `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **Important:** Use the **service_role** key, NOT the anon key!

## Step 3: Set Up Database

### 3.1 Create Tables

1. Go to Supabase Dashboard → **SQL Editor**
2. Click **New Query**
3. Copy and paste the contents of `server/database/schema.sql`
4. Click **Run** (or press Cmd/Ctrl + Enter)

This creates:
- `products` table
- `product_variants` table
- `orders` table
- `order_items` table

### 3.2 Seed Test Data (Optional)

1. In SQL Editor, create a new query
2. Copy and paste the contents of `server/database/seed.example.sql`
3. Click **Run**

This adds sample products and variants to your database.

## Step 4: Start the Server

```bash
cd server
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3001
📦 Environment: development
🔗 Frontend URL: http://localhost:5173
```

## Step 5: Test the API

### 5.1 Test Health Endpoint

Open your browser or use curl:
```bash
curl http://localhost:3001/health
```

Should return:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-01-02T..."
}
```

### 5.2 Test Products Endpoint

```bash
curl http://localhost:3001/api/products
```

Should return an array of products (empty if you haven't seeded data).

### 5.3 Test Orders Endpoint

```bash
curl http://localhost:3001/api/orders
```

Should return an empty array `[]` (no orders yet.

## Step 6: Connect Frontend

### 6.1 Update Frontend .env

In the root directory, make sure `.env` has:
```env
VITE_API_URL=http://localhost:3001/api
```

### 6.2 Start Frontend

In a new terminal:
```bash
npm run dev
```

The frontend should now connect to your API!

## Troubleshooting

### "Missing required environment variables"
- Check that `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
- Make sure there are no extra spaces or quotes
- Restart the server after changing `.env`

### "Database: disconnected" in health check
- Verify Supabase credentials are correct
- Check that tables exist (run schema.sql)
- Make sure you're using service_role key, not anon key

### "CORS error" in browser
- Check `FRONTEND_URL` in server `.env` matches your frontend URL
- Make sure frontend is running on the URL specified

### "Cannot connect to API"
- Verify server is running on port 3001
- Check `VITE_API_URL` in frontend `.env`
- Check browser console for errors

### Products endpoint returns empty array
- Run the seed.sql to add test data
- Or manually add products in Supabase dashboard

## Next Steps

Once the API is working:

1. ✅ Test all endpoints
2. ✅ Seed your products
3. ✅ Test checkout flow (when Stripe is configured)
4. ✅ Deploy to production

## API Endpoints Reference

- `GET /health` - Health check
- `GET /api/products` - Get all products
- `GET /api/products/low-stock` - Get low stock items
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `PATCH /api/orders/:id` - Update order status
- `POST /api/checkout/create-session` - Create Stripe checkout
- `POST /api/webhooks/stripe` - Stripe webhook handler

## Need Help?

Check the logs in your terminal for detailed error messages. Most issues are:
- Missing environment variables
- Incorrect Supabase credentials
- Database tables not created
- CORS configuration issues

