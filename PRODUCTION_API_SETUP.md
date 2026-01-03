# Production API Setup for Vercel

This guide will help you deploy your API to Vercel for production.

## ✅ What's Configured

- ✅ Serverless function setup (`api/index.js`)
- ✅ Vercel configuration (`vercel.json`)
- ✅ Express app exports for serverless
- ✅ Environment variable validation
- ✅ CORS configured for production

## Step 1: Push to GitHub

Make sure all your code is committed and pushed:

```bash
git add .
git commit -m "Configure API for production deployment"
git push
```

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect the configuration
5. Click **"Deploy"**

### Option B: Via Vercel CLI

```bash
npm i -g vercel
vercel
```

Follow the prompts to deploy.

## Step 3: Add Environment Variables

After deployment, go to **Project Settings → Environment Variables** and add:

### Required Variables:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Optional (for Stripe):

```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Important Notes:

- **Add to all environments:** Production, Preview, and Development
- **Use production keys:** For production, use `sk_live_` and `pk_live_` (not test keys)
- **FRONTEND_URL:** Should be your actual production frontend URL

## Step 4: Redeploy

After adding environment variables, click **"Redeploy"** in Vercel dashboard.

## Step 5: Verify API is Working

Your API will be available at:
```
https://your-project.vercel.app/api/health
https://your-project.vercel.app/api/products
https://your-project.vercel.app/api/orders
```

Test it:
```bash
curl https://your-project.vercel.app/health
```

Should return:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "..."
}
```

## Step 6: Update Frontend API URL

In your frontend `.env` (or Vercel environment variables), update:

```env
VITE_API_URL=https://your-project.vercel.app/api
```

## Step 7: Configure Stripe Webhook (When Ready)

1. Go to Stripe Dashboard → **Developers → Webhooks**
2. Click **"Add endpoint"**
3. Enter: `https://your-project.vercel.app/api/webhooks/stripe`
4. Select event: `checkout.session.completed`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`
7. Redeploy

## API Endpoints in Production

All your API endpoints will be available at:

- `GET https://your-project.vercel.app/health`
- `GET https://your-project.vercel.app/api/products`
- `GET https://your-project.vercel.app/api/products/low-stock`
- `GET https://your-project.vercel.app/api/orders`
- `GET https://your-project.vercel.app/api/orders/:id`
- `PATCH https://your-project.vercel.app/api/orders/:id`
- `POST https://your-project.vercel.app/api/checkout/create-session`
- `POST https://your-project.vercel.app/api/webhooks/stripe`

## Troubleshooting

### "Function not found"
- Make sure `api/index.js` exists
- Check that `vercel.json` routes are correct
- Verify the build completed successfully

### "Missing environment variables"
- Check Vercel dashboard → Settings → Environment Variables
- Make sure variables are added to **all environments**
- Redeploy after adding variables

### "Database: disconnected"
- Verify Supabase credentials are correct
- Check that database tables exist
- Make sure you're using **service_role** key

### "CORS error"
- Update `FRONTEND_URL` in Vercel environment variables
- Make sure it matches your actual frontend domain
- Redeploy

### API works locally but not in production
- Check Vercel function logs (Dashboard → Functions → View Logs)
- Verify environment variables are set
- Check that database is accessible from Vercel

## Monitoring

### View Logs

1. Go to Vercel Dashboard
2. Select your project
3. Click **"Functions"** tab
4. Click on a function to see logs

### Health Monitoring

Set up uptime monitoring to check:
```
https://your-project.vercel.app/health
```

Use services like:
- UptimeRobot
- Pingdom
- StatusCake

## Performance Tips

1. **Database Connection Pooling:** Supabase handles this automatically
2. **Caching:** Consider adding Redis for frequently accessed data
3. **Rate Limiting:** Already configured (100 requests per 15 minutes)
4. **Cold Starts:** Vercel keeps functions warm, but first request may be slower

## Security Checklist

- [x] Environment variables set in Vercel (not in code)
- [x] CORS restricted to your frontend domain
- [x] Rate limiting enabled
- [x] Request size limits set
- [x] Webhook signature verification
- [ ] HTTPS enforced (automatic on Vercel)
- [ ] Error messages don't expose sensitive info

## Next Steps

1. ✅ API deployed to Vercel
2. ✅ Environment variables configured
3. ✅ Frontend updated to use production API
4. ⏭️ Test all endpoints
5. ⏭️ Set up Stripe webhook
6. ⏭️ Monitor logs and errors
7. ⏭️ Set up analytics

Your API is now production-ready! 🚀

