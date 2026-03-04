import { describe, it, expect } from 'vitest';
import {
  validateFormat,
  validateFileSize,
  validateDimensions,
  hasTransparency,
  getErrorMessage,
  validateImageFile,
} from './fileValidator';

describe('fileValidator', () => {
  describe('validateFormat', () => {
    it('should detect PNG format from magic numbers', async () => {
      // PNG magic number: 89 50 4E 47
      const pngBuffer = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).buffer;
      const result = await validateFormat(pngBuffer, 'test.png');
      
      expect(result.valid).toBe(true);
      expect(result.format).toBe('png');
    });

    it('should detect JPG format from magic numbers', async () => {
      // JPG magic number: FF D8 FF
      const jpgBuffer = new Uint8Array([0xff, 0xd8, 0xff, 0xe0]).buffer;
      const result = await validateFormat(jpgBuffer, 'test.jpg');
      
      expect(result.valid).toBe(true);
      expect(result.format).toBe('jpg');
    });

    it('should detect GIF format from magic numbers', async () => {
      // GIF magic number: 47 49 46 38
      const gifBuffer = new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]).buffer;
      const result = await validateFormat(gifBuffer, 'test.gif');
      
      expect(result.valid).toBe(true);
      expect(result.format).toBe('gif');
    });

    it('should fallback to extension for format detection', async () => {
      const emptyBuffer = new ArrayBuffer(0);
      const result = await validateFormat(emptyBuffer, 'test.webp');
      
      expect(result.valid).toBe(true);
      expect(result.format).toBe('webp');
    });

    it('should reject unsupported formats', async () => {
      const emptyBuffer = new ArrayBuffer(0);
      const result = await validateFormat(emptyBuffer, 'test.xyz');
      
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Unsupported image format');
    });
  });

  describe('validateFileSize', () => {
    it('should reject empty files', () => {
      const result = validateFileSize(0);
      
      expect(result.valid).toBe(false);
      expect(result.error).toBe('File is empty');
    });

    it('should accept files under 50MB', () => {
      const result = validateFileSize(49 * 1024 * 1024);
      
      expect(result.valid).toBe(true);
    });

    it('should reject files over 50MB', () => {
      const result = validateFileSize(51 * 1024 * 1024);
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds');
    });

    it('should accept exactly 50MB files', () => {
      const result = validateFileSize(50 * 1024 * 1024);
      
      expect(result.valid).toBe(true);
    });
  });

  describe('validateDimensions', () => {
    it('should accept valid dimensions', () => {
      const result = validateDimensions(100, 100);
      
      expect(result.valid).toBe(true);
    });

    it('should reject zero width', () => {
      const result = validateDimensions(0, 100);
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('at least');
    });

    it('should reject zero height', () => {
      const result = validateDimensions(100, 0);
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('at least');
    });

    it('should reject dimensions over 10000px', () => {
      const result = validateDimensions(10001, 100);
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('cannot exceed');
    });

    it('should accept maximum dimensions', () => {
      const result = validateDimensions(10000, 10000);
      
      expect(result.valid).toBe(true);
    });
  });

  describe('hasTransparency', () => {
    it('should return true for PNG', () => {
      expect(hasTransparency('png')).toBe(true);
    });

    it('should return true for WebP', () => {
      expect(hasTransparency('webp')).toBe(true);
    });

    it('should return true for GIF', () => {
      expect(hasTransparency('gif')).toBe(true);
    });

    it('should return false for JPG', () => {
      expect(hasTransparency('jpg')).toBe(false);
    });

    it('should return false for BMP', () => {
      expect(hasTransparency('bmp')).toBe(false);
    });
  });

  describe('getErrorMessage', () => {
    it('should return user-friendly message for unsupported format', () => {
      const message = getErrorMessage('Unsupported image format');
      
      expect(message).toContain('not supported');
      expect(message).toContain('PNG');
    });

    it('should return user-friendly message for file size', () => {
      const message = getErrorMessage('File size exceeds limit');
      
      expect(message).toContain('too large');
      expect(message).toContain('50MB');
    });

    it('should return user-friendly message for empty file', () => {
      const message = getErrorMessage('File is empty');
      
      expect(message).toContain('empty');
    });

    it('should return original message if no match', () => {
      const message = getErrorMessage('Unknown error');
      
      expect(message).toBe('Unknown error');
    });
  });

  describe('validateImageFile', () => {
    it('should validate a complete valid file', async () => {
      const pngBuffer = new Uint8Array([0x89, 0x50, 0x4e, 0x47]).buffer;
      const result = await validateImageFile(pngBuffer, 'test.png', 1024, 100, 100);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.format).toBe('png');
    });

    it('should return errors for invalid file', async () => {
      const emptyBuffer = new ArrayBuffer(0);
      const result = await validateImageFile(emptyBuffer, 'test.xyz', 0, 0, 0);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should add warnings for large images', async () => {
      const pngBuffer = new Uint8Array([0x89, 0x50, 0x4e, 0x47]).buffer;
      const result = await validateImageFile(pngBuffer, 'test.png', 1024, 5000, 5000);
      
      expect(result.warnings).toContainEqual(expect.stringContaining('Large image'));
    });

    it('should add warnings for non-standard formats', async () => {
      const bmpBuffer = new Uint8Array([0x42, 0x4d]).buffer;
      const result = await validateImageFile(bmpBuffer, 'test.bmp', 1024, 100, 100);
      
      expect(result.warnings).toContainEqual(expect.stringContaining('limited compatibility'));
    });
  });
});
