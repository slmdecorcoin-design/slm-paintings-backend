# APK Build & Deployment Guide

## Prerequisites Setup
Since your workspace has Java version 25 (too new for Gradle), you need to install JDK 11 or 17:

### Option 1: Install JDK 17 (Recommended)
1. Download: https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html
2. Install to: `C:\Program Files\Java\jdk-17.x.x`
3. Set environment variable:
   - Right-click "This PC" → Properties
   - Advanced system settings → Environment Variables
   - New: `JAVA_HOME = C:\Program Files\Java\jdk-17.x.x`
   - Add to PATH: `C:\Program Files\Java\jdk-17.x.x\bin`

### Option 2: Use Android Studio's Built-in JDK
Install Android Studio (includes JDK) and set:
```
JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
```

## Build Steps

### Step 1: Sync Capacitor Files
```bash
cd c:\Users\rm770\Downloads\ai-ui-enhancer-main\ai-ui-enhancer-main
npx cap sync android
```

### Step 2: Build Release APK
```bash
cd android
gradlew.bat assembleRelease
```

The APK will be generated at:
```
android\app\build\outputs\apk\release\app-release-unsigned.apk
```

### Step 3: Sign the APK
Create a keystore first (one-time):
```bash
cd android/app
keytool -genkey -v -keystore release.keystore -keyalg RSA -keysize 2048 -validity 10000
```

Then sign the APK:
```bash
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore release.keystore build/outputs/apk/release/app-release-unsigned.apk alias_name
```

### Step 4: Optimize with zipalign (if > 50MB)
```bash
zipalign -v 4 build/outputs/apk/release/app-release-unsigned.apk app-release.apk
```

## Size Optimization Tips

If APK is still > 50MB:

1. **Use App Bundle (Recommended)**
   - Build AAB instead: `gradlew.bat bundleRelease`
   - Upload to Play Store, download optimized APKs

2. **Reduce Assets**
   - Compress images further
   - Remove unused fonts
   - Check dist/ folder for large files

3. **Remove Unused Dependencies**
   - Check package.json for unused packages
   - ProGuard/R8 helps with minification (already enabled)

## Installation QR Code Generation

Once you have the signed APK:

### Method 1: Using Local Hosting
```bash
npm install -g http-server
http-server -p 8000
```
Then share: `http://your-ip:8000/app-release.apk`

### Method 2: Using Python Server
```bash
python -m http.server 8000
```

### Method 3: Using QR Code Generator
```bash
npm install -g qr-image
node -e "require('qr-image').save('qr.png', 'http://your-url/app-release.apk')"
```

Or use online: https://www.qr-code-generator.com/

## Installation Instructions for Users

1. Download the QR code or use your phone camera
2. Scan the QR code
3. Allow installation from unknown sources (Settings > Security)
4. Install the APK

## Common Issues

| Issue | Solution |
|-------|----------|
| APK > 50MB | Use App Bundle instead, compress images, remove unused fonts |
| Installation fails | Check min/target SDK compatibility with device |
| App crashes | Check logcat: `adb logcat \| grep -i error` |
| Can't scan QR | Ensure QR URL is accessible from mobile network |

## File Locations
- Web assets: `dist/`
- Android project: `android/`
- Build output: `android/app/build/outputs/apk/release/`
- Signed APK: `android/app/app-release.apk`

---
**Next Steps:** Install Java, run the build steps above, and share the generated APK via QR code!
