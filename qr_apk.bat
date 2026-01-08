@echo off
REM Quick QR Code Generator for APK Distribution
REM Usage: qr_apk.bat <url>

if "%1"=="" (
    echo Usage: qr_apk.bat "http://example.com/app-release.apk"
    echo.
    echo This will generate a QR code that users can scan to download your APK
    pause
    exit /b 1
)

echo Generating QR code for: %1
echo.

python -c "
import qrcode
import sys

try:
    url = '%1'
    qr = qrcode.QRCode(version=1, box_size=10, border=4)
    qr.add_data(url)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color='black', back_color='white')
    img.save('apk_qr_code.png')
    
    print('[SUCCESS] QR code saved as: apk_qr_code.png')
    print('[INFO] Scan this QR code to download the APK')
except ImportError:
    print('[ERROR] qrcode module not found. Installing...')
    import subprocess
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'qrcode[pil]'])
    print('[SUCCESS] Please run the command again')
except Exception as e:
    print(f'[ERROR] {e}')
    sys.exit(1)
"

if %errorlevel% equ 0 (
    echo.
    echo To use the QR code:
    echo   1. Users scan the QR code with their phone camera
    echo   2. They click the link that appears
    echo   3. Select "Install" when prompted
    echo   4. App installs automatically
)

pause
