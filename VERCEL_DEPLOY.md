# Deploying to Vercel

This guide will help you deploy your Feliz store to Vercel for testing.

## Prerequisites

- ✅ Supabase credentials configured
- ✅ GitHub repository (or GitLab/Bitbucket)
- ⚠️ Stripe not required for initial testing

## Deployment Options

### Option 1: Deploy Frontend Only (Recommended for Testing)

Since you haven't set up Stripe yet, you can deploy just the frontend to test the UI and Supabase connection.

#### Steps:

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset:** Vite
     - **Root Directory:** `./` (leave as is)
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`
     - **Install Command:** `npm install`

3. **Add Environment Variables:**
   - In Vercel project settings → Environment Variables
   - Add:
     ```
     VITE_API_URL=https://your-backend-url.vercel.app/api
     ```
   - Or if you're not deploying backend yet:
     ```
     VITE_API_URL=http://localhost:3001/api
     ```
     (This will only work locally, but won't break the build)

4. **Deploy!**

### Option 2: Deploy Frontend + Backend (Full Stack)

For a complete deployment with the backend API:

#### Steps:

1. **Update Vercel Configuration:**
   - The `vercel.json` file is already configured
   - Vercel will automatically detect and deploy both frontend and backend

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect the configuration

3. **Add Environment Variables in Vercel:**
   
   Go to Project Settings → Environment Variables and add:

   **Backend Variables:**
   ```
   STRIPE_SECRET_KEY=sk_test_... (leave empty for now)
   STRIPE_PUBLISHABLE_KEY=pk_test_... (leave empty for now)
   STRIPE_WEBHOOK_SECRET=whsec_... (leave empty for now)
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   PORT=3001
   FRONTEND_URL=https://your-project.vercel.app
   ```

   **Frontend Variables:**
   ```
   VITE_API_URL=https://your-project.vercel.app/api
   ```

4. **Redeploy** after adding environment variables

## Important Notes

### Without Stripe Configuration

- ✅ The site will deploy and run
- ✅ You can browse products
- ✅ Admin dashboard will work (if you seed orders manually)
- ⚠️ Checkout button will show an error: "Payment processing is not yet configured"
- ⚠️ You won't be able to process payments

### Testing Without Stripe

You can still test:
1. **Product browsing** - All product pages work
2. **Cart functionality** - Add/remove items
3. **Admin dashboard** - View orders (if you add test data)
4. **Database connection** - Verify Supabase is working

### Adding Test Data

To test the admin dashboard without Stripe:

1. Go to Supabase SQL Editor
2. Run this to add a test order:
   ```sql
   INSERT INTO orders (
     stripe_session_id,
     customer_email,
     customer_name,
     total_amount,
     payment_status,
     order_status
   ) VALUES (
     'test_session_123',
     'test@example.com',
     'Test Customer',
     7800,
     'paid',
     'pending'
   );
   ```

## Vercel Configuration Files

### `vercel.json` (Root)
This handles routing - API calls go to backend, everything else to frontend.

### `server/vercel.json` (Backend)
This configures the serverless function for the backend API.

## Environment Variables in Vercel

### Where to Add Them:

1. Go to your project on Vercel
2. Settings → Environment Variables
3. Add each variable:
   - **Key:** The variable name (e.g., `SUPABASE_URL`)
   - **Value:** Your actual value
   - **Environment:** Select all (Production, Preview, Development)

### Required Variables:

**For Testing (No Stripe):**
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VITE_API_URL` (frontend)
- `FRONTEND_URL` (backend)

**For Full Functionality (With Stripe):**
- All above, plus:
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

## Deployment Checklist

- [ ] Push code to GitHub
- [ ] Connect repository to Vercel
- [ ] Add Supabase environment variables
- [ ] Add `VITE_API_URL` for frontend
- [ ] Deploy
- [ ] Test the deployed site
- [ ] Verify Supabase connection works
- [ ] (Optional) Add test order data to see admin dashboard

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify build command is correct
- Check Vercel build logs

### API Not Working
- Verify environment variables are set in Vercel
- Check that `VITE_API_URL` points to correct backend URL
- Verify CORS is configured (should be automatic)

### Database Connection Issues
- Double-check Supabase credentials
- Verify Supabase project is active
- Check that database schema is created

### Checkout Shows Error
- This is expected without Stripe
- The error message will say "Payment processing is not yet configured"
- This is normal until you add Stripe keys

## Next Steps After Deployment

1. **Test the site** - Browse products, test cart
2. **Verify Supabase** - Check that database queries work
3. **Set up Stripe** - When ready, add Stripe keys to Vercel
4. **Configure webhook** - Point Stripe webhook to your Vercel API URL
5. **Test checkout** - Use Stripe test cards

## Quick Deploy Command

If you have Vercel CLI installed:
```bash
npm i -g vercel
vercel
```

Follow the prompts to deploy!

