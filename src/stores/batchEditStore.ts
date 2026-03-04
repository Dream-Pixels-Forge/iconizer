/**
 * Batch Editing Store (v1.1.0)
 * 
 * Manages state for batch image editing including:
 * - Current adjustments
 * - Image selection
 * - Presets
 * - Undo/redo history
 * - Batch processing state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  Adjustments, 
  AdjustmentPreset, 
  AdjustmentHistoryEntry,
  BatchEditState,
  AdjustmentAction 
} from '../types';

// Default adjustment values
const DEFAULT_ADJUSTMENTS: Adjustments = {
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
};

// Initial state
const initialState: BatchEditState = {
  currentAdjustments: { ...DEFAULT_ADJUSTMENTS },
  selectedImages: [],
  presets: [],
  history: [],
  historyIndex: -1,
  isApplying: false,
  batchProgress: 0,
  batchResults: {
    success: 0,
    failed: 0,
    skipped: 0,
  },
  activePanel: 'adjustments',
  showPreview: true,
  previewMode: 'slider',
};

// Maximum history size for undo/redo
const MAX_HISTORY_SIZE = 20;

interface BatchEditStore extends BatchEditState {
  // Adjustment actions
  setAdjustment: <K extends keyof Adjustments>(key: K, value: Adjustments[K]) => void;
  setMultipleAdjustments: (adjustments: Partial<Adjustments>) => void;
  resetAdjustment: <K extends keyof Adjustments>(key: K) => void;
  resetAllAdjustments: () => void;
  
  // Image selection actions
  selectImages: (imagePaths: string[]) => void;
  addToSelection: (imagePath: string) => void;
  removeFromSelection: (imagePath: string) => void;
  clearSelection: () => void;
  
  // Preset actions
  savePreset: (name: string, description?: string) => void;
  loadPreset: (presetId: string) => void;
  deletePreset: (presetId: string) => void;
  
  // Undo/redo actions
  undo: () => void;
  redo: () => void;
  
  // Batch actions
  applyBatch: () => Promise<void>;
  cancelBatch: () => void;
  
  // UI actions
  setActivePanel: (panel: BatchEditState['activePanel']) => void;
  setPreviewMode: (mode: BatchEditState['previewMode']) => void;
  togglePreview: () => void;
  
  // Helper actions
  addToHistory: (adjustments: Partial<Adjustments>, action: AdjustmentHistoryEntry['action'], presetId?: string) => void;
  clearHistory: () => void;
}

/**
 * Create batch edit store
 */
export const useBatchEditStore = create<BatchEditStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ========================================
      // Adjustment Actions
      // ========================================

      setAdjustment: (key, value) => {
        const currentState = get();
        
        // Add to history before making change
        get().addToHistory({ [key]: value }, 'adjustment');
        
        set({
          currentAdjustments: {
            ...currentState.currentAdjustments,
            [key]: value,
          },
        });
      },

      setMultipleAdjustments: (adjustments) => {
        const currentState = get();
        
        // Add to history before making change
        get().addToHistory(adjustments, 'adjustment');
        
        set({
          currentAdjustments: {
            ...currentState.currentAdjustments,
            ...adjustments,
          },
        });
      },

      resetAdjustment: (key) => {
        const currentState = get();
        
        // Add to history before reset
        get().addToHistory({ [key]: DEFAULT_ADJUSTMENTS[key] }, 'reset');
        
        set({
          currentAdjustments: {
            ...currentState.currentAdjustments,
            [key]: DEFAULT_ADJUSTMENTS[key],
          },
        });
      },

      resetAllAdjustments: () => {
        const currentState = get();
        
        // Add to history before reset
        get().addToHistory({ ...DEFAULT_ADJUSTMENTS }, 'reset');
        
        set({
          currentAdjustments: { ...DEFAULT_ADJUSTMENTS },
        });
      },

      // ========================================
      // Image Selection Actions
      // ========================================

      selectImages: (imagePaths) => {
        set({ selectedImages: imagePaths });
      },

      addToSelection: (imagePath) => {
        const currentState = get();
        if (!currentState.selectedImages.includes(imagePath)) {
          set({
            selectedImages: [...currentState.selectedImages, imagePath],
          });
        }
      },

      removeFromSelection: (imagePath) => {
        const currentState = get();
        set({
          selectedImages: currentState.selectedImages.filter(
            path => path !== imagePath
          ),
        });
      },

      clearSelection: () => {
        set({ selectedImages: [] });
      },

      // ========================================
      // Preset Actions
      // ========================================

      savePreset: (name, description) => {
        const currentState = get();
        const now = Date.now();
        
        const newPreset: AdjustmentPreset = {
          id: `preset_${now}_${Math.random().toString(36).substr(2, 9)}`,
          name,
          description,
          adjustments: { ...currentState.currentAdjustments },
          createdAt: now,
          updatedAt: now,
          isDefault: false,
        };
        
        set({
          presets: [...currentState.presets, newPreset],
        });
      },

      loadPreset: (presetId) => {
        const currentState = get();
        const preset = currentState.presets.find(p => p.id === presetId);
        
        if (preset) {
          // Add to history before applying
          get().addToHistory(preset.adjustments, 'preset-applied', presetId);
          
          set({
            currentAdjustments: {
              ...DEFAULT_ADJUSTMENTS,
              ...preset.adjustments,
            },
          });
        }
      },

      deletePreset: (presetId) => {
        const currentState = get();
        set({
          presets: currentState.presets.filter(p => p.id !== presetId),
        });
      },

      // ========================================
      // Undo/Redo Actions
      // ========================================

      undo: () => {
        const currentState = get();
        
        if (currentState.historyIndex > 0) {
          const newIndex = currentState.historyIndex - 1;
          const previousEntry = currentState.history[newIndex];
          
          set({
            currentAdjustments: {
              ...DEFAULT_ADJUSTMENTS,
              ...previousEntry.adjustments,
            },
            historyIndex: newIndex,
          });
        }
      },

      redo: () => {
        const currentState = get();
        
        if (currentState.historyIndex < currentState.history.length - 1) {
          const newIndex = currentState.historyIndex + 1;
          const nextEntry = currentState.history[newIndex];
          
          set({
            currentAdjustments: {
              ...DEFAULT_ADJUSTMENTS,
              ...nextEntry.adjustments,
            },
            historyIndex: newIndex,
          });
        }
      },

      // ========================================
      // Batch Actions
      // ========================================

      applyBatch: async () => {
        set({ isApplying: true, batchProgress: 0 });
        
        const currentState = get();
        const totalImages = currentState.selectedImages.length;
        
        if (totalImages === 0) {
          set({ isApplying: false });
          return;
        }
        
        // TODO: Implement actual batch processing with Tauri backend
        // This is a placeholder for the actual implementation
        
        let success = 0;
        let failed = 0;
        let skipped = 0;
        
        for (let i = 0; i < totalImages; i++) {
          try {
            // Simulate processing (replace with actual Tauri command)
            await new Promise(resolve => setTimeout(resolve, 100));
            
            success++;
            set({
              batchProgress: ((i + 1) / totalImages) * 100,
              batchResults: { success, failed, skipped },
            });
          } catch (error) {
            failed++;
            set({
              batchProgress: ((i + 1) / totalImages) * 100,
              batchResults: { success, failed, skipped },
            });
          }
        }
        
        set({ isApplying: false });
      },

      cancelBatch: () => {
        set({ 
          isApplying: false, 
          batchProgress: 0,
          batchResults: { success: 0, failed: 0, skipped: 0 },
        });
      },

      // ========================================
      // UI Actions
      // ========================================

      setActivePanel: (panel) => {
        set({ activePanel: panel });
      },

      setPreviewMode: (mode) => {
        set({ previewMode: mode });
      },

      togglePreview: () => {
        const currentState = get();
        set({ showPreview: !currentState.showPreview });
      },

      // ========================================
      // Helper Actions
      // ========================================

      addToHistory: (adjustments, action, presetId) => {
        const currentState = get();
        
        const newEntry: AdjustmentHistoryEntry = {
          id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
          adjustments,
          action,
          presetId,
        };
        
        // Remove any future history if we're not at the end
        const newHistory = currentState.history.slice(0, currentState.historyIndex + 1);
        
        // Add new entry
        newHistory.push(newEntry);
        
        // Limit history size
        if (newHistory.length > MAX_HISTORY_SIZE) {
          newHistory.shift();
        }
        
        set({
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      clearHistory: () => {
        set({ history: [], historyIndex: -1 });
      },
    }),
    {
      name: 'iconizer-batch-edit',
      partialize: (state) => ({
        presets: state.presets,
        // Don't persist current adjustments, selection, or processing state
      }),
    }
  )
);

export default useBatchEditStore;
