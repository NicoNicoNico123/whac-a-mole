# Firebase Environment Variables Setup

This project now **requires** Firebase configuration to be loaded from environment variables. **No hardcoded fallback values are provided**, ensuring security best practices.

## ⚠️ Important Notice

Without proper environment variable configuration:
- **Local Development**: `npm run dev` will fail to initialize Firebase
- **Production Build**: `npm run build` will build successfully but Firebase features will not work
- **Leaderboard**: Will not save or load scores

## Required Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_FIREBASE_API_KEY` | Firebase API Key | ✅ Yes |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | ✅ Yes |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | ✅ Yes |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | ✅ Yes |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID | ✅ Yes |
| `VITE_FIREBASE_APP_ID` | Firebase App ID | ✅ Yes |
| `VITE_FIREBASE_MEASUREMENT_ID` | Firebase Measurement ID | ❌ No |

## Local Development Setup

### Step 1: Create Environment File
```bash
cp .env.local.example .env.local
```

### Step 2: Configure Firebase
Edit `.env.local` and add your actual Firebase configuration values:
```bash
VITE_FIREBASE_API_KEY=AIzaSyBexampleKey1234567890abcdefghijklmnopqrstuvwxyz
VITE_FIREBASE_AUTH_DOMAIN=my-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=my-project
VITE_FIREBASE_STORAGE_BUCKET=my-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdefghijklmnop
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Step 3: Start Development Server
```bash
npm run dev
```

## GitHub Actions Deployment

### Step 1: Set Repository Secrets
1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add the following repository secrets:
   - `FIREBASE_APIKEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`
   - `FIREBASE_MEASUREMENT_ID`

### Step 2: Configure Workflow
In your GitHub Actions workflow, reference the secrets:
```yaml
env:
  FIREBASE_APIKEY: ${{ secrets.FIREBASE_APIKEY }}
  FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
  FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
  FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
  FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
  FIREBASE_APP_ID: ${{ secrets.FIREBASE_APP_ID }}
  FIREBASE_MEASUREMENT_ID: ${{ secrets.FIREBASE_MEASUREMENT_ID }}
```

## Environment Variable Loading Priority

The Firebase configuration loads environment variables in this priority order:

1. **`VITE_FIREBASE_*` variables** (for local .env files)
2. **`FIREBASE_*` variables** (for GitHub Actions/secrets)

## Security Best Practices

1. **Never commit sensitive keys** to version control
2. **Use different Firebase projects** for development and production
3. **Regularly rotate API keys** for security
4. **Use environment-specific configuration** files
5. **Keep .env files in .gitignore**

## Troubleshooting

### Firebase Initialization Failures
1. Check that all **required** environment variables are set
2. Verify that your Firebase project settings are correct
3. Ensure your Firebase security rules allow the required operations

### Environment Variables Not Loading
1. Make sure you're using the correct variable names
2. Check that .env files are in the correct location (project root)
3. Verify that variables are properly exported in GitHub Actions

## Example Configuration Files

### .env.local (Local Development)
```bash
VITE_FIREBASE_API_KEY=AIzaSyBexampleKey1234567890abcdefghijklmnopqrstuvwxyz
VITE_FIREBASE_AUTH_DOMAIN=my-whac-a-mole-game.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=my-whac-a-mole-game
VITE_FIREBASE_STORAGE_BUCKET=my-whac-a-mole-game.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdefghijklmnop
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### GitHub Actions Workflow
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          FIREBASE_APIKEY: ${{ secrets.FIREBASE_APIKEY }}
          FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
          FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
          FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
          FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
          FIREBASE_APP_ID: ${{ secrets.FIREBASE_APP_ID }}
          FIREBASE_MEASUREMENT_ID: ${{ secrets.FIREBASE_MEASUREMENT_ID }}

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Need Help?

If you're having trouble setting up Firebase environment variables:

1. Make sure you have a Firebase project
2. Get your Firebase configuration from the Firebase Console
3. Copy the values to your `.env.local` file or GitHub repository secrets
4. Test with `npm run dev` locally first

For more information, refer to the [Firebase Documentation](https://firebase.google.com/docs/web/setup).