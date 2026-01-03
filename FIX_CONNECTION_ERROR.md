# Fix: ERR_CONNECTION_REFUSED Error

## What This Error Means

`ERR_CONNECTION_REFUSED` means your frontend is trying to connect to the API server, but:
- The API server isn't running, OR
- The API URL is incorrect

## Quick Fix Options

### Option 1: Start the API Server (For Local Development)

If you're testing locally, start the API server:

```bash
cd server
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3001
```

Then your frontend can connect to `http://localhost:3001/api`

### Option 2: Use Production API (If Deployed to Vercel)

If your API is deployed to Vercel, update your frontend `.env`:

```env
VITE_API_URL=https://your-api-project.vercel.app/api
```

Replace `your-api-project` with your actual Vercel project name.

## Step-by-Step Fix

### 1. Check if API Server is Running

Open a new terminal and run:
```bash
curl http://localhost:3001/health
```

**If it works:** Server is running ✅  
**If it fails:** Server is not running ❌

### 2. Start the API Server

```bash
cd server
npm run dev
```

Keep this terminal open - the server needs to keep running.

### 3. Verify Frontend .env File

Create or check `.env` in the root directory:

```env
VITE_API_URL=http://localhost:3001/api
```

### 4. Restart Frontend

After creating/updating `.env`, restart your frontend:

```bash
# Stop the current dev server (Ctrl+C)
# Then restart:
npm run dev
```

**Important:** Vite requires a restart to pick up new environment variables.

## For Production (Vercel)

If you're on Vercel and getting this error:

1. **Check your API is deployed:**
   - Go to Vercel dashboard
   - Verify your API project is deployed
   - Get the URL (e.g., `https://feliz-api.vercel.app`)

2. **Update Frontend Environment Variables:**
   - In Vercel dashboard → Your frontend project
   - Settings → Environment Variables
   - Add: `VITE_API_URL=https://your-api.vercel.app/api`
   - Redeploy frontend

## Common Issues

### "Server won't start"
- Check that dependencies are installed: `cd server && npm install`
- Check that `.env` file exists with Supabase credentials
- Check for port conflicts (something else using port 3001)

### "Still getting connection refused"
- Make sure API server is actually running (check terminal)
- Verify the URL in `.env` matches where server is running
- Check browser console for the exact URL it's trying to connect to

### "Works locally but not on Vercel"
- Make sure API is deployed to Vercel
- Check environment variables are set in Vercel
- Verify `VITE_API_URL` points to your Vercel API URL (not localhost)

## Testing the Connection

Once server is running, test in browser console:

```javascript
fetch('http://localhost:3001/health')
  .then(r => r.json())
  .then(console.log)
```

Should return: `{status: "ok", database: "connected", ...}`

## Quick Checklist

- [ ] API server is running (`npm run dev` in server directory)
- [ ] Frontend `.env` has `VITE_API_URL=http://localhost:3001/api`
- [ ] Frontend was restarted after creating `.env`
- [ ] No port conflicts (port 3001 is free)
- [ ] Supabase credentials are in `server/.env`

