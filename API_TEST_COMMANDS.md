# API Test Commands

Use these commands to test your API after setup.

## Health Check

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-01-02T..."
}
```

## Get All Products

```bash
curl http://localhost:3001/api/products
```

Expected: Array of products (or empty array `[]` if no data)

## Get Low Stock Items

```bash
curl http://localhost:3001/api/products/low-stock?threshold=10
```

Expected: Array of products with stock < 10

## Get All Orders

```bash
curl http://localhost:3001/api/orders
```

Expected: Array of orders (or empty array `[]` if no orders)

## Get Single Order

```bash
curl http://localhost:3001/api/orders/1
```

Expected: Single order object or 404 if not found

## Create Checkout Session (Requires Stripe)

```bash
curl -X POST http://localhost:3001/api/checkout/create-session \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"variantId": 1, "quantity": 2}
    ]
  }'
```

Expected: Checkout session with URL (or error if Stripe not configured)

## Test in Browser

You can also test these in your browser:
- http://localhost:3001/health
- http://localhost:3001/api/products
- http://localhost:3001/api/orders

## Using Postman or Insomnia

Import these endpoints:
- GET `http://localhost:3001/health`
- GET `http://localhost:3001/api/products`
- GET `http://localhost:3001/api/orders`
- POST `http://localhost:3001/api/checkout/create-session`

For POST requests, set:
- Method: POST
- Headers: `Content-Type: application/json`
- Body: JSON with your data

