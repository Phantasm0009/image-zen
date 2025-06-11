const fs = require('fs-extra');
const sharp = require('sharp');

/**
 * Smart image compression using Sharp library
 * Provides optimal compression with multiple format support
 */
class ImageCompressor {
  constructor(options = {}) {
    this.options = options;
  }

  async process(input, options = {}) {
    const {
      quality = 80,
      format = 'webp',
      progressive = true,
      optimizeForSize = true,
      preserveMetadata = false,
      maxWidth = null,
      maxHeight = null,
      effort = 4
    } = options;

    try {
      // Load image data
      let image;
      if (Buffer.isBuffer(input)) {
        image = sharp(input);
      } else {
        image = sharp(input);
      }
      
      // Apply preprocessing if needed
      if (maxWidth || maxHeight || !preserveMetadata) {
        image = await this.preprocessImage(image, { maxWidth, maxHeight, preserveMetadata });
      }
      
      // Apply compression based on format
      const result = await this.compressWithSharp(image, format, {
        quality,
        progressive,
        optimizeForSize,
        effort
      });
      
      return result;
      
    } catch (error) {
      throw new Error(`Compression failed: ${error.message}`);
    }
  }

  async preprocessImage(image, options) {
    const { maxWidth, maxHeight, preserveMetadata } = options;
    
    // Apply resizing if dimensions specified
    if (maxWidth || maxHeight) {
      image = image.resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    // Remove metadata unless preservation requested
    if (!preserveMetadata) {
      image = image.withMetadata({});
    }
    
    return image;
  }

  async compressWithSharp(image, format, options) {
    const { quality, progressive, optimizeForSize, effort } = options;
    
    switch (format.toLowerCase()) {
      case 'webp':
        return await image
          .webp({
            quality,
            progressive,
            effort: optimizeForSize ? 6 : effort,
            lossless: quality >= 95,
            nearLossless: quality >= 90 && quality < 95,
            smartSubsample: true
          })
          .toBuffer();
        
      case 'avif':
        return await image
          .avif({
            quality,
            effort: optimizeForSize ? 9 : Math.min(effort * 2, 9),
            chromaSubsampling: quality < 90 ? '4:2:0' : '4:4:4'
          })
          .toBuffer();
        
      case 'mozjpeg':
      case 'jpeg':
      case 'jpg':
        return await image
          .jpeg({
            quality,
            progressive,
            mozjpeg: true,
            optimizeScans: optimizeForSize,
            trellisQuantisation: optimizeForSize,
            overshootDeringing: optimizeForSize,
            optimizeColors: optimizeForSize
          })
          .toBuffer();
        
      case 'oxipng':
      case 'png':
        return await image
          .png({
            progressive,
            compressionLevel: optimizeForSize ? 9 : Math.min(effort + 2, 9),
            adaptiveFiltering: optimizeForSize,
            palette: optimizeForSize
          })
          .toBuffer();
        
      default:
        throw new Error(`Unsupported compression format: ${format}`);
    }
  }

  // Intelligent quality selection based on image analysis
  async getOptimalQuality(input, targetFormat = 'webp') {
    try {
      // Use Sharp for quick image analysis
      const image = sharp(input);
      const stats = await image.stats();
      const metadata = await image.metadata();
      
      // Analyze image characteristics
      const isPhoto = this.isPhotographic(stats);
      const hasTransparency = metadata.hasAlpha;
      const complexity = this.calculateComplexity(stats);
      const fileSize = metadata.size || (Buffer.isBuffer(input) ? input.length : (await fs.stat(input)).size);
      
      let baseQuality = 80;
      
      // Adjust based on content type
      if (isPhoto) {
        baseQuality = 85; // Photos can handle more compression
      } else {
        baseQuality = 92; // Graphics/text need higher quality
      }
      
      // Adjust based on complexity
      if (complexity > 0.8) {
        baseQuality += 8; // High detail images
      } else if (complexity < 0.3) {
        baseQuality -= 12; // Simple images can be compressed more
      }
      
      // Adjust based on file size
      if (fileSize > 2 * 1024 * 1024) { // > 2MB
        baseQuality -= 5; // Compress larger files more aggressively
      } else if (fileSize < 100 * 1024) { // < 100KB
        baseQuality += 5; // Preserve quality for small files
      }
      
      // Format-specific adjustments
      switch (targetFormat.toLowerCase()) {
        case 'webp':
          baseQuality += 5; // WebP is more efficient
          break;
        case 'avif':
          baseQuality += 10; // AVIF is very efficient
          break;
        case 'mozjpeg':
        case 'jpeg':
          // No adjustment needed
          break;
        case 'oxipng':
        case 'png':
          return hasTransparency ? 100 : 95; // PNG is lossless
      }
      
      return Math.max(50, Math.min(95, Math.round(baseQuality)));
      
    } catch (error) {
      // Fallback to default quality
      return 80;
    }
  }

  isPhotographic(stats) {
    // Photos typically have more varied colors and higher entropy
    const colorVariance = stats.channels.reduce((sum, channel) => 
      sum + channel.stdev, 0) / stats.channels.length;
    
    const entropy = stats.entropy || 0;
    
    return colorVariance > 25 && entropy > 6;
  }

  calculateComplexity(stats) {
    // Calculate image complexity based on standard deviation and entropy
    const avgStdev = stats.channels.reduce((sum, channel) => 
      sum + channel.stdev, 0) / stats.channels.length;
    
    const entropy = stats.entropy || 0;
    
    // Combine metrics and normalize to 0-1 scale
    const complexityScore = (avgStdev / 100) * 0.7 + (entropy / 8) * 0.3;
    
    return Math.min(1, Math.max(0, complexityScore));
  }

  // Batch compression with progress tracking and optimization
  async compressBatch(files, options = {}, progressCallback = null) {
    const results = [];
    const startTime = Date.now();
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        const originalSize = (await fs.stat(file)).size;
        
        // Auto-optimize quality if not specified
        let compressionOptions = { ...options };
        if (!options.quality) {
          compressionOptions.quality = await this.getOptimalQuality(file, options.format);
        }
        
        const compressed = await this.process(file, compressionOptions);
        const compressionRatio = (1 - compressed.length / originalSize) * 100;
        
        results.push({
          file,
          originalSize,
          compressedSize: compressed.length,
          compressionRatio: Math.round(compressionRatio * 100) / 100,
          quality: compressionOptions.quality,
          buffer: compressed,
          success: true
        });
        
        if (progressCallback) {
          const elapsed = Date.now() - startTime;
          const avgTime = elapsed / (i + 1);
          const eta = avgTime * (files.length - i - 1);
          
          progressCallback(i + 1, files.length, {
            ...results[i],
            eta: Math.round(eta / 1000)
          });
        }
        
      } catch (error) {
        results.push({
          file,
          error: error.message,
          success: false
        });
        
        if (progressCallback) {
          progressCallback(i + 1, files.length, { file, success: false, error: error.message });
        }
      }
    }
    
    return results;
  }

  // Cleanup resources (no longer needed with Sharp)
  async close() {
    // No resources to cleanup with Sharp
    return Promise.resolve();
  }
}

module.exports = ImageCompressor;