# 📱 APK Build & Distribution Guide

## Quick Summary

Your Capacitor React app is ready to be converted to an Android APK for distribution. This guide walks you through the complete process.

---

## Prerequisites (One-Time Setup)

### 1. Install Java Development Kit (JDK)
Choose one option:

**Option A: Oracle JDK 17 (Recommended)**
- Download: https://www.oracle.com/java/technologies/downloads/
- Install to: `C:\Program Files\Java\jdk-17.x.x`

**Option B: Android Studio (Includes JDK)**
- Download: https://developer.android.com/studio
- Install Android Studio (automatically installs JDK)

### 2. Set Java Environment Variables
After installing Java:

1. **Right-click "This PC" or "My Computer"** → Properties
2. **Click "Advanced system settings"**
3. **Click "Environment Variables"**
4. **New System Variable:**
   - Variable name: `JAVA_HOME`
   - Variable value: `C:\Program Files\Java\jdk-17.x.x` (your installation path)
5. **Edit PATH variable:**
   - Add: `C:\Program Files\Java\jdk-17.x.x\bin`
6. **Click OK and restart your terminal**

### 3. Verify Installation
```bash
java -version
javac -version
```

---

## Building the APK

### Method 1: Automated Build (Easiest)

**Run the build script:**
```bash
build_apk.bat
```

This will:
1. ✅ Build web assets
2. ✅ Sync files to Android
3. ✅ Build release APK
4. ✅ Check APK size
5. ✅ Show output location

**Expected Output:**
```
[OK] Web build completed
[OK] Capacitor sync completed
[OK] APK build completed
APK Size: 18.5 MB
[OK] APK is under 50 MB!

Location: android\app\build\outputs\apk\release\app-release-unsigned.apk
```

### Method 2: Manual Build (Step-by-Step)

```bash
# Step 1: Build web assets
npm run build

# Step 2: Sync to Android
npx cap sync android

# Step 3: Build APK
cd android
gradlew.bat assembleRelease

# Back to root
cd ..
```

**APK Location:** `android/app/build/outputs/apk/release/app-release-unsigned.apk`

---

## Signing the APK (Required for Installation)

Before installing on your phone, the APK must be signed.

### Create Keystore (One-Time)
```bash
cd android/app

keytool -genkey -v -keystore release.keystore -keyalg RSA -keysize 2048 -validity 10000

# Answer prompts:
# - First and Last Name: Your Name
# - Organization: Your Company
# - City/State/Country: Your location
# - Password: Create a strong password (remember it!)
```

### Sign the APK
```bash
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore release.keystore \
  build/outputs/apk/release/app-release-unsigned.apk \
  my-key-alias
```

### Optimize with Zipalign (if > 50MB)
```bash
zipalign -v 4 build/outputs/apk/release/app-release-unsigned.apk app-release.apk
```

**Result:** `android/app/app-release.apk` (Ready to install!)

---

## Size Optimization

### Current Status
- Expected APK size: **15-20 MB** ✅ (well under 50 MB)

### If APK Exceeds 50 MB

**Option 1: Use App Bundle (Recommended)**
```bash
cd android
gradlew.bat bundleRelease
```
- Smaller file size
- More optimized by Play Store
- Better for distribution

**Option 2: Optimize Manually**
- Compress images further
- Remove unused fonts/assets
- Check [APK_OPTIMIZATION.md](APK_OPTIMIZATION.md)

---

## Distribution via QR Code

### Option A: Self-Hosted (Recommended for Testing)

**1. Start a local web server:**
```bash
# Using Python
python -m http.server 8000

# Or using Node
npx http-server -p 8000
```

**2. Copy APK to serve:**
```bash
copy android\app\app-release.apk .
```

**3. Get your IP address:**
```bash
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.1.100)

**4. Generate QR code:**
```bash
qr_apk.bat "http://192.168.1.100:8000/app-release.apk"
```

**5. Share the generated `apk_qr_code.png` with users**

### Option B: Online Hosting

Upload `app-release.apk` to:
- Firebase Storage
- AWS S3
- GitHub Releases
- Google Drive (with sharing link)
- Any public file host

Then:
```bash
qr_apk.bat "https://your-hosted-url/app-release.apk"
```

### Option C: Google Play Store

For public distribution:
1. Sign APK with release keystore
2. Upload to Google Play Console
3. Google automatically generates QR codes
4. Much larger audience reach

---

## Installation on Android Phone

### User Instructions

**Step 1: Enable Unknown Sources**
- Settings → Security → Unknown Sources → Enable

**Step 2: Scan QR Code**
- Open phone camera or QR code scanner
- Point at QR code
- Tap notification that appears

**Step 3: Download & Install**
- Browser opens and downloads APK
- Tap "Install" when prompted
- Wait for installation to complete
- Tap "Open" to launch app

**Step 4: Allow Permissions**
- Camera (for scanning)
- Location (if used)
- Other permissions as needed

---

## Verification

### Check APK Size
```bash
dir android\app\build\outputs\apk\release\app-release-unsigned.apk
```

### Install on Phone
```bash
adb install -r android\app\app-release.apk
```

### View App Logs
```bash
adb logcat | find "slmpaintings"
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| **Java not found** | Install JDK, set JAVA_HOME, restart terminal |
| **Gradle build fails** | Ensure you have Java 11+ installed |
| **APK > 50 MB** | Use App Bundle or check [APK_OPTIMIZATION.md](APK_OPTIMIZATION.md) |
| **Can't scan QR** | Ensure QR URL is accessible from mobile network |
| **Installation fails** | Enable "Unknown Sources" in Settings |
| **App crashes** | Check logs with `adb logcat` |
| **No internet** | Check AndroidManifest.xml has `INTERNET` permission |

---

## File Reference

| File | Purpose |
|------|---------|
| `build_apk.bat` | Automated build script |
| `qr_apk.bat` | Generate QR codes |
| `APK_BUILD_GUIDE.md` | Detailed setup guide |
| `APK_OPTIMIZATION.md` | Size optimization tips |
| `android/app/app-release.apk` | Final signed APK (ready to install) |

---

## Next Steps

1. **Install Java** (if not already installed)
2. **Run:** `build_apk.bat`
3. **Sign APK** (see Signing section above)
4. **Host APK** (self-hosted or cloud)
5. **Generate QR:** `qr_apk.bat "your-url"`
6. **Share QR code** with users
7. **Users install** by scanning QR code

---

## Support Resources

- **Capacitor Docs:** https://capacitorjs.com/docs
- **Android Build:** https://developer.android.com/build
- **Java Setup:** https://docs.oracle.com/javase/tutorial/
- **Gradle Guide:** https://gradle.org/

---

**Your app is ready! Follow the steps above to build and distribute your APK.** 🎉
