#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

/**
 * Image optimization script that converts images to WebP format
 * for better performance on Netlify and other hosting platforms
 */

const IMAGES_DIR = path.join(__dirname, 'assets', 'images');
const WEBP_DIR = path.join(__dirname, 'assets', 'images', 'webp');

// WebP quality settings (0-100, higher = better quality but larger file)
const WEBP_QUALITY = 85; // Good balance between quality and size

async function ensureWebpDirectory() {
  try {
    await fs.access(WEBP_DIR);
  } catch {
    await fs.mkdir(WEBP_DIR, { recursive: true });
    console.log('✅ Created webp directory');
  }
}

async function getImageFiles() {
  const files = await fs.readdir(IMAGES_DIR);
  return files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'].includes(ext);
  });
}

async function convertToWebP(filename) {
  const inputPath = path.join(IMAGES_DIR, filename);
  const outputFilename = path.parse(filename).name + '.webp';
  const outputPath = path.join(WEBP_DIR, outputFilename);

  try {
    const stats = await fs.stat(inputPath);
    const originalSize = stats.size;

    await sharp(inputPath)
      .webp({ 
        quality: WEBP_QUALITY,
        effort: 6, // Higher effort = better compression (0-6)
        lossless: false // Set to true for lossless compression
      })
      .toFile(outputPath);

    const newStats = await fs.stat(outputPath);
    const newSize = newStats.size;
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);

    console.log(`✅ ${filename} → ${outputFilename}`);
    console.log(`   Original: ${(originalSize / 1024).toFixed(1)}KB → WebP: ${(newSize / 1024).toFixed(1)}KB (${savings}% smaller)`);
    
    return {
      original: filename,
      webp: outputFilename,
      originalSize,
      newSize,
      savings: parseFloat(savings)
    };
  } catch (error) {
    console.error(`❌ Error converting ${filename}:`, error.message);
    return null;
  }
}

async function generateCSSFallbacks(conversions) {
  let css = `/* WebP with fallback CSS */\n\n`;
  
  conversions.forEach(conversion => {
    if (conversion) {
      const baseName = path.parse(conversion.original).name;
      css += `/* ${conversion.original} */\n`;
      css += `.bg-${baseName.replace(/\s+/g, '-').toLowerCase()} {\n`;
      css += `  background-image: url('../images/${conversion.original}');\n`;
      css += `}\n\n`;
      css += `.webp .bg-${baseName.replace(/\s+/g, '-').toLowerCase()} {\n`;
      css += `  background-image: url('../images/webp/${conversion.webp}');\n`;
      css += `}\n\n`;
    }
  });

  const cssPath = path.join(__dirname, 'css', 'webp-fallbacks.css');
  await fs.writeFile(cssPath, css);
  console.log('✅ Generated CSS fallbacks in css/webp-fallbacks.css');
}

async function generateWebPDetectionScript() {
  const script = `// WebP detection script
function supportsWebP() {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

// Add 'webp' class to html element if WebP is supported
supportsWebP().then((supported) => {
  if (supported) {
    document.documentElement.classList.add('webp');
  }
});`;

  const scriptPath = path.join(__dirname, 'js', 'webp-detection.js');
  await fs.writeFile(scriptPath, script);
  console.log('✅ Generated WebP detection script in js/webp-detection.js');
}

async function main() {
  console.log('🚀 Starting image optimization...\n');

  try {
    // Check if Sharp is available
    try {
      require.resolve('sharp');
    } catch {
      console.error('❌ Sharp is not installed. Please run: npm install sharp');
      process.exit(1);
    }

    await ensureWebpDirectory();
    
    const imageFiles = await getImageFiles();
    console.log(`📁 Found ${imageFiles.length} images to convert\n`);

    if (imageFiles.length === 0) {
      console.log('No images found to convert.');
      return;
    }

    const conversions = [];
    let totalOriginalSize = 0;
    let totalNewSize = 0;

    for (const file of imageFiles) {
      const result = await convertToWebP(file);
      if (result) {
        conversions.push(result);
        totalOriginalSize += result.originalSize;
        totalNewSize += result.newSize;
      }
      console.log(); // Empty line for readability
    }

    const totalSavings = ((totalOriginalSize - totalNewSize) / totalOriginalSize * 100).toFixed(1);
    
    console.log('📊 SUMMARY:');
    console.log(`   Total images converted: ${conversions.length}`);
    console.log(`   Original total size: ${(totalOriginalSize / 1024).toFixed(1)}KB`);
    console.log(`   WebP total size: ${(totalNewSize / 1024).toFixed(1)}KB`);
    console.log(`   Total savings: ${totalSavings}% (${((totalOriginalSize - totalNewSize) / 1024).toFixed(1)}KB)\n`);

    // Generate helper files
    await generateCSSFallbacks(conversions);
    await generateWebPDetectionScript();

    console.log('✨ Optimization complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Include css/webp-fallbacks.css in your HTML');
    console.log('2. Include js/webp-detection.js in your HTML');
    console.log('3. Update your CSS to use the new background classes');
    console.log('4. Test that WebP images load correctly in different browsers');

  } catch (error) {
    console.error('❌ Error during optimization:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { convertToWebP, supportsWebP: () => true };
