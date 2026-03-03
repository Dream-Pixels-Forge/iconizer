import React from 'react';
import { FolderOpen, Folder } from 'lucide-react';
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

  const [outputPath, setOutputPath] = React.useState(defaultOutputPath || '');

  /**
   * Handle opening folder dialog
   */
  const handleSelectFolder = async () => {
    try {
      // In Tauri, this would use the dialog plugin
      // const selected = await open({ directory: true, multiple: false });

      // For now, simulate with a prompt (will be replaced with Tauri dialog)
      console.log('Opening folder dialog...');

      // Mock implementation - replace with Tauri dialog
      const mockPath = outputPath || 'C:\\Users\\User\\Pictures\\Iconizer Output';
      setOutputPath(mockPath);

      if (onDirectorySelected) {
        onDirectorySelected(mockPath);
      }

      // Remember as default if option is enabled
      if (rememberLastPath) {
        setDefaultOutputPath(mockPath);
      }
    } catch (error) {
      console.error('Failed to select folder:', error);
    }
  };

  /**
   * Handle clearing the output path
   */
  const handleClearPath = () => {
    setOutputPath('');
    onDirectorySelected?.('');
  };

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
