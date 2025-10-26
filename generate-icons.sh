#!/bin/bash

# Script to generate PWA icons
# Note: This requires ImageMagick (convert command)
# For production, use a proper icon generator service

echo "Generating PWA icons..."

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "ImageMagick not found. Creating placeholder icons..."

    # Create placeholder PNG files (simple colored squares)
    # In production, replace these with proper icons
    for size in 72 96 128 144 152 167 180 192 384 512; do
        echo "Creating ${size}x${size} placeholder icon..."

        # Create a simple colored rectangle as placeholder
        # This uses rsvg-convert if available, otherwise creates a basic file
        if command -v rsvg-convert &> /dev/null; then
            rsvg-convert -w $size -h $size public/icons/icon.svg -o "public/icons/icon-${size}.png"
        else
            # Fallback: copy SVG as is
            cp public/icons/icon.svg "public/icons/icon-${size}.svg"
            echo "Note: Install rsvg-convert (librsvg2-bin) to generate PNG icons"
        fi
    done
else
    # Use ImageMagick to convert SVG to PNG at different sizes
    for size in 72 96 128 144 152 167 180 192 384 512; do
        echo "Generating ${size}x${size} icon..."
        convert -background none -resize "${size}x${size}" public/icons/icon.svg "public/icons/icon-${size}.png"
    done
fi

echo "Icon generation complete!"
echo "Note: For production, use a professional icon generator service"
echo "Recommended: https://realfavicongenerator.net/"
