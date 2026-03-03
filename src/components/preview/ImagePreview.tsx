import React, { useState, useCallback, useRef } from 'react';
import { ZoomIn, ZoomOut, Maximize, Info } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';
import type { ImageMetadata } from '../../types';

interface ImagePreviewProps {
  image: ImageMetadata;
  onClose?: () => void;
}

/**
 * Format file size to human-readable string
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * ImagePreview component with zoom and pan functionality
 */
export default function ImagePreview({ image, onClose }: ImagePreviewProps) {
  const [zoom, setZoom] = useState(100);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const MIN_ZOOM = 25;
  const MAX_ZOOM = 400;
  const ZOOM_STEP = 25;

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoom(100);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    setZoom((prev) => Math.min(Math.max(prev + delta, MIN_ZOOM), MAX_ZOOM));
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (zoom > 100) {
        setIsPanning(true);
        setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      }
    },
    [zoom, panOffset]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) {
        setPanOffset({
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        });
      }
    },
    [isPanning, panStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPanning(false);
  }, []);

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        {/* Preview Area */}
        <div
          ref={containerRef}
          className="relative mb-4 overflow-hidden rounded-lg border bg-muted/50"
          style={{ height: '400px' }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className={cn(
              'flex h-full w-full items-center justify-center',
              isPanning && 'cursor-grabbing'
            )}
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
              transition: isPanning ? 'none' : 'transform 0.2s',
            }}
          >
            {/* Image with zoom */}
            <div
              className="relative"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'center center',
                transition: isPanning ? 'none' : 'transform 0.2s',
              }}
            >
              {/* Placeholder for actual image - in real implementation, load from path */}
              <div
                className="rounded bg-white shadow-lg"
                style={{
                  minWidth: '200px',
                  minHeight: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={image.path}
                  alt={image.name}
                  className="max-h-full max-w-full object-contain"
                  style={{
                    maxWidth: '300px',
                    maxHeight: '300px',
                  }}
                  draggable={false}
                />
              </div>
            </div>
          </div>

          {/* Zoom Level Indicator */}
          <div className="absolute right-2 top-2 rounded bg-background/80 px-2 py-1 text-xs font-medium backdrop-blur">
            {zoom}%
          </div>
        </div>

        {/* Controls */}
        <div className="mb-4 flex items-center justify-between">
          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomOut}
              disabled={zoom <= MIN_ZOOM}
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>

            <div className="w-24">
              <input
                type="range"
                min={MIN_ZOOM}
                max={MAX_ZOOM}
                step={ZOOM_STEP}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomIn}
              disabled={zoom >= MAX_ZOOM}
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleResetZoom}
              disabled={zoom === 100 && panOffset.x === 0 && panOffset.y === 0}
              title="Reset View"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>

          {/* Close Button */}
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>

        {/* Metadata Display */}
        <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-4 md:grid-cols-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              <span>File Name</span>
            </div>
            <p className="truncate text-sm font-medium" title={image.name}>
              {image.name}
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Format</div>
            <p className="text-sm font-medium">{image.format.toUpperCase()}</p>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Dimensions</div>
            <p className="text-sm font-medium">
              {image.width > 0 && image.height > 0 ? `${image.width} × ${image.height}` : 'Unknown'}
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">File Size</div>
            <p className="text-sm font-medium">
              {image.size > 0 ? formatFileSize(image.size) : 'Unknown'}
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'h-3 w-3 rounded-full',
                image.hasTransparency ? 'bg-green-500' : 'bg-gray-300'
              )}
            />
            <span>Transparency: {image.hasTransparency ? 'Yes' : 'No'}</span>
          </div>

          {image.colorSpace && <div>Color Space: {image.colorSpace}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
