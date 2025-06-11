# 🖼️ @phantasm0009/image-zen

**Local-first image optimizer with AI-powered processing - no cloud dependencies**

[![npm version](https://badge.fury.io/js/@phantasm0009%2Fimage-zen.svg)](https://www.npmjs.com/package/@phantasm0009/image-zen)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/@phantasm0009/image-zen.svg)](https://nodejs.org/)

## 🚀 Features

- **🎯 Zero-Cloud AI Tools**: Background removal, super-resolution, and smart compression using TensorFlow Lite
- **⚡ Local Processing**: Complete offline processing with pre-trained models
- **🛠️ CLI + API Support**: Use from command line or integrate into your apps
- **🔗 Extensible Pipeline**: Chain multiple operations seamlessly
- **🏃‍♂️ High Performance**: Squoosh compression + TensorFlow Lite acceleration
- **📦 All-in-One**: Pre-trained models downloaded automatically

## 🎯 Core Capabilities

| Feature | Technology | Performance |
|---------|------------|-------------|
| **Background Removal** | TensorFlow Lite + RobustVideoMatting | ~800ms avg |
| **Super-resolution** | TensorFlow Lite + EDSR models | ~1.2s avg |
| **Smart Compression** | Squoosh + multiple codecs | ~300ms avg |
| **Format Conversion** | Support for JPG, PNG, WebP, AVIF | ~200ms avg |

## 📦 Installation

```bash
# Install globally for CLI usage
npm install -g @phantasm0009/image-zen

# Or install locally for API usage
npm install @phantasm0009/image-zen
```

**Note**: On first install, TensorFlow Lite models (~17MB total) will be downloaded automatically for offline AI processing.

## 🚀 Quick Start

### CLI Usage

```bash
# Remove background from image
image-zen remove-bg photo.jpg -o clean.png

# Upscale image 2x with AI
image-zen upscale small.jpg --scale 2 -o large.png

# Compress with Squoosh optimization
image-zen compress *.jpg --quality 80 --format webp

# Enhanced pipeline processing
image-zen enhance photo.jpg -t remove-bg,upscale,compress -s 2 -q 85
```

### API Usage

```javascript
import { ImageZen, compress, removeBackground } from '@phantasm0009/image-zen';

// Create instance
const zen = new ImageZen({ verbose: true });

// AI background removal with TensorFlow Lite
const bgRemoved = await zen.removeBackground('photo.jpg');

// AI upscaling with EDSR models
const upscaled = await zen.upscale('small.jpg', 2);

// Squoosh compression
const compressed = await zen.compress('large.jpg', {
  quality: 80,
  format: 'webp'
});

// Enhanced pipeline
await zen.enhance('input.jpg', {
  tasks: ['remove-bg', 'upscale', 'compress'],
  scale: 2,
  compression: { quality: 85, format: 'webp' },
  output: 'output.webp'
});

// Direct function usage
const result = await compress('image.jpg', { quality: 70 });
```

## 🛠️ CLI Reference

### Commands

#### `remove-bg <input>`
AI-powered background removal using TensorFlow Lite
```bash
image-zen remove-bg photo.jpg -o clean.png -f png
```

**Options:**
- `-o, --output <path>` - Output path or directory
- `-f, --format <format>` - Output format (png, webp) [default: png]

#### `upscale <input>`
AI super-resolution using EDSR TensorFlow Lite models
```bash
image-zen upscale small.jpg -s 4 -o large.png
```

**Options:**
- `-s, --scale <number>` - Scale factor (2, 4) [default: 2]
- `-o, --output <path>` - Output path or directory
- `-f, --format <format>` - Output format [default: png]

#### `compress <input>`
Smart compression using Squoosh library
```bash
image-zen compress *.jpg -q 80 -f webp -o compressed/
```

**Options:**
- `-q, --quality <number>` - Compression quality (1-100) [default: 80]
- `-f, --format <format>` - Output format (webp, avif, mozjpeg, oxipng) [default: webp]
- `-o, --output <path>` - Output path or directory

#### `enhance <input>`
Apply multiple AI enhancements in pipeline
```bash
image-zen enhance photo.jpg -t remove-bg,upscale,compress -s 2 -q 85
```

**Options:**
- `-t, --tasks <tasks>` - Comma-separated tasks [default: compress]
- `-s, --scale <number>` - Scale factor for upscaling [default: 2]
- `-q, --quality <number>` - Compression quality [default: 80]
- `-f, --format <format>` - Output format [default: webp]
- `-o, --output <path>` - Output path or directory

#### `info`
Show package information and model status

## 📚 API Reference

### Class: ImageZen

#### Constructor
```javascript
const zen = new ImageZen(options);
```

**Options:**
- `verbose` (boolean) - Enable verbose logging

#### Methods

##### `removeBackground(input, options)`
AI background removal using TensorFlow Lite
- **input**: `string | Buffer` - Image path or buffer
- **options**: `Object` - Processing options
- **Returns**: `Promise<Buffer>` - Processed image

##### `upscale(input, scale, options)`
AI upscaling using EDSR models
- **input**: `string | Buffer` - Image path or buffer
- **scale**: `number` - Scale factor (2 or 4)
- **options**: `Object` - Processing options
- **Returns**: `Promise<Buffer>` - Upscaled image

##### `compress(input, options)`
Smart compression using Squoosh
- **input**: `string | Buffer` - Image path or buffer
- **options**: `Object` - Compression options
  - `quality`: `number` (1-100) - Compression quality
  - `format`: `string` - Output format (webp, avif, mozjpeg, oxipng)
  - `progressive`: `boolean` - Progressive encoding
  - `optimizeForSize`: `boolean` - Size optimization
  - `effort`: `number` (0-6) - Compression effort
- **Returns**: `Promise<Buffer>` - Compressed image

##### `enhance(input, config)`
Enhanced processing pipeline
- **input**: `string | Buffer` - Image path or buffer
- **config**: `Object` - Processing configuration
  - `tasks`: `Array` - Processing tasks
  - `output`: `string` - Output file path
  - `scale`: `number` - Upscaling factor
  - `compression`: `Object` - Compression options
- **Returns**: `Promise<Buffer | string>` - Result or output path

## 🎨 Advanced Examples

### AI-Powered Background Removal
```javascript
const zen = new ImageZen({ verbose: true });

// High-quality background removal
const result = await zen.removeBackground('portrait.jpg', {
  format: 'png' // Preserve transparency
});

await fs.writeFile('portrait_clean.png', result);
```

### Super-Resolution Upscaling
```javascript
// 4x upscaling with AI enhancement
const upscaled = await zen.upscale('low_res.jpg', 4, {
  algorithm: 'lanczos3', // Fallback if TFLite model unavailable
  sharpen: true,
  enhanceDetails: true
});
```

### Squoosh-Powered Compression
```javascript
// Multi-format optimization
const formats = ['webp', 'avif', 'mozjpeg'];

for (const format of formats) {
  const compressed = await zen.compress('photo.jpg', {
    format,
    quality: await zen.getOptimalQuality('photo.jpg', format),
    optimizeForSize: true
  });
  
  await fs.writeFile(`photo.${format}`, compressed);
}
```

### Batch Processing with Progress
```javascript
const files = glob.sync('./photos/*.jpg');

const results = await zen.compressBatch(files, {
  format: 'webp',
  quality: 85
}, (current, total, result) => {
  console.log(`Progress: ${current}/${total} - ${result.file}`);
  if (result.success) {
    console.log(`  Saved ${result.compressionRatio}% space`);
  }
});
```

## 🔧 Technology Stack

### AI Models (TensorFlow Lite)
- **Background Removal**: RobustVideoMatting (14.2MB)
- **2x Upscaling**: EDSR 2x model (1.5MB)
- **4x Upscaling**: EDSR 4x model (1.5MB)

### Compression Engine
- **Squoosh Library**: Google's advanced image compression
- **Supported Codecs**: WebP, AVIF, MozJPEG, OxiPNG
- **Optimization**: Automatic quality selection and size optimization

### Performance Features
- **Tile-based Processing**: Handle large images efficiently
- **Memory Management**: Automatic cleanup and optimization
- **Batch Processing**: Parallel processing with progress tracking
- **Fallback Methods**: Graceful degradation when models unavailable

## 📊 Performance Benchmarks

| Operation | TensorFlow Lite | Fallback | Memory Usage |
|-----------|----------------|----------|--------------|
| Background Removal | 800ms | 300ms | ~250MB |
| 2x Upscaling | 1.2s | 400ms | ~300MB |
| 4x Upscaling | 3.5s | 1.1s | ~600MB |
| Squoosh Compression | 300ms | - | ~150MB |

*Benchmarks on M1 MacBook Pro with 16GB RAM*

## 🔧 Supported Formats

### Input Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- TIFF (.tiff)
- BMP (.bmp)

### Output Formats
- **WebP** - Best overall compression
- **AVIF** - Next-gen format, excellent compression
- **MozJPEG** - Optimized JPEG with better compression
- **OxiPNG** - Optimized PNG with lossless compression

## ⚙️ Requirements

- **Node.js**: 16.0.0 or higher
- **Memory**: 2GB RAM minimum (4GB recommended for 4x upscaling)
- **Storage**: 150MB for package, models, and dependencies
- **Internet**: Required only for initial model download

## 🚀 Model Management

Models are automatically downloaded on first install:

```bash
# Check model status
image-zen info

# Manually trigger model download
npm run postinstall

# Models are stored in: node_modules/@phantasm0009/image-zen/models/
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 💖 Support

If you find this package useful, consider:

- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting features
- 💝 [Sponsoring development](https://github.com/sponsors/phantasm0009)

## 🔗 Links

- [NPM Package](https://www.npmjs.com/package/@phantasm0009/image-zen)
- [GitHub Repository](https://github.com/phantasm0009/image-zen)
- [Documentation](https://github.com/phantasm0009/image-zen#readme)
- [Issue Tracker](https://github.com/phantasm0009/image-zen/issues)

---

**Made with ❤️ by phantasm0009** | **Local-first AI for everyone**