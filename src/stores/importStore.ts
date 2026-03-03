import { create } from 'zustand';
import type { ImportState, ImageMetadata } from '../types';

interface ImportStore extends ImportState {
  // Actions
  addImage: (image: ImageMetadata) => void;
  addImages: (images: ImageMetadata[]) => void;
  removeImage: (path: string) => void;
  clearAll: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useImportStore = create<ImportStore>((set) => ({
  images: [],
  isLoading: false,
  error: null,

  addImage: (image) =>
    set((state) => ({
      images: [...state.images, image],
    })),

  addImages: (images) =>
    set((state) => ({
      images: [...state.images, ...images],
    })),

  removeImage: (path) =>
    set((state) => ({
      images: state.images.filter((img) => img.path !== path),
    })),

  clearAll: () => set({ images: [], error: null }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),
}));
