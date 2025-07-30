#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

/**
 * Verification script to check if WebP images and fallbacks are properly set up
 */

const WEBP_DIR = path.join(__dirname, 'assets', 'images', 'webp');
const OLD_DIR = path.join(__dirname, 'assets', 'images', 'old');

async function checkDirectories() {
  console.log('🔍 Checking directory structure...\n');
  
  try {
    const webpExists = await fs.access(WEBP_DIR).then(() => true).catch(() => false);
    const oldExists = await fs.access(OLD_DIR).then(() => true).catch(() => false);
    
    if (!webpExists) {
      console.log('❌ WebP directory not found: assets/images/webp/');
      return false;
    }
    
    if (!oldExists) {
      console.log('❌ Old images directory not found: assets/images/old/');
      return false;
    }
    
    console.log('✅ Directory structure looks good');
    return true;
  } catch (error) {
    console.error('❌ Error checking directories:', error.message);
    return false;
  }
}

async function checkImagePairs() {
  console.log('\n🖼️  Checking image pairs...\n');
  
  try {
    const webpFiles = await fs.readdir(WEBP_DIR);
    const oldFiles = await fs.readdir(OLD_DIR);
    
    const webpImages = webpFiles.filter(file => file.endsWith('.webp'));
    
    console.log(`Found ${webpImages.length} WebP images`);
    console.log(`Found ${oldFiles.length} fallback images\n`);
    
    let missingFallbacks = 0;
    
    for (const webpFile of webpImages) {
      const baseName = path.parse(webpFile).name;
      
      // Look for corresponding fallback (could be .png or .jpeg)
      const possibleFallbacks = [
        `${baseName}.png`,
        `${baseName}.jpeg`,
        `${baseName}.jpg`
      ];
      
      const fallbackExists = possibleFallbacks.some(fallback => 
        oldFiles.includes(fallback)
      );
      
      if (fallbackExists) {
        const fallbackFile = possibleFallbacks.find(fallback => 
          oldFiles.includes(fallback)
        );
        console.log(`✅ ${webpFile} ↔ ${fallbackFile}`);
      } else {
        console.log(`❌ ${webpFile} - No fallback found`);
        missingFallbacks++;
      }
    }
    
    if (missingFallbacks === 0) {
      console.log('\n✅ All WebP images have fallbacks');
      return true;
    } else {
      console.log(`\n⚠️  ${missingFallbacks} WebP images missing fallbacks`);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error checking image pairs:', error.message);
    return false;
  }
}

async function checkJavaScriptIntegration() {
  console.log('\n🔧 Checking JavaScript integration...\n');
  
  try {
    // Check if background.js has been updated
    const backgroundJs = await fs.readFile(path.join(__dirname, 'js', 'background.js'), 'utf8');
    
    if (backgroundJs.includes('webp:') && backgroundJs.includes('fallback:')) {
      console.log('✅ background.js updated with WebP support');
    } else {
      console.log('❌ background.js not updated for WebP support');
      return false;
    }
    
    // Check if webp-detection.js exists
    const webpDetectionExists = await fs.access(path.join(__dirname, 'js', 'webp-detection.js'))
      .then(() => true).catch(() => false);
    
    if (webpDetectionExists) {
      console.log('✅ webp-detection.js found');
    } else {
      console.log('❌ webp-detection.js not found');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error checking JavaScript integration:', error.message);
    return false;
  }
}

async function checkHTMLIntegration() {
  console.log('\n📄 Checking HTML integration...\n');
  
  try {
    const indexHtml = await fs.readFile(path.join(__dirname, 'index.html'), 'utf8');
    
    if (indexHtml.includes('webp-detection.js')) {
      console.log('✅ webp-detection.js included in HTML');
    } else {
      console.log('❌ webp-detection.js not included in HTML');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error checking HTML integration:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 WebP Integration Verification\n');
  console.log('=' .repeat(50));
  
  const checks = [
    await checkDirectories(),
    await checkImagePairs(),
    await checkJavaScriptIntegration(),
    await checkHTMLIntegration()
  ];
  
  const allPassed = checks.every(check => check === true);
  
  console.log('\n' + '=' .repeat(50));
  
  if (allPassed) {
    console.log('🎉 All checks passed! WebP integration is ready.');
    console.log('\n💡 Tips for testing:');
    console.log('1. Open your site in Chrome/Firefox (WebP supported)');
    console.log('2. Check DevTools Network tab to see .webp files loading');
    console.log('3. Test in Safari/older browsers for fallback behavior');
    console.log('4. Use Lighthouse to measure performance improvements');
  } else {
    console.log('⚠️  Some checks failed. Please fix the issues above.');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
