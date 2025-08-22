# Environment Variables Setup

This project uses environment variables to manage Firebase configuration for different environments.

## Local Development

For local development, create a `.env` file in the root directory with your Firebase configuration:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## GitHub Actions Deployment

For GitHub Actions deployment, set the following secrets in your repository:

- `FIREBASE_APIKEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `FIREBASE_MEASUREMENT_ID`

The application will automatically use:
1. `VITE_FIREBASE_API_KEY` for local development
2. `FIREBASE_APIKEY` for GitHub Actions
3. Default values if neither is available

## Security Notes

- Never commit `.env` files to version control
- The `.env` file is already added to `.gitignore`
- Use different Firebase projects for development and production if possible