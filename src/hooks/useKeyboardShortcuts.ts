import { useEffect, useCallback } from 'react';
import type { Shortcut } from '../lib/shortcuts';
import { matchesShortcut } from '../lib/shortcuts';

export interface UseKeyboardShortcutsOptions {
  /** Prevent shortcuts from firing when typing in inputs */
  ignoreWhenTyping?: boolean;
  /** Global shortcuts that work even when typing */
  globalShortcuts?: string[];
}

/**
 * Hook for managing keyboard shortcuts
 */
export function useKeyboardShortcuts(
  shortcuts: Shortcut[],
  handlers: Record<string, () => void>,
  options: UseKeyboardShortcutsOptions = {}
) {
  const { ignoreWhenTyping = true, globalShortcuts = [] } = options;

  /**
   * Check if user is currently typing in an input
   */
  const isTyping = useCallback((): boolean => {
    const activeElement = document.activeElement;
    if (!activeElement) return false;

    const tagName = activeElement.tagName.toLowerCase();
    const isInput =
      tagName === 'input' ||
      tagName === 'textarea' ||
      tagName === 'select' ||
      activeElement.getAttribute('contenteditable') === 'true';

    return isInput;
  }, []);

  /**
   * Handle keyboard event
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Skip if typing and not a global shortcut
      if (ignoreWhenTyping && isTyping()) {
        const isGlobal = globalShortcuts.some((id) => {
          const shortcut = shortcuts.find((s) => s.id === id);
          return shortcut && matchesShortcut(event, shortcut);
        });

        if (!isGlobal) return;
      }

      // Find matching shortcut
      const matchingShortcut = shortcuts.find((shortcut) =>
        matchesShortcut(event, shortcut)
      );

      if (matchingShortcut && handlers[matchingShortcut.id]) {
        event.preventDefault();
        handlers[matchingShortcut.id]();
      }
    },
    [shortcuts, handlers, ignoreWhenTyping, globalShortcuts, isTyping]
  );

  /**
   * Setup and cleanup event listener
   */
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

/**
 * Hook for managing shortcut help dialog visibility
 */
export function useShortcutHelp() {
  const { showShortcutHelp, setShowShortcutHelp } = useShortcutHelpStore();

  const toggleShortcutHelp = useCallback(() => {
    setShowShortcutHelp(!showShortcutHelp);
  }, [showShortcutHelp, setShowShortcutHelp]);

  return {
    showShortcutHelp,
    setShowShortcutHelp,
    toggleShortcutHelp,
  };
}

/**
 * Simple store for shortcut help dialog state
 */
import { useState } from 'react';

const shortcutHelpState: { show: boolean; callback: ((show: boolean) => void) | null } = {
  show: false,
  callback: null,
};

export function useShortcutHelpStore() {
  const [showShortcutHelp, setShowShortcutHelpInternal] = useState(false);

  const setShowShortcutHelp = useCallback((show: boolean) => {
    shortcutHelpState.show = show;
    shortcutHelpState.callback?.(show);
    setShowShortcutHelpInternal(show);
  }, []);

  // Subscribe to state changes
  useEffect(() => {
    const callback = (show: boolean) => {
      setShowShortcutHelpInternal(show);
    };

    shortcutHelpState.callback = callback;
    setShowShortcutHelpInternal(shortcutHelpState.show);

    return () => {
      shortcutHelpState.callback = null;
    };
  }, []);

  return { showShortcutHelp, setShowShortcutHelp };
}
