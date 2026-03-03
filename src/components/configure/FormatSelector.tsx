import React from 'react';
import { CheckCheck } from 'lucide-react';
import { useConfigStore } from '../../stores/configStore';
import { SUPPORTED_FORMATS } from '../../lib/supportedFormats';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Card, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';

export default function FormatSelector() {
  const { selectedFormats, toggleFormat, selectAllFormats, deselectAllFormats } = useConfigStore();

  return (
    <div className="space-y-4">
      {/* Select All / Deselect All */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {selectedFormats.length} of {SUPPORTED_FORMATS.length} selected
        </span>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={selectAllFormats}
            className="h-8 text-xs"
          >
            <CheckCheck className="h-4 w-4 mr-1" />
            Select All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={deselectAllFormats}
            className="h-8 text-xs"
          >
            Deselect All
          </Button>
        </div>
      </div>

      {/* Format Grid */}
      <div className="grid gap-3">
        {SUPPORTED_FORMATS.map((format) => {
          const isSelected = selectedFormats.includes(format.id);
          return (
            <Card key={format.id}>
              <CardContent className="p-4">
                <label
                  className={cn(
                    'flex items-start space-x-3 cursor-pointer',
                    isSelected && 'text-primary'
                  )}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleFormat(format.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{format.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                        .{format.id}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {format.description}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {format.supportsTransparency && (
                        <span className="text-xs px-2 py-0.5 rounded bg-green-500/10 text-green-600 dark:text-green-400">
                          Transparency
                        </span>
                      )}
                      {format.qualitySettings && (
                        <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          Quality Settings
                        </span>
                      )}
                    </div>
                  </div>
                </label>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
