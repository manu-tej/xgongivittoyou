#!/usr/bin/env python3
"""
Simple script to create basic PNG icons for PWA
Creates solid color icons with text for development
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False
    print("PIL not available, creating minimal icons...")

import os

def create_icon(size, output_path):
    """Create a simple icon with the app color"""
    if PIL_AVAILABLE:
        # Create image with Twitter blue background
        img = Image.new('RGB', (size, size), color='#1DA1F2')
        draw = ImageDraw.Draw(img)

        # Draw X shape
        padding = size // 4
        draw.line([(padding, padding), (size-padding, size-padding)], fill='white', width=size//20)
        draw.line([(size-padding, padding), (padding, size-padding)], fill='white', width=size//20)

        # Draw thread dots at bottom
        dot_y = size - size//6
        dot_radius = size//25
        for i in range(3):
            x = size//4 + (i * size//4)
            opacity = int(255 * (0.8 - i*0.2))
            draw.ellipse([(x-dot_radius, dot_y-dot_radius), (x+dot_radius, dot_y+dot_radius)],
                        fill=(255, 255, 255, opacity))

        img.save(output_path, 'PNG')
        print(f"Created {size}x{size} icon at {output_path}")
    else:
        # Create a minimal valid PNG (1x1 pixel) as placeholder
        # This is a base64 decoded minimal PNG
        minimal_png = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82'

        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, 'wb') as f:
            f.write(minimal_png)
        print(f"Created placeholder {output_path} (install Pillow for proper icons)")

# Create icons directory
os.makedirs('public/icons', exist_ok=True)

# Generate all required sizes
sizes = [72, 96, 128, 144, 152, 167, 180, 192, 384, 512]

print("Generating PWA icons...")
for size in sizes:
    output_path = f'public/icons/icon-{size}.png'
    create_icon(size, output_path)

print("\nIcon generation complete!")
if not PIL_AVAILABLE:
    print("\nNote: For better icons, install Pillow:")
    print("  pip install Pillow")
    print("  Then run this script again")
