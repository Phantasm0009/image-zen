declare module '@phantasm0009/image-zen' {
  export interface ProcessingOptions {
    quality?: number;
    format?: 'jpg' | 'jpeg' | 'png' | 'webp' | 'avif';
    progressive?: boolean;
    preserveMetadata?: boolean;
    maxWidth?: number;
    maxHeight?: number;
  }

  export interface CompressionOptions extends ProcessingOptions {
    optimizeForSize?: boolean;
  }

  export interface UpscaleOptions {
    algorithm?: 'lanczos3' | 'cubic' | 'linear';
    sharpen?: boolean;
  }

  export interface EnhanceConfig {
    tasks: Array<'remove-bg' | 'upscale' | 'compress'>;
    output?: string;
    scale?: number;
    compression?: CompressionOptions;
  }

  export interface PackageInfo {
    name: string;
    version: string;
    supportedFormats: {
      input: string[];
      output: string[];
    };
    features: string[];
  }

  export class ImageZen {
    constructor(options?: { verbose?: boolean });
    
    removeBackground(
      input: string | Buffer, 
      options?: ProcessingOptions
    ): Promise<Buffer>;
    
    upscale(
      input: string | Buffer, 
      scale?: 2 | 4, 
      options?: UpscaleOptions
    ): Promise<Buffer>;
    
    compress(
      input: string | Buffer, 
      options?: CompressionOptions
    ): Promise<Buffer>;
    
    enhance(
      input: string | Buffer, 
      config?: EnhanceConfig
    ): Promise<Buffer | string>;
    
    static getInfo(): PackageInfo;
  }

  // Direct function exports
  export function removeBackground(
    input: string | Buffer, 
    options?: ProcessingOptions
  ): Promise<Buffer>;

  export function upscale(
    input: string | Buffer, 
    scale?: 2 | 4, 
    options?: UpscaleOptions
  ): Promise<Buffer>;

  export function compress(
    input: string | Buffer, 
    options?: CompressionOptions
  ): Promise<Buffer>;

  export function enhance(
    input: string | Buffer, 
    config?: EnhanceConfig
  ): Promise<Buffer | string>;

  export default ImageZen;
}