# Contributing to @phantasm0009/image-zen

Thank you for your interest in contributing to image-zen! This document outlines how you can help improve this local-first image processing library.

## 🚀 Quick Start for Contributors

1. **Fork the repository**
   ```bash
   git fork https://github.com/phantasm0009/image-zen.git
   cd image-zen
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run tests**
   ```bash
   npm test
   npm run dev  # Run API examples
   ```

4. **Test CLI**
   ```bash
   node src/cli.js --help
   node src/cli.js info
   ```

## 🎯 Areas for Contribution

### High Priority
- **TensorFlow Lite Integration**: Implement actual TFLite model loading for background removal and super-resolution
- **Performance Optimization**: Improve processing speed and memory usage
- **Advanced AI Models**: Add support for newer AI models (RIFE, Real-ESRGAN, etc.)
- **Better Fallback Methods**: Improve the quality of non-AI processing methods

### Medium Priority
- **New Image Formats**: Add support for JXL, HEIC, etc.
- **Batch Processing UI**: Create a web interface for batch processing
- **Plugin System**: Allow custom processors to be added
- **Cloud Integration**: Optional cloud processing for heavy tasks

### Low Priority
- **Video Processing**: Extend to basic video processing
- **Documentation**: Improve examples and tutorials
- **Benchmarking**: Add performance benchmarking tools

## 🛠️ Development Guidelines

### Code Style
- Use ES6+ JavaScript
- Follow existing naming conventions
- Add JSDoc comments for all public methods
- Use async/await for asynchronous operations

### File Structure
```
src/
├── processors/          # Core image processing classes
│   ├── background-remover.js
│   ├── compressor.js
│   └── upscaler.js
├── utils/              # Utility functions
│   ├── pipeline.js
│   └── validation.js
├── cli.js              # Command-line interface
├── index.js            # Main API exports
└── index.d.ts          # TypeScript definitions
```

### Adding a New Processor

1. Create processor class in `src/processors/`:
```javascript
class MyProcessor {
  constructor(options = {}) {
    this.options = options;
  }

  async process(input, options = {}) {
    // Implementation here
    return processedBuffer;
  }
}

module.exports = MyProcessor;
```

2. Add to main API in `src/index.js`:
```javascript
const MyProcessor = require('./processors/my-processor');

class ImageZen {
  constructor(options = {}) {
    // ...existing code...
    this.myProcessor = new MyProcessor(this.options);
  }

  async myMethod(input, options = {}) {
    validateInput(input);
    return await this.myProcessor.process(input, options);
  }
}
```

3. Add CLI command in `src/cli.js`:
```javascript
program
  .command('my-command <input>')
  .description('Description of my command')
  .option('-o, --output <path>', 'Output path')
  .action(async (input, options) => {
    // Implementation
  });
```

### Testing

- Add unit tests in `test/` directory
- Use Jest for testing framework
- Test both API and CLI interfaces
- Include integration tests for complex workflows

Example test:
```javascript
const ImageZen = require('../src/index');

describe('MyProcessor', () => {
  let zen;
  
  beforeAll(() => {
    zen = new ImageZen({ verbose: false });
  });

  test('should process image correctly', async () => {
    const result = await zen.myMethod(testImagePath);
    expect(Buffer.isBuffer(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});
```

## 📝 Commit Guidelines

Use conventional commits:
- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `test:` adding or updating tests
- `refactor:` code refactoring
- `perf:` performance improvements

Examples:
```
feat: add JPEG XL format support
fix: handle corrupted image files gracefully
docs: update API documentation for compress method
test: add integration tests for pipeline processing
```

## 🔍 Code Review Process

1. **Fork and create branch**
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Make changes and test**
   ```bash
   npm test
   npm run dev
   ```

3. **Commit and push**
   ```bash
   git commit -m "feat: add my new feature"
   git push origin feature/my-new-feature
   ```

4. **Create Pull Request**
   - Include clear description
   - Add screenshots/examples if UI changes
   - Reference any related issues

## 🐛 Bug Reports

When reporting bugs, include:
- Node.js version
- Operating system
- Sample image (if applicable)
- Error messages
- Steps to reproduce

## 💡 Feature Requests

For new features:
- Describe the use case
- Explain expected behavior
- Consider backward compatibility
- Provide examples if possible

## 🏆 Recognition

Contributors will be:
- Listed in README.md
- Mentioned in release notes
- Given credit in package.json

## 📞 Getting Help

- **Discord**: [Join our community](https://discord.gg/image-zen)
- **GitHub Issues**: For bugs and feature requests
- **Email**: phantasm0009@gmail.com

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Happy Contributing! 🎉**
