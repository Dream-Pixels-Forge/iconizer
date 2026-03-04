import { describe, it, expect, beforeEach } from 'vitest';
import { useConfigStore } from './configStore';

describe('configStore', () => {
  beforeEach(() => {
    // Reset store to default state before each test
    useConfigStore.setState({
      selectedSizes: ['16x16', '32x32', '48x48', '64x64', '128x128', '256x256', '512x512'],
      customSizes: [],
      selectedFormats: ['png', 'ico'],
      quality: 90,
      maintainAspectRatio: true,
      backgroundColor: undefined,
    });
  });

  describe('toggleSize', () => {
    it('should add size when not selected', () => {
      const state = useConfigStore.getState();
      expect(state.selectedSizes).not.toContain('1024x1024');

      state.toggleSize('1024x1024');

      expect(useConfigStore.getState().selectedSizes).toContain('1024x1024');
    });

    it('should remove size when already selected', () => {
      const state = useConfigStore.getState();
      expect(state.selectedSizes).toContain('512x512');

      state.toggleSize('512x512');

      expect(useConfigStore.getState().selectedSizes).not.toContain('512x512');
    });
  });

  describe('selectAllSizes', () => {
    it('should select all preset sizes', () => {
      const state = useConfigStore.getState();
      state.selectAllSizes();

      expect(useConfigStore.getState().selectedSizes.length).toBeGreaterThan(5);
    });
  });

  describe('deselectAllSizes', () => {
    it('should deselect all sizes', () => {
      const state = useConfigStore.getState();
      state.deselectAllSizes();

      expect(useConfigStore.getState().selectedSizes).toHaveLength(0);
    });
  });

  describe('addCustomSize', () => {
    it('should add custom size to store', () => {
      const state = useConfigStore.getState();
      state.addCustomSize(200, 200);

      const newSize = useConfigStore.getState().customSizes[0];
      expect(newSize.width).toBe(200);
      expect(newSize.height).toBe(200);
    });

    it('should generate unique id for custom size', () => {
      const state = useConfigStore.getState();
      state.addCustomSize(100, 100);
      state.addCustomSize(150, 150);

      const sizes = useConfigStore.getState().customSizes;
      expect(sizes[0].id).not.toBe(sizes[1].id);
    });
  });

  describe('removeCustomSize', () => {
    it('should remove custom size by id', () => {
      const state = useConfigStore.getState();
      state.addCustomSize(100, 100);
      
      const sizeId = useConfigStore.getState().customSizes[0].id;
      state.removeCustomSize(sizeId);

      expect(useConfigStore.getState().customSizes).toHaveLength(0);
    });
  });

  describe('toggleFormat', () => {
    it('should add format when not selected', () => {
      const state = useConfigStore.getState();
      expect(state.selectedFormats).not.toContain('webp');

      state.toggleFormat('webp');

      expect(useConfigStore.getState().selectedFormats).toContain('webp');
    });

    it('should remove format when already selected', () => {
      const state = useConfigStore.getState();
      expect(state.selectedFormats).toContain('png');

      state.toggleFormat('png');

      expect(useConfigStore.getState().selectedFormats).not.toContain('png');
    });
  });

  describe('selectAllFormats', () => {
    it('should select all common formats', () => {
      const state = useConfigStore.getState();
      state.selectAllFormats();

      const formats = useConfigStore.getState().selectedFormats;
      expect(formats).toContain('png');
      expect(formats).toContain('jpg');
      expect(formats).toContain('webp');
    });
  });

  describe('deselectAllFormats', () => {
    it('should deselect all formats', () => {
      const state = useConfigStore.getState();
      state.deselectAllFormats();

      expect(useConfigStore.getState().selectedFormats).toHaveLength(0);
    });
  });

  describe('applyPreset', () => {
    it('should apply web preset sizes', () => {
      const state = useConfigStore.getState();
      state.applyPreset('web');

      const sizes = useConfigStore.getState().selectedSizes;
      expect(sizes).toContain('16x16');
      expect(sizes).toContain('32x32');
    });

    it('should apply mobile preset sizes', () => {
      const state = useConfigStore.getState();
      state.applyPreset('mobile');

      const sizes = useConfigStore.getState().selectedSizes;
      expect(sizes).toContain('96x96');
      expect(sizes).toContain('512x512');
    });

    it('should apply desktop preset sizes', () => {
      const state = useConfigStore.getState();
      state.applyPreset('desktop');

      const sizes = useConfigStore.getState().selectedSizes;
      expect(sizes).toContain('48x48');
      expect(sizes).toContain('256x256');
    });
  });

  describe('setQuality', () => {
    it('should update quality value', () => {
      const state = useConfigStore.getState();
      expect(state.quality).toBe(90);

      state.setQuality(75);

      expect(useConfigStore.getState().quality).toBe(75);
    });
  });

  describe('setMaintainAspectRatio', () => {
    it('should update maintainAspectRatio value', () => {
      const state = useConfigStore.getState();
      expect(state.maintainAspectRatio).toBe(true);

      state.setMaintainAspectRatio(false);

      expect(useConfigStore.getState().maintainAspectRatio).toBe(false);
    });
  });

  describe('reset', () => {
    it('should reset to default configuration', () => {
      const state = useConfigStore.getState();
      state.toggleSize('1024x1024');
      state.setQuality(50);

      state.reset();

      const newState = useConfigStore.getState();
      expect(newState.selectedSizes).not.toContain('1024x1024');
      expect(newState.quality).toBe(90);
    });
  });
});
