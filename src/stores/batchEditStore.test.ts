/**
 * Batch Edit Store Tests (v1.1.0)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useBatchEditStore } from './batchEditStore';

describe('Batch Edit Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useBatchEditStore.setState({
      currentAdjustments: {
        brightness: 0,
        contrast: 0,
        saturation: 0,
        hue: 0,
        vibrance: 0,
        redBalance: 0,
        greenBalance: 0,
        blueBalance: 0,
        grayscale: false,
        sepia: false,
        blur: 0,
        sharpen: 0,
        rotate: 0,
        flipHorizontal: false,
        flipVertical: false,
        crop: undefined,
        watermark: undefined,
      },
      selectedImages: [],
      presets: [],
      history: [],
      historyIndex: -1,
      isApplying: false,
      batchProgress: 0,
      batchResults: { success: 0, failed: 0, skipped: 0 },
      activePanel: 'adjustments',
      showPreview: true,
      previewMode: 'slider',
    });
  });

  describe('Adjustment Actions', () => {
    it('should set brightness adjustment', () => {
      const { setAdjustment, currentAdjustments } = useBatchEditStore.getState();
      
      setAdjustment('brightness', 50);
      
      expect(useBatchEditStore.getState().currentAdjustments.brightness).toBe(50);
    });

    it('should set multiple adjustments at once', () => {
      const { setMultipleAdjustments } = useBatchEditStore.getState();
      
      setMultipleAdjustments({
        brightness: 30,
        contrast: -20,
        saturation: 10,
      });
      
      const state = useBatchEditStore.getState();
      expect(state.currentAdjustments.brightness).toBe(30);
      expect(state.currentAdjustments.contrast).toBe(-20);
      expect(state.currentAdjustments.saturation).toBe(10);
    });

    it('should reset individual adjustment', () => {
      const { setAdjustment, resetAdjustment } = useBatchEditStore.getState();
      
      setAdjustment('brightness', 50);
      expect(useBatchEditStore.getState().currentAdjustments.brightness).toBe(50);
      
      resetAdjustment('brightness');
      expect(useBatchEditStore.getState().currentAdjustments.brightness).toBe(0);
    });

    it('should reset all adjustments', () => {
      const { setMultipleAdjustments, resetAllAdjustments } = useBatchEditStore.getState();
      
      setMultipleAdjustments({
        brightness: 50,
        contrast: 30,
        hue: 180,
      });
      
      resetAllAdjustments();
      
      const state = useBatchEditStore.getState();
      expect(state.currentAdjustments.brightness).toBe(0);
      expect(state.currentAdjustments.contrast).toBe(0);
      expect(state.currentAdjustments.hue).toBe(0);
    });
  });

  describe('Image Selection Actions', () => {
    it('should select images', () => {
      const { selectImages, selectedImages } = useBatchEditStore.getState();
      
      selectImages(['/path/to/image1.png', '/path/to/image2.png']);
      
      expect(useBatchEditStore.getState().selectedImages).toHaveLength(2);
      expect(useBatchEditStore.getState().selectedImages).toContain('/path/to/image1.png');
    });

    it('should add to selection', () => {
      const { selectImages, addToSelection } = useBatchEditStore.getState();
      
      selectImages(['/path/to/image1.png']);
      addToSelection('/path/to/image2.png');
      
      const state = useBatchEditStore.getState();
      expect(state.selectedImages).toHaveLength(2);
      expect(state.selectedImages).toContain('/path/to/image2.png');
    });

    it('should not add duplicate to selection', () => {
      const { selectImages, addToSelection } = useBatchEditStore.getState();
      
      selectImages(['/path/to/image1.png']);
      addToSelection('/path/to/image1.png');
      
      expect(useBatchEditStore.getState().selectedImages).toHaveLength(1);
    });

    it('should remove from selection', () => {
      const { selectImages, removeFromSelection } = useBatchEditStore.getState();
      
      selectImages(['/path/to/image1.png', '/path/to/image2.png']);
      removeFromSelection('/path/to/image1.png');
      
      expect(useBatchEditStore.getState().selectedImages).toHaveLength(1);
      expect(useBatchEditStore.getState().selectedImages).not.toContain('/path/to/image1.png');
    });

    it('should clear selection', () => {
      const { selectImages, clearSelection } = useBatchEditStore.getState();
      
      selectImages(['/path/to/image1.png', '/path/to/image2.png']);
      clearSelection();
      
      expect(useBatchEditStore.getState().selectedImages).toHaveLength(0);
    });
  });

  describe('Preset Actions', () => {
    it('should save preset', () => {
      const { setAdjustment, savePreset, presets } = useBatchEditStore.getState();
      
      setAdjustment('brightness', 50);
      savePreset('Bright', 'Increased brightness');
      
      const state = useBatchEditStore.getState();
      expect(state.presets).toHaveLength(1);
      expect(state.presets[0].name).toBe('Bright');
      expect(state.presets[0].adjustments.brightness).toBe(50);
    });

    it('should load preset', () => {
      const { savePreset, loadPreset, currentAdjustments } = useBatchEditStore.getState();
      
      // Save preset with brightness 50
      useBatchEditStore.getState().setAdjustment('brightness', 50);
      savePreset('Bright', 'Test preset');
      
      // Reset adjustments
      useBatchEditStore.getState().resetAllAdjustments();
      expect(useBatchEditStore.getState().currentAdjustments.brightness).toBe(0);
      
      // Load preset
      const presetId = useBatchEditStore.getState().presets[0].id;
      loadPreset(presetId);
      
      expect(useBatchEditStore.getState().currentAdjustments.brightness).toBe(50);
    });

    it('should delete preset', () => {
      const { savePreset, deletePreset, presets } = useBatchEditStore.getState();
      
      savePreset('Test', 'Test preset');
      expect(useBatchEditStore.getState().presets).toHaveLength(1);
      
      const presetId = useBatchEditStore.getState().presets[0].id;
      deletePreset(presetId);
      
      expect(useBatchEditStore.getState().presets).toHaveLength(0);
    });
  });

  describe('Undo/Redo Actions', () => {
    it('should undo adjustment', () => {
      const { setAdjustment, undo, currentAdjustments } = useBatchEditStore.getState();
      
      // Make adjustment
      setAdjustment('brightness', 50);
      expect(useBatchEditStore.getState().currentAdjustments.brightness).toBe(50);
      
      // Undo
      undo();
      
      expect(useBatchEditStore.getState().currentAdjustments.brightness).toBe(0);
    });

    it('should redo adjustment', () => {
      const { setAdjustment, undo, redo } = useBatchEditStore.getState();
      
      // Make adjustment
      setAdjustment('brightness', 50);
      
      // Undo
      undo();
      expect(useBatchEditStore.getState().currentAdjustments.brightness).toBe(0);
      
      // Redo
      redo();
      
      expect(useBatchEditStore.getState().currentAdjustments.brightness).toBe(50);
    });

    it('should limit history size', () => {
      const { setAdjustment, history } = useBatchEditStore.getState();
      
      // Make 25 adjustments (more than MAX_HISTORY_SIZE of 20)
      for (let i = 0; i < 25; i++) {
        setAdjustment('brightness', i);
      }
      
      expect(useBatchEditStore.getState().history.length).toBeLessThanOrEqual(20);
    });

    it('should clear future history on new adjustment', () => {
      const { setAdjustment, undo, redo } = useBatchEditStore.getState();
      
      // Make adjustments
      setAdjustment('brightness', 10);
      setAdjustment('brightness', 20);
      setAdjustment('brightness', 30);
      
      // Undo twice
      undo();
      undo();
      
      // Make new adjustment (should clear redo history)
      setAdjustment('brightness', 99);
      
      // Redo should not work anymore
      redo();
      
      expect(useBatchEditStore.getState().currentAdjustments.brightness).toBe(99);
    });
  });

  describe('UI Actions', () => {
    it('should set active panel', () => {
      const { setActivePanel, activePanel } = useBatchEditStore.getState();
      
      expect(activePanel).toBe('adjustments');
      
      setActivePanel('filters');
      expect(useBatchEditStore.getState().activePanel).toBe('filters');
      
      setActivePanel('transform');
      expect(useBatchEditStore.getState().activePanel).toBe('transform');
    });

    it('should set preview mode', () => {
      const { setPreviewMode, previewMode } = useBatchEditStore.getState();
      
      expect(previewMode).toBe('slider');
      
      setPreviewMode('split');
      expect(useBatchEditStore.getState().previewMode).toBe('split');
      
      setPreviewMode('before');
      expect(useBatchEditStore.getState().previewMode).toBe('before');
    });

    it('should toggle preview', () => {
      const { togglePreview, showPreview } = useBatchEditStore.getState();
      
      expect(showPreview).toBe(true);
      
      togglePreview();
      expect(useBatchEditStore.getState().showPreview).toBe(false);
      
      togglePreview();
      expect(useBatchEditStore.getState().showPreview).toBe(true);
    });
  });

  describe('History Management', () => {
    it('should add to history on adjustment', () => {
      const { setAdjustment, history } = useBatchEditStore.getState();
      
      expect(history).toHaveLength(0);
      
      setAdjustment('brightness', 50);
      
      expect(useBatchEditStore.getState().history).toHaveLength(1);
      expect(useBatchEditStore.getState().history[0].action).toBe('adjustment');
    });

    it('should add to history on preset load', () => {
      const { savePreset, loadPreset } = useBatchEditStore.getState();
      
      // Save and load preset
      useBatchEditStore.getState().setAdjustment('brightness', 50);
      savePreset('Test', 'Test');
      
      useBatchEditStore.getState().resetAllAdjustments();
      const presetId = useBatchEditStore.getState().presets[0].id;
      loadPreset(presetId);
      
      const state = useBatchEditStore.getState();
      const lastHistoryEntry = state.history[state.history.length - 1];
      expect(lastHistoryEntry.action).toBe('preset-applied');
      expect(lastHistoryEntry.presetId).toBe(presetId);
    });

    it('should clear history', () => {
      const { setAdjustment, clearHistory } = useBatchEditStore.getState();
      
      setAdjustment('brightness', 50);
      expect(useBatchEditStore.getState().history).toHaveLength(1);
      
      clearHistory();
      
      expect(useBatchEditStore.getState().history).toHaveLength(0);
    });
  });
});
