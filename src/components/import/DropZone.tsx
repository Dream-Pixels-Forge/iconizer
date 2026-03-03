import { useCallback, useState } from 'react';
import { FileImage, X } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { useImportStore } from '../../stores/importStore';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import type { ImageMetadata, ImageFormat } from '../../types';

export default function DropZone() {
  const { addImages, removeImage, images } = useImportStore();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const processFiles = useCallback(
    async (filePaths: string[]) => {
      if (filePaths.length === 0) return;

      setIsLoading(true);

      try {
        // Get metadata for each file using Tauri backend
        const metadataPromises = filePaths.map(async (path) => {
          try {
            const metadata = await invoke<{
              name: string;
              path: string;
              format: string;
              width: number;
              height: number;
              size: number;
              has_transparency: boolean;
            }>('get_image_metadata', { path });
            
            return {
              name: metadata.name,
              path: metadata.path,
              format: metadata.format as ImageFormat,
              width: metadata.width,
              height: metadata.height,
              size: metadata.size,
              hasTransparency: metadata.has_transparency,
            } as ImageMetadata;
          } catch (error) {
            console.error('Failed to get metadata for:', path, error);
            // Fallback: create basic metadata
            const fileName = path.split(/[\\/]/).pop() || 'unknown';
            const ext = fileName.split('.').pop()?.toLowerCase() || 'png';
            return {
              name: fileName,
              path,
              format: ext as ImageFormat,
              width: 0,
              height: 0,
              size: 0,
              hasTransparency: false,
            } as ImageMetadata;
          }
        });

        const metadata = await Promise.all(metadataPromises);
        addImages(metadata);
      } catch (error) {
        console.error('Failed to process files:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [addImages]
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      // For drag and drop from file system, we need to use the Tauri dialog
      // since web drag events don't provide file paths
      try {
        const selected = await invoke<string[]>('select_files', {
          filters: ['png', 'jpg', 'jpeg', 'webp', 'ico', 'bmp', 'gif', 'tiff', 'svg'],
        });

        if (selected && selected.length > 0) {
          await processFiles(selected);
        }
      } catch (error) {
        console.error('Failed to select files:', error);
      }
    },
    [processFiles]
  );

  const handleBrowse = useCallback(async () => {
    try {
      const selected = await invoke<string[]>('select_files', {
        filters: ['png', 'jpg', 'jpeg', 'webp', 'ico', 'bmp', 'gif', 'tiff', 'svg'],
      });

      if (selected && selected.length > 0) {
        await processFiles(selected);
      }
    } catch (error) {
      console.error('Failed to select files:', error);
    }
  }, [processFiles]);

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          isDragOver && 'border-primary bg-accent/50',
          'min-h-[200px]'
        )}
        onClick={handleBrowse}
      >
        <FileImage className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-medium">
          {isDragOver ? 'Drop images here' : 'Drag & drop images'}
        </h3>
        <p className="mb-4 text-sm text-muted-foreground">or click to browse</p>
        <Button type="button" disabled={isLoading} onClick={(e) => {
          e.stopPropagation();
          handleBrowse();
        }}>
          {isLoading ? 'Loading...' : 'Browse Files'}
        </Button>
      </div>

      {images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Selected Images ({images.length})</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => useImportStore.getState().clearAll()}
              className="text-xs"
            >
              Clear All
            </Button>
          </div>
          <div className="grid gap-2">
            {images.map((image, index) => (
              <div
                key={`${image.name}-${index}`}
                className="flex items-center justify-between rounded-md border bg-card p-3"
              >
                <div className="flex items-center gap-3">
                  <FileImage className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{image.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {image.format.toUpperCase()} • {(image.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeImage(image.path)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
