# Deploy API to Production - Quick Guide

## ✅ What's Ready

Your API is now configured for Vercel deployment:
- ✅ Serverless function created (`api/index.js`)
- ✅ Vercel configuration updated
- ✅ Express app exports correctly
- ✅ Environment variable handling

## 🚀 Deploy Steps

### 1. Commit and Push

```bash
git add .
git commit -m "Configure API for Vercel production"
git push
```

### 2. Deploy to Vercel

**Option A: Via Dashboard (Easiest)**
1. Go to https://vercel.com
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect everything
5. Click **"Deploy"**

**Option B: Via CLI**
```bash
npm i -g vercel
vercel
```

### 3. Add Environment Variables

After first deployment, go to **Project Settings → Environment Variables**:

**Required:**
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
FRONTEND_URL=https://your-frontend.vercel.app
```

**Optional (for Stripe):**
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

⚠️ **Important:**
- Add to **all environments** (Production, Preview, Development)
- Use **production Stripe keys** (`sk_live_`, not `sk_test_`)
- Set `FRONTEND_URL` to your actual production domain

### 4. Redeploy

Click **"Redeploy"** after adding environment variables.

### 5. Test Your API

Your API will be at:
```
https://your-project.vercel.app/health
https://your-project.vercel.app/api/products
https://your-project.vercel.app/api/orders
```

Test it:
```bash
curl https://your-project.vercel.app/health
```

### 6. Update Frontend

In your frontend Vercel project, add environment variable:
```
VITE_API_URL=https://your-api-project.vercel.app/api
```

## 📋 Checklist

- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Environment variables added
- [ ] Redeployed after adding env vars
- [ ] Health endpoint works
- [ ] Frontend API URL updated
- [ ] Tested all endpoints

## 🎯 Your API URLs

After deployment, you'll have:
- Health: `https://your-project.vercel.app/health`
- Products: `https://your-project.vercel.app/api/products`
- Orders: `https://your-project.vercel.app/api/orders`
- Checkout: `https://your-project.vercel.app/api/checkout/create-session`
- Webhooks: `https://your-project.vercel.app/api/webhooks/stripe`

## 🔧 Troubleshooting

**"Function not found"**
- Check that `api/index.js` exists
- Verify `vercel.json` is correct

**"Missing environment variables"**
- Check Vercel dashboard → Settings → Environment Variables
- Make sure added to all environments
- Redeploy after adding

**"Database: disconnected"**
- Verify Supabase credentials
- Check database tables exist

See `PRODUCTION_API_SETUP.md` for detailed troubleshooting.

