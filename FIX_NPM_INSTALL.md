# Fix: npm install Error

You're getting a permissions error with npm. Here's how to fix it:

## Option 1: Run npm install manually (Recommended)

Open your terminal and run:

```bash
cd /Users/lucaorion/feliz/server
npm install
```

If you still get permission errors, try:

```bash
cd /Users/lucaorion/feliz/server
npm install --legacy-peer-deps
```

## Option 2: Fix npm permissions

If you keep getting permission errors, try:

```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

Then try installing again:
```bash
cd /Users/lucaorion/feliz/server
npm install
```

## Option 3: Use nvm (Node Version Manager)

If npm is still having issues, consider using nvm:

```bash
# Install nvm (if not already installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Use Node.js via nvm
nvm install 18
nvm use 18

# Then install dependencies
cd /Users/lucaorion/feliz/server
npm install
```

## What Should Happen

After running `npm install`, you should see:

```
added 150 packages, and audited 151 packages in 5s
```

Then you can start the server:
```bash
npm run dev
```

## Verify Installation

Check that `node_modules` folder exists:
```bash
ls -la server/node_modules | head -10
```

You should see folders like:
- express
- stripe
- @supabase
- cors
- dotenv

## Still Having Issues?

1. Make sure you're in the `server/` directory
2. Check Node.js version: `node --version` (should be 18+)
3. Check npm version: `npm --version`
4. Try clearing npm cache: `npm cache clean --force`
5. Try deleting `node_modules` and `package-lock.json` then reinstalling

