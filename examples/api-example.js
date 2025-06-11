const ImageZen = require('../src/index');
const path = require('path');
const fs = require('fs-extra');

async function runExamples() {
  console.log('🖼️  @phantasm0009/image-zen API Examples\n');
  console.log('Using Squoosh compression + TensorFlow Lite AI models\n');
  
  // Create example directory
  const exampleDir = path.join(__dirname, 'output');
  await fs.ensureDir(exampleDir);
  
  try {
    // Example 1: Create instance and use methods
    console.log('1. Creating ImageZen instance...');
    const zen = new ImageZen({ verbose: true });
    
    // Create a simple test image (since we don't have real images)
    const testImagePath = await createTestImage(exampleDir);
    
    // Example 2: AI Background removal with TensorFlow Lite
    console.log('\n2. AI Background removal example...');
    try {
      const bgRemoved = await zen.removeBackground(testImagePath);
      const bgRemovedPath = path.join(exampleDir, 'background-removed.png');
      await fs.writeFile(bgRemovedPath, bgRemoved);
      console.log(`✅ Background removed with TensorFlow Lite: ${bgRemovedPath}`);
    } catch (error) {
      console.log(`⚠️  Background removal demo: ${error.message}`);
    }
    
    // Example 3: AI Image upscaling with EDSR models
    console.log('\n3. AI Image upscaling example...');
    try {
      const upscaled = await zen.upscale(testImagePath, 2);
      const upscaledPath = path.join(exampleDir, 'upscaled-2x.png');
      await fs.writeFile(upscaledPath, upscaled);
      console.log(`✅ Image upscaled 2x with EDSR model: ${upscaledPath}`);
    } catch (error) {
      console.log(`⚠️  Upscaling demo: ${error.message}`);
    }
    
    // Example 4: Squoosh compression
    console.log('\n4. Squoosh compression example...');
    try {
      const compressed = await zen.compress(testImagePath, {
        quality: 80,
        format: 'webp',
        optimizeForSize: true
      });
      const compressedPath = path.join(exampleDir, 'compressed.webp');
      await fs.writeFile(compressedPath, compressed);
      console.log(`✅ Image compressed with Squoosh: ${compressedPath}`);
    } catch (error) {
      console.log(`⚠️  Compression demo: ${error.message}`);
    }
    
    // Example 5: Multi-format compression comparison
    console.log('\n5. Multi-format compression comparison...');
    try {
      const formats = ['webp', 'avif', 'mozjpeg'];
      const originalSize = (await fs.stat(testImagePath)).size;
      
      for (const format of formats) {
        const compressed = await zen.compress(testImagePath, {
          quality: 80,
          format: format,
          optimizeForSize: true
        });
        
        const outputPath = path.join(exampleDir, `compressed.${format === 'mozjpeg' ? 'jpg' : format}`);
        await fs.writeFile(outputPath, compressed);
        
        const compressionRatio = ((originalSize - compressed.length) / originalSize * 100).toFixed(1);
        console.log(`  ${format.toUpperCase()}: ${compressed.length} bytes (${compressionRatio}% smaller)`);
      }
    } catch (error) {
      console.log(`⚠️  Multi-format demo: ${error.message}`);
    }
    
    // Example 6: Enhanced processing (AI pipeline)
    console.log('\n6. Enhanced AI processing pipeline...');
    try {
      const enhanced = await zen.enhance(testImagePath, {
        tasks: ['remove-bg', 'upscale', 'compress'],
        scale: 2,
        compression: { quality: 85, format: 'webp', optimizeForSize: true },
        output: path.join(exampleDir, 'enhanced.webp')
      });
      console.log(`✅ Enhanced AI processing complete: ${enhanced}`);
    } catch (error) {
      console.log(`⚠️  Enhancement demo: ${error.message}`);
    }
    
    // Example 7: Using direct function exports
    console.log('\n7. Direct function usage...');
    const { compress } = require('../src/index');
    try {
      const directCompressed = await compress(testImagePath, { 
        quality: 70,
        format: 'webp'
      });
      const directPath = path.join(exampleDir, 'direct-compressed.webp');
      await fs.writeFile(directPath, directCompressed);
      console.log(`✅ Direct function compression: ${directPath}`);
    } catch (error) {
      console.log(`⚠️  Direct function demo: ${error.message}`);
    }
    
    // Example 8: Intelligent quality optimization
    console.log('\n8. Intelligent quality optimization...');
    try {
      const optimalQuality = await zen.compressor.getOptimalQuality(testImagePath, 'webp');
      console.log(`📊 Optimal quality for WebP: ${optimalQuality}%`);
      
      const optimized = await zen.compress(testImagePath, {
        quality: optimalQuality,
        format: 'webp'
      });
      const optimizedPath = path.join(exampleDir, 'auto-optimized.webp');
      await fs.writeFile(optimizedPath, optimized);
      console.log(`✅ Auto-optimized compression: ${optimizedPath}`);
    } catch (error) {
      console.log(`⚠️  Auto-optimization demo: ${error.message}`);
    }
    
    // Example 9: Package info
    console.log('\n9. Package information...');
    const info = ImageZen.getInfo();
    console.log('📦 Package Info:');
    console.log(`   Name: ${info.name}`);
    console.log(`   Version: ${info.version}`);
    console.log(`   Features: ${info.features.join(', ')}`);
    console.log(`   Input formats: ${info.supportedFormats.input.join(', ')}`);
    console.log(`   Output formats: ${info.supportedFormats.output.join(', ')}`);
    
    console.log('\n🎉 All examples completed successfully!');
    console.log(`📁 Check the output directory: ${exampleDir}`);
    console.log('🚀 Try the CLI: npx image-zen --help');
    
    // Cleanup Squoosh resources
    await zen.compressor.close();
    
  } catch (error) {
    console.error('❌ Example failed:', error.message);
    process.exit(1);
  }
}

// Helper function to create a test image
async function createTestImage(outputDir) {
  const sharp = require('sharp');
  
  // Create a more complex test image with gradients and patterns
  const testImage = await sharp({
    create: {
      width: 400,
      height: 300,
      channels: 3,
      background: { r: 100, g: 150, b: 200 }
    }
  })
    .composite([
      {
        input: Buffer.from(
          '<svg width="400" height="300">' +
          '<defs>' +
          '<radialGradient id="grad1" cx="50%" cy="50%" r="50%">' +
          '<stop offset="0%" style="stop-color:rgb(255,255,255);stop-opacity:1" />' +
          '<stop offset="100%" style="stop-color:rgb(100,150,200);stop-opacity:1" />' +
          '</radialGradient>' +
          '</defs>' +
          '<rect width="100%" height="100%" fill="url(#grad1)" />' +
          '<circle cx="200" cy="150" r="80" fill="rgba(255,100,100,0.8)" />' +
          '<rect x="150" y="100" width="100" height="100" fill="rgba(100,255,100,0.6)" />' +
          '<text x="200" y="250" font-family="Arial" font-size="24" text-anchor="middle" fill="white">Test Image</text>' +
          '</svg>'
        ),
        top: 0,
        left: 0
      }
    ])
    .png()
    .toBuffer();
  
  const testImagePath = path.join(outputDir, 'test-image.png');
  await fs.writeFile(testImagePath, testImage);
  
  console.log(`📸 Created test image: ${testImagePath}`);
  return testImagePath;
}

// Run examples if this file is executed directly
if (require.main === module) {
  runExamples().catch(console.error);
}

module.exports = { runExamples };