# Deploy Backend to Vercel - Simple Guide

## 🚀 Quick Steps

### 1. Go to Vercel
Visit: https://vercel.com and sign in

### 2. Click "Add New Project"

### 3. Import Your Repository
- Click "Import Git Repository"
- Select your `feliz` repository
- Click "Import"

### 4. Configure (Auto-detected)
Vercel should auto-detect everything. Just click **"Deploy"**

### 5. Wait for Deployment
Takes 1-2 minutes. You'll see a success message.

### 6. Add Environment Variables ⚠️ IMPORTANT

Go to: **Settings → Environment Variables**

Add these (click "Add New" for each):

**Required:**
```
SUPABASE_URL = https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
FRONTEND_URL = https://your-frontend.vercel.app
```

**Select:** Production, Preview, Development (all three)

### 7. Redeploy
- Go to **Deployments** tab
- Click **"..."** on latest deployment
- Click **"Redeploy"**

### 8. Test
Your API is now at: `https://your-project.vercel.app`

Test it:
```
https://your-project.vercel.app/health
```

Should return: `{"status":"ok","database":"connected"}`

## ✅ Done!

Your backend is now live. Use this URL in your frontend:
```
VITE_API_URL=https://your-project.vercel.app/api
```

## 📝 Notes

- **Project Name:** You can name it anything (e.g., `feliz-api`)
- **Environment Variables:** Must add to ALL environments
- **Redeploy:** Always redeploy after adding env vars
- **URL:** You'll get a URL like `https://feliz-api.vercel.app`

See `DEPLOY_BACKEND_VERCEL.md` for detailed troubleshooting.

