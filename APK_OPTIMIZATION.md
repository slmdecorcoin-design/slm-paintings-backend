# Android Build Optimization Configuration

## ProGuard Optimization
The app is configured with R8/ProGuard to:
- Remove unused code
- Obfuscate remaining code
- Inline constants
- Remove dead code

Key settings enabled:
- minifyEnabled = true (ProGuard)
- shrinkResources = true (Remove unused resources)
- proguard-android-optimize.txt (Optimized rules)

## Size Reduction Strategies

### Already Implemented
✓ Code minification with ProGuard/R8
✓ Resource shrinking
✓ Unused code removal via dead code elimination

### For Further Optimization

#### 1. Dynamic Import (Reduce Main Chunk)
In vite.config.ts, enable code splitting:
```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom'],
        'radix-ui': ['@radix-ui/react-accordion', '@radix-ui/react-dialog', ...],
        'utils': ['clsx', 'date-fns', 'cmdk']
      }
    }
  }
}
```

#### 2. Image Optimization
```bash
# Compress images further
npm install -g imagemin-cli
imagemin src/assets --out-dir=src/assets
```

#### 3. Remove Unused Fonts
Check public/fonts/ and delete unused font files

#### 4. Use App Bundle Instead of APK
App Bundle (.aab) is smaller and Google Play generates optimized APKs:
```bash
gradlew.bat bundleRelease
```

#### 5. Configuration Optimization
Set minSdkVersion appropriately in android/build.gradle:
```gradle
minSdkVersion 24  // Removes support for older Android versions
```

#### 6. Enable Proguard Aggressive Optimization
In android/app/proguard-rules.pro:
```
-optimizationpasses 10
-mergeinterfacesaggressively
-repackageclasses ''
```

## Size Budget Breakdown

Typical Capacitor + React app breakdown:

| Component | Size | Optimization |
|-----------|------|--------------|
| Capacitor Core | 3-4 MB | Already optimized |
| Androidx Libraries | 5-8 MB | Requires minAPI 24+ |
| React + ReactDOM | 40-60 KB | Already bundled |
| Radix UI Library | 100-200 KB | Tree-shake unused components |
| Other Dependencies | 200-400 KB | Review and remove unused |
| Web Assets (dist) | 600-800 KB | Already built |
| **TOTAL** | **8-15 MB** | **Should easily be < 50MB** |

## Verification Steps

After build, verify:

```bash
# Extract and analyze APK
cd android/app/build/outputs/apk/release/
unzip -l app-release-unsigned.apk | head -20

# Check classes.dex size (Java bytecode)
unzip app-release-unsigned.apk classes.dex
ls -lh classes.dex

# Analyze with APK Analyzer (Android Studio required)
# File > Open > select app-release-unsigned.apk
```

## File Size Limits

- APK Download Limit: 50 MB (your requirement)
- Play Store Maximum: 100 MB
- Recommended for Network: < 50 MB
- Device Storage: Typically 3x APK size

## Build Time Optimization

If builds are slow:

1. Use gradle daemon:
   ```bash
   gradlew.bat assembleRelease --daemon
   ```

2. Parallel build:
   ```bash
   gradlew.bat assembleRelease -x test -j 4
   ```

3. Skip unused tasks:
   ```bash
   gradlew.bat assembleRelease -x lintVitalRelease
   ```

## Debugging Large APKs

If APK exceeds 50 MB:

```bash
# Download APK Analyzer plugin for Android Studio
# Or use command line:
7z l app-release-unsigned.apk | grep -E "\.(so|jar|dex|png|jpg)" | sort -k5 -n

# Check for large native libraries (.so files)
# Check for duplicate dependencies
# Verify resource compression is working
```

## Size Optimization Checklist

- [ ] ProGuard minification enabled ✓
- [ ] Resource shrinking enabled ✓
- [ ] Unused code removed
- [ ] Images optimized
- [ ] Unnecessary fonts removed
- [ ] No duplicate dependencies
- [ ] minSdkVersion set appropriately
- [ ] No unused plugins
- [ ] Capabilities (geolocation, camera) only requested if used
- [ ] ProGuard rules for third-party libraries updated

## Next Build Command

```bash
cd android
gradlew.bat assembleRelease -x test -x lintVitalRelease
```

This will build a production APK optimized for size.
