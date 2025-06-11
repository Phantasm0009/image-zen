#!/bin/bash

# @phantasm0009/image-zen CLI Examples
# Run these commands to test the CLI functionality

echo "🖼️  @phantasm0009/image-zen CLI Examples"
echo "========================================"

# Create test images directory
mkdir -p test-images
echo "📁 Created test-images directory"

# Show package information
echo ""
echo "1. Package Information:"
echo "----------------------"
npx @phantasm0009/image-zen info

# Help command
echo ""
echo "2. Help Information:"
echo "-------------------"
npx @phantasm0009/image-zen --help

# Background removal example
echo ""
echo "3. Background Removal:"
echo "---------------------"
echo "npx @phantasm0009/image-zen remove-bg photo.jpg -o clean.png"
echo "# Removes background from photo.jpg and saves as clean.png"

# Upscaling example
echo ""
echo "4. Image Upscaling:"
echo "------------------"
echo "npx @phantasm0009/image-zen upscale small.jpg --scale 2 -o large.png"
echo "# Upscales small.jpg by 2x and saves as large.png"

# Compression example
echo ""
echo "5. Image Compression:"
echo "--------------------"
echo "npx @phantasm0009/image-zen compress *.jpg --quality 80 --format webp"
echo "# Compresses all JPG files to WebP with 80% quality"

# Enhanced processing pipeline
echo ""
echo "6. Enhanced Pipeline:"
echo "--------------------"
echo "npx @phantasm0009/image-zen enhance photo.jpg -t remove-bg,upscale,compress -s 2 -q 85"
echo "# Removes background, upscales 2x, and compresses with 85% quality"

# Batch processing examples
echo ""
echo "7. Batch Processing:"
echo "-------------------"
echo "npx @phantasm0009/image-zen compress ./photos/*.jpg -o ./compressed/"
echo "# Compresses all JPG files in photos directory to compressed directory"

echo ""
echo "npx @phantasm0009/image-zen enhance ./raw/*.png -t upscale,compress -o ./processed/"
echo "# Processes all PNG files with upscaling and compression"

# Advanced options
echo ""
echo "8. Advanced Options:"
echo "-------------------"
echo "npx @phantasm0009/image-zen compress image.jpg \\"
echo "  --quality 75 \\"
echo "  --format webp \\"
echo "  --output optimized.webp"
echo "# Detailed compression with specific options"

echo ""
echo "npx @phantasm0009/image-zen upscale low-res.png \\"
echo "  --scale 4 \\"
echo "  --format png \\"
echo "  --output high-res.png"
echo "# 4x upscaling with PNG output"

# Pipeline chaining examples
echo ""
echo "9. Pipeline Chaining:"
echo "--------------------"
echo "# Chain operations for complex workflows:"
echo "npx @phantasm0009/image-zen enhance portrait.jpg \\"
echo "  --tasks remove-bg,upscale,compress \\"
echo "  --scale 2 \\"
echo "  --quality 90 \\"
echo "  --format webp \\"
echo "  --output final.webp"

echo ""
echo "✨ Ready to optimize your images!"
echo "💡 Pro tip: Use --help with any command for detailed options"