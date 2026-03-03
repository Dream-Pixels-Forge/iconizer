import React from 'react';
import { X, Moon, Sun, Monitor, FolderOpen, Layers, Cpu } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { cn } from '../../lib/utils';

interface SettingsPanelProps {
  onClose: () => void;
  showAbout?: boolean;
  onAboutClose?: () => void;
}

export default function SettingsPanel({ onClose, showAbout, onAboutClose }: SettingsPanelProps) {
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
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-xl animate-slide-in">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-lg font-semibold">Settings</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Theme Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Appearance
                </CardTitle>
                <CardDescription>
                  Choose your preferred theme
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <button
                  onClick={() => setTheme('light')}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-md border transition-colors',
                    theme === 'light' && 'border-primary bg-primary/5'
                  )}
                >
                  <Sun className="h-5 w-5" />
                  <span>Light</span>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-md border transition-colors',
                    theme === 'dark' && 'border-primary bg-primary/5'
                  )}
                >
                  <Moon className="h-5 w-5" />
                  <span>Dark</span>
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-md border transition-colors',
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
                <CardTitle className="text-base flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  Output
                </CardTitle>
                <CardDescription>
                  Configure output behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Default Organization
                  </label>
                  <select
                    value={defaultOrganization}
                    onChange={(e) => setDefaultOrganization(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
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
                <CardTitle className="text-base flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  Performance
                </CardTitle>
                <CardDescription>
                  Adjust processing settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="text-sm font-medium mb-2 block">
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
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
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
                  <CardDescription>
                    Version 1.0.0-mvp
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Iconizer is a powerful desktop application for batch image conversion 
                    and icon generation.
                  </p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Built with:</p>
                    <ul className="list-disc list-inside space-y-1">
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
