import sharp, { type Metadata } from 'sharp';
import type { ImageFormat, ProcessingOptions, ProcessingResult } from './types';

/**
 * Map format names to Sharp format identifiers
 */
const FORMAT_MAP: Record<string, string> = {
  jpeg: 'jpeg',
  jpg: 'jpeg',
  png: 'png',
  webp: 'webp',
  ico: 'png', // ICO is handled separately
  bmp: 'raw',
  gif: 'gif',
  tiff: 'tiff',
  svg: 'svg',
};

/**
 * Get Sharp output options based on format
 */
function getOutputOptions(format: ImageFormat, quality?: number) {
  switch (format) {
    case 'png':
      return { compressionLevel: 6 };
    case 'jpg':
    case 'jpeg':
      return { quality: quality || 80 };
    case 'webp':
      return { quality: quality || 80 };
    case 'bmp':
      return {};
    case 'gif':
      return {};
    case 'tiff':
      return { compression: 'lzw', quality: quality || 80 };
    case 'svg':
      return {};
    default:
      return {};
  }
}

/**
 * Convert image to specified format and size
 */
export async function convertImage(
  inputBuffer: Buffer,
  options: ProcessingOptions
): Promise<ProcessingResult> {
  try {
    const { format, size, quality, maintainAspectRatio = true, backgroundColor, fit = 'contain' } = options;

    // Create Sharp pipeline
    let pipeline = sharp(inputBuffer);

    // Get metadata for validation
    const metadata: Metadata = await pipeline.metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error('Invalid image metadata');
    }

    // Resize if needed
    if (metadata.width !== size.width || metadata.height !== size.height) {
      const resizeOptions: sharp.ResizeOptions = {
        width: size.width,
        height: size.height,
        fit,
        withoutEnlargement: false,
      };

      if (!maintainAspectRatio) {
        resizeOptions.fit = 'fill';
      }

      // Add background color if provided (for transparency handling)
      if (backgroundColor && format !== 'png' && format !== 'webp') {
        pipeline = pipeline.flatten({ background: backgroundColor });
      }

      pipeline = pipeline.resize(resizeOptions);
    }

    // Convert to target format
    const outputOptions = getOutputOptions(format, quality);
    
    switch (format) {
      case 'png':
        pipeline = pipeline.png(outputOptions);
        break;
      case 'jpg':
      case 'jpeg':
        pipeline = pipeline.jpeg(outputOptions);
        break;
      case 'webp':
        pipeline = pipeline.webp(outputOptions);
        break;
      case 'bmp':
        pipeline = pipeline.raw();
        break;
      case 'gif':
        // GIF requires specific handling - skip for now
        throw new Error('GIF output not yet implemented');
      case 'tiff':
        pipeline = pipeline.tiff(outputOptions);
        break;
      case 'svg':
        // SVG output requires vector input - skip for raster images
        throw new Error('SVG output requires vector input');
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    // Process the image
    const outputBuffer = await pipeline.toBuffer();
    const outputMetadata = await sharp(outputBuffer).metadata();

    return {
      success: true,
      outputBuffer,
      width: outputMetadata.width || size.width,
      height: outputMetadata.height || size.height,
      format: FORMAT_MAP[format] || format,
      size: outputBuffer.length,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Conversion failed';
    
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
 * Convert image to ICO format (multi-size)
 */
export async function convertToIco(
  inputBuffer: Buffer,
  sizes: Array<{ width: number; height: number }>
): Promise<ProcessingResult> {
  try {
    // ICO format requires specific sizes
    const validSizes = sizes.filter(s => 
      s.width <= 256 && s.height <= 256 && s.width === s.height
    );

    if (validSizes.length === 0) {
      throw new Error('ICO format requires square sizes up to 256x256');
    }

    // Generate all sizes and combine into ICO
    const icons = await Promise.all(
      validSizes.map(async (size) => {
        const result = await convertImage(inputBuffer, {
          format: 'png',
          size,
          maintainAspectRatio: true,
          fit: 'contain',
        });

        if (!result.success || !result.outputBuffer) {
          throw new Error(`Failed to generate ${size.width}x${size.height}`);
        }

        return result.outputBuffer;
      })
    );

    // For now, return the largest size as PNG
    // In a full implementation, we would combine all icons into a single ICO file
    const largestIcon = icons[icons.length - 1];
    const largestSize = validSizes[validSizes.length - 1];

    return {
      success: true,
      outputBuffer: largestIcon,
      width: largestSize.width,
      height: largestSize.height,
      format: 'ico',
      size: largestIcon.length,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'ICO conversion failed';
    
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
 * Get supported output formats
 */
export function getSupportedFormats(): ImageFormat[] {
  return ['png', 'jpg', 'webp', 'bmp', 'gif', 'tiff', 'svg'];
}

/**
 * Validate if a format is supported
 */
export function isFormatSupported(format: string): format is ImageFormat {
  return getSupportedFormats().includes(format as ImageFormat);
}
