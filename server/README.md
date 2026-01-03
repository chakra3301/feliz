# Feliz Store Backend Server

Backend server for Stripe Checkout integration with Supabase database.

## Setup

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Stripe and Supabase credentials:
   - `STRIPE_SECRET_KEY`: Get from Stripe Dashboard > Developers > API keys
   - `STRIPE_PUBLISHABLE_KEY`: Get from Stripe Dashboard > Developers > API keys
   - `STRIPE_WEBHOOK_SECRET`: Get from Stripe Dashboard > Developers > Webhooks (after creating webhook endpoint)
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (from Settings > API)

3. **Set up database:**
   - Go to Supabase Dashboard > SQL Editor
   - Run the SQL from `database/schema.sql` to create tables

4. **Run the server:**
   ```bash
   npm run dev
   ```

## Stripe Webhook Setup

1. **Install Stripe CLI** (for local development):
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Or download from https://stripe.com/docs/stripe-cli
   ```

2. **Login to Stripe:**
   ```bash
   stripe login
   ```

3. **Forward webhooks to local server:**
   ```bash
   stripe listen --forward-to localhost:3001/api/webhooks/stripe
   ```
   
   This will give you a webhook signing secret (starts with `whsec_`). Add it to your `.env` file.

4. **For production:**
   - Go to Stripe Dashboard > Developers > Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select event: `checkout.session.completed`
   - Copy the webhook signing secret to your production environment variables

## API Endpoints

### Checkout
- `POST /api/checkout/create-session` - Create Stripe checkout session

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `PATCH /api/orders/:id` - Update order status

### Products
- `GET /api/products` - Get all products
- `GET /api/products/low-stock` - Get low stock items

### Webhooks
- `POST /api/webhooks/stripe` - Stripe webhook handler

## Database Queries

### View all orders
```sql
SELECT 
  o.id,
  o.stripe_session_id,
  o.customer_email,
  o.total_amount / 100.0 as total_usd,
  o.payment_status,
  o.order_status,
  o.created_at,
  json_agg(
    json_build_object(
      'product', oi.product_name,
      'size', oi.size,
      'quantity', oi.quantity,
      'price', oi.price / 100.0
    )
  ) as items
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id
ORDER BY o.created_at DESC;
```

### View low stock items
```sql
SELECT 
  p.name as product_name,
  pv.size,
  pv.sku,
  pv.stock_count,
  pv.price / 100.0 as price_usd
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
WHERE pv.stock_count < 10
ORDER BY pv.stock_count ASC;
```

### Get order statistics
```sql
SELECT 
  COUNT(*) as total_orders,
  SUM(total_amount) / 100.0 as total_revenue,
  AVG(total_amount) / 100.0 as avg_order_value,
  COUNT(*) FILTER (WHERE payment_status = 'paid') as paid_orders,
  COUNT(*) FILTER (WHERE order_status = 'pending') as pending_orders
FROM orders
WHERE created_at >= NOW() - INTERVAL '30 days';
```

