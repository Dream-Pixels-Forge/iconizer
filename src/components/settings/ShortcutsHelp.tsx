import { X } from 'lucide-react';
import { DEFAULT_SHORTCUTS, SHORTCUT_CATEGORIES, formatShortcut, type Shortcut } from '../../lib/shortcuts';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';

interface ShortcutsHelpProps {
  onClose: () => void;
}

/**
 * ShortcutsHelp dialog - Display all available keyboard shortcuts
 */
export default function ShortcutsHelp({ onClose }: ShortcutsHelpProps) {
  // Group shortcuts by category
  const shortcutsByCategory = Object.entries(SHORTCUT_CATEGORIES).map(([key, category]) => ({
    id: key,
    ...category,
    shortcuts: DEFAULT_SHORTCUTS.filter((s: Shortcut) => s.category === key && s.enabled),
  }));

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-background shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-6">
            <h2 id="shortcuts-title" className="text-lg font-semibold">
              Keyboard Shortcuts
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid gap-6 md:grid-cols-2">
              {shortcutsByCategory.map(
                (category) =>
                  category.shortcuts.length > 0 && (
                    <Card key={category.id}>
                      <CardContent className="p-4">
                        <h3 className="mb-1 text-sm font-semibold">{category.label}</h3>
                        <p className="mb-3 text-xs text-muted-foreground">
                          {category.description}
                        </p>

                        <div className="space-y-2">
                          {category.shortcuts.map((shortcut: Shortcut) => (
                            <div
                              key={shortcut.id}
                              className="flex items-center justify-between gap-2"
                            >
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">{shortcut.name}</p>
                                <p className="truncate text-xs text-muted-foreground">
                                  {shortcut.description}
                                </p>
                              </div>
                              <div className="flex shrink-0 gap-1">
                                {shortcut.keys.map((key: string, index: number) => (
                                  <kbd
                                    key={index}
                                    className={cn(
                                      'inline-flex min-h-[24px] min-w-[24px] items-center justify-center rounded-md border bg-muted px-2 py-1 text-xs font-medium font-mono',
                                      'shadow-sm'
                                    )}
                                  >
                                    {formatShortcut({ ...shortcut, keys: [key] })}
                                  </kbd>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )
              )}
            </div>

            {/* Tips Section */}
            <Card className="mt-6">
              <CardContent className="p-4">
                <h3 className="mb-2 text-sm font-semibold">Tips</h3>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li>Press <kbd className="rounded border bg-muted px-1 font-mono">?</kbd> anytime to open this help</li>
                  <li>Shortcuts work globally except when typing in text fields</li>
                  <li>Use number keys <kbd className="rounded border bg-muted px-1 font-mono">1</kbd>-<kbd className="rounded border bg-muted px-1 font-mono">4</kbd> to quickly navigate between sections</li>
                  <li>On macOS, <kbd className="rounded border bg-muted px-1 font-mono">⌘</kbd> replaces <kbd className="rounded border bg-muted px-1 font-mono">Ctrl</kbd></li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="border-t p-4">
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
