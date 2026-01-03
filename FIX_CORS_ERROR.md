# Fix: CORS Error - "Redirect is not allowed for a preflight request"

## The Problem

You're seeing:
```
Access to fetch at 'https://feliznavidadstore.com/api/...' from origin 'https://www.feliznavidadstore.com' 
has been blocked by CORS policy: Response to preflight request doesn't pass access control check: 
Redirect is not allowed for a preflight request.
```

This happens when:
1. Frontend is at `https://www.feliznavidadstore.com` (with www)
2. API URL is set to `https://feliznavidadstore.com/api` (without www)
3. Browser treats this as a cross-origin request
4. A redirect happens during the preflight OPTIONS request (browsers block this)

## The Fix

### Step 1: Update Environment Variables in Vercel

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. Update `FRONTEND_URL` to include **both** www and non-www versions:
   ```
   https://www.feliznavidadstore.com,https://feliznavidadstore.com
   ```
   (Comma-separated, no spaces after commas)

3. Update `VITE_API_URL` to match your **current domain** (with www if that's what users see):
   ```
   https://www.feliznavidadstore.com/api
   ```
   OR if your site redirects to non-www:
   ```
   https://feliznavidadstore.com/api
   ```

4. **Important:** Select **all environments** (Production, Preview, Development)

### Step 2: Redeploy

After updating environment variables:
1. Go to **Deployments** tab
2. Click **"..."** on the latest deployment
2. Click **"Redeploy"**

## What Changed in Code

The code now:
- ✅ Automatically handles both www and non-www versions in CORS
- ✅ Matches API URL to current domain (www/non-www)
- ✅ Allows requests from both www and non-www origins
- ✅ Better CORS error logging

## Verify It Works

After redeploying, check the browser console. You should see:
```
API Base URL configured: https://www.feliznavidadstore.com/api
Current origin: https://www.feliznavidadstore.com
```

Both should match (both with www or both without).

## Best Practice: Choose One Canonical Domain

To avoid this issue entirely, configure your domain to redirect one to the other:

### Option A: Redirect www → non-www (Recommended)
In your domain/DNS settings, set up a redirect so:
- `www.feliznavidadstore.com` → `feliznavidadstore.com`

Then set:
- `FRONTEND_URL=https://feliznavidadstore.com`
- `VITE_API_URL=https://feliznavidadstore.com/api`

### Option B: Redirect non-www → www
In your domain/DNS settings, set up a redirect so:
- `feliznavidadstore.com` → `www.feliznavidadstore.com`

Then set:
- `FRONTEND_URL=https://www.feliznavidadstore.com`
- `VITE_API_URL=https://www.feliznavidadstore.com/api`

## Still Not Working?

1. **Check Vercel Domain Settings:**
   - Go to **Settings** → **Domains**
   - See which domain is primary
   - Check if redirects are configured

2. **Test the API directly:**
   ```bash
   curl -X OPTIONS https://www.feliznavidadstore.com/api/checkout/create-session \
     -H "Origin: https://www.feliznavidadstore.com" \
     -H "Access-Control-Request-Method: POST" \
     -v
   ```
   Should return CORS headers.

3. **Check browser console:**
   - Look for CORS error details
   - Check the "API Base URL configured" log
   - Verify it matches your current domain

4. **Check Vercel Function Logs:**
   - Go to **Functions** tab → api/index.js**
   - Look for CORS-related errors
   - Check if requests are reaching the function

## Common Mistakes

❌ **Wrong:**
```
FRONTEND_URL=https://feliznavidadstore.com
VITE_API_URL=https://www.feliznavidadstore.com/api
```
(Mismatch between www and non-www)

✅ **Correct:**
```
FRONTEND_URL=https://www.feliznavidadstore.com,https://feliznavidadstore.com
VITE_API_URL=https://www.feliznavidadstore.com/api
```
(Include both in FRONTEND_URL, match current domain in VITE_API_URL)

