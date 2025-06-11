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
   * @param {Object} options - Processing options
   * @returns {Promise<Buffer>} Processed image buffer
   */
  async removeBackground(input, options = {}) {
    validateInput(input);
    return await this.backgroundRemover.process(input, options);
  }

  /**
   * Upscale image using AI super-resolution
   * @param {string|Buffer} input - Input image path or buffer
   * @param {number} scale - Scale factor (2x, 4x)
   * @param {Object} options - Processing options
   * @returns {Promise<Buffer>} Upscaled image buffer
   */
  async upscale(input, scale = 2, options = {}) {
    validateInput(input);
    return await this.upscaler.process(input, scale, options);
  }

  /**
   * Compress image with smart optimization
   * @param {string|Buffer} input - Input image path or buffer
   * @param {Object} options - Compression options
   * @returns {Promise<Buffer>} Compressed image buffer
   */
  async compress(input, options = {}) {
    validateInput(input);
    const defaultOptions = {
      quality: 80,
      format: 'webp',
      progressive: true
    };
    return await this.compressor.process(input, { ...defaultOptions, ...options });
  }

  /**
   * Enhanced processing with multiple operations
   * @param {string|Buffer} input - Input image path or buffer
   * @param {Object} config - Processing configuration
   * @returns {Promise<Buffer>} Processed image buffer
   */
  async enhance(input, config = {}) {
    validateInput(input);
    
    const {
      tasks = [],
      output = null,
      ...options
    } = config;

    const pipeline = new Pipeline(this.options);
    
    // Add tasks to pipeline
    for (const task of tasks) {
      switch (task) {
        case 'remove-bg':
          pipeline.add('removeBackground', this.backgroundRemover);
          break;
        case 'upscale':
          pipeline.add('upscale', this.upscaler, options.scale || 2);
          break;
        case 'compress':
          pipeline.add('compress', this.compressor, options.compression || {});
          break;
        default:
          throw new Error(`Unknown task: ${task}`);
      }
    }

    const result = await pipeline.execute(input);
    
    // Save to file if output path specified
    if (output) {
      const fs = require('fs-extra');
      await fs.writeFile(output, result);
      return output;
    }
    
    return result;
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
module.exports.removeBackground = async (input, options) => {
  const zen = new ImageZen();
  return await zen.removeBackground(input, options);
};
module.exports.upscale = async (input, scale, options) => {
  const zen = new ImageZen();
  return await zen.upscale(input, scale, options);
};
module.exports.compress = async (input, options) => {
  const zen = new ImageZen();
  return await zen.compress(input, options);
};
module.exports.enhance = async (input, config) => {
  const zen = new ImageZen();
  return await zen.enhance(input, config);
};