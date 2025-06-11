const fs = require('fs-extra');
const path = require('path');
const fetch = require('node-fetch');
const { createWriteStream } = require('fs');
const { pipeline } = require('stream');
const { promisify } = require('util');

const streamPipeline = promisify(pipeline);

/**
 * Download TensorFlow Lite models for image processing
 */
class ModelDownloader {
  constructor() {
    this.modelsDir = path.join(__dirname, '..', 'models');
    this.models = {
      'background-removal': {
        url: 'https://github.com/PeterL1n/RobustVideoMatting/releases/download/v1.0.0/rvm_mobilenetv3_fp32.tflite',
        filename: 'background_removal.tflite',
        size: '14.2MB'
      },
      'super-resolution-2x': {
        url: 'https://github.com/Saafke/EDSR_Tensorflow/raw/master/models/EDSR_x2.tflite',
        filename: 'super_resolution_2x.tflite',
        size: '1.5MB'
      },
      'super-resolution-4x': {
        url: 'https://github.com/Saafke/EDSR_Tensorflow/raw/master/models/EDSR_x4.tflite',
        filename: 'super_resolution_4x.tflite',
        size: '1.5MB'
      }
    };
  }

  async downloadModels() {
    console.log('📦 Setting up @phantasm0009/image-zen models...\n');
    
    // Ensure models directory exists
    await fs.ensureDir(this.modelsDir);
    
    // Check if models already exist
    const existingModels = await this.checkExistingModels();
    if (existingModels.length === Object.keys(this.models).length) {
      console.log('✅ All models already downloaded and ready!\n');
      return;
    }
    
    console.log('🔄 Downloading TensorFlow Lite models for offline processing...');
    console.log('   This is a one-time setup and may take a few minutes.\n');
    
    for (const [name, config] of Object.entries(this.models)) {
      const modelPath = path.join(this.modelsDir, config.filename);
      
      if (await fs.pathExists(modelPath)) {
        console.log(`✓ ${name} model already exists (${config.size})`);
        continue;
      }
      
      try {
        console.log(`📥 Downloading ${name} model (${config.size})...`);
        await this.downloadModel(config.url, modelPath);
        console.log(`✅ ${name} model downloaded successfully`);
      } catch (error) {
        console.warn(`⚠️  Failed to download ${name} model: ${error.message}`);
        console.warn(`   The package will work with reduced functionality.`);
      }
    }
    
    console.log('\n🎉 Model setup complete! @phantasm0009/image-zen is ready to use.');
    console.log('💡 Try: npx image-zen --help\n');
  }

  async downloadModel(url, outputPath) {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    await streamPipeline(response.body, createWriteStream(outputPath));
  }

  async checkExistingModels() {
    const existing = [];
    
    for (const [name, config] of Object.entries(this.models)) {
      const modelPath = path.join(this.modelsDir, config.filename);
      if (await fs.pathExists(modelPath)) {
        existing.push(name);
      }
    }
    
    return existing;
  }

  getModelPath(modelName) {
    const config = this.models[modelName];
    if (!config) {
      throw new Error(`Unknown model: ${modelName}`);
    }
    
    return path.join(this.modelsDir, config.filename);
  }

  async isModelAvailable(modelName) {
    const modelPath = this.getModelPath(modelName);
    return await fs.pathExists(modelPath);
  }
}

// Run download if this script is executed directly
if (require.main === module) {
  const downloader = new ModelDownloader();
  downloader.downloadModels().catch(error => {
    console.error('❌ Model download failed:', error.message);
    console.log('📝 You can manually download models later or use reduced functionality.');
    process.exit(0); // Don't fail installation
  });
}

module.exports = ModelDownloader;