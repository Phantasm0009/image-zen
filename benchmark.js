const ImageZen = require('./src/index');
const path = require('path');
const fs = require('fs-extra');

async function runBenchmark() {
  console.log('🔥 ImageZen Performance Benchmark\n');
  console.log('='.repeat(50));
  
  const testDir = path.join(__dirname, 'benchmark-output');
  await fs.ensureDir(testDir);
  
  const zen = new ImageZen();
  
  // Test with the example image
  const inputImage = path.join(__dirname, 'examples', 'output', 'test-image.png');
  
  if (!fs.existsSync(inputImage)) {
    console.log('❌ No test image found. Run examples/api-example.js first.');
    return;
  }
  
  const originalSize = (await fs.stat(inputImage)).size;
  console.log(`📸 Test image: ${originalSize} bytes (${(originalSize/1024).toFixed(1)}KB)\n`);
  
  // 1. Background Removal Test
  console.log('1️⃣ Background Removal Performance:');
  const bgStart = Date.now();
  try {
    const bgResult = await zen.removeBackground(inputImage, path.join(testDir, 'bg-removed.png'));
    const bgTime = Date.now() - bgStart;
    console.log(`   ✅ Completed in ${bgTime}ms`);
    console.log(`   📊 Processed ${bgResult.pixelsProcessed.toLocaleString()} pixels`);
    console.log(`   🎯 Removed ${bgResult.backgroundPixelsRemoved.toLocaleString()} background pixels\n`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }
  
  // 2. Upscaling Test
  console.log('2️⃣ AI Upscaling Performance:');
  const upscaleStart = Date.now();
  try {
    const upscaleResult = await zen.upscale(inputImage, path.join(testDir, 'upscaled.png'), { scale: 2 });
    const upscaleTime = Date.now() - upscaleStart;
    console.log(`   ✅ Completed in ${upscaleTime}ms`);
    console.log(`   📊 ${upscaleResult.originalWidth}×${upscaleResult.originalHeight} → ${upscaleResult.newWidth}×${upscaleResult.newHeight}`);
    console.log(`   🚀 Method: ${upscaleResult.method}\n`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }
  
  // 3. Compression Test
  console.log('3️⃣ Smart Compression Performance:');
  const formats = ['webp', 'avif', 'jpeg'];
  
  for (const format of formats) {
    const compressStart = Date.now();
    try {
      const compressResult = await zen.compress(inputImage, path.join(testDir, `compressed.${format}`), {
        format,
        quality: 80
      });
      const compressTime = Date.now() - compressStart;
      const savings = ((compressResult.originalSize - compressResult.newSize) / compressResult.originalSize * 100).toFixed(1);
      
      console.log(`   ${format.toUpperCase()}: ${compressTime}ms, ${compressResult.newSize} bytes (${savings}% smaller)`);
    } catch (error) {
      console.log(`   ${format.toUpperCase()}: Error - ${error.message}`);
    }
  }
  
  // 4. Pipeline Test
  console.log('\n4️⃣ Pipeline Processing Performance:');
  const pipelineStart = Date.now();
  try {
    const pipelineResult = await zen.enhance(inputImage, path.join(testDir, 'enhanced.webp'), {
      upscale: { scale: 2 },
      removeBackground: { method: 'edge-based' },
      compress: { format: 'webp', quality: 85 }
    });
    const pipelineTime = Date.now() - pipelineStart;
    console.log(`   ✅ Pipeline completed in ${pipelineTime}ms`);
    console.log(`   🔄 Steps executed: ${pipelineResult.steps.length}`);
    pipelineResult.steps.forEach((step, i) => {
      console.log(`      ${i + 1}. ${step.operation}: ${step.duration}ms`);
    });
  } catch (error) {
    console.log(`   ❌ Pipeline error: ${error.message}`);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('🎉 Benchmark completed!');
  console.log(`📁 Results saved in: ${testDir}`);
  
  // Cleanup
  await fs.remove(testDir);
}

if (require.main === module) {
  runBenchmark().catch(console.error);
}

module.exports = { runBenchmark };
