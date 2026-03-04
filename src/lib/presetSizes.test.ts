import { describe, it, expect } from 'vitest';
import {
  PRESET_SIZES,
  SIZE_CATEGORIES,
  QUICK_PRESETS,
  getSizesByCategory,
  getSizeById,
  getCategorySizes,
} from './presetSizes';
import type { PresetSize } from '../types';

describe('presetSizes', () => {
  describe('PRESET_SIZES', () => {
    it('should contain all preset sizes', () => {
      expect(PRESET_SIZES).toHaveLength(10);
    });

    it('should have valid structure for each size', () => {
      PRESET_SIZES.forEach((size: PresetSize) => {
        expect(size).toHaveProperty('id');
        expect(size).toHaveProperty('name');
        expect(size).toHaveProperty('width');
        expect(size).toHaveProperty('height');
        expect(size).toHaveProperty('description');
        expect(size).toHaveProperty('category');
      });
    });

    it('should include favicon sizes', () => {
      const faviconSizes = PRESET_SIZES.filter((s: PresetSize) => s.category === 'favicon');

      expect(faviconSizes.length).toBeGreaterThan(0);
      expect(faviconSizes.map((s: PresetSize) => s.id)).toContain('16x16');
    });

    it('should include app store sizes', () => {
      const appSizes = PRESET_SIZES.filter((s: PresetSize) => s.category === 'app');

      expect(appSizes.length).toBeGreaterThan(0);
      expect(appSizes.map((s: PresetSize) => s.id)).toContain('1024x1024');
    });
  });

  describe('SIZE_CATEGORIES', () => {
    it('should have all category definitions', () => {
      expect(SIZE_CATEGORIES).toHaveProperty('favicon');
      expect(SIZE_CATEGORIES).toHaveProperty('icon');
      expect(SIZE_CATEGORIES).toHaveProperty('app');
      expect(SIZE_CATEGORIES).toHaveProperty('social');
      expect(SIZE_CATEGORIES).toHaveProperty('other');
    });

    it('should have valid structure for each category', () => {
      Object.values(SIZE_CATEGORIES).forEach((category) => {
        expect(category).toHaveProperty('label');
        expect(category).toHaveProperty('description');
        expect(category).toHaveProperty('icon');
      });
    });
  });

  describe('QUICK_PRESETS', () => {
    it('should have all preset configurations', () => {
      expect(QUICK_PRESETS).toHaveProperty('web');
      expect(QUICK_PRESETS).toHaveProperty('mobile');
      expect(QUICK_PRESETS).toHaveProperty('desktop');
      expect(QUICK_PRESETS).toHaveProperty('all');
    });

    it('should have valid structure for each preset', () => {
      Object.values(QUICK_PRESETS).forEach((preset) => {
        const p = preset as typeof QUICK_PRESETS.web;
        expect(p).toHaveProperty('id');
        expect(p).toHaveProperty('name');
        expect(p).toHaveProperty('description');
        expect(p).toHaveProperty('sizes');
        expect(Array.isArray(p.sizes)).toBe(true);
      });
    });

    it('web preset should include favicon sizes', () => {
      const webPreset = QUICK_PRESETS.web;

      expect(webPreset.sizes).toContain('16x16');
      expect(webPreset.sizes).toContain('32x32');
    });

    it('mobile preset should include app sizes', () => {
      const mobilePreset = QUICK_PRESETS.mobile;

      expect(mobilePreset.sizes).toContain('512x512');
      expect(mobilePreset.sizes).toContain('1024x1024');
    });

    it('desktop preset should include icon sizes', () => {
      const desktopPreset = QUICK_PRESETS.desktop;

      expect(desktopPreset.sizes).toContain('48x48');
      expect(desktopPreset.sizes).toContain('128x128');
    });

    it('all preset should include all sizes', () => {
      const allPreset = QUICK_PRESETS.all;

      expect(allPreset.sizes).toHaveLength(PRESET_SIZES.length);
    });
  });

  describe('getSizesByCategory', () => {
    it('should return sizes for favicon category', () => {
      const sizes = getSizesByCategory('favicon');

      expect(sizes.length).toBeGreaterThan(0);
      expect(sizes.every((s: PresetSize) => s.category === 'favicon')).toBe(true);
    });

    it('should return sizes for icon category', () => {
      const sizes = getSizesByCategory('icon');

      expect(sizes.length).toBeGreaterThan(0);
      expect(sizes.every((s: PresetSize) => s.category === 'icon')).toBe(true);
    });

    it('should return empty array for social category (no sizes)', () => {
      const sizes = getSizesByCategory('social');

      expect(sizes).toEqual([]);
    });
  });

  describe('getSizeById', () => {
    it('should find size by id', () => {
      const size = getSizeById('512x512');

      expect(size).toBeDefined();
      expect(size?.name).toBe('512×512');
      expect(size?.width).toBe(512);
      expect(size?.height).toBe(512);
    });

    it('should return undefined for non-existent id', () => {
      const size = getSizeById('999x999');

      expect(size).toBeUndefined();
    });

    it('should find 16x16 size', () => {
      const size = getSizeById('16x16');

      expect(size).toBeDefined();
      expect(size?.category).toBe('favicon');
    });
  });

  describe('getCategorySizes', () => {
    it('should return sizes grouped by category', () => {
      const categories = getCategorySizes();

      expect(categories).toHaveProperty('favicon');
      expect(categories).toHaveProperty('icon');
      expect(categories).toHaveProperty('app');
    });

    it('should have correct number of sizes in each category', () => {
      const categories = getCategorySizes();

      expect(categories.favicon.length).toBeGreaterThan(0);
      expect(categories.icon.length).toBeGreaterThan(0);
      expect(categories.app.length).toBeGreaterThan(0);
    });

    it('should contain all preset sizes across categories', () => {
      const categories = getCategorySizes();
      const totalSizes = Object.values(categories).reduce((sum, sizes) => sum + sizes.length, 0);

      expect(totalSizes).toBe(PRESET_SIZES.length);
    });
  });
});
