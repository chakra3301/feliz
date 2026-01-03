# Quick Fix: Connection Refused Error

## The Problem
Your frontend is trying to connect to `http://localhost:3001/api` but nothing is running there.

## The Solution

### Step 1: Start the API Server

Open a terminal and run:
```bash
cd server
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3001
```

**Keep this terminal open!** The server needs to keep running.

### Step 2: Create Frontend .env File

I've already created `.env` with:
```
VITE_API_URL=http://localhost:3001/api
```

### Step 3: Restart Your Frontend

Stop your frontend dev server (Ctrl+C) and restart:
```bash
npm run dev
```

**Important:** Vite needs a restart to read new environment variables.

### Step 4: Test

Try checkout again. It should work now!

## If You're on Vercel (Production)

If you're testing the deployed site:

1. Make sure your API is deployed to Vercel
2. Update frontend environment variable in Vercel:
   ```
   VITE_API_URL=https://your-api-project.vercel.app/api
   ```
3. Redeploy frontend

## Still Not Working?

Check:
- Is the API server actually running? (Check the terminal)
- Did you restart the frontend after creating `.env`?
- Check browser console for the exact error

