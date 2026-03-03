import { create } from 'zustand';
import type { ConversionConfig, ImageFormat } from '../types';
import { QUICK_PRESETS, PRESET_SIZES } from '../lib/presetSizes';

interface ConfigState extends ConversionConfig {
  // Actions
  toggleSize: (sizeId: string) => void;
  selectAllSizes: () => void;
  deselectAllSizes: () => void;
  addCustomSize: (width: number, height: number) => void;
  removeCustomSize: (id: string) => void;
  toggleFormat: (format: ImageFormat) => void;
  selectAllFormats: () => void;
  deselectAllFormats: () => void;
  applyPreset: (presetId: keyof typeof QUICK_PRESETS) => void;
  setQuality: (quality: number) => void;
  setMaintainAspectRatio: (value: boolean) => void;
  setBackgroundColor: (color: string | undefined) => void;
  reset: () => void;
}

const defaultConfig: ConversionConfig = {
  selectedSizes: ['16x16', '32x32', '48x48', '64x64', '128x128', '256x256', '512x512'],
  customSizes: [],
  selectedFormats: ['png', 'ico'],
  quality: 90,
  maintainAspectRatio: true,
  backgroundColor: undefined,
};

export const useConfigStore = create<ConfigState>((set) => ({
  ...defaultConfig,

  toggleSize: (sizeId) =>
    set((state) => {
      const isSelected = state.selectedSizes.includes(sizeId);
      return {
        selectedSizes: isSelected
          ? state.selectedSizes.filter((id) => id !== sizeId)
          : [...state.selectedSizes, sizeId],
      };
    }),

  selectAllSizes: () => set({ selectedSizes: PRESET_SIZES.map((s) => s.id) }),

  deselectAllSizes: () => set({ selectedSizes: [] }),

  addCustomSize: (width, height) =>
    set((state) => ({
      customSizes: [
        ...state.customSizes,
        {
          id: `custom-${Date.now()}`,
          width,
          height,
          maintainAspectRatio: false,
        },
      ],
    })),

  removeCustomSize: (id) =>
    set((state) => ({
      customSizes: state.customSizes.filter((size) => size.id !== id),
    })),

  toggleFormat: (format) =>
    set((state) => {
      const isSelected = state.selectedFormats.includes(format);
      return {
        selectedFormats: isSelected
          ? state.selectedFormats.filter((f) => f !== format)
          : [...state.selectedFormats, format],
      };
    }),

  selectAllFormats: () => set({ selectedFormats: ['png', 'jpg', 'webp', 'ico', 'bmp'] }),

  deselectAllFormats: () => set({ selectedFormats: [] }),

  applyPreset: (presetId) => {
    const preset = QUICK_PRESETS[presetId];
    if (preset) {
      set({ selectedSizes: [...preset.sizes] });
    }
  },

  setQuality: (quality) => set({ quality }),

  setMaintainAspectRatio: (value) => set({ maintainAspectRatio: value }),

  setBackgroundColor: (color) => set({ backgroundColor: color }),

  reset: () => set(defaultConfig),
}));
