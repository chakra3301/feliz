# Install Dependencies Now

You're in the `server` directory. Run this command:

```bash
npm install
```

This will:
1. Read `package.json`
2. Download all dependencies (express, stripe, supabase, etc.)
3. Create the `node_modules` folder

After it finishes, you can verify with:
```bash
ls node_modules
```

You should see folders like:
- express
- stripe  
- @supabase
- cors
- dotenv

Then start the server with:
```bash
npm run dev
```

