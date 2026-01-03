# Debug 500 Error - Quick Guide

## Your Error
```
GET https://www.feliznavidadstore.com/api 500 (Internal Server Error)
```

This means the API is deployed but failing.

## Immediate Steps

### 1. Check Vercel Logs (This Will Show You the Exact Error)

1. Go to https://vercel.com
2. Click your project (`feliznavidadstore`)
3. Click **"Functions"** tab
4. Click on `api/index.js`
5. Look at the **Logs** section

**This will show you the exact error!**

### 2. Most Likely Issue: Missing Environment Variables

Your API needs these in Vercel:

Go to: **Settings → Environment Variables**

Add:
```
SUPABASE_URL = https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
FRONTEND_URL = https://www.feliznavidadstore.com
```

**Select:** Production, Preview, Development (all three)

### 3. Redeploy

After adding variables:
- **Deployments** tab
- Click **"..."** on latest
- Click **"Redeploy"**

### 4. Test Health Endpoint

Try:
```
https://www.feliznavidadstore.com/health
```

This will tell you if database is connected.

## What the Logs Will Tell You

The Vercel function logs will show one of these:

- **"Missing required environment variables"** → Add env vars
- **"Database: disconnected"** → Check Supabase credentials
- **"Cannot find module"** → Dependencies issue
- **"CORS error"** → Update FRONTEND_URL

## Quick Fix

1. ✅ Check logs in Vercel
2. ✅ Add missing environment variables
3. ✅ Redeploy
4. ✅ Test `/health` endpoint

The logs are your best friend here! Check them first. 🔍

