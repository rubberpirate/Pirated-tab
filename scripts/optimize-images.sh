#!/bin/bash

# Image optimization script using cwebp (WebP encoder)
# Converts all images in assets/images to WebP format

IMAGES_DIR="assets/images"
WEBP_DIR="assets/images/webp"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting image optimization...${NC}\n"

# Check if cwebp is installed
if ! command -v cwebp &> /dev/null; then
    echo -e "${RED}❌ cwebp is not installed.${NC}"
    echo -e "${YELLOW}Please install it:${NC}"
    echo "  Ubuntu/Debian: sudo apt-get install webp"
    echo "  macOS: brew install webp"
    echo "  Arch Linux: sudo pacman -S libwebp"
    exit 1
fi

# Create webp directory if it doesn't exist
if [ ! -d "$WEBP_DIR" ]; then
    mkdir -p "$WEBP_DIR"
    echo -e "${GREEN}✅ Created webp directory${NC}"
fi

# Initialize counters
total_files=0
converted_files=0
total_original_size=0
total_new_size=0

# Find and convert all image files
while IFS= read -r -d '' file; do
    if [[ -f "$file" ]]; then
        filename=$(basename "$file")
        extension="${filename##*.}"
        name="${filename%.*}"
        
        # Skip if already a webp file
        if [[ "$extension" == "webp" ]]; then
            continue
        fi
        
        output_file="$WEBP_DIR/${name}.webp"
        
        # Get original file size
        original_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        
        # Convert to WebP with quality 85
        if cwebp -q 85 -m 6 "$file" -o "$output_file" &>/dev/null; then
            # Get new file size
            new_size=$(stat -f%z "$output_file" 2>/dev/null || stat -c%s "$output_file" 2>/dev/null)
            
            # Calculate savings
            savings=$(echo "scale=1; ($original_size - $new_size) * 100 / $original_size" | bc)
            original_kb=$(echo "scale=1; $original_size / 1024" | bc)
            new_kb=$(echo "scale=1; $new_size / 1024" | bc)
            
            echo -e "${GREEN}✅ $filename → ${name}.webp${NC}"
            echo -e "   Original: ${original_kb}KB → WebP: ${new_kb}KB (${savings}% smaller)"
            echo
            
            ((converted_files++))
            total_original_size=$((total_original_size + original_size))
            total_new_size=$((total_new_size + new_size))
        else
            echo -e "${RED}❌ Error converting $filename${NC}"
        fi
        
        ((total_files++))
    fi
done < <(find "$IMAGES_DIR" -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.bmp" \) -print0)

# Calculate total savings
if [ $total_original_size -gt 0 ]; then
    total_savings=$(echo "scale=1; ($total_original_size - $total_new_size) * 100 / $total_original_size" | bc)
    original_total_kb=$(echo "scale=1; $total_original_size / 1024" | bc)
    new_total_kb=$(echo "scale=1; $total_new_size / 1024" | bc)
    saved_kb=$(echo "scale=1; ($total_original_size - $total_new_size) / 1024" | bc)
    
    echo -e "${BLUE}📊 SUMMARY:${NC}"
    echo -e "   Total images processed: $total_files"
    echo -e "   Successfully converted: $converted_files"
    echo -e "   Original total size: ${original_total_kb}KB"
    echo -e "   WebP total size: ${new_total_kb}KB"
    echo -e "   Total savings: ${total_savings}% (${saved_kb}KB)"
    echo
fi

echo -e "${GREEN}✨ Optimization complete!${NC}"
echo
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Update your CSS to use WebP images with fallbacks"
echo "2. Add WebP detection JavaScript to your page"
echo "3. Test in different browsers to ensure fallbacks work"
echo "4. Consider using <picture> elements for maximum compatibility"

echo -e "\n${BLUE}💡 Example CSS with fallback:${NC}"
echo ".background {"
echo "  background-image: url('assets/images/background.png');"
echo "}"
echo ".webp .background {"
echo "  background-image: url('assets/images/webp/background.webp');"
echo "}"
