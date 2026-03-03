import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppSettings } from '../types';

interface SettingsState extends AppSettings {
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setDefaultOutputPath: (path: string) => void;
  setDefaultOrganization: (organization: AppSettings['defaultOrganization']) => void;
  setRememberLastPath: (value: boolean) => void;
  setOpenFolderAfterCompletion: (value: boolean) => void;
  setMaxConcurrentJobs: (value: number) => void;
  resetToDefaults: () => void;
}

const defaultSettings: AppSettings = {
  theme: 'system',
  defaultOrganization: 'flat',
  defaultNamingPattern: '{name}-{size}.{format}',
  rememberLastPath: true,
  openFolderAfterCompletion: true,
  maxConcurrentJobs: 4,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      
      setTheme: (theme) => set({ theme }),
      
      setDefaultOutputPath: (path) => set({ defaultOutputPath: path }),
      
      setDefaultOrganization: (organization) => set({ defaultOrganization: organization }),
      
      setRememberLastPath: (value) => set({ rememberLastPath: value }),
      
      setOpenFolderAfterCompletion: (value) => set({ openFolderAfterCompletion: value }),
      
      setMaxConcurrentJobs: (value) => set({ maxConcurrentJobs: value }),
      
      resetToDefaults: () => set(defaultSettings),
    }),
    {
      name: 'iconizer-settings',
    }
  )
);
