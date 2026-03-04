/**
 * Keyboard shortcut definition
 */
export interface Shortcut {
  id: string;
  name: string;
  description: string;
  keys: string[];
  category: 'general' | 'navigation' | 'actions' | 'view';
  enabled: boolean;
}

/**
 * Default keyboard shortcuts for Iconizer
 */
export const DEFAULT_SHORTCUTS: Shortcut[] = [
  // General
  {
    id: 'help',
    name: 'Keyboard Shortcuts',
    description: 'Show keyboard shortcuts help',
    keys: ['?', 'Shift+/'],
    category: 'general',
    enabled: true,
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'Open settings panel',
    keys: [','],
    category: 'general',
    enabled: true,
  },

  // Navigation
  {
    id: 'focus-import',
    name: 'Focus Import',
    description: 'Focus import section',
    keys: ['1'],
    category: 'navigation',
    enabled: true,
  },
  {
    id: 'focus-sizes',
    name: 'Focus Sizes',
    description: 'Focus sizes selection',
    keys: ['2'],
    category: 'navigation',
    enabled: true,
  },
  {
    id: 'focus-formats',
    name: 'Focus Formats',
    description: 'Focus formats selection',
    keys: ['3'],
    category: 'navigation',
    enabled: true,
  },
  {
    id: 'focus-output',
    name: 'Focus Output',
    description: 'Focus output section',
    keys: ['4'],
    category: 'navigation',
    enabled: true,
  },

  // Actions
  {
    id: 'browse-files',
    name: 'Browse Files',
    description: 'Open file browser',
    keys: ['o', 'Control+O'],
    category: 'actions',
    enabled: true,
  },
  {
    id: 'convert',
    name: 'Convert',
    description: 'Start conversion',
    keys: ['Control+Enter', 'Command+Enter'],
    category: 'actions',
    enabled: true,
  },
  {
    id: 'clear-all',
    name: 'Clear All',
    description: 'Clear all imported images',
    keys: ['Control+Delete', 'Command+Delete'],
    category: 'actions',
    enabled: true,
  },
  {
    id: 'select-all-sizes',
    name: 'Select All Sizes',
    description: 'Select all preset sizes',
    keys: ['Control+A'],
    category: 'actions',
    enabled: true,
  },

  // View
  {
    id: 'toggle-theme',
    name: 'Toggle Theme',
    description: 'Switch between light/dark theme',
    keys: ['t'],
    category: 'view',
    enabled: true,
  },
  {
    id: 'zoom-in',
    name: 'Zoom In',
    description: 'Zoom in on preview',
    keys: ['+', 'Control+='],
    category: 'view',
    enabled: true,
  },
  {
    id: 'zoom-out',
    name: 'Zoom Out',
    description: 'Zoom out on preview',
    keys: ['-', 'Control+-'],
    category: 'view',
    enabled: true,
  },
  {
    id: 'reset-zoom',
    name: 'Reset Zoom',
    description: 'Reset zoom to 100%',
    keys: ['0'],
    category: 'view',
    enabled: true,
  },
];

/**
 * Shortcut categories for grouping
 */
export const SHORTCUT_CATEGORIES = {
  general: {
    label: 'General',
    description: 'Application-wide shortcuts',
  },
  navigation: {
    label: 'Navigation',
    description: 'Navigate between sections',
  },
  actions: {
    label: 'Actions',
    description: 'Common actions',
  },
  view: {
    label: 'View',
    description: 'View controls',
  },
} as const;

/**
 * Platform-specific modifier key display
 */
export function formatShortcutKey(key: string): string {
  const platform = navigator.platform.toLowerCase();
  const isMac = platform.includes('mac');

  let result = key
    .replace(/Control/g, isMac ? '⌘' : 'Ctrl')
    .replace(/Command/g, '⌘')
    .replace(/Shift/g, '⇧')
    .replace(/Alt/g, isMac ? '⌥' : 'Alt')
    .replace(/Delete/g, 'Del')
    .replace(/Enter/g, '↵');

  // Uppercase single character keys (like 'a' -> 'A')
  if (result.length === 1 && /[a-z]/.test(result)) {
    result = result.toUpperCase();
  }

  return result;
}

/**
 * Format shortcut keys for display
 */
export function formatShortcut(shortcut: Shortcut): string {
  return shortcut.keys.map(formatShortcutKey).join(' or ');
}

/**
 * Check if keyboard event matches a shortcut
 */
export function matchesShortcut(event: KeyboardEvent, shortcut: Shortcut): boolean {
  if (!shortcut.enabled) return false;

  return shortcut.keys.some((keyCombo) => {
    const keys = keyCombo.split('+').map((k) => k.trim().toLowerCase());

    const hasControl = keys.includes('control') || keys.includes('command');
    const hasShift = keys.includes('shift');
    const hasAlt = keys.includes('alt');

    const mainKey = keys.find(
      (k) => k !== 'control' && k !== 'command' && k !== 'shift' && k !== 'alt'
    );

    // Check modifier keys
    if (hasControl && !event.ctrlKey && !event.metaKey) return false;
    if (hasShift && !event.shiftKey) return false;
    if (hasAlt && !event.altKey) return false;

    // Check main key
    if (mainKey) {
      const eventKey = event.key.toLowerCase();
      const isSpecialKey =
        mainKey === 'enter' || mainKey === 'delete' || mainKey === '+' || mainKey === '-';

      if (isSpecialKey) {
        return eventKey === mainKey;
      }

      // For single character keys, check both key and code
      return eventKey === mainKey || event.code.toLowerCase() === `key${mainKey}`;
    }

    // For special keys like '?' or '/'
    if (keys.length === 1 && !hasControl && !hasShift && !hasAlt) {
      return event.key === keyCombo;
    }

    return false;
  });
}
