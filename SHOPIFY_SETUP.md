# Shopify Storefront API Integration

This site uses the Shopify Storefront API for products, cart, and checkout.

## Setup

### 1. Create a Headless Sales Channel in Shopify

1. Go to **Shopify Admin** → **Settings** → **Apps and sales channels**
2. Click **Develop apps** (or create a custom app)
3. Create a new app and configure Storefront API access
4. Copy the **Storefront API access token**

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
```

### 3. Add Products in Shopify

1. Go to **Shopify Admin** → **Products**
2. Add your products with variants (sizes, colors, etc.)
3. Products will automatically appear on your site

## How It Works

- **Products** - Fetched from Shopify Storefront API
- **Cart** - Managed by Shopify (stored in localStorage)
- **Checkout** - Redirects to Shopify's hosted checkout
- **Orders** - Managed in Shopify Admin

## Development Mode

If Shopify is not configured, the site will use fallback products from `src/data/products.js` for development/preview purposes. Checkout will not work until Shopify is configured.

## Deployment

Deploy to Vercel:

```bash
vercel
```

Make sure to add your environment variables in Vercel's project settings.
