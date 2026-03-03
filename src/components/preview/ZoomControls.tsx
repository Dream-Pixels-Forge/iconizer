import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface ZoomControlsProps {
  zoom: number;
  minZoom?: number;
  maxZoom?: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomChange: (zoom: number) => void;
  onReset: () => void;
  className?: string;
}

/**
 * ZoomControls component - Provides zoom slider and buttons
 */
export default function ZoomControls({
  zoom,
  minZoom = 25,
  maxZoom = 400,
  onZoomIn,
  onZoomOut,
  onZoomChange,
  onReset,
  className,
}: ZoomControlsProps) {
  const canZoomIn = zoom < maxZoom;
  const canZoomOut = zoom > minZoom;
  const isResetDisabled = zoom === 100;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomOut}
        disabled={!canZoomOut}
        title={`Zoom Out (Current: ${zoom}%)`}
      >
        <ZoomOut className="h-4 w-4" />
      </Button>

      <div className="w-32">
        <input
          type="range"
          min={minZoom}
          max={maxZoom}
          step={25}
          value={zoom}
          onChange={(e) => onZoomChange(Number(e.target.value))}
          className="w-full"
          aria-label="Zoom level"
        />
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={onZoomIn}
        disabled={!canZoomIn}
        title={`Zoom In (Current: ${zoom}%)`}
      >
        <ZoomIn className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        disabled={isResetDisabled}
        title="Reset zoom to 100%"
      >
        <Maximize className="h-4 w-4" />
      </Button>

      <div className="min-w-[3rem] text-center text-sm font-medium">{zoom}%</div>
    </div>
  );
}
