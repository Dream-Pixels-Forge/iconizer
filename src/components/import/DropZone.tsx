import { useCallback, useState } from 'react';
import { FileImage, X, Upload } from 'lucide-react';
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
            // Fallback: create basic metadata from path
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
        const errorMessage = error instanceof Error ? error.message : 'Failed to process files';
        console.error('Failed to process files:', error);
        useImportStore.getState().setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [addImages]
  );

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleBrowse = useCallback(async () => {
    try {
      setIsLoading(true);

      const paths = await invoke<string[]>('select_files', {
        filters: ['png', 'jpg', 'jpeg', 'webp', 'ico', 'bmp', 'gif', 'tiff', 'svg'],
      });

      if (paths && paths.length > 0) {
        await processFiles(paths);
      }
    } catch (error) {
      console.error('Failed to select files:', error);
      // Don't show error if user cancelled
      if (error && typeof error === 'string' && !error.includes('No files selected')) {
        alert(`Failed to select files: ${error}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [processFiles]);

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowse}
        className={cn(
          // Skeuomorphic drop zone
          'relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all duration-200',
          // Base state - inset surface
          'bg-gradient-to-b from-card to-muted/20',
          'border-border',
          'shadow-[inset_0_2px_4px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(0,0,0,0.03)]',
          // Hover state - slightly raised
          'hover:border-primary/50',
          'hover:bg-gradient-to-b hover:from-card hover:to-primary/5',
          'hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(0,0,0,0.05)]',
          // Drag over state - pressed/active
          isDragOver && 'border-primary bg-gradient-to-b from-primary/10 to-primary/5',
          isDragOver && 'shadow-[inset_0_2px_8px_rgba(0,0,0,0.08),0_0_0_3px_rgba(0,0,0,0.1)]',
          'min-h-[200px]'
        )}
      >
        <div
          className={cn(
            'mb-4 rounded-full p-4 transition-all duration-200',
            isDragOver
              ? 'bg-gradient-to-b from-primary/20 to-primary/10'
              : 'bg-gradient-to-b from-muted/30 to-muted/20'
          )}
        >
          <Upload
            className={cn(
              'h-12 w-12 transition-colors duration-200',
              isDragOver ? 'text-primary' : 'text-muted-foreground'
            )}
          />
        </div>
        <h3 className="mb-2 text-lg font-medium text-foreground">
          {isDragOver ? 'Drop images here' : 'Drag & drop images'}
        </h3>
        <p className="mb-4 text-sm text-muted-foreground">or click to browse</p>
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={(e) => {
            e.stopPropagation();
            handleBrowse();
          }}
          className="skeuo-btn-outline"
        >
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
            {images.map((image) => (
              <div
                key={image.path}
                className="flex items-center justify-between rounded-lg border bg-gradient-to-b from-card to-card/95 p-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gradient-to-b from-muted/30 to-muted/20 p-2">
                    <FileImage className="h-5 w-5 text-muted-foreground" />
                  </div>
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
