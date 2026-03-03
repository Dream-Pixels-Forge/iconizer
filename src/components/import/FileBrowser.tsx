import { useCallback } from 'react';
import { FolderOpen } from 'lucide-react';
import { open } from '@tauri-apps/plugin-dialog';
import { useImportStore } from '../../stores/importStore';
import { Button } from '../ui/button';
import type { ImageMetadata, ImageFormat } from '../../types';

/**
 * Supported image extensions for file dialog filter
 */
const IMAGE_EXTENSIONS = [
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.ico',
  '.bmp',
  '.gif',
  '.tiff',
  '.svg',
];

interface FileBrowserProps {
  onFilesSelected?: (files: ImageMetadata[]) => void;
}

/**
 * Extract format from file path
 */
function getFormatFromPath(path: string): ImageFormat {
  const ext = path.split('.').pop()?.toLowerCase() || 'png';

  // Map common extensions to standard format names
  const formatMap: Record<string, ImageFormat> = {
    jpg: 'jpg',
    jpeg: 'jpeg',
    png: 'png',
    webp: 'webp',
    ico: 'ico',
    bmp: 'bmp',
    gif: 'gif',
    tiff: 'tiff',
    svg: 'svg',
  };

  return formatMap[ext] || 'png';
}

/**
 * FileBrowser component - Opens native file dialog using Tauri
 */
export default function FileBrowser({ onFilesSelected }: FileBrowserProps) {
  const { addImages, setLoading, setError } = useImportStore();

  const handleBrowse = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Open native file dialog
      const selected = await open({
        multiple: true,
        filters: [
          {
            name: 'Images',
            extensions: IMAGE_EXTENSIONS,
          },
        ],
      });

      if (!selected) {
        // User cancelled
        setLoading(false);
        return;
      }

      // Handle both single file and multiple files
      const paths = Array.isArray(selected) ? selected : [selected];

      // Convert paths to ImageMetadata
      // Note: In a real implementation, we would read file metadata using Tauri FS API
      const metadata: ImageMetadata[] = paths.map((path) => {
        const fileName = path.split(/[\\/]/).pop() || 'unknown';
        const format = getFormatFromPath(path);

        return {
          name: fileName,
          path: path.toString(),
          format,
          width: 0, // Would be populated by reading image dimensions
          height: 0,
          size: 0, // Would be populated by reading file size
          hasTransparency: false,
        };
      });

      // Add to store
      addImages(metadata);

      // Notify parent if callback provided
      onFilesSelected?.(metadata);

      setLoading(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to open file dialog';
      setError(errorMessage);
      setLoading(false);
    }
  }, [addImages, setLoading, setError, onFilesSelected]);

  return (
    <Button variant="outline" onClick={handleBrowse} className="gap-2">
      <FolderOpen className="h-4 w-4" />
      Browse Files
    </Button>
  );
}
