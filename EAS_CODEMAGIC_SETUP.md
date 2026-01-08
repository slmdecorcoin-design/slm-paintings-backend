# EAS Build with Codemagic - Authentication Setup

## Problem
CI/CD build fails because EAS requires authentication via `EXPO_TOKEN`.

## Solution: Add EXPO_TOKEN to Codemagic

### Step 1: Generate Personal Access Token from Expo Dashboard

1. Go to https://expo.dev/settings/tokens
2. Click "Create Token"
3. Name: `codemagic-build`
4. Copy the token (you won't see it again)

### Step 2: Add Token to Codemagic Environment Variables

1. Go to **Codemagic Dashboard**
2. Select your project
3. Click **Environment Variables**
4. Add a new variable:
   - **Name**: `EXPO_TOKEN`
   - **Value**: (paste the token from Step 1)
   - **Secure**: ✅ Check this box!

### Step 3: Rebuild

1. Go to your builds
2. Click **Start New Build**
3. Select **android-workflow**
4. The build will now authenticate with EAS and build your APK!

## Alternative: Using app.json projectId

If you prefer, EAS can also track projects via the `projectId` in `app.json`:

```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "42a2149e-37cd-400a-80d6-db5c03492e7d"
      }
    }
  }
}
```

This is already configured in your project! ✅
