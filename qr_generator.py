#!/usr/bin/env python3
"""
APK QR Code Generator
Generates QR codes for APK distribution

Usage:
    python qr_generator.py "http://example.com/app-release.apk"
    python qr_generator.py --local android/app/app-release.apk
"""

import sys
import os
import argparse
from pathlib import Path

def generate_qr_from_url(url, output_path="apk_qr_code.png"):
    """Generate QR code from URL"""
    try:
        import qrcode
    except ImportError:
        print("[*] Installing qrcode module...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "qrcode[pil]"])
        import qrcode
    
    print(f"[*] Generating QR code for URL: {url}")
    
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    img.save(output_path)
    
    print(f"[✓] QR code saved: {output_path}")
    print(f"[*] Size: {Path(output_path).stat().st_size / 1024:.1f} KB")
    
    return output_path

def start_local_server(apk_path, port=8000):
    """Start local HTTP server and generate QR"""
    import socket
    import subprocess
    import time
    
    apk_path = Path(apk_path).resolve()
    if not apk_path.exists():
        print(f"[✗] APK not found: {apk_path}")
        return False
    
    # Get local IP
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    except:
        ip = "localhost"
    finally:
        s.close()
    
    apk_dir = apk_path.parent
    apk_name = apk_path.name
    
    url = f"http://{ip}:{port}/{apk_name}"
    
    print(f"\n[*] Starting HTTP server in: {apk_dir}")
    print(f"[*] Server URL: {url}")
    print(f"[*] Share this URL or its QR code with users")
    
    # Generate QR
    generate_qr_from_url(url, apk_dir / "qr_code.png")
    
    # Start server
    print(f"\n[*] Starting server on port {port}...")
    print(f"[*] Press Ctrl+C to stop\n")
    
    os.chdir(apk_dir)
    
    try:
        if sys.platform == "win32":
            subprocess.run([sys.executable, "-m", "http.server", str(port)])
        else:
            subprocess.run([sys.executable, "-m", "http.server", str(port)])
    except KeyboardInterrupt:
        print("\n[*] Server stopped")
        return True

def print_instructions():
    """Print installation instructions"""
    print("""
╔═══════════════════════════════════════════════════════╗
║   APK Installation Instructions for Users            ║
╚═══════════════════════════════════════════════════════╝

1. SCAN QR CODE
   - Open your phone camera or QR scanner app
   - Point at the QR code
   - Tap the notification that appears

2. DOWNLOAD
   - Browser opens and downloads the APK
   - Wait for download to complete

3. ENABLE INSTALLATION
   - Settings → Security → Unknown Sources
   - Enable "Allow installation from unknown sources"

4. INSTALL
   - Tap "Install" in the download notification
   - Wait for installation to complete
   - Tap "Open" to launch the app

5. GRANT PERMISSIONS
   - Allow camera access
   - Allow location (if needed)
   - Other permissions as required

Note:
- Make sure you have at least 50 MB of storage
- Installation takes 1-2 minutes
- Internet connection required for initial download
    """)

def main():
    parser = argparse.ArgumentParser(
        description="Generate QR codes for APK distribution",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python qr_generator.py "https://example.com/app.apk"
  python qr_generator.py --local android/app/app-release.apk
  python qr_generator.py --serve android/app/app-release.apk
        """
    )
    
    parser.add_argument("url", nargs="?", help="APK download URL")
    parser.add_argument("--local", help="Path to local APK file")
    parser.add_argument("--serve", help="Start local HTTP server for APK")
    parser.add_argument("--port", type=int, default=8000, help="HTTP server port (default: 8000)")
    parser.add_argument("--output", default="apk_qr_code.png", help="Output QR code filename")
    
    args = parser.parse_args()
    
    print("""
╔═══════════════════════════════════════════════════════╗
║      APK QR Code Generator                           ║
║      SLM Paintings - Mobile Distribution             ║
╚═══════════════════════════════════════════════════════╝
    """)
    
    if args.serve:
        # Serve APK locally
        start_local_server(args.serve, args.port)
        print_instructions()
        
    elif args.local:
        # Generate QR for local file without serving
        apk_path = Path(args.local).resolve()
        if not apk_path.exists():
            print(f"[✗] APK not found: {apk_path}")
            return 1
        
        print(f"[*] APK: {apk_path}")
        print(f"[*] Size: {apk_path.stat().st_size / (1024*1024):.1f} MB")
        print(f"\n[!] Note: Local file path - for actual distribution, upload to a web server")
        print(f"    Then run: python qr_generator.py 'http://your-url/{apk_path.name}'")
        
    elif args.url:
        # Generate QR for URL
        generate_qr_from_url(args.url, args.output)
        print_instructions()
        
    else:
        # Interactive mode
        print("\n[*] Interactive Mode\n")
        
        choice = input("What would you like to do?\n"
                      "1. Generate QR code from URL\n"
                      "2. Serve APK locally (with QR code)\n"
                      "3. Show installation instructions\n"
                      "\nChoice (1-3): ").strip()
        
        if choice == "1":
            url = input("\nEnter APK download URL: ").strip()
            if url:
                generate_qr_from_url(url)
                print_instructions()
        
        elif choice == "2":
            apk_file = input("\nEnter path to APK file: ").strip()
            if apk_file:
                start_local_server(apk_file, args.port)
                print_instructions()
        
        elif choice == "3":
            print_instructions()
        
        else:
            print("[!] Invalid choice")
            return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
