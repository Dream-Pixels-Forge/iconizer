import React, { useState } from 'react';
import { FolderOpen, Settings, Play } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';

export default function OutputPanel() {
  const { defaultOutputPath, defaultOrganization } = useSettingsStore();
  const [outputPath, setOutputPath] = useState(defaultOutputPath || '');
  const [isConverting, setIsConverting] = useState(false);

  const handleSelectFolder = async () => {
    // In Tauri, this would use the dialog plugin
    console.log('Opening folder dialog...');
  };

  const handleConvert = async () => {
    setIsConverting(true);
    // In Tauri, this would invoke the conversion command
    console.log('Starting conversion...');
    setTimeout(() => setIsConverting(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Output Location */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div>
            <h4 className="text-sm font-medium mb-2">Output Location</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={outputPath}
                onChange={(e) => setOutputPath(e.target.value)}
                placeholder="Select output folder..."
                className="flex-1 h-10 px-3 rounded-md border border-input bg-background text-sm"
                readOnly
              />
              <Button variant="outline" size="icon" onClick={handleSelectFolder}>
                <FolderOpen className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Organization</h4>
            <select
              defaultValue={defaultOrganization}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="flat">Flat (all files in one folder)</option>
              <option value="by-size">Organize by Size</option>
              <option value="by-format">Organize by Format</option>
              <option value="by-size-and-format">Organize by Size & Format</option>
            </select>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Naming Pattern</h4>
            <input
              type="text"
              defaultValue="{name}-{size}.{format}"
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm font-mono"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Variables: {'{name}'}, {'{size}'}, {'{format}'}, {'{width}'}, {'{height}'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardContent className="p-4">
          <h4 className="text-sm font-medium mb-3">Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Selected Sizes</span>
              <span>7</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Selected Formats</span>
              <span>2</span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t">
              <span>Total Outputs</span>
              <span>14 files</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Convert Button */}
      <Button
        className="w-full h-12 text-base"
        onClick={handleConvert}
        disabled={isConverting || !outputPath}
      >
        {isConverting ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin">⏳</span>
            Converting...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Convert Images
          </span>
        )}
      </Button>
    </div>
  );
}
