import sharp from 'sharp';
import type { ImageSize, ProcessingResult } from './types';

/**
 * Resize modes
 */
export type ResizeFit = 'cover' | 'contain' | 'fill' | 'inside' | 'outside';

/**
 * Resize options
 */
export interface ResizeOptions {
  size: ImageSize;
  fit?: ResizeFit;
  maintainAspectRatio?: boolean;
  withoutEnlargement?: boolean;
  withoutReduction?: boolean;
  backgroundColor?: string;
}

/**
 * Resize an image to specified dimensions
 */
export async function resizeImage(
  inputBuffer: Buffer,
  options: ResizeOptions
): Promise<ProcessingResult> {
  try {
    const {
      size,
      fit = 'contain',
      maintainAspectRatio = true,
      withoutEnlargement = false,
      withoutReduction = false,
      backgroundColor,
    } = options;

    // Create Sharp pipeline
    let pipeline = sharp(inputBuffer);

    // Get metadata
    const metadata = await pipeline.metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error('Invalid image metadata');
    }

    // Calculate resize parameters
    const resizeOptions: sharp.ResizeOptions = {
      width: size.width,
      height: size.height,
      fit,
      withoutEnlargement,
      withoutReduction,
    };

    if (!maintainAspectRatio) {
      resizeOptions.fit = 'fill';
    }

    // Apply background color if needed
    if (backgroundColor) {
      pipeline = pipeline.flatten({ background: backgroundColor });
    }

    // Resize
    pipeline = pipeline.resize(resizeOptions);

    // Convert to buffer (PNG for lossless)
    pipeline = pipeline.png();

    const outputBuffer = await pipeline.toBuffer();
    const outputMetadata = await sharp(outputBuffer).metadata();

    return {
      success: true,
      outputBuffer,
      width: outputMetadata.width || size.width,
      height: outputMetadata.height || size.height,
      format: 'png',
      size: outputBuffer.length,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Resize failed';
    
    return {
      success: false,
      width: 0,
      height: 0,
      format: '',
      size: 0,
      error: errorMessage,
    };
  }
}

/**
 * Generate multiple sizes from a single image
 */
export async function generateMultipleSizes(
  inputBuffer: Buffer,
  sizes: ImageSize[],
  options?: Omit<ResizeOptions, 'size'>
): Promise<Map<string, ProcessingResult>> {
  const results = new Map<string, ProcessingResult>();

  for (const size of sizes) {
    const key = `${size.width}x${size.height}`;
    
    const result = await resizeImage(inputBuffer, {
      size,
      ...options,
    });

    results.set(key, result);
  }

  return results;
}

/**
 * Generate square thumbnails with optional background
 */
export async function generateThumbnail(
  inputBuffer: Buffer,
  size: number,
  backgroundColor?: string
): Promise<ProcessingResult> {
  return resizeImage(inputBuffer, {
    size: { width: size, height: size },
    fit: 'cover',
    maintainAspectRatio: true,
    backgroundColor,
  });
}

/**
 * Get optimal resize fit mode for use case
 */
export function getOptimalFitMode(useCase: string): ResizeFit {
  const modes: Record<string, ResizeFit> = {
    'icon': 'contain',
    'thumbnail': 'cover',
    'avatar': 'cover',
    'banner': 'fill',
    'default': 'contain',
  };

  return modes[useCase] || modes.default;
}
