import type { PresetSize } from '../types';

/**
 * Preset sizes for icon generation
 */
export const PRESET_SIZES: PresetSize[] = [
  // Favicon sizes
  {
    id: '16x16',
    name: '16×16',
    width: 16,
    height: 16,
    description: 'Browser favicon',
    category: 'favicon',
  },
  {
    id: '24x24',
    name: '24×24',
    width: 24,
    height: 24,
    description: 'Small icon',
    category: 'favicon',
  },
  {
    id: '32x32',
    name: '32×32',
    width: 32,
    height: 32,
    description: 'Taskbar icon',
    category: 'favicon',
  },
  
  // Icon sizes
  {
    id: '48x48',
    name: '48×48',
    width: 48,
    height: 48,
    description: 'Desktop icon',
    category: 'icon',
  },
  {
    id: '64x64',
    name: '64×64',
    width: 64,
    height: 64,
    description: 'Application icon',
    category: 'icon',
  },
  {
    id: '96x96',
    name: '96×96',
    width: 96,
    height: 96,
    description: 'Android launcher',
    category: 'icon',
  },
  {
    id: '128x128',
    name: '128×128',
    width: 128,
    height: 128,
    description: 'macOS small icon',
    category: 'icon',
  },
  
  // App sizes
  {
    id: '256x256',
    name: '256×256',
    width: 256,
    height: 256,
    description: 'macOS icon, Windows icon',
    category: 'app',
  },
  {
    id: '512x512',
    name: '512×512',
    width: 512,
    height: 512,
    description: 'PWA icon, Android',
    category: 'app',
  },
  {
    id: '1024x1024',
    name: '1024×1024',
    width: 1024,
    height: 1024,
    description: 'App Store, Play Store',
    category: 'app',
  },
];

/**
 * Size categories for grouping
 */
export const SIZE_CATEGORIES = {
  favicon: {
    label: 'Favicon',
    description: 'Browser and small icons',
    icon: '🌐',
  },
  icon: {
    label: 'Icons',
    description: 'Desktop and application icons',
    icon: '🖼️',
  },
  app: {
    label: 'App Stores',
    description: 'App store and large icons',
    icon: '📱',
  },
  social: {
    label: 'Social Media',
    description: 'Social media profile pictures',
    icon: '📸',
  },
  other: {
    label: 'Other',
    description: 'Custom sizes',
    icon: '⚙️',
  },
} as const;

/**
 * Quick preset configurations
 */
export const QUICK_PRESETS = {
  web: {
    id: 'web',
    name: 'Web',
    description: 'Essential web icons',
    sizes: ['16x16', '32x32', '48x48'],
  },
  mobile: {
    id: 'mobile',
    name: 'Mobile',
    description: 'Mobile app icons',
    sizes: ['96x96', '512x512', '1024x1024'],
  },
  desktop: {
    id: 'desktop',
    name: 'Desktop',
    description: 'Desktop application icons',
    sizes: ['48x48', '64x64', '128x128', '256x256'],
  },
  all: {
    id: 'all',
    name: 'All Sizes',
    description: 'Generate all preset sizes',
    sizes: PRESET_SIZES.map(s => s.id),
  },
} as const;

/**
 * Get sizes by category
 */
export function getSizesByCategory(category: keyof typeof SIZE_CATEGORIES): PresetSize[] {
  return PRESET_SIZES.filter(size => size.category === category);
}

/**
 * Get size by ID
 */
export function getSizeById(id: string): PresetSize | undefined {
  return PRESET_SIZES.find(size => size.id === id);
}

/**
 * Get category sizes with counts
 */
export function getCategorySizes(): Record<string, PresetSize[]> {
  const categories: Record<string, PresetSize[]> = {};
  
  for (const size of PRESET_SIZES) {
    if (!categories[size.category]) {
      categories[size.category] = [];
    }
    categories[size.category].push(size);
  }
  
  return categories;
}
