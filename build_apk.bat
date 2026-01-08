@echo off
REM APK Build Script for Windows
REM Automates the Capacitor APK build process

setlocal enabledelayedexpansion

echo.
echo ====================================================
echo  APK Builder - SLM Paintings Mobile App
echo ====================================================
echo.

REM Check if JAVA_HOME is set
if not defined JAVA_HOME (
    echo ERROR: JAVA_HOME is not set!
    echo.
    echo Please install JDK 11 or 17 and set JAVA_HOME:
    echo   1. Download from: https://www.oracle.com/java/technologies/downloads/
    echo   2. Install to: C:\Program Files\Java\jdk-17.x.x
    echo   3. Set JAVA_HOME environment variable
    echo   4. Add to PATH: C:\Program Files\Java\jdk-17.x.x\bin
    echo.
    pause
    exit /b 1
)

echo [OK] Java Home: %JAVA_HOME%
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js: %errorlevel%
echo.

REM Step 1: Build web assets
echo [1/4] Building web assets...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Web build failed
    pause
    exit /b 1
)
echo [OK] Web build completed
echo.

REM Step 2: Sync Capacitor
echo [2/4] Syncing Capacitor files to Android...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ERROR: Capacitor sync failed
    pause
    exit /b 1
)
echo [OK] Capacitor sync completed
echo.

REM Step 3: Build APK
echo [3/4] Building release APK (this may take several minutes)...
cd android
call gradlew.bat assembleRelease
if %errorlevel% neq 0 (
    echo ERROR: APK build failed
    pause
    exit /b 1
)
echo [OK] APK build completed
cd ..
echo.

REM Step 4: Check size
echo [4/4] Checking APK size...
for /f %%A in ('powershell -Command "(Get-Item 'android\app\build\outputs\apk\release\app-release-unsigned.apk').Length / 1MB"') do set size=%%A
echo APK Size: %size% MB
echo.

if %size% gtr 50 (
    echo WARNING: APK exceeds 50 MB limit
    echo Consider using App Bundle instead or optimize assets
) else (
    echo [OK] APK is under 50 MB!
)

echo.
echo ====================================================
echo APK BUILD COMPLETE
echo ====================================================
echo.
echo Location: android\app\build\outputs\apk\release\app-release-unsigned.apk
echo.
echo Next Steps:
echo   1. Sign the APK with your keystore
echo   2. Optimize with zipalign (if needed)
echo   3. Host on web server
echo   4. Generate QR code: python build_apk.py
echo.
pause
