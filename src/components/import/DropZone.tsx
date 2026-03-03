import React, { useCallback, useState } from 'react';
import { FileImage, X } from 'lucide-react';
import { useImportStore } from '../../stores/importStore';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import type { ImageMetadata, ImageFormat } from '../../types';

export default function DropZone() {
  const { addImages, removeImage, images } = useImportStore();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      const imageFiles = files.filter((file) => file.type.startsWith('image/'));

      const metadata: ImageMetadata[] = imageFiles.map((file) => ({
        name: file.name,
        path: file.name, // In Tauri, this would be the actual path
        format: file.type.split('/')[1] as ImageFormat,
        width: 0, // Would be populated by reading the image
        height: 0,
        size: file.size,
        hasTransparency: false,
      }));

      addImages(metadata);
    },
    [addImages]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const imageFiles = files.filter((file) => file.type.startsWith('image/'));

      const metadata: ImageMetadata[] = imageFiles.map((file) => ({
        name: file.name,
        path: file.name,
        format: file.type.split('/')[1] as ImageFormat,
        width: 0,
        height: 0,
        size: file.size,
        hasTransparency: false,
      }));

      addImages(metadata);
      e.target.value = ''; // Reset input
    },
    [addImages]
  );

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn('drop-zone min-h-[200px] p-8', isDragOver && 'active')}
      >
        <div className="text-center">
          <FileImage className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-medium">
            {isDragOver ? 'Drop images here' : 'Drag & drop images'}
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">or click to browse</p>
          <label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileInput}
              className="hidden"
            />
            <Button>Browse Files</Button>
          </label>
        </div>
      </div>

      {images.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Selected Images ({images.length})</h4>
          <div className="grid gap-2">
            {images.map((image, index) => (
              <div
                key={index}
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
