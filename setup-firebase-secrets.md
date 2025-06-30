# Firebase Secrets Setup Guide

## Step 1: Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/project/my-inventory-project-9dccf/settings/serviceaccounts/adminsdk)
2. Click "Generate new private key"
3. Choose "Firebase Admin SDK"
4. Click "Generate key"
5. Download the JSON file

## Step 2: Add Secret to GitHub

1. Go to [GitHub Repository Secrets](https://github.com/khod-ed/inventory-system/settings/secrets/actions)
2. Click "New repository secret"
3. Name: `FIREBASE_SERVICE_ACCOUNT`
4. Value: Copy the entire content of the downloaded JSON file
5. Click "Add secret"

## Step 3: Test the Workflow

After adding the secret, the frontend deployment should work automatically on the next push.

## Alternative: Manual Firebase Deploy

If you prefer to deploy manually:
```bash
cd frontend
npm run build
firebase deploy --only hosting
``` 