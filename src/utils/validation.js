const fs = require('fs-extra');
const path = require('path');

/**
 * Input validation utilities
 */

const supportedFormats = {
  input: ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'bmp'],
  output: ['jpg', 'jpeg', 'png', 'webp', 'avif']
};

/**
 * Validate input image
 * @param {string|Buffer} input - Input to validate
 * @throws {Error} If input is invalid
 */
function validateInput(input) {
  if (!input) {
    throw new Error('Input is required');
  }

  if (Buffer.isBuffer(input)) {
    if (input.length === 0) {
      throw new Error('Input buffer is empty');
    }
    return; // Buffer is valid
  }

  if (typeof input !== 'string') {
    throw new Error('Input must be a file path (string) or Buffer');
  }

  // Validate file path
  if (!fs.existsSync(input)) {
    throw new Error(`Input file does not exist: ${input}`);
  }

  const ext = path.extname(input).toLowerCase().slice(1);
  if (!supportedFormats.input.includes(ext)) {
    throw new Error(
      `Unsupported input format: ${ext}. Supported formats: ${supportedFormats.input.join(', ')}`
    );
  }

  // Check if file is readable
  try {
    fs.accessSync(input, fs.constants.R_OK);
  } catch (error) {
    throw new Error(`Cannot read input file: ${input}`);
  }
}

/**
 * Validate output format
 * @param {string} format - Output format to validate
 * @throws {Error} If format is unsupported
 */
function validateOutputFormat(format) {
  if (!format) {
    throw new Error('Output format is required');
  }

  const normalizedFormat = format.toLowerCase();
  if (!supportedFormats.output.includes(normalizedFormat)) {
    throw new Error(
      `Unsupported output format: ${format}. Supported formats: ${supportedFormats.output.join(', ')}`
    );
  }
}

/**
 * Validate quality parameter
 * @param {number} quality - Quality value to validate
 * @throws {Error} If quality is invalid
 */
function validateQuality(quality) {
  if (typeof quality !== 'number') {
    throw new Error('Quality must be a number');
  }

  if (quality < 1 || quality > 100) {
    throw new Error('Quality must be between 1 and 100');
  }
}

/**
 * Validate scale factor
 * @param {number} scale - Scale factor to validate
 * @throws {Error} If scale is invalid
 */
function validateScale(scale) {
  if (typeof scale !== 'number') {
    throw new Error('Scale must be a number');
  }

  if (![2, 4].includes(scale)) {
    throw new Error('Scale must be 2 or 4');
  }
}

/**
 * Validate output path and create directory if needed
 * @param {string} outputPath - Output path to validate
 * @throws {Error} If path is invalid or cannot be created
 */
async function validateAndCreateOutputPath(outputPath) {
  if (!outputPath || typeof outputPath !== 'string') {
    throw new Error('Output path must be a string');
  }

  const dir = path.dirname(outputPath);
  
  try {
    await fs.ensureDir(dir);
  } catch (error) {
    throw new Error(`Cannot create output directory: ${dir}`);
  }

  // Check if we can write to the directory
  try {
    await fs.access(dir, fs.constants.W_OK);
  } catch (error) {
    throw new Error(`Cannot write to output directory: ${dir}`);
  }
}

/**
 * Get file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size string
 */
function formatFileSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * Validate processing options
 * @param {Object} options - Options object to validate
 * @throws {Error} If options are invalid
 */
function validateProcessingOptions(options = {}) {
  if (typeof options !== 'object' || Array.isArray(options)) {
    throw new Error('Options must be an object');
  }

  // Validate individual option properties
  if (options.quality !== undefined) {
    validateQuality(options.quality);
  }

  if (options.format !== undefined) {
    validateOutputFormat(options.format);
  }

  if (options.scale !== undefined) {
    validateScale(options.scale);
  }

  if (options.maxWidth !== undefined && (typeof options.maxWidth !== 'number' || options.maxWidth <= 0)) {
    throw new Error('maxWidth must be a positive number');
  }

  if (options.maxHeight !== undefined && (typeof options.maxHeight !== 'number' || options.maxHeight <= 0)) {
    throw new Error('maxHeight must be a positive number');
  }
}

module.exports = {
  validateInput,
  validateOutputFormat,
  validateQuality,
  validateScale,
  validateAndCreateOutputPath,
  validateProcessingOptions,
  formatFileSize,
  supportedFormats
};