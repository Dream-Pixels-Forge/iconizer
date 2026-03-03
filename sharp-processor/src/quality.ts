import type { ImageFormat } from './types';

/**
 * Quality presets
 */
export const QUALITY_PRESETS = {
  low: 50,
  medium: 75,
  high: 90,
  lossless: 100,
} as const;

export type QualityPreset = keyof typeof QUALITY_PRESETS;

/**
 * Quality settings for different formats
 */
export interface QualitySettings {
  quality: number;
  compressionLevel?: number;
  effort?: number;
}

/**
 * Get quality settings for a specific format
 */
export function getQualitySettings(
  format: ImageFormat,
  quality: number | QualityPreset
): QualitySettings {
  const qualityValue = typeof quality === 'string' 
    ? QUALITY_PRESETS[quality] 
    : quality;

  switch (format) {
    case 'jpg':
    case 'jpeg':
      return {
        quality: qualityValue,
      };

    case 'webp':
      return {
        quality: qualityValue,
      };

    case 'png':
      // PNG uses compression level instead of quality
      return {
        quality: 100, // PNG is lossless
        compressionLevel: Math.floor((100 - qualityValue) / 20), // 0-9
      };

    case 'tiff':
      return {
        quality: qualityValue,
        compressionLevel: qualityValue >= 90 ? 1 : 0, // LZW compression
      };

    case 'gif':
      // GIF doesn't support quality settings
      return {
        quality: 100,
      };

    case 'bmp':
      // BMP is uncompressed
      return {
        quality: 100,
      };

    case 'svg':
      // SVG is vector, no quality settings
      return {
        quality: 100,
      };

    default:
      return {
        quality: qualityValue,
      };
  }
}

/**
 * Calculate optimal quality for target file size
 */
export function calculateOptimalQuality(
  currentSize: number,
  targetSize: number,
  currentQuality: number = 80
): number {
  const ratio = targetSize / currentSize;
  
  if (ratio >= 1) {
    // Target is larger, no need to reduce quality
    return Math.min(currentQuality + 10, 100);
  }

  // Simple linear approximation
  const newQuality = Math.floor(currentQuality * ratio);
  return Math.max(newQuality, 10); // Minimum quality of 10
}

/**
 * Estimate file size based on quality and dimensions
 */
export function estimateFileSize(
  width: number,
  height: number,
  format: ImageFormat,
  quality: number
): number {
  const pixelCount = width * height;
  
  // Bits per pixel estimates for different formats
  const bpp: Record<ImageFormat, number> = {
    png: 2.5,
    jpg: 0.5,
    jpeg: 0.5,
    webp: 0.3,
    bmp: 24,
    gif: 1,
    tiff: 3,
    ico: 4,
    svg: 0.1, // Vector, very small
  };

  const formatBpp = bpp[format] || 1;
  const qualityFactor = quality / 100;
  
  // Estimate in bytes
  const estimatedBytes = (pixelCount * formatBpp * qualityFactor) / 8;
  
  return Math.floor(estimatedBytes);
}

/**
 * Get recommended quality for use case
 */
export function getRecommendedQuality(useCase: string): QualityPreset {
  const recommendations: Record<string, QualityPreset> = {
    'web-icon': 'high',
    'app-icon': 'high',
    'thumbnail': 'medium',
    'photo': 'high',
    'preview': 'medium',
    'archive': 'lossless',
    'default': 'high',
  };

  return recommendations[useCase] || recommendations.default;
}
