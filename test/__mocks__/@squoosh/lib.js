// Mock implementation of @squoosh/lib for testing
class MockImage {
  constructor(buffer) {
    this.buffer = buffer;
    this.encodedWith = {};
  }

  async preprocess(options) {
    // Mock preprocessing
    return Promise.resolve();
  }

  async encode(options) {
    // Mock encoding - simulate compression
    const format = Object.keys(options)[0];
    const mockResult = {
      binary: Buffer.from('compressed-image-data'),
      size: Math.floor(this.buffer.length * 0.7) // Simulate 30% compression
    };
    
    this.encodedWith[format] = mockResult;
    return Promise.resolve();
  }
}

class MockImagePool {
  constructor() {
    this.closed = false;
  }

  ingestImage(buffer) {
    return new MockImage(buffer);
  }

  async close() {
    this.closed = true;
    return Promise.resolve();
  }
}

module.exports = {
  ImagePool: MockImagePool
};
