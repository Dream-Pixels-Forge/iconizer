import { describe, it, expect } from 'vitest';
import {
  DEFAULT_SHORTCUTS,
  SHORTCUT_CATEGORIES,
  formatShortcutKey,
  formatShortcut,
  matchesShortcut,
  type Shortcut,
} from './shortcuts';

describe('shortcuts', () => {
  describe('DEFAULT_SHORTCUTS', () => {
    it('should contain all default shortcuts', () => {
      expect(DEFAULT_SHORTCUTS.length).toBeGreaterThan(10);
    });

    it('should have valid structure for each shortcut', () => {
      DEFAULT_SHORTCUTS.forEach((shortcut: Shortcut) => {
        expect(shortcut).toHaveProperty('id');
        expect(shortcut).toHaveProperty('name');
        expect(shortcut).toHaveProperty('description');
        expect(shortcut).toHaveProperty('keys');
        expect(shortcut).toHaveProperty('category');
        expect(shortcut).toHaveProperty('enabled');
        expect(Array.isArray(shortcut.keys)).toBe(true);
      });
    });

    it('should have shortcuts in all categories', () => {
      const categories = new Set(DEFAULT_SHORTCUTS.map((s: Shortcut) => s.category));
      
      expect(categories).toContain('general');
      expect(categories).toContain('navigation');
      expect(categories).toContain('actions');
      expect(categories).toContain('view');
    });

    it('should have help shortcut enabled', () => {
      const helpShortcut = DEFAULT_SHORTCUTS.find((s) => s.id === 'help');
      
      expect(helpShortcut).toBeDefined();
      expect(helpShortcut?.enabled).toBe(true);
    });
  });

  describe('SHORTCUT_CATEGORIES', () => {
    it('should have all category definitions', () => {
      expect(SHORTCUT_CATEGORIES).toHaveProperty('general');
      expect(SHORTCUT_CATEGORIES).toHaveProperty('navigation');
      expect(SHORTCUT_CATEGORIES).toHaveProperty('actions');
      expect(SHORTCUT_CATEGORIES).toHaveProperty('view');
    });

    it('should have valid structure for each category', () => {
      Object.values(SHORTCUT_CATEGORIES).forEach((category) => {
        expect(category).toHaveProperty('label');
        expect(category).toHaveProperty('description');
      });
    });
  });

  describe('formatShortcutKey', () => {
    it('should format Control key for Windows', () => {
      // Mock Windows platform
      const originalPlatform = navigator.platform;
      Object.defineProperty(navigator, 'platform', {
        value: 'Win32',
        writable: true,
      });

      const result = formatShortcutKey('Control+Enter');
      expect(result).toContain('Ctrl');

      // Restore
      Object.defineProperty(navigator, 'platform', {
        value: originalPlatform,
        writable: true,
      });
    });

    it('should format Command key for macOS', () => {
      // Mock macOS platform
      const originalPlatform = navigator.platform;
      Object.defineProperty(navigator, 'platform', {
        value: 'MacIntel',
        writable: true,
      });

      const result = formatShortcutKey('Command+Enter');
      expect(result).toContain('⌘');

      // Restore
      Object.defineProperty(navigator, 'platform', {
        value: originalPlatform,
        writable: true,
      });
    });

    it('should format Shift key', () => {
      const result = formatShortcutKey('Shift+A');
      expect(result).toContain('⇧');
    });
  });

  describe('formatShortcut', () => {
    it('should format single key shortcut', () => {
      const shortcut = {
        id: 'test',
        name: 'Test',
        description: 'Test shortcut',
        keys: ['a'],
        category: 'general' as const,
        enabled: true,
      };

      const result = formatShortcut(shortcut);
      expect(result).toBe('A');
    });

    it('should format multi-key shortcut', () => {
      const shortcut = {
        id: 'test',
        name: 'Test',
        description: 'Test shortcut',
        keys: ['Control+S'],
        category: 'general' as const,
        enabled: true,
      };

      const result = formatShortcut(shortcut);
      expect(result).toContain('Ctrl');
      expect(result).toContain('S');
    });
  });

  describe('matchesShortcut', () => {
    it('should match simple key shortcut', () => {
      const shortcut = {
        id: 'test',
        name: 'Test',
        description: 'Test shortcut',
        keys: ['a'],
        category: 'general' as const,
        enabled: true,
      };

      const event = new KeyboardEvent('keydown', { key: 'a' });
      expect(matchesShortcut(event, shortcut)).toBe(true);
    });

    it('should match Control+key shortcut', () => {
      const shortcut = {
        id: 'test',
        name: 'Test',
        description: 'Test shortcut',
        keys: ['Control+S'],
        category: 'general' as const,
        enabled: true,
      };

      const event = new KeyboardEvent('keydown', {
        key: 's',
        ctrlKey: true,
      });
      expect(matchesShortcut(event, shortcut)).toBe(true);
    });

    it('should not match when Control is not pressed', () => {
      const shortcut = {
        id: 'test',
        name: 'Test',
        description: 'Test shortcut',
        keys: ['Control+S'],
        category: 'general' as const,
        enabled: true,
      };

      const event = new KeyboardEvent('keydown', {
        key: 's',
        ctrlKey: false,
      });
      expect(matchesShortcut(event, shortcut)).toBe(false);
    });

    it('should not match disabled shortcut', () => {
      const shortcut = {
        id: 'test',
        name: 'Test',
        description: 'Test shortcut',
        keys: ['a'],
        category: 'general' as const,
        enabled: false,
      };

      const event = new KeyboardEvent('keydown', { key: 'a' });
      expect(matchesShortcut(event, shortcut)).toBe(false);
    });

    it('should match Shift+key shortcut', () => {
      const shortcut = {
        id: 'test',
        name: 'Test',
        description: 'Test shortcut',
        keys: ['Shift+?'],
        category: 'general' as const,
        enabled: true,
      };

      const event = new KeyboardEvent('keydown', {
        key: '?',
        shiftKey: true,
      });
      expect(matchesShortcut(event, shortcut)).toBe(true);
    });
  });
});
