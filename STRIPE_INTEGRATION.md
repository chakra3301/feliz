# Stripe Checkout Integration Guide

This guide explains how to set up and use the Stripe Checkout integration for the Feliz store.

## Architecture Overview

```
Frontend (React) → Backend API (Express) → Stripe Checkout
                                      ↓
                              Supabase Database
                                      ↓
                              Stripe Webhook
```

## Setup Steps

### 1. Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your credentials:
   - `STRIPE_SECRET_KEY`: From Stripe Dashboard > Developers > API keys
   - `STRIPE_PUBLISHABLE_KEY`: From Stripe Dashboard > Developers > API keys
   - `STRIPE_WEBHOOK_SECRET`: See webhook setup below
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: From Supabase Settings > API

4. **Set up database:**
   - Go to Supabase Dashboard > SQL Editor
   - Run the SQL from `server/database/schema.sql`

5. **Start the server:**
   ```bash
   npm run dev
   ```

### 2. Stripe Setup

1. **Create Stripe account:**
   - Sign up at https://stripe.com
   - Get your API keys from Dashboard > Developers > API keys

2. **Set up webhook (for local development):**
   ```bash
   # Install Stripe CLI
   brew install stripe/stripe-cli/stripe
   
   # Login
   stripe login
   
   # Forward webhooks to local server
   stripe listen --forward-to localhost:3001/api/webhooks/stripe
   ```
   
   Copy the webhook signing secret (starts with `whsec_`) to your `.env` file.

3. **For production:**
   - Go to Stripe Dashboard > Developers > Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select event: `checkout.session.completed`
   - Copy the webhook signing secret to production environment

### 3. Frontend Setup

1. **Configure API URL:**
   ```bash
   # Create .env file in root directory
   echo "VITE_API_URL=http://localhost:3001/api" > .env
   ```

2. **Update product data:**
   - Products need to have `variantId` mapped to database variant IDs
   - See `server/database/seed.sql` (create this) for seeding products

### 4. Product Variant Mapping

The checkout flow requires mapping frontend products to database variants. You'll need to:

1. **Seed products in database:**
   ```sql
   -- Insert products
   INSERT INTO products (name, category, description) VALUES
   ('Classic Tee', 'Clothing', 'Essential cotton tee...');
   
   -- Insert variants with SKUs
   INSERT INTO product_variants (product_id, size, sku, price, stock_count) VALUES
   (1, 'S', 'TEE-S-001', 3500, 100),  -- $35.00 in cents
   (1, 'M', 'TEE-M-001', 3500, 150);
   ```

2. **Update frontend cart:**
   - When adding to cart, include `variantId` from database
   - The checkout API expects `variantId` in the items array

## How It Works

### Checkout Flow

1. **User clicks "Checkout with Stripe"**
   - Frontend calls `POST /api/checkout/create-session`
   - Backend validates stock, creates Stripe session
   - Returns Stripe checkout URL

2. **User completes payment on Stripe**
   - Stripe handles payment processing
   - Redirects to success/cancel page

3. **Webhook processes order**
   - Stripe sends `checkout.session.completed` event
   - Backend creates order in database
   - Decrements stock atomically

### Order Management

- Orders are stored in Supabase
- Admin dashboard fetches orders from API
- Order status can be updated via admin panel

## API Endpoints

### Checkout
- `POST /api/checkout/create-session` - Create Stripe checkout session
  ```json
  {
    "items": [
      { "variantId": 1, "quantity": 2 }
    ]
  }
  ```

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `PATCH /api/orders/:id` - Update order status

### Products
- `GET /api/products` - Get all products
- `GET /api/products/low-stock` - Get low stock items

## Database Queries

### View all orders with items
```sql
SELECT 
  o.id,
  o.stripe_session_id,
  o.customer_email,
  o.total_amount / 100.0 as total_usd,
  o.payment_status,
  o.order_status,
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

## Testing

### Test Cards (Stripe Test Mode)

- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **3D Secure:** `4000 0025 0000 3155`

Use any future expiry date, any CVC, and any ZIP code.

### Testing Webhooks Locally

1. Start the server: `npm run dev`
2. Run Stripe CLI: `stripe listen --forward-to localhost:3001/api/webhooks/stripe`
3. Complete a test checkout
4. Check server logs for webhook processing

## Security Notes

- ✅ Never expose Stripe secret keys in frontend
- ✅ Always verify webhook signatures
- ✅ Use environment variables for all secrets
- ✅ Validate stock before creating checkout session
- ✅ Use atomic database operations for stock updates
- ✅ Implement rate limiting in production

## Troubleshooting

### Webhook not receiving events
- Check webhook secret is correct
- Verify endpoint URL is accessible
- Check Stripe Dashboard > Webhooks for delivery logs

### Stock not decrementing
- Check webhook is processing `checkout.session.completed`
- Verify database connection
- Check server logs for errors

### Checkout session creation fails
- Verify Stripe API keys are correct
- Check product variants exist in database
- Verify stock is available

## Next Steps

1. **Seed database** with your products and variants
2. **Update frontend** to map products to variant IDs
3. **Test checkout flow** with test cards
4. **Set up production webhook** endpoint
5. **Configure shipping** options in Stripe
6. **Add email notifications** for order confirmations

