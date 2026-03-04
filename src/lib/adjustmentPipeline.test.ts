/**
 * Adjustment Pipeline Tests (v1.1.0)
 */

import { describe, it, expect } from 'vitest';
import {
  applyBrightness,
  applyContrast,
  applySaturation,
  applyHueRotation,
  applyGrayscale,
  applySepia,
  validateAdjustments,
  getDefaultAdjustments,
  hasAdjustments,
} from './adjustmentPipeline';

// Helper to create test image data
function createTestData(
  width: number,
  height: number,
  r: number,
  g: number,
  b: number,
  a: number = 255
): ImageData {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    data[i + 3] = a;
  }
  return new ImageData(data, width, height);
}

describe('Adjustment Pipeline', () => {
  describe('applyBrightness', () => {
    it('should increase brightness with positive values', () => {
      const testData = createTestData(1, 1, 100, 100, 100);
      const result = applyBrightness(testData, 50);
      
      expect(result.data[0]).toBeGreaterThan(100);
      expect(result.data[1]).toBeGreaterThan(100);
      expect(result.data[2]).toBeGreaterThan(100);
    });

    it('should decrease brightness with negative values', () => {
      const testData = createTestData(1, 1, 150, 150, 150);
      const result = applyBrightness(testData, -50);
      
      expect(result.data[0]).toBeLessThan(150);
      expect(result.data[1]).toBeLessThan(150);
      expect(result.data[2]).toBeLessThan(150);
    });

    it('should not modify alpha channel', () => {
      const testData = createTestData(1, 1, 100, 100, 100, 200);
      const result = applyBrightness(testData, 50);
      
      expect(result.data[3]).toBe(200);
    });

    it('should clamp values to 0-255 range', () => {
      const testData = createTestData(1, 1, 200, 200, 200);
      const result = applyBrightness(testData, 100);
      
      expect(result.data[0]).toBeLessThanOrEqual(255);
      expect(result.data[1]).toBeLessThanOrEqual(255);
      expect(result.data[2]).toBeLessThanOrEqual(255);
    });
  });

  describe('applyContrast', () => {
    it('should increase contrast with positive values', () => {
      const testData = createTestData(1, 1, 150, 150, 150);
      const result = applyContrast(testData, 50);
      
      expect(result.data[0]).toBeGreaterThan(150);
    });

    it('should decrease contrast with negative values', () => {
      const testData = createTestData(1, 1, 150, 150, 150);
      const result = applyContrast(testData, -50);
      
      expect(result.data[0]).toBeLessThan(150);
    });

    it('should not affect mid-gray (128) significantly', () => {
      const testData = createTestData(1, 1, 128, 128, 128);
      const result = applyContrast(testData, 50);
      
      // Mid-gray should stay close to mid-gray
      expect(Math.abs(result.data[0] - 128)).toBeLessThan(10);
    });
  });

  describe('applySaturation', () => {
    it('should increase saturation with positive values', () => {
      const testData = createTestData(1, 1, 200, 100, 50);
      const result = applySaturation(testData, 50);
      
      // Saturated colors should be more extreme
      expect(result.data[0]).toBeGreaterThan(200);
    });

    it('should decrease saturation with negative values', () => {
      const testData = createTestData(1, 1, 200, 100, 50);
      const result = applySaturation(testData, -50);
      
      // Desaturated colors should move toward gray
      const gray = 0.299 * 200 + 0.587 * 100 + 0.114 * 50;
      expect(Math.abs(result.data[0] - gray)).toBeLessThan(Math.abs(200 - gray));
    });

    it('should not affect already gray pixels', () => {
      const testData = createTestData(1, 1, 128, 128, 128);
      const result = applySaturation(testData, 50);
      
      expect(result.data[0]).toBe(128);
      expect(result.data[1]).toBe(128);
      expect(result.data[2]).toBe(128);
    });
  });

  describe('applyHueRotation', () => {
    it('should rotate hue by specified degrees', () => {
      const testData = createTestData(1, 1, 255, 0, 0); // Red
      const result = applyHueRotation(testData, 120);
      
      // Rotating red by 120° should give a different color
      expect(result.data[0]).not.toBe(255);
    });

    it('should preserve brightness', () => {
      const testData = createTestData(1, 1, 200, 100, 50);
      const originalBrightness = 0.299 * testData.data[0] + 
                                  0.587 * testData.data[1] + 
                                  0.114 * testData.data[2];
      
      const result = applyHueRotation(testData, 90);
      
      const newBrightness = 0.299 * result.data[0] + 
                            0.587 * result.data[1] + 
                            0.114 * result.data[2];
      
      // Brightness should be similar after hue rotation
      expect(Math.abs(newBrightness - originalBrightness)).toBeLessThan(30);
    });

    it('should handle 360 degree rotation (full circle)', () => {
      const testData = createTestData(1, 1, 200, 100, 50);
      const result = applyHueRotation(testData, 360);
      
      // Should be very close to original
      expect(Math.abs(result.data[0] - testData.data[0])).toBeLessThan(10);
    });
  });

  describe('applyGrayscale', () => {
    it('should convert color to grayscale', () => {
      const testData = createTestData(1, 1, 200, 100, 50);
      const result = applyGrayscale(testData);
      
      // All RGB channels should be equal
      expect(result.data[0]).toBe(result.data[1]);
      expect(result.data[1]).toBe(result.data[2]);
    });

    it('should preserve brightness in grayscale', () => {
      const testData = createTestData(1, 1, 200, 100, 50);
      const originalBrightness = 0.299 * testData.data[0] + 
                                  0.587 * testData.data[1] + 
                                  0.114 * testData.data[2];
      
      const result = applyGrayscale(testData);
      
      // Grayscale value should equal original brightness
      expect(Math.abs(result.data[0] - originalBrightness)).toBeLessThan(1);
    });
  });

  describe('applySepia', () => {
    it('should apply sepia tone', () => {
      const testData = createTestData(1, 1, 200, 200, 200);
      const result = applySepia(testData);
      
      // Sepia should have more red than blue
      expect(result.data[0]).toBeGreaterThan(result.data[2]);
    });

    it('should maintain relative brightness', () => {
      const testData = createTestData(1, 1, 200, 100, 50);
      const result = applySepia(testData);
      
      // Lighter pixels should still be lighter
      expect(result.data[0]).toBeGreaterThan(150);
    });
  });

  describe('validateAdjustments', () => {
    it('should accept valid adjustments', () => {
      const valid = {
        brightness: 50,
        contrast: -30,
        saturation: 0,
        hue: 180,
        vibrance: 25,
        blur: 5,
        sharpen: 3,
      };
      
      const result = validateAdjustments(valid);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject brightness out of range', () => {
      const invalid = { brightness: 150 };
      const result = validateAdjustments(invalid);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Brightness must be between -100 and 100');
    });

    it('should reject hue out of range', () => {
      const invalid = { hue: 400 };
      const result = validateAdjustments(invalid);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Hue must be between 0 and 360 degrees');
    });

    it('should reject blur out of range', () => {
      const invalid = { blur: 25 };
      const result = validateAdjustments(invalid);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Blur must be between 0 and 20px');
    });

    it('should reject watermark opacity out of range', () => {
      const invalid = { 
        watermark: { 
          type: 'text' as const,
          position: 'center' as any,
          opacity: 150,
        },
      };
      const result = validateAdjustments(invalid);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Watermark opacity must be between 0 and 100');
    });

    it('should validate multiple errors', () => {
      const invalid = { brightness: 150, hue: 400 };
      const result = validateAdjustments(invalid);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('getDefaultAdjustments', () => {
    it('should return default adjustment values', () => {
      const defaults = getDefaultAdjustments();
      
      expect(defaults.brightness).toBe(0);
      expect(defaults.contrast).toBe(0);
      expect(defaults.saturation).toBe(0);
      expect(defaults.hue).toBe(0);
      expect(defaults.vibrance).toBe(0);
      expect(defaults.grayscale).toBe(false);
      expect(defaults.sepia).toBe(false);
      expect(defaults.blur).toBe(0);
      expect(defaults.sharpen).toBe(0);
      expect(defaults.rotate).toBe(0);
      expect(defaults.flipHorizontal).toBe(false);
      expect(defaults.flipVertical).toBe(false);
      expect(defaults.watermark).toBeUndefined();
    });
  });

  describe('hasAdjustments', () => {
    it('should return false for default values', () => {
      const defaults = getDefaultAdjustments();
      expect(hasAdjustments(defaults)).toBe(false);
    });

    it('should return true for non-default values', () => {
      const adjusted = { brightness: 50 };
      expect(hasAdjustments(adjusted)).toBe(true);
    });

    it('should return false for empty object', () => {
      expect(hasAdjustments({})).toBe(false);
    });

    it('should detect non-default watermark', () => {
      const withWatermark = {
        watermark: {
          type: 'text' as const,
          text: 'Test',
          position: 'bottom-right' as const,
          opacity: 80,
        },
      };
      expect(hasAdjustments(withWatermark)).toBe(true);
    });
  });
});
