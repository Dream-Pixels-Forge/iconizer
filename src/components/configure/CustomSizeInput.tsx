import React, { useState, useCallback } from 'react';
import { Plus, Lock, Unlock, Trash2 } from 'lucide-react';
import { useConfigStore } from '../../stores/configStore';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { cn } from '../../lib/utils';

interface CustomSizeInputProps {
  className?: string;
}

/**
 * Minimum and maximum allowed dimensions
 */
const MIN_DIMENSION = 1;
const MAX_DIMENSION = 10000;

/**
 * CustomSizeInput component - Allow users to add custom image sizes
 */
export default function CustomSizeInput({ className }: CustomSizeInputProps) {
  const { customSizes, addCustomSize, removeCustomSize } = useConfigStore();

  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Validate dimension input
   */
  const validateDimension = useCallback((value: string): number | null => {
    const num = parseInt(value, 10);
    if (isNaN(num)) return null;
    if (num < MIN_DIMENSION) return MIN_DIMENSION;
    if (num > MAX_DIMENSION) return MAX_DIMENSION;
    return num;
  }, []);

  /**
   * Handle width change with aspect ratio lock
   */
  const handleWidthChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setWidth(value);
      setError(null);

      // If aspect ratio is locked and we have a height, adjust height
      if (maintainAspectRatio && height) {
        const widthNum = validateDimension(value);
        const heightNum = validateDimension(height);
        if (widthNum && heightNum) {
          // Simple 1:1 aspect ratio lock for now
          setHeight(value);
        }
      }
    },
    [maintainAspectRatio, height, validateDimension]
  );

  /**
   * Handle height change with aspect ratio lock
   */
  const handleHeightChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setHeight(value);
      setError(null);

      // If aspect ratio is locked and we have a width, adjust width
      if (maintainAspectRatio && width) {
        const widthNum = validateDimension(width);
        const heightNum = validateDimension(value);
        if (widthNum && heightNum) {
          // Simple 1:1 aspect ratio lock for now
          setWidth(value);
        }
      }
    },
    [maintainAspectRatio, width, validateDimension]
  );

  /**
   * Handle adding custom size
   */
  const handleAddSize = useCallback(() => {
    const widthNum = validateDimension(width);
    const heightNum = validateDimension(height);

    if (!widthNum || !heightNum) {
      setError('Please enter valid dimensions');
      return;
    }

    // Check for duplicate size
    const isDuplicate = customSizes.some(
      (size) => size.width === widthNum && size.height === heightNum
    );

    if (isDuplicate) {
      setError('This size already exists');
      return;
    }

    addCustomSize(widthNum, heightNum);
    setWidth('');
    setHeight('');
    setError(null);
  }, [width, height, customSizes, validateDimension, addCustomSize]);

  /**
   * Handle key press for Enter key
   */
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleAddSize();
      }
    },
    [handleAddSize]
  );

  return (
    <Card className={cn('w-full', className)}>
      <CardContent className="space-y-4 p-4">
        <div>
          <Label>Custom Size</Label>
          <p className="mt-1 text-sm text-muted-foreground">
            Add custom dimensions not available in presets
          </p>
        </div>

        {/* Width and Height Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="custom-width">Width (px)</Label>
            <Input
              id="custom-width"
              type="number"
              min={MIN_DIMENSION}
              max={MAX_DIMENSION}
              value={width}
              onChange={handleWidthChange}
              onKeyPress={handleKeyPress}
              placeholder="e.g., 200"
              className={cn(error && 'border-destructive')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-height">Height (px)</Label>
            <Input
              id="custom-height"
              type="number"
              min={MIN_DIMENSION}
              max={MAX_DIMENSION}
              value={height}
              onChange={handleHeightChange}
              onKeyPress={handleKeyPress}
              placeholder="e.g., 200"
              className={cn(error && 'border-destructive')}
            />
          </div>
        </div>

        {/* Aspect Ratio Lock */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="aspect-ratio-lock"
            checked={maintainAspectRatio}
            onCheckedChange={(checked) => setMaintainAspectRatio(checked as boolean)}
          />
          <label
            htmlFor="aspect-ratio-lock"
            className="flex cursor-pointer items-center gap-2 text-sm font-medium"
          >
            {maintainAspectRatio ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
            Lock aspect ratio (1:1)
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        {/* Add Button */}
        <Button
          onClick={handleAddSize}
          disabled={!width || !height}
          className="w-full"
          variant="default"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Custom Size
        </Button>

        {/* Custom Sizes List */}
        {customSizes.length > 0 && (
          <div className="space-y-2 border-t pt-4">
            <Label>Added Custom Sizes</Label>
            <div className="grid gap-2">
              {customSizes.map((size) => (
                <div
                  key={size.id}
                  className="flex items-center justify-between rounded-md border bg-muted/50 p-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-background font-mono text-xs font-medium">
                      {size.width}×{size.height}
                    </div>
                    <span className="text-sm font-medium">
                      {size.width} × {size.height} px
                    </span>
                    {size.maintainAspectRatio && <Lock className="h-3 w-3 text-muted-foreground" />}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCustomSize(size.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Helper Text */}
        <div className="border-t pt-2">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> Custom sizes will be generated along with preset sizes during
            conversion.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
