#!/usr/bin/env python3
"""
SLM Paintings - Terminal QR Code Display
Shows QR code directly in terminal + saves image file
"""

import subprocess
import sys
import os

def display_qr_terminal(url):
    """Display QR code in terminal with ASCII art"""
    try:
        import qrcode
        
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=1,
            border=2,
        )
        qr.add_data(url)
        qr.make(fit=True)
        
        print("\n" + "🔷" * 35)
        print("📱 SCAN THIS QR CODE WITH YOUR PHONE")
        print("🔷" * 35 + "\n")
        
        qr.print_ascii(tty=True, invert=True)
        
        print("\n" + "🔷" * 35)
        print("OR open the PNG file for better quality!")
        print("🔷" * 35 + "\n")
        
        return True
        
    except Exception as e:
        print(f"❌ Terminal display error: {e}")
        return False

def generate_qr_image(url, filename="SLM_Paintings_App_QR.png"):
    """Generate QR code image file"""
    try:
        import qrcode
        from PIL import Image, ImageDraw
        
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4,
        )
        qr.add_data(url)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Add text to image
        width, height = img.size
        new_height = height + 100
        new_img = Image.new('RGB', (width, new_height), 'white')
        new_img.paste(img, (0, 0))
        
        # Add text
        try:
            draw = ImageDraw.Draw(new_img)
            draw.text((width//2 - 80, height + 10), "SLM Paintings", fill='black')
            draw.text((width//2 - 120, height + 50), "Scan to Install App", fill='black')
        except:
            pass
        
        new_img.save(filename)
        print(f"✅ QR Code image saved: {filename}")
        
        # Get file size
        size = os.path.getsize(filename) / 1024
        print(f"   📊 File size: {size:.1f} KB")
        print(f"   📁 Location: {os.path.abspath(filename)}\n")
        
        return True
        
    except Exception as e:
        print(f"❌ Image generation error: {e}")
        return False

def open_qr_file(filename="SLM_Paintings_App_QR.png"):
    """Open QR code image with default viewer"""
    try:
        if sys.platform == 'win32':
            os.startfile(os.path.abspath(filename))
            print(f"📂 Opening {filename} in default viewer...")
        elif sys.platform == 'darwin':  # macOS
            os.system(f'open "{filename}"')
            print(f"📂 Opening {filename} in default viewer...")
        elif sys.platform == 'linux':
            os.system(f'xdg-open "{filename}"')
            print(f"📂 Opening {filename} in default viewer...")
    except Exception as e:
        print(f"⚠️  Could not auto-open file: {e}")
        print(f"   📂 Please manually open: {os.path.abspath(filename)}")

if __name__ == "__main__":
    print("\n" + "="*50)
    print("🎨 SLM PAINTINGS - QR CODE GENERATOR")
    print("="*50 + "\n")
    
    # Get URL from user
    url = input("📍 Enter your app URL:\n   (e.g., https://slm-paintings.vercel.app)\n\n   > ").strip()
    
    if not url:
        url = "https://slm-paintings.example.com"
        print(f"   Using default: {url}\n")
    else:
        print()
    
    # Ensure HTTPS
    if not url.startswith('http'):
        url = 'https://' + url
        print(f"✅ Added HTTPS: {url}\n")
    
    print("-" * 50)
    print("Generating QR codes...")
    print("-" * 50 + "\n")
    
    # Display in terminal
    print("1️⃣  TERMINAL QR CODE:")
    display_qr_terminal(url)
    
    print("\n2️⃣  IMAGE FILE QR CODE:")
    generate_qr_image(url)
    
    print("\n" + "="*50)
    print("✨ ALL DONE!")
    print("="*50)
    print("\n📲 How to use the QR code:")
    print("   • iOS 15: Scan with Camera app")
    print("   • Android: Scan with Chrome/Google Lens")
    print("   • Both: Tap → Install → Done!")
    print("\n💡 Tips:")
    print("   • Print the PNG file for physical sharing")
    print("   • Share on WhatsApp/Social media")
    print("   • Email to customers")
    print("\n")
    
    # Ask to open file
    open_file = input("Would you like to open the QR image? (y/n): ").strip().lower()
    if open_file == 'y':
        open_qr_file()
    
    print("\n✅ QR code is ready to share!\n")
