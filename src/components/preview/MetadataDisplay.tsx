import { Info } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';
import type { ImageMetadata } from '../../types';

interface MetadataDisplayProps {
  image: ImageMetadata;
  className?: string;
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
 * MetadataDisplay component - Shows image file information
 */
export default function MetadataDisplay({ image, className }: MetadataDisplayProps) {
  const hasDimensions = image.width > 0 && image.height > 0;
  const hasSize = image.size > 0;

  return (
    <Card className={cn('w-full', className)}>
      <CardContent className="p-4">
        {/* Main Metadata Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {/* File Name */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              <span>File Name</span>
            </div>
            <p className="truncate text-sm font-medium" title={image.name}>
              {image.name}
            </p>
          </div>

          {/* Format */}
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Format</div>
            <p className="text-sm font-medium">{image.format.toUpperCase()}</p>
          </div>

          {/* Dimensions */}
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Dimensions</div>
            <p className="text-sm font-medium">
              {hasDimensions ? `${image.width} × ${image.height}` : 'Unknown'}
            </p>
          </div>

          {/* File Size */}
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">File Size</div>
            <p className="text-sm font-medium">
              {hasSize ? formatFileSize(image.size) : 'Unknown'}
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-4 flex flex-wrap gap-4 border-t pt-4 text-sm">
          {/* Transparency Indicator */}
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'h-3 w-3 rounded-full',
                image.hasTransparency ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
              )}
            />
            <span className="text-muted-foreground">Transparency:</span>
            <span className="font-medium">{image.hasTransparency ? 'Yes' : 'No'}</span>
          </div>

          {/* Color Space */}
          {image.colorSpace && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Color Space:</span>
              <span className="font-medium">{image.colorSpace}</span>
            </div>
          )}

          {/* Aspect Ratio */}
          {hasDimensions && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Aspect Ratio:</span>
              <span className="font-medium">{getAspectRatio(image.width, image.height)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Calculate and format aspect ratio
 */
function getAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const divisor = gcd(width, height);
  const ratioW = width / divisor;
  const ratioH = height / divisor;

  return `${ratioW}:${ratioH}`;
}
