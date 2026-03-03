import { X, Moon, Sun, Monitor, FolderOpen, Cpu } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { cn } from '../../lib/utils';

interface SettingsPanelProps {
  onClose: () => void;
  showAbout?: boolean;
}

export default function SettingsPanel({ onClose, showAbout }: SettingsPanelProps) {
  const {
    theme,
    setTheme,
    defaultOrganization,
    setDefaultOrganization,
    rememberLastPath,
    setRememberLastPath,
    openFolderAfterCompletion,
    setOpenFolderAfterCompletion,
    maxConcurrentJobs,
    setMaxConcurrentJobs,
  } = useSettingsStore();

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md animate-slide-in bg-background shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-6">
            <h2 className="text-lg font-semibold">Settings</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-6 overflow-y-auto p-6">
            {/* Theme Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Monitor className="h-5 w-5" />
                  Appearance
                </CardTitle>
                <CardDescription>Choose your preferred theme</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <button
                  onClick={() => setTheme('light')}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-md border p-3 transition-colors',
                    theme === 'light' && 'border-primary bg-primary/5'
                  )}
                >
                  <Sun className="h-5 w-5" />
                  <span>Light</span>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-md border p-3 transition-colors',
                    theme === 'dark' && 'border-primary bg-primary/5'
                  )}
                >
                  <Moon className="h-5 w-5" />
                  <span>Dark</span>
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-md border p-3 transition-colors',
                    theme === 'system' && 'border-primary bg-primary/5'
                  )}
                >
                  <Monitor className="h-5 w-5" />
                  <span>System</span>
                </button>
              </CardContent>
            </Card>

            {/* Output Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FolderOpen className="h-5 w-5" />
                  Output
                </CardTitle>
                <CardDescription>Configure output behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Default Organization</label>
                  <select
                    value={defaultOrganization}
                    onChange={(e) =>
                      setDefaultOrganization(
                        e.target.value as 'flat' | 'by-size' | 'by-format' | 'by-size-and-format'
                      )
                    }
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="flat">Flat</option>
                    <option value="by-size">By Size</option>
                    <option value="by-format">By Format</option>
                    <option value="by-size-and-format">By Size & Format</option>
                  </select>
                </div>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={rememberLastPath}
                    onChange={(e) => setRememberLastPath(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">Remember last output location</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={openFolderAfterCompletion}
                    onChange={(e) => setOpenFolderAfterCompletion(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">Open folder after conversion</span>
                </label>
              </CardContent>
            </Card>

            {/* Performance Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Cpu className="h-5 w-5" />
                  Performance
                </CardTitle>
                <CardDescription>Adjust processing settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Maximum Concurrent Jobs: {maxConcurrentJobs}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={maxConcurrentJobs}
                    onChange={(e) => setMaxConcurrentJobs(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    <span>1 (Slow)</span>
                    <span>8 (Fast)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            {showAbout && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">About Iconizer</CardTitle>
                  <CardDescription>Version 1.0.0-mvp</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Iconizer is a powerful desktop application for batch image conversion and icon
                    generation.
                  </p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>Built with:</p>
                    <ul className="list-inside list-disc space-y-1">
                      <li>Tauri v2</li>
                      <li>React 18</li>
                      <li>TypeScript</li>
                      <li>Sharp (libvips)</li>
                    </ul>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    © 2026 Dream Pixels Forge. MIT License.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
