# Fix: 404 Error on API Endpoints

## The Problem

You're seeing:
```
/.vercel.app/api/checkout/create-session:1  Failed to load resource: the server responded with a status of 404
```

This means `VITE_API_URL` is set to a **relative path** instead of a **full URL**.

## Quick Fix

### Step 1: Check Your Current Domain

Your site is deployed at: `https://feliznavidadstore.com` (or check your Vercel dashboard)

### Step 2: Update VITE_API_URL in Vercel

1. Go to **Vercel Dashboard** → Your Project
2. **Settings** → **Environment Variables**
3. Find `VITE_API_URL` (or create it if it doesn't exist)
4. Set it to:
   ```
   https://feliznavidadstore.com/api
   ```
   OR if you're using a Vercel preview URL:
   ```
   https://feliznavidadstore.vercel.app/api
   ```

**Important:** 
- Use the **same domain** as your frontend
- Must include `https://`
- Must end with `/api`
- Select **all environments** (Production, Preview, Development)

### Step 3: Redeploy

After updating the environment variable:
1. Go to **Deployments** tab
2. Click **"..."** on the latest deployment
3. Click **"Redeploy"**

## What Changed in Code

The code now automatically fixes relative URLs:
- If `VITE_API_URL` starts with `/`, it will use the current domain
- Example: `/.vercel.app/api` → `https://feliznavidadstore.com/.vercel.app/api`

But it's better to set the correct full URL in Vercel!

## Verify It Works

After redeploying, check the browser console. You should see:
```
API Base URL configured: https://feliznavidadstore.com/api
```

And the checkout should work!

## Common Mistakes

❌ **Wrong:**
```
VITE_API_URL=/.vercel.app/api
VITE_API_URL=/api
VITE_API_URL=api
```

✅ **Correct:**
```
VITE_API_URL=https://feliznavidadstore.com/api
VITE_API_URL=https://feliznavidadstore.vercel.app/api
```

## Still Not Working?

1. **Check Vercel Functions:**
   - Go to **Functions** tab
   - Verify `api/index.js` exists and has logs
   - Check for any errors

2. **Test the API directly:**
   ```bash
   curl https://feliznavidadstore.com/health
   ```
   Should return: `{"status":"ok","database":"connected",...}`

3. **Check browser console:**
   - Look for the "API Base URL configured" log
   - Verify it shows the correct full URL

