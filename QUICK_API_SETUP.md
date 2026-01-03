# Quick API Setup - Run These Commands

## Step 1: Install Dependencies

Open terminal and run:

```bash
cd server
npm install
```

This installs all required packages (Express, Stripe, Supabase, etc.)

## Step 2: Configure Environment Variables

Your `.env` file is already in `server/` directory. Open it and make sure you have:

```env
# REQUIRED - Get from Supabase Dashboard → Settings → API
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional - Add later when setting up Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Server Config
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### How to Get Supabase Credentials:

1. Go to https://app.supabase.com
2. Click your project
3. Go to **Settings** (gear icon) → **API**
4. Copy:
   - **Project URL** → paste as `SUPABASE_URL`
   - **service_role** key (the secret one) → paste as `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **Use service_role key, NOT anon key!**

## Step 3: Set Up Database

1. Go to Supabase Dashboard → **SQL Editor**
2. Click **New Query**
3. Open `server/database/schema.sql` in your editor
4. Copy ALL the SQL code
5. Paste into Supabase SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)

This creates all the tables you need.

## Step 4: (Optional) Add Test Data

1. In Supabase SQL Editor, create a new query
2. Open `server/database/seed.example.sql`
3. Copy ALL the SQL code
4. Paste into Supabase SQL Editor
5. Click **Run**

This adds sample products to test with.

## Step 5: Start the Server

```bash
cd server
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3001
📦 Environment: development
🔗 Frontend URL: http://localhost:5173
```

## Step 6: Test It Works

Open a new terminal and run:

```bash
curl http://localhost:3001/health
```

Should return:
```json
{"status":"ok","database":"connected","timestamp":"..."}
```

Or open in browser: http://localhost:3001/health

## Step 7: Test Products Endpoint

```bash
curl http://localhost:3001/api/products
```

Or in browser: http://localhost:3001/api/products

Should return an array of products (empty `[]` if you didn't seed data).

## ✅ You're Done!

Your API is now running. The frontend can connect to it at `http://localhost:3001/api`

## Troubleshooting

### "Missing required environment variables"
- Make sure `.env` file exists in `server/` directory
- Check that `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are filled in
- No extra spaces or quotes around values

### "Database: disconnected"
- Double-check Supabase credentials
- Make sure you ran `schema.sql` to create tables
- Verify you're using **service_role** key (not anon key)

### "Cannot find module"
- Run `npm install` in the `server/` directory
- Make sure you're in the `server/` directory when running commands

### Port 3001 already in use
- Change `PORT=3001` to a different port in `.env`
- Or stop whatever is using port 3001

## Next Steps

1. ✅ API is running
2. ✅ Database is connected
3. ⏭️ Test frontend connection
4. ⏭️ Add Stripe when ready
5. ⏭️ Deploy to production

