# Deploy Backend API to Vercel - Step by Step

This guide will walk you through deploying your backend API to Vercel.

## Prerequisites

- ✅ Code pushed to GitHub
- ✅ Supabase credentials ready
- ✅ Vercel account (free tier works)

## Step 1: Push Code to GitHub

Make sure all your code is committed and pushed:

```bash
git add .
git commit -m "Ready for backend deployment"
git push
```

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. **Go to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Sign in (or create account)

2. **Create New Project:**
   - Click **"Add New Project"**
   - Click **"Import Git Repository"**
   - Select your `feliz` repository
   - Click **"Import"**

3. **Configure Project:**
   - **Project Name:** `feliz-api` (or any name you want)
   - **Framework Preset:** Vercel will auto-detect (or select "Other")
   - **Root Directory:** Leave as `./` (root)
   - **Build Command:** Leave empty (not needed for serverless)
   - **Output Directory:** Leave empty
   - Click **"Deploy"**

4. **Wait for Deployment:**
   - Vercel will build and deploy
   - This takes 1-2 minutes
   - You'll see a success message with your URL

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd /Users/lucaorion/feliz
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? feliz-api
# - Directory? ./
# - Override settings? No
```

## Step 3: Add Environment Variables

**This is critical!** Your API won't work without these.

1. **Go to Project Settings:**
   - In Vercel dashboard, click your project
   - Go to **Settings** → **Environment Variables**

2. **Add Required Variables:**

   Click **"Add New"** for each:

   ```
   Name: SUPABASE_URL
   Value: https://your-project.supabase.co
   Environment: Production, Preview, Development (select all)
   ```

   ```
   Name: SUPABASE_SERVICE_ROLE_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   Environment: Production, Preview, Development (select all)
   ```

   ```
   Name: FRONTEND_URL
   Value: https://your-frontend.vercel.app
   Environment: Production, Preview, Development (select all)
   ```

   **Optional (for Stripe):**
   ```
   Name: STRIPE_SECRET_KEY
   Value: sk_live_... (or sk_test_... for testing)
   Environment: Production, Preview, Development (select all)
   ```

   ```
   Name: STRIPE_PUBLISHABLE_KEY
   Value: pk_live_... (or pk_test_... for testing)
   Environment: Production, Preview, Development (select all)
   ```

   ```
   Name: STRIPE_WEBHOOK_SECRET
   Value: whsec_...
   Environment: Production, Preview, Development (select all)
   ```

3. **Save:**
   - Click **"Save"** after adding each variable
   - Make sure to select **all environments** (Production, Preview, Development)

## Step 4: Redeploy

After adding environment variables:

1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

## Step 5: Test Your API

Your API will be available at:
```
https://your-project-name.vercel.app
```

### Test Health Endpoint:

Open in browser or use curl:
```bash
curl https://your-project-name.vercel.app/health
```

Should return:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "..."
}
```

### Test Products Endpoint:

```bash
curl https://your-project-name.vercel.app/api/products
```

## Step 6: Update Frontend to Use Production API

### If Frontend is Also on Vercel:

1. Go to your **frontend project** in Vercel
2. **Settings** → **Environment Variables**
3. Add:
   ```
   Name: VITE_API_URL
   Value: https://your-api-project.vercel.app/api
   Environment: Production, Preview, Development (select all)
   ```
4. **Redeploy** frontend

### If Frontend is Local:

Update `.env` file:
```env
VITE_API_URL=https://your-api-project.vercel.app/api
```

Restart frontend dev server.

## Your API Endpoints

After deployment, all endpoints are available at:

- Health: `https://your-project.vercel.app/health`
- Products: `https://your-project.vercel.app/api/products`
- Orders: `https://your-project.vercel.app/api/orders`
- Checkout: `https://your-project.vercel.app/api/checkout/create-session`
- Webhooks: `https://your-project.vercel.app/api/webhooks/stripe`

## Troubleshooting

### "Function not found" or 404 errors

- Check that `api/index.js` exists
- Verify `vercel.json` configuration
- Check deployment logs in Vercel dashboard

### "Missing required environment variables"

- Go to Settings → Environment Variables
- Make sure all required variables are added
- Check that you selected **all environments**
- Redeploy after adding variables

### "Database: disconnected"

- Verify Supabase credentials are correct
- Check that you're using **service_role** key (not anon key)
- Make sure database tables exist (run schema.sql)

### "CORS error"

- Update `FRONTEND_URL` environment variable
- Make sure it matches your actual frontend domain
- Redeploy after updating

### API works but frontend can't connect

- Check `VITE_API_URL` in frontend environment variables
- Make sure it points to your Vercel API URL (not localhost)
- Redeploy frontend after updating

## Viewing Logs

To see what's happening:

1. Go to Vercel dashboard
2. Click your project
3. Click **"Functions"** tab
4. Click on a function to see logs
5. Or go to **Deployments** → Click a deployment → View logs

## Important Notes

1. **Environment Variables:** Must be set in Vercel dashboard (not in code)
2. **Redeploy:** Always redeploy after adding/updating environment variables
3. **All Environments:** Add variables to Production, Preview, AND Development
4. **Service Role Key:** Use Supabase service_role key (has admin privileges)
5. **HTTPS:** Vercel automatically provides HTTPS

## Next Steps

After deployment:

1. ✅ Test all endpoints
2. ✅ Verify database connection
3. ✅ Update frontend to use production API
4. ⏭️ Set up Stripe webhook (when ready)
5. ⏭️ Monitor logs and errors

## Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Environment variables added (all environments)
- [ ] Redeployed after adding env vars
- [ ] Health endpoint works
- [ ] Database connection verified
- [ ] Frontend updated to use production API URL

Your backend API is now live on Vercel! 🚀

