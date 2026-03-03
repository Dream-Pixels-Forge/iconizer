import type { ImageFormat, OutputFormat } from '../types';

/**
 * Supported output formats with metadata
 */
export const SUPPORTED_FORMATS: OutputFormat[] = [
  {
    id: 'png',
    name: 'PNG',
    description: 'Lossless compression, supports transparency',
    supportsTransparency: true,
    isLossy: false,
    qualitySettings: false,
  },
  {
    id: 'jpg',
    name: 'JPG',
    description: 'Lossy compression, smaller file size',
    supportsTransparency: false,
    isLossy: true,
    qualitySettings: true,
  },
  {
    id: 'webp',
    name: 'WebP',
    description: 'Modern format, excellent compression',
    supportsTransparency: true,
    isLossy: true,
    qualitySettings: true,
  },
  {
    id: 'ico',
    name: 'ICO',
    description: 'Windows icon format (multi-size)',
    supportsTransparency: true,
    isLossy: false,
    qualitySettings: false,
  },
  {
    id: 'bmp',
    name: 'BMP',
    description: 'Uncompressed bitmap format',
    supportsTransparency: false,
    isLossy: false,
    qualitySettings: false,
  },
];

/**
 * Input formats that can be converted
 */
export const INPUT_FORMATS: ImageFormat[] = [
  'png',
  'jpg',
  'jpeg',
  'webp',
  'bmp',
  'gif',
  'tiff',
  'svg',
];

/**
 * Get format by ID
 */
export function getFormatById(id: string): OutputFormat | undefined {
  return SUPPORTED_FORMATS.find((format) => format.id === id.toLowerCase());
}

/**
 * Check if format supports transparency
 */
export function supportsTransparency(format: ImageFormat): boolean {
  const fmt = getFormatById(format);
  return fmt?.supportsTransparency ?? false;
}

/**
 * Check if format has quality settings
 */
export function hasQualitySettings(format: ImageFormat): boolean {
  const fmt = getFormatById(format);
  return fmt?.qualitySettings ?? false;
}

/**
 * Get recommended format for use case
 */
export function getRecommendedFormat(useCase: string): ImageFormat {
  const recommendations: Record<string, ImageFormat> = {
    'web-icon': 'png',
    'app-icon': 'png',
    photo: 'jpg',
    transparent: 'png',
    'windows-icon': 'ico',
    'small-file': 'webp',
  };
  return recommendations[useCase] || 'png';
}

/**
 * Format compatibility matrix
 */
export const FORMAT_COMPATIBILITY: Record<ImageFormat, ImageFormat[]> = {
  png: ['png', 'jpg', 'webp', 'ico', 'bmp'],
  jpg: ['png', 'jpg', 'webp', 'ico', 'bmp'],
  jpeg: ['png', 'jpg', 'webp', 'ico', 'bmp'],
  webp: ['png', 'jpg', 'webp', 'ico', 'bmp'],
  ico: ['png', 'jpg', 'webp', 'ico', 'bmp'],
  bmp: ['png', 'jpg', 'webp', 'ico', 'bmp'],
  gif: ['png', 'jpg', 'webp', 'ico', 'bmp'],
  tiff: ['png', 'jpg', 'webp', 'ico', 'bmp'],
  svg: ['png', 'jpg', 'webp', 'bmp'], // SVG output is traced
};
