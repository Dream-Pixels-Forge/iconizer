import { useCallback, useState, useRef } from 'react';
import { FileImage, X } from 'lucide-react';
import { useImportStore } from '../../stores/importStore';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import type { ImageMetadata, ImageFormat } from '../../types';

export default function DropZone() {
  const { addImages, removeImage, images } = useImportStore();
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const processFiles = useCallback(
    (fileList: FileList) => {
      const files = Array.from(fileList);
      const imageFiles = files.filter((file) => file.type.startsWith('image/'));

      if (imageFiles.length === 0) {
        return;
      }

      const metadata: ImageMetadata[] = imageFiles.map((file) => {
        // Get format from MIME type
        let format: ImageFormat = 'png';
        const mimeType = file.type.split('/')[1];
        
        if (mimeType === 'jpeg') {
          format = 'jpg';
        } else if (['png', 'jpg', 'webp', 'ico', 'bmp', 'gif', 'tiff', 'svg'].includes(mimeType)) {
          format = mimeType as ImageFormat;
        }

        return {
          name: file.name,
          path: URL.createObjectURL(file), // Create blob URL for preview
          format,
          width: 0,
          height: 0,
          size: file.size,
          hasTransparency: false,
        };
      });

      addImages(metadata);
    },
    [addImages]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      processFiles(files);
    },
    [processFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        processFiles(files);
      }
      // Reset input value to allow selecting same file again
      e.target.value = '';
    },
    [processFiles]
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

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
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInput}
          className="hidden"
        />
        <FileImage className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-medium">
          {isDragOver ? 'Drop images here' : 'Drag & drop images'}
        </h3>
        <p className="mb-4 text-sm text-muted-foreground">or click to browse</p>
        <Button type="button" onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}>
          Browse Files
        </Button>
      </div>

      {images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Selected Images ({images.length})</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeImage(images[0].path)}
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
