@echo off
REM SLM Paintings - Deploy and Generate QR Code Script (Windows)
REM This script deploys your app to Vercel and generates a QR code

echo.
echo ========================================
echo 🚀 SLM Paintings - Mobile App Deployment
echo ========================================
echo.

REM Check if Vercel is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 📦 Installing Vercel CLI...
    call npm install -g vercel
)

echo.
echo 🚀 Deploying to Vercel...
echo Please follow the prompts below:
echo.
call vercel

echo.
echo 📱 Deployment complete!
echo.
echo Now generating QR code...
echo.

REM Install qrcode if needed
python -c "import qrcode" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 📦 Installing qrcode library...
    pip install qrcode[pil]
)

REM Run QR code generator
python generate_qr.py

echo.
echo ✅ Done! Share the QR code with your users!
echo.
echo 📲 How to use:
echo 1. iOS 15 Users: Scan QR -^> Open in Safari -^> Share -^> Add to Home Screen
echo 2. Android Users: Scan QR -^> Open in Chrome -^> Tap menu -^> Install app
echo.
pause
