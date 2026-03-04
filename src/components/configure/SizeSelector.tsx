import { useState } from 'react';
import { CheckCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { useConfigStore } from '../../stores/configStore';
import {
  PRESET_SIZES,
  SIZE_CATEGORIES,
  getCategorySizes,
  QUICK_PRESETS,
} from '../../lib/presetSizes';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Card, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';
import CustomSizeInput from './CustomSizeInput';

export default function SizeSelector() {
  const { selectedSizes, toggleSize, selectAllSizes, deselectAllSizes, applyPreset, customSizes } =
    useConfigStore();
  const categories = getCategorySizes();
  const [showCustomSizeInput, setShowCustomSizeInput] = useState(false);

  const totalSelected = selectedSizes.length + customSizes.length;
  const totalAvailable = PRESET_SIZES.length;

  return (
    <div className="space-y-4">
      {/* Quick Presets */}
      <div className="flex flex-wrap gap-2">
        {Object.values(QUICK_PRESETS).map((preset) => (
          <Button
            key={preset.id}
            variant="outline"
            size="sm"
            onClick={() => applyPreset(preset.id as keyof typeof QUICK_PRESETS)}
            className="text-xs"
          >
            {preset.name}
          </Button>
        ))}
      </div>

      {/* Select All / Deselect All */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {totalSelected} of {totalAvailable}+ selected
        </span>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={selectAllSizes} className="h-8 text-xs">
            <CheckCheck className="mr-1 h-4 w-4" />
            Select All Presets
          </Button>
          <Button variant="ghost" size="sm" onClick={deselectAllSizes} className="h-8 text-xs">
            Deselect All
          </Button>
        </div>
      </div>

      {/* Custom Size Input Toggle */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowCustomSizeInput(!showCustomSizeInput)}
        className="w-full"
      >
        {showCustomSizeInput ? (
          <>
            <ChevronUp className="mr-2 h-4 w-4" />
            Hide Custom Size Input
          </>
        ) : (
          <>
            <ChevronDown className="mr-2 h-4 w-4" />
            Add Custom Size
          </>
        )}
      </Button>

      {/* Custom Size Input (conditionally rendered) */}
      {showCustomSizeInput && <CustomSizeInput />}

      {/* Size Categories */}
      <div className="space-y-4">
        {Object.entries(categories).map(([category, sizes]) => (
          <Card key={category}>
            <CardContent className="p-4">
              <div className="mb-3">
                <h4 className="text-sm font-medium">
                  {SIZE_CATEGORIES[category as keyof typeof SIZE_CATEGORIES].icon}{' '}
                  {SIZE_CATEGORIES[category as keyof typeof SIZE_CATEGORIES].label}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {SIZE_CATEGORIES[category as keyof typeof SIZE_CATEGORIES].description}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map((size) => {
                  const isSelected = selectedSizes.includes(size.id);
                  return (
                    <label
                      key={size.id}
                      className={cn(
                        'flex cursor-pointer items-center space-x-2 rounded-md border p-2 transition-colors',
                        isSelected ? 'border-primary bg-primary/5' : 'border-input hover:bg-accent'
                      )}
                    >
                      <Checkbox checked={isSelected} onCheckedChange={() => toggleSize(size.id)} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{size.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{size.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
