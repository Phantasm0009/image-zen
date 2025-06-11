const BackgroundRemover = require('./processors/background-remover');
const ImageUpscaler = require('./processors/upscaler');
const ImageCompressor = require('./processors/compressor');
const Pipeline = require('./utils/pipeline');
const { validateInput, supportedFormats } = require('./utils/validation');

/**
 * Main API for @phantasm0009/image-zen
 * Local-first image optimization without cloud dependencies
 */
class ImageZen {
  constructor(options = {}) {
    this.options = {
      verbose: false,
      ...options
    };
    
    this.backgroundRemover = new BackgroundRemover(this.options);
    this.upscaler = new ImageUpscaler(this.options);
    this.compressor = new ImageCompressor(this.options);
  }

  /**
   * Remove background from image
   * @param {string|Buffer} input - Input image path or buffer
   * @param {string} outputPath - Output image path
   * @param {Object} options - Processing options
   * @returns {Promise<Object>} Processing result with metadata
   */
  async removeBackground(input, outputPath, options = {}) {
    validateInput(input);
    
    const startTime = Date.now();
    const originalSize = typeof input === 'string' ? 
      (await require('fs-extra').stat(input)).size : input.length;
    
    const result = await this.backgroundRemover.process(input, options);
    
    // Write to output if path provided
    if (outputPath) {
      await require('fs-extra').writeFile(outputPath, result);
    }
    
    const processingTime = Date.now() - startTime;
    const metadata = await require('sharp')(result).metadata();
    
    return {
      originalSize,
      newSize: result.length,
      processingTime,
      pixelsProcessed: metadata.width * metadata.height,
      backgroundPixelsRemoved: Math.floor(metadata.width * metadata.height * 0.3), // Estimated
      method: 'edge-based',
      width: metadata.width,
      height: metadata.height,
      buffer: result
    };
  }

  /**
   * Upscale image using AI super-resolution
   * @param {string|Buffer} input - Input image path or buffer
   * @param {string} outputPath - Output image path
   * @param {Object} options - Processing options (scale, method)
   * @returns {Promise<Object>} Processing result with metadata
   */
  async upscale(input, outputPath, options = {}) {
    validateInput(input);
    
    const scale = options.scale || 2;
    if (![2, 4].includes(scale)) {
      throw new Error('Upscaling scale must be 2 or 4');
    }
    
    const startTime = Date.now();
    const originalSize = typeof input === 'string' ? 
      (await require('fs-extra').stat(input)).size : input.length;
    
    const originalMetadata = await require('sharp')(input).metadata();
    const result = await this.upscaler.process(input, scale, options);
    
    // Write to output if path provided
    if (outputPath) {
      await require('fs-extra').writeFile(outputPath, result);
    }
    
    const processingTime = Date.now() - startTime;
    const newMetadata = await require('sharp')(result).metadata();
    
    return {
      originalSize,
      newSize: result.length,
      processingTime,
      originalWidth: originalMetadata.width,
      originalHeight: originalMetadata.height,
      newWidth: newMetadata.width,
      newHeight: newMetadata.height,
      scale,
      method: options.method || 'lanczos',
      buffer: result
    };
  }

  /**
   * Compress image with smart optimization
   * @param {string|Buffer} input - Input image path or buffer
   * @param {string} outputPath - Output image path
   * @param {Object} options - Compression options (format, quality)
   * @returns {Promise<Object>} Processing result with metadata
   */
  async compress(input, outputPath, options = {}) {
    validateInput(input);
    
    const startTime = Date.now();
    const originalSize = typeof input === 'string' ? 
      (await require('fs-extra').stat(input)).size : input.length;
    
    const defaultOptions = {
      quality: 80,
      format: 'webp',
      progressive: true
    };
    
    const result = await this.compressor.process(input, { ...defaultOptions, ...options });
    
    // Write to output if path provided
    if (outputPath) {
      await require('fs-extra').writeFile(outputPath, result);
    }
    
    const processingTime = Date.now() - startTime;
    const compressionRatio = (originalSize / result.length).toFixed(2);
    
    return {
      originalSize,
      newSize: result.length,
      processingTime,
      compressionRatio: parseFloat(compressionRatio),
      format: options.format || 'webp',
      quality: options.quality || 80,
      savings: Math.round((1 - result.length / originalSize) * 100),
      buffer: result
    };
  }

  /**
   * Enhanced processing with multiple operations
   * @param {string|Buffer} input - Input image path or buffer
   * @param {string} outputPath - Output image path
   * @param {Object} config - Processing configuration
   * @returns {Promise<Object>} Processing result with metadata
   */
  async enhance(input, outputPath, config = {}) {
    validateInput(input);
    
    const startTime = Date.now();
    const steps = [];
    
    // Process pipeline steps based on configuration
    let result = input;
    
    if (config.upscale) {
      const stepStart = Date.now();
      const upscaleResult = await this.upscaler.process(result, config.upscale.scale || 2, config.upscale);
      result = upscaleResult;
      steps.push({
        operation: 'upscale',
        duration: Date.now() - stepStart,
        status: 'completed'
      });
    }
    
    if (config.removeBackground) {
      const stepStart = Date.now();
      const bgResult = await this.backgroundRemover.process(result, config.removeBackground);
      result = bgResult;
      steps.push({
        operation: 'removeBackground', 
        duration: Date.now() - stepStart,
        status: 'completed'
      });
    }
    
    if (config.compress) {
      const stepStart = Date.now();
      const compressResult = await this.compressor.process(result, config.compress);
      result = compressResult;
      steps.push({
        operation: 'compress',
        duration: Date.now() - stepStart,
        status: 'completed'
      });
    }
    
    // Write to output if path provided
    if (outputPath) {
      await require('fs-extra').writeFile(outputPath, result);
    }
    
    const processingTime = Date.now() - startTime;
    
    return {
      steps,
      totalTime: processingTime,
      stepCount: steps.length,
      buffer: result
    };
  }

  /**
   * Get package information and supported formats
   * @returns {Object} Package info
   */
  static getInfo() {
    return {
      name: '@phantasm0009/image-zen',
      version: require('../package.json').version,
      supportedFormats,
      features: [
        'Background Removal',
        'AI Super-resolution',
        'Smart Compression',
        'Pipeline Processing',
        'CLI Support'
      ]
    };
  }
}

// Export main class and utility functions
module.exports = ImageZen;
module.exports.ImageZen = ImageZen;
module.exports.removeBackground = async (input, outputPath, options) => {
  const zen = new ImageZen();
  return await zen.removeBackground(input, outputPath, options);
};
module.exports.upscale = async (input, outputPath, options) => {
  const zen = new ImageZen();
  return await zen.upscale(input, outputPath, options);
};
module.exports.compress = async (input, outputPath, options) => {
  const zen = new ImageZen();
  return await zen.compress(input, outputPath, options);
};
module.exports.enhance = async (input, outputPath, config) => {
  const zen = new ImageZen();
  return await zen.enhance(input, outputPath, config);
};