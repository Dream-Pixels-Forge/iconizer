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
          <Button variant="ghost" size="sm" onClick={selectAllFormats} className="h-8 text-xs">
            <CheckCheck className="mr-1 h-4 w-4" />
            Select All
          </Button>
          <Button variant="ghost" size="sm" onClick={deselectAllFormats} className="h-8 text-xs">
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
                    'flex cursor-pointer items-start space-x-3',
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
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                        .{format.id}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{format.description}</p>
                    <div className="mt-2 flex gap-2">
                      {format.supportsTransparency && (
                        <span className="rounded bg-green-500/10 px-2 py-0.5 text-xs text-green-600 dark:text-green-400">
                          Transparency
                        </span>
                      )}
                      {format.qualitySettings && (
                        <span className="rounded bg-blue-500/10 px-2 py-0.5 text-xs text-blue-600 dark:text-blue-400">
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
