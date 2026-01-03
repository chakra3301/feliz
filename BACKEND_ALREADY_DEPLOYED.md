# Your Backend is Already Deployed! ✅

## Good News

With your current `vercel.json` configuration, **the backend API is already deployed** as part of your frontend project!

The configuration automatically:
- ✅ Deploys the frontend (React app)
- ✅ Deploys the backend API (serverless functions)
- ✅ Routes `/api/*` requests to the backend
- ✅ All on the same domain

## What You Need to Do

### 1. Add Backend Environment Variables

Go to your **existing Vercel project** → **Settings** → **Environment Variables**

Add these (if you haven't already):

```
SUPABASE_URL = https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
FRONTEND_URL = https://your-frontend-project.vercel.app
```

**Important:** Select **all environments** (Production, Preview, Development)

### 2. Update Frontend API URL

In the **same Vercel project**, make sure you have:

```
VITE_API_URL = https://your-frontend-project.vercel.app/api
```

Notice: It's the **same domain** as your frontend, just with `/api` at the end!

### 3. Redeploy

After adding/updating environment variables:
- Go to **Deployments** tab
- Click **"..."** on latest deployment
- Click **"Redeploy"**

## Test Your API

Your API is at the same domain as your frontend:

```
https://your-project.vercel.app/health
https://your-project.vercel.app/api/products
https://your-project.vercel.app/api/orders
```

Test it:
```bash
curl https://your-project.vercel.app/health
```

## How It Works

Your `vercel.json` routes:
- `/api/*` → Backend serverless function (`api/index.js`)
- `/*` → Frontend static files

Everything is on **one domain** - no separate deployment needed!

## Checklist

- [x] Frontend deployed ✅
- [x] Environment variables added ✅
- [ ] Backend env vars added (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
- [ ] VITE_API_URL points to same domain + `/api`
- [ ] Redeployed after adding backend env vars
- [ ] Tested `/health` endpoint

## If API Doesn't Work

1. **Check Functions tab:**
   - Go to Vercel dashboard → Your project
   - Click **"Functions"** tab
   - You should see `api/index.js` listed

2. **Check Logs:**
   - Click on the function
   - View logs for errors

3. **Verify Environment Variables:**
   - Make sure backend variables are added
   - Check they're added to **all environments**

4. **Redeploy:**
   - Always redeploy after adding env vars

Your backend is already there - just needs the right environment variables! 🚀

