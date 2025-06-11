const ImageZen = require('../src/index');
const fs = require('fs-extra');
const path = require('path');

describe('ImageZen Basic Tests', () => {
  let zen;
  
  beforeAll(() => {
    zen = new ImageZen({ verbose: false });
  });

  test('should create ImageZen instance', () => {
    expect(zen).toBeDefined();
    expect(zen.backgroundRemover).toBeDefined();
    expect(zen.upscaler).toBeDefined();
    expect(zen.compressor).toBeDefined();
  });

  test('should get package info', () => {
    const info = ImageZen.getInfo();
    expect(info.name).toBe('@phantasm0009/image-zen');
    expect(info.version).toBe('1.0.0');
    expect(info.features).toEqual(
      expect.arrayContaining(['Background Removal', 'AI Super-resolution', 'Smart Compression'])
    );
  });

  test('should validate supported formats', () => {
    const { supportedFormats } = require('../src/utils/validation');
    expect(supportedFormats.input).toContain('jpg');
    expect(supportedFormats.input).toContain('png');
    expect(supportedFormats.input).toContain('webp');
    expect(supportedFormats.output).toContain('webp');
    expect(supportedFormats.output).toContain('avif');
  });

  test('should export direct functions', () => {
    const { compress, upscale, removeBackground, enhance } = require('../src/index');
    expect(typeof compress).toBe('function');
    expect(typeof upscale).toBe('function');
    expect(typeof removeBackground).toBe('function');
    expect(typeof enhance).toBe('function');
  });

  test('should handle validation errors', () => {
    const { validateInput } = require('../src/utils/validation');
    
    expect(() => validateInput(null)).toThrow('Input is required');
    expect(() => validateInput('')).toThrow('Input is required');
    expect(() => validateInput(123)).toThrow('Input must be a file path (string) or Buffer');
  });
});
