#!/bin/bash
# SLM Paintings - Deploy and Generate QR Code Script
# This script deploys your app to Vercel and generates a QR code

echo "🚀 SLM Paintings - Mobile App Deployment"
echo "=========================================="
echo ""

# Check if Vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo ""
echo "🚀 Deploying to Vercel..."
vercel

# Get the deployment URL from Vercel
echo ""
echo "📱 Deployment complete!"
echo ""
echo "Now generating QR code..."
echo ""

# Install qrcode if needed
python -c "import qrcode" 2>/dev/null || pip install qrcode[pil]

# Run QR code generator
python generate_qr.py

echo ""
echo "✅ Done! Share the QR code with your users!"
echo ""
echo "📲 How to use:"
echo "1. iOS 15 Users: Scan QR → Open in Safari → Share → Add to Home Screen"
echo "2. Android Users: Scan QR → Open in Chrome → Tap menu → Install app"
echo ""
