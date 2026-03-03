import React, { useState, useCallback } from 'react';
import { Plus, Lock, Unlock } from 'lucide-react';
import { useConfigStore } from '../../stores/configStore';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface CustomSizeInputProps {
  onSizeAdded?: (width: number, height: number) => void;
}

/**
 * Minimum and maximum allowed dimensions
 */
const MIN_DIMENSION = 1;
const MAX_DIMENSION = 10000;

/**
 * CustomSizeInput component - Allows users to add custom image sizes
 */
export default function CustomSizeInput({ onSizeAdded }: CustomSizeInputProps) {
  const { addCustomSize, customSizes, removeCustomSize } = useConfigStore();

  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Validate dimension input
   */
  const validateDimension = useCallback((value: string): number | null => {
    if (!value || value.trim() === '') return null;

    const num = parseInt(value, 10);
    if (isNaN(num)) return null;

    if (num < MIN_DIMENSION || num > MAX_DIMENSION) {
      return null;
    }

    return num;
  }, []);

  /**
   * Handle width change with aspect ratio lock
   */
  const handleWidthChange = useCallback(
    (value: string) => {
      setWidth(value);
      setError(null);

      if (maintainAspectRatio && width && height) {
        const currentWidth = parseInt(width, 10);
        const currentHeight = parseInt(height, 10);

        if (!isNaN(currentWidth) && currentWidth > 0) {
          const ratio = currentHeight / currentWidth;
          const newWidth = validateDimension(value);

          if (newWidth) {
            const newHeight = Math.round(newWidth * ratio);
            setHeight(newHeight.toString());
          }
        }
      }
    },
    [maintainAspectRatio, width, height, validateDimension]
  );

  /**
   * Handle height change with aspect ratio lock
   */
  const handleHeightChange = useCallback(
    (value: string) => {
      setHeight(value);
      setError(null);

      if (maintainAspectRatio && width && height) {
        const currentWidth = parseInt(width, 10);
        const currentHeight = parseInt(height, 10);

        if (!isNaN(currentHeight) && currentHeight > 0) {
          const ratio = currentWidth / currentHeight;
          const newHeight = validateDimension(value);

          if (newHeight) {
            const newWidth = Math.round(newHeight * ratio);
            setWidth(newWidth.toString());
          }
        }
      }
    },
    [maintainAspectRatio, width, height, validateDimension]
  );

  /**
   * Handle adding custom size
   */
  const handleAddSize = useCallback(() => {
    const validWidth = validateDimension(width);
    const validHeight = validateDimension(height);

    if (!validWidth || !validHeight) {
      setError(`Please enter valid dimensions between ${MIN_DIMENSION} and ${MAX_DIMENSION}`);
      return;
    }

    // Check for duplicate
    const isDuplicate = customSizes.some(
      (size) => size.width === validWidth && size.height === validHeight
    );

    if (isDuplicate) {
      setError('This size already exists');
      return;
    }

    // Add the custom size
    addCustomSize(validWidth, validHeight);
    onSizeAdded?.(validWidth, validHeight);

    // Reset inputs
    setWidth('');
    setHeight('');
    setError(null);
  }, [width, height, validateDimension, customSizes, addCustomSize, onSizeAdded]);

  /**
   * Handle key press for submit
   */
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleAddSize();
      }
    },
    [handleAddSize]
  );

  const hasValidInputs = validateDimension(width) !== null && validateDimension(height) !== null;

  return (
    <Card className="w-full">
      <CardContent className="space-y-4 p-4">
        <div>
          <h3 className="mb-3 text-sm font-semibold">Add Custom Size</h3>

          <div className="grid grid-cols-2 gap-4">
            {/* Width Input */}
            <div className="space-y-2">
              <Label htmlFor="custom-width">Width (px)</Label>
              <Input
                id="custom-width"
                type="number"
                min={MIN_DIMENSION}
                max={MAX_DIMENSION}
                value={width}
                onChange={(e) => handleWidthChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., 100"
                className="w-full"
              />
            </div>

            {/* Height Input */}
            <div className="space-y-2">
              <Label htmlFor="custom-height">Height (px)</Label>
              <Input
                id="custom-height"
                type="number"
                min={MIN_DIMENSION}
                max={MAX_DIMENSION}
                value={height}
                onChange={(e) => handleHeightChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., 100"
                className="w-full"
              />
            </div>
          </div>

          {/* Aspect Ratio Lock */}
          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setMaintainAspectRatio(!maintainAspectRatio)}
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {maintainAspectRatio ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
              <span>{maintainAspectRatio ? 'Lock aspect ratio' : 'Unlock aspect ratio'}</span>
            </button>

            <Button size="sm" onClick={handleAddSize} disabled={!hasValidInputs} className="gap-1">
              <Plus className="h-4 w-4" />
              Add Size
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <p className="mt-2 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </div>

        {/* Custom Sizes List */}
        {customSizes.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Added Custom Sizes</h4>
            <div className="grid gap-2">
              {customSizes.map((size) => (
                <div
                  key={size.id}
                  className="flex items-center justify-between rounded-md border bg-card p-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-xs font-medium">
                      {size.width}×{size.height}
                    </div>
                    <span className="text-sm font-medium">Custom Size</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCustomSize(size.id)}
                    className="h-8 text-xs text-destructive hover:text-destructive"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
