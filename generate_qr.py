#!/usr/bin/env python3
"""
QR Code Generator for SLM Paintings App
Generates a QR code for easy downloading on mobile devices
"""

import subprocess
import sys

def install_qrcode():
    """Install qrcode library if not available"""
    try:
        import qrcode
    except ImportError:
        print("Installing qrcode library...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "qrcode[pil]"])

def generate_qr_code(url, filename="app_qr.png"):
    """Generate QR code from URL"""
    try:
        import qrcode
        from PIL import Image, ImageDraw, ImageFont
        
        # Create QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4,
        )
        qr.add_data(url)
        qr.make(fit=True)
        
        # Create image
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Add title and instructions
        width, height = img.size
        new_height = height + 150
        new_img = Image.new('RGB', (width, new_height), 'white')
        
        # Paste QR code
        new_img.paste(img, (0, 0))
        
        # Add text
        try:
            draw = ImageDraw.Draw(new_img)
            # Try to use a default font
            font_size = 20
            text_y = height + 10
            
            draw.text((width//2 - 100, text_y), "SLM Paintings", fill='black')
            draw.text((width//2 - 150, text_y + 40), "Scan to Download App", fill='black')
            draw.text((width//2 - 180, text_y + 80), f"URL: {url}", fill='gray', width=width-20)
        except:
            pass  # Ignore font errors
        
        new_img.save(filename)
        print(f"✅ QR Code generated: {filename}")
        print(f"URL encoded: {url}")
        return filename
        
    except Exception as e:
        print(f"❌ Error generating QR code: {e}")
        return None

if __name__ == "__main__":
    install_qrcode()
    
    # You can modify this URL to your actual hosted URL
    url = input("Enter your app URL (e.g., https://yourdomain.com): ").strip()
    if not url:
        url = "https://slm-paintings.example.com"
    
    print("\n" + "="*60)
    print("📱 Generating QR Code for: " + url)
    print("="*60 + "\n")
    
    # Generate image QR code
    output_file = "SLM_Paintings_App_QR.png"
    generate_qr_code(url, output_file)
    
    # Also generate terminal QR code
    try:
        import qrcode
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=1,
            border=1,
        )
        qr.add_data(url)
        qr.make(fit=True)
        
        print("\n📲 QR CODE (Scan this in terminal):\n")
        qr.print_ascii(tty=True, invert=True)
        
    except Exception as e:
        print(f"Note: Could not display terminal QR code: {e}")
    
    print("\n" + "="*60)
    print("✅ QR Code generated!")
    print("="*60)
    print(f"\n📁 Image saved as: {output_file}")
    print(f"📲 Open this file to see a high-quality QR code")
    print(f"\n🔗 URL encoded: {url}")
    print(f"\n📱 Share this QR code with users to download the app!")
    print("\nℹ️  File location: " + str(__file__.replace("generate_qr.py", output_file)))
