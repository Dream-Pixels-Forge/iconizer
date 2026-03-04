/**
 * Adjustment Panel Component (v1.1.0)
 * 
 * Provides sliders for basic image adjustments:
 * - Brightness
 * - Contrast
 * - Saturation
 */

import React from 'react';
import { useBatchEditStore } from '../../stores/batchEditStore';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface AdjustmentSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  onReset: () => void;
  unit?: string;
}

/**
 * Reusable adjustment slider component
 */
const AdjustmentSlider: React.FC<AdjustmentSliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  onReset,
  unit = '',
}) => {
  const isDefault = value === 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={`adjustment-${label}`} className="text-sm font-medium">
          {label}
        </Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-16 h-7 text-xs"
            min={min}
            max={max}
            step={step}
          />
          <span className="text-xs text-muted-foreground w-8">{unit}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            disabled={isDefault}
            className="h-7 px-2"
          >
            Reset
          </Button>
        </div>
      </div>
      <Slider
        id={`adjustment-${label}`}
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(newValue) => onChange(newValue[0])}
        className="w-full"
      />
    </div>
  );
};

/**
 * Main adjustment panel component
 */
export const AdjustmentPanel: React.FC = () => {
  const {
    currentAdjustments,
    setAdjustment,
    resetAdjustment,
    resetAllAdjustments,
  } = useBatchEditStore();

  const hasNonDefault =
    currentAdjustments.brightness !== 0 ||
    currentAdjustments.contrast !== 0 ||
    currentAdjustments.saturation !== 0;

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Basic Adjustments</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetAllAdjustments}
          disabled={!hasNonDefault}
        >
          Reset All
        </Button>
      </div>

      {/* Brightness */}
      <AdjustmentSlider
        label="Brightness"
        value={currentAdjustments.brightness}
        min={-100}
        max={100}
        onChange={(value) => setAdjustment('brightness', value)}
        onReset={() => resetAdjustment('brightness')}
      />

      {/* Contrast */}
      <AdjustmentSlider
        label="Contrast"
        value={currentAdjustments.contrast}
        min={-100}
        max={100}
        onChange={(value) => setAdjustment('contrast', value)}
        onReset={() => resetAdjustment('contrast')}
      />

      {/* Saturation */}
      <AdjustmentSlider
        label="Saturation"
        value={currentAdjustments.saturation}
        min={-100}
        max={100}
        onChange={(value) => setAdjustment('saturation', value)}
        onReset={() => resetAdjustment('saturation')}
      />

      {/* Info */}
      <div className="mt-4 p-3 bg-muted rounded-md">
        <p className="text-xs text-muted-foreground">
          Adjust brightness, contrast, and saturation to enhance your images.
          All adjustments are applied in real-time to the preview.
        </p>
      </div>
    </div>
  );
};

export default AdjustmentPanel;
