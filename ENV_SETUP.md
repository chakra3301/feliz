# Environment Variables Setup Guide

This guide will help you set up your `.env` files with the correct credentials.

## Quick Start

1. **Copy the template files:**
   ```bash
   # Backend .env
   cp server/.env.template server/.env
   
   # Frontend .env
   cp .env.template .env
   ```

2. **Fill in your credentials** (see details below)

3. **Never commit `.env` files** - they're already in `.gitignore`

---

## Backend `.env` File (`server/.env`)

### 1. Stripe Configuration

#### Get Stripe API Keys:
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Make sure you're in **Test mode** (toggle in top right)
3. Copy your keys:
   - **Secret key** (starts with `sk_test_`)
   - **Publishable key** (starts with `pk_test_`)

```env
STRIPE_SECRET_KEY=sk_test_51AbC123...  # Replace with your secret key
STRIPE_PUBLISHABLE_KEY=pk_test_51XyZ789...  # Replace with your publishable key
```

#### Get Webhook Secret:

**For Local Development:**
```bash
# Install Stripe CLI (if not installed)
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3001/api/webhooks/stripe
```

You'll see output like:
```
> Ready! Your webhook signing secret is whsec_1234567890abcdef... (^C to quit)
```

Copy that `whsec_...` value to your `.env`:
```env
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef...
```

**For Production:**
1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click "Add endpoint"
3. Enter your production URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select event: `checkout.session.completed`
5. Copy the "Signing secret" (starts with `whsec_`)

---

### 2. Supabase Configuration

#### Get Supabase Credentials:
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create one)
3. Go to **Settings > API**

You'll need:
- **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
- **Service Role Key** (NOT the anon key - this is the secret one with admin privileges)

```env
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co  # Replace with your project URL
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # Replace with service_role key
```

⚠️ **Important:** Use the **service_role** key, not the anon key. The service_role key has admin privileges needed for server-side operations.

---

### 3. Server Configuration

These are usually fine as-is for development:

```env
PORT=3001  # Backend server port
FRONTEND_URL=http://localhost:5173  # Your React app URL (Vite default)
```

For production, update `FRONTEND_URL` to your actual domain:
```env
FRONTEND_URL=https://yourdomain.com
```

---

## Frontend `.env` File (root `.env`)

This is simpler - just the API URL:

```env
VITE_API_URL=http://localhost:3001/api
```

For production:
```env
VITE_API_URL=https://your-api-domain.com/api
```

**Note:** Vite requires the `VITE_` prefix for environment variables to be accessible in your React app.

---

## Complete Example

### `server/.env` (Backend)
```env
# Stripe
STRIPE_SECRET_KEY=sk_test_51AbC123dEf456GhI789JkL012MnO345PqR678StU901VwX234YzA567BcD890
STRIPE_PUBLISHABLE_KEY=pk_test_51XyZ789AbC012DeF345GhI678JkL901MnO234PqR567StU890VwX123YzA456
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ

# Supabase
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjQ2MTM5OTIyLCJleHAiOjE5NjE3MTU5MjJ9.abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890

# Server
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### `.env` (Frontend)
```env
VITE_API_URL=http://localhost:3001/api
```

---

## Verification

After setting up your `.env` files:

1. **Backend:**
   ```bash
   cd server
   npm run dev
   ```
   Should start without errors. If you see warnings about missing keys, check your `.env` file.

2. **Frontend:**
   ```bash
   npm run dev
   ```
   Should connect to the backend API.

3. **Test Stripe connection:**
   - Try creating a checkout session
   - Check server logs for any Stripe errors

4. **Test Supabase connection:**
   - The server should be able to query the database
   - Check server logs for any Supabase errors

---

## Security Reminders

✅ **DO:**
- Keep `.env` files local only
- Use test keys for development
- Rotate keys if exposed
- Use environment variables in production (not hardcoded)

❌ **DON'T:**
- Commit `.env` files to git
- Share `.env` files publicly
- Use production keys in development
- Hardcode secrets in code

---

## Troubleshooting

### "STRIPE_SECRET_KEY is not set"
- Check that `server/.env` exists
- Verify the key name is exactly `STRIPE_SECRET_KEY`
- Make sure there are no extra spaces or quotes

### "Supabase credentials are not set"
- Check that `server/.env` exists
- Verify you're using the **service_role** key, not anon key
- Make sure the URL is correct

### "Cannot connect to API"
- Check that backend server is running on port 3001
- Check that `VITE_API_URL` in frontend `.env` matches backend URL
- Verify CORS is configured correctly

### Webhook not working
- Make sure Stripe CLI is running: `stripe listen --forward-to localhost:3001/api/webhooks/stripe`
- Verify `STRIPE_WEBHOOK_SECRET` matches the secret from Stripe CLI
- Check server logs for webhook errors

