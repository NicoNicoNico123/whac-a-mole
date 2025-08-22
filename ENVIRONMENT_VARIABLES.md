# Environment Variables Setup

This project supports loading Firebase configuration from environment variables for both local development and production deployments.

## Environment Variable Loading Order

The Firebase configuration loads environment variables in this priority order:

1. `VITE_FIREBASE_*` variables (for local .env files)
2. `FIREBASE_*` variables (for GitHub Actions/secrets)
3. Default hardcoded values (fallback)

## Local Development Setup

### Option 1: Using .env file (Recommended)
1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your actual Firebase configuration values

3. The variables will be automatically loaded when you run the development server

### Option 2: System Environment Variables
Set environment variables in your shell:
```bash
export VITE_FIREBASE_API_KEY="your_api_key"
export VITE_FIREBASE_AUTH_DOMAIN="your_project.firebaseapp.com"
# ... other variables
```

## GitHub Actions Deployment

For GitHub Actions deployment, set the following secrets in your repository:

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Add the following repository secrets:
   - `FIREBASE_APIKEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`
   - `FIREBASE_MEASUREMENT_ID`

In your GitHub Actions workflow, reference them like this:
```yaml
env:
  FIREBASE_APIKEY: ${{ secrets.FIREBASE_APIKEY }}
  FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
  # ... other variables
```

## Available Environment Variables

| Variable Name | Description | Required |
|---------------|-------------|----------|
| `VITE_FIREBASE_API_KEY` or `FIREBASE_APIKEY` | Firebase API Key | Yes |
| `VITE_FIREBASE_AUTH_DOMAIN` or `FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | Yes |
| `VITE_FIREBASE_PROJECT_ID` or `FIREBASE_PROJECT_ID` | Firebase Project ID | Yes |
| `VITE_FIREBASE_STORAGE_BUCKET` or `FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | Yes |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` or `FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID | Yes |
| `VITE_FIREBASE_APP_ID` or `FIREBASE_APP_ID` | Firebase App ID | Yes |
| `VITE_FIREBASE_MEASUREMENT_ID` or `FIREBASE_MEASUREMENT_ID` | Firebase Measurement ID | No |

## Security Best Practices

1. **Never commit sensitive keys** to version control
2. **Use different Firebase projects** for development and production
3. **Regularly rotate API keys** for security
4. **Use environment-specific configuration** files
5. **Keep .env files in .gitignore**

## Troubleshooting

### Environment Variables Not Loading
1. Make sure you're using the correct variable names
2. Check that .env files are in the correct location (project root)
3. Verify that variables are properly exported in GitHub Actions

### Firebase Authentication Errors
1. Check that all required environment variables are set
2. Verify that your Firebase project settings are correct
3. Ensure your Firebase security rules allow the required operations

## Example .env.local File

```bash
VITE_FIREBASE_API_KEY=AIzaSyBexampleKey1234567890abcdefghijklmnopqrstuvwxyz
VITE_FIREBASE_AUTH_DOMAIN=my-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=my-project
VITE_FIREBASE_STORAGE_BUCKET=my-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdefghijklmnop
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```