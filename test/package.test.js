const ImageZen = require('../src/index');

describe('ImageZen Package Tests', () => {
  test('should provide package information', () => {
    const info = ImageZen.getInfo();
    expect(info.name).toBe('@phantasm0009/image-zen');
    expect(info.version).toBe('1.0.0');
    expect(info.features).toBeInstanceOf(Array);
    expect(info.features.length).toBeGreaterThan(0);
  });

  test('should create ImageZen instance', () => {
    const zen = new ImageZen();
    expect(zen).toBeDefined();
    expect(zen.compress).toBeDefined();
    expect(zen.upscale).toBeDefined();
    expect(zen.removeBackground).toBeDefined();
    expect(zen.enhance).toBeDefined();
  });

  test('should export direct functions', () => {
    const { compress, upscale, removeBackground, enhance } = require('../src/index');
    expect(typeof compress).toBe('function');
    expect(typeof upscale).toBe('function');
    expect(typeof removeBackground).toBe('function');
    expect(typeof enhance).toBe('function');
  });

  test('should support required formats', () => {
    const info = ImageZen.getInfo();
    expect(info.supportedFormats.input).toContain('png');
    expect(info.supportedFormats.input).toContain('jpeg');
    expect(info.supportedFormats.output).toContain('webp');
    expect(info.supportedFormats.output).toContain('png');
  });
});
