# Fix: 500 Internal Server Error

## What This Error Means

A 500 error means your API is deployed and receiving requests, but something is failing on the server side.

## Most Common Causes

### 1. Missing Environment Variables (Most Likely)

Your API needs these environment variables in Vercel:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `FRONTEND_URL`

**Fix:**
1. Go to Vercel Dashboard → Your Project
2. **Settings** → **Environment Variables**
3. Add the missing variables
4. **Redeploy**

### 2. Database Connection Issues

The API can't connect to Supabase.

**Check:**
- Supabase credentials are correct
- Using **service_role** key (not anon key)
- Database tables exist (run schema.sql)

### 3. Code Errors

There might be an error in the API code.

**Check Vercel Logs:**
1. Go to Vercel Dashboard → Your Project
2. Click **"Functions"** tab
3. Click on `api/index.js`
4. View the logs - you'll see the exact error

## Step-by-Step Debugging

### Step 1: Check Vercel Function Logs

1. Go to https://vercel.com
2. Click your project
3. Click **"Functions"** tab
4. Click on `api/index.js` (or the function that's failing)
5. Look at the **Logs** section

You'll see the exact error message there.

### Step 2: Verify Environment Variables

In Vercel Dashboard → Settings → Environment Variables, make sure you have:

```
SUPABASE_URL = https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
FRONTEND_URL = https://www.feliznavidadstore.com
```

**Important:**
- Must be added to **all environments** (Production, Preview, Development)
- No extra spaces or quotes
- Use the **service_role** key (not anon key)

### Step 3: Test Health Endpoint

Try accessing:
```
https://www.feliznavidadstore.com/health
```

This will tell you if the database is connected.

**Expected response:**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "..."
}
```

**If you get "database: disconnected":**
- Supabase credentials are wrong
- Database tables don't exist
- Network issue

### Step 4: Check Database Tables

Make sure you've run the schema in Supabase:

1. Go to Supabase Dashboard → SQL Editor
2. Run `server/database/schema.sql`
3. Verify tables exist

## Quick Fix Checklist

- [ ] Check Vercel function logs for exact error
- [ ] Verify all environment variables are set
- [ ] Check environment variables are in **all environments**
- [ ] Verify Supabase credentials are correct
- [ ] Check database tables exist
- [ ] Test `/health` endpoint
- [ ] Redeploy after fixing issues

## Common Error Messages in Logs

### "Missing required environment variables"
- Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to Vercel
- Redeploy

### "Database: disconnected"
- Check Supabase credentials
- Verify you're using service_role key
- Check database tables exist

### "Cannot find module"
- Dependencies might not be installed
- Check that `server/package.json` dependencies are installed
- Vercel should auto-install, but check build logs

### "CORS error"
- Update `FRONTEND_URL` to `https://www.feliznavidadstore.com`
- Redeploy

## How to View Logs

**In Vercel Dashboard:**
1. Your Project → **Functions** tab
2. Click on `api/index.js`
3. Scroll to see **Logs**

**Or:**
1. Your Project → **Deployments** tab
2. Click on a deployment
3. Click **"View Function Logs"**

The logs will show you the exact error!

## Most Likely Fix

Based on the 500 error, you probably need to:

1. **Add backend environment variables to Vercel:**
   ```
   SUPABASE_URL
   SUPABASE_SERVICE_ROLE_KEY
   FRONTEND_URL
   ```

2. **Redeploy** after adding them

3. **Check the logs** to see the exact error

The logs will tell you exactly what's wrong! 🔍

