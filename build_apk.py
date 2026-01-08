#!/usr/bin/env python3
"""
APK Builder and QR Code Generator
Automates the APK build and QR code creation process
"""

import os
import subprocess
import json
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent
ANDROID_DIR = PROJECT_ROOT / "android"
APP_DIR = ANDROID_DIR / "app"
BUILD_OUTPUT = APP_DIR / "build" / "outputs" / "apk" / "release"

def run_command(cmd, description):
    """Run a shell command and report status"""
    print(f"\n{'='*60}")
    print(f"→ {description}")
    print(f"{'='*60}")
    print(f"$ {cmd}\n")
    
    try:
        result = subprocess.run(cmd, shell=True, check=True)
        print(f"✓ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ Error: {description} failed with code {e.returncode}")
        return False

def build_web_assets():
    """Build web assets with npm"""
    os.chdir(PROJECT_ROOT)
    return run_command("npm run build", "Building web assets")

def sync_capacitor():
    """Sync web files to Android project"""
    os.chdir(PROJECT_ROOT)
    return run_command("npx cap sync android", "Syncing Capacitor files")

def build_apk():
    """Build release APK"""
    os.chdir(ANDROID_DIR)
    return run_command("gradlew.bat assembleRelease", "Building release APK")

def check_apk_size():
    """Check APK file size"""
    if BUILD_OUTPUT.exists():
        unsigned_apk = BUILD_OUTPUT / "app-release-unsigned.apk"
        if unsigned_apk.exists():
            size_mb = unsigned_apk.stat().st_size / (1024 * 1024)
            print(f"\n{'='*60}")
            print(f"APK Size: {size_mb:.2f} MB")
            print(f"{'='*60}")
            
            if size_mb > 50:
                print(f"⚠ APK exceeds 50 MB limit by {size_mb - 50:.2f} MB")
                print("Consider using App Bundle instead or optimize assets")
            else:
                print(f"✓ APK is under 50 MB limit!")
            
            return True
    return False

def generate_qr_code(apk_url):
    """Generate QR code for APK download"""
    try:
        import qrcode
    except ImportError:
        print("\nInstalling qrcode module...")
        subprocess.run([sys.executable, "-m", "pip", "install", "qrcode[pil]"], check=True)
        import qrcode
    
    print(f"\nGenerating QR code for: {apk_url}")
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(apk_url)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    qr_path = PROJECT_ROOT / "apk_download_qr.png"
    img.save(qr_path)
    
    print(f"✓ QR code saved to: {qr_path}")
    return str(qr_path)

def main():
    print("""
╔════════════════════════════════════════╗
║   APK Builder & QR Code Generator      ║
║   SLM Paintings Mobile App             ║
╚════════════════════════════════════════╝
""")
    
    # Check if JAVA_HOME is set
    if not os.environ.get('JAVA_HOME'):
        print("⚠ Warning: JAVA_HOME is not set!")
        print("Please install JDK 11 or 17 and set JAVA_HOME environment variable")
        print("Guide: https://docs.oracle.com/en/java/javase/17/install/")
        return False
    
    print(f"Java Home: {os.environ.get('JAVA_HOME')}")
    
    # Build steps
    steps = [
        ("Build web assets", build_web_assets),
        ("Sync Capacitor files", sync_capacitor),
        ("Build release APK", build_apk),
        ("Check APK size", check_apk_size),
    ]
    
    for name, func in steps:
        if not func():
            print(f"\n✗ Build failed at: {name}")
            return False
    
    # QR code generation
    print("\n" + "="*60)
    print("APK Build Complete!")
    print("="*60)
    print(f"\nUnsigned APK location:")
    print(f"  {BUILD_OUTPUT / 'app-release-unsigned.apk'}")
    
    print("\nNext steps:")
    print("1. Sign the APK with your keystore")
    print("2. Optimize with zipalign (if > 50MB)")
    print("3. Host the APK on a web server")
    print("4. Generate QR code for mobile installation")
    
    # Ask for APK URL for QR code
    apk_url = input("\nEnter APK download URL (or press Enter to skip QR generation): ").strip()
    if apk_url:
        generate_qr_code(apk_url)
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
