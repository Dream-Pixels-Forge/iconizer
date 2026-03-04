import { useCallback, useState } from 'react';
import { FolderOpen, Folder } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { useSettingsStore } from '../../stores/settingsStore';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { cn } from '../../lib/utils';

interface DirectorySelectorProps {
  onDirectorySelected?: (path: string) => void;
  className?: string;
}

/**
 * DirectorySelector component - Allows users to select output folder
 */
export default function DirectorySelector({
  onDirectorySelected,
  className,
}: DirectorySelectorProps) {
  const { defaultOutputPath, rememberLastPath, setDefaultOutputPath, setRememberLastPath } =
    useSettingsStore();

  const [outputPath, setOutputPath] = useState(defaultOutputPath || '');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle opening folder dialog using Tauri
   */
  const handleSelectFolder = useCallback(async () => {
    try {
      setIsLoading(true);

      // Use Tauri dialog plugin to select folder
      const selected = await invoke<string | undefined>('select_folder');

      if (selected) {
        setOutputPath(selected);

        if (onDirectorySelected) {
          onDirectorySelected(selected);
        }

        // Remember as default if option is enabled
        if (rememberLastPath) {
          setDefaultOutputPath(selected);
        }
      }
    } catch (error) {
      console.error('Failed to select folder:', error);
      // User cancelled or error
    } finally {
      setIsLoading(false);
    }
  }, [onDirectorySelected, rememberLastPath, setDefaultOutputPath]);

  /**
   * Handle clearing the output path
   */
  const handleClearPath = useCallback(() => {
    setOutputPath('');
    onDirectorySelected?.('');
  }, [onDirectorySelected]);

  return (
    <Card className={cn('w-full', className)}>
      <CardContent className="space-y-4 p-4">
        <div className="space-y-2">
          <Label htmlFor="output-path">Output Location</Label>

          <div className="flex gap-2">
            <input
              id="output-path"
              type="text"
              value={outputPath}
              readOnly
              placeholder="Select output folder..."
              className={cn(
                'h-10 flex-1 rounded-md border px-3',
                'bg-background font-mono text-sm',
                'focus:outline-none focus:ring-2 focus:ring-ring',
                !outputPath && 'italic text-muted-foreground'
              )}
            />

            <Button
              variant="outline"
              size="icon"
              onClick={handleSelectFolder}
              disabled={isLoading}
              title="Browse for folder"
            >
              <FolderOpen className="h-4 w-4" />
            </Button>

            {outputPath && (
              <Button variant="ghost" size="icon" onClick={handleClearPath} title="Clear selection">
                <Folder className="h-4 w-4" />
              </Button>
            )}
          </div>

          {!outputPath && (
            <p className="text-xs text-muted-foreground">
              No folder selected. Click the folder icon to choose an output location.
            </p>
          )}
        </div>

        {/* Remember Last Path Option */}
        <div className="flex items-center gap-2 border-t pt-2">
          <input
            type="checkbox"
            id="remember-path"
            checked={rememberLastPath}
            onChange={(e) => setRememberLastPath(e.target.checked)}
            className="h-4 w-4"
          />
          <Label htmlFor="remember-path" className="cursor-pointer text-sm">
            Remember as default location
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
