import type { ImageFormat, ProcessingError, ProcessingErrorType } from '../types';
import { SUPPORTED_FORMATS } from './supportedFormats';

/**
 * Maximum file size in bytes (50MB default)
 */
const MAX_FILE_SIZE = 50 * 1024 * 1024;

/**
 * Minimum dimensions for valid image
 */
const MIN_DIMENSION = 1;

/**
 * Maximum dimensions for valid image
 */
const MAX_DIMENSION = 10000;

/**
 * Magic numbers for image format detection
 */
const MAGIC_NUMBERS: Record<string, string[]> = {
  png: ['89504e47'],
  jpg: ['ffd8ff'],
  gif: ['47494638'],
  webp: ['52494646'],
  bmp: ['424d'],
  tiff: ['49492a00', '4d4d002a'],
  ico: ['00000100'],
  svg: ['3c3f786d6c', '3c737667'], // '<?xml' or '<svg'
};

/**
 * Validate file format using magic numbers
 */
export async function validateFormat(
  arrayBuffer: ArrayBuffer,
  fileName: string
): Promise<{ valid: boolean; format?: ImageFormat; error?: string }> {
  const bytes = new Uint8Array(arrayBuffer);
  const hex = Array.from(bytes)
    .slice(0, 16)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  // Check against known magic numbers
  for (const [format, signatures] of Object.entries(MAGIC_NUMBERS)) {
    for (const signature of signatures) {
      if (hex.startsWith(signature)) {
        return {
          valid: true,
          format: format as ImageFormat,
        };
      }
    }
  }

  // Fallback: check file extension
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (extension && SUPPORTED_FORMATS.some((f) => f.id === extension)) {
    return {
      valid: true,
      format: extension as ImageFormat,
    };
  }

  return {
    valid: false,
    error: 'Unsupported image format',
  };
}

/**
 * Validate file size
 */
export function validateFileSize(size: number): {
  valid: boolean;
  error?: string;
} {
  if (size === 0) {
    return { valid: false, error: 'File is empty' };
  }

  if (size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`,
    };
  }

  return { valid: true };
}

/**
 * Validate image dimensions
 */
export function validateDimensions(
  width: number,
  height: number
): { valid: boolean; error?: string } {
  if (width < MIN_DIMENSION || height < MIN_DIMENSION) {
    return {
      valid: false,
      error: `Image dimensions must be at least ${MIN_DIMENSION}x${MIN_DIMENSION}`,
    };
  }

  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    return {
      valid: false,
      error: `Image dimensions cannot exceed ${MAX_DIMENSION}x${MAX_DIMENSION}`,
    };
  }

  return { valid: true };
}

/**
 * Check if file has transparency (for formats that support it)
 */
export function hasTransparency(format: ImageFormat): boolean {
  const formatInfo = SUPPORTED_FORMATS.find((f) => f.id === format);
  return formatInfo?.supportsTransparency ?? false;
}

/**
 * Create a processing error object
 */
export function createError(
  type: ProcessingErrorType,
  message: string,
  recoverable = true
): ProcessingError {
  return {
    type,
    message,
    recoverable,
  };
}

/**
 * Comprehensive file validation
 */
export interface ValidationResult {
  valid: boolean;
  format?: ImageFormat;
  errors: string[];
  warnings: string[];
}

/**
 * Validate an image file completely
 */
export async function validateImageFile(
  arrayBuffer: ArrayBuffer,
  fileName: string,
  fileSize: number,
  width?: number,
  height?: number
): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate format
  const formatResult = await validateFormat(arrayBuffer, fileName);
  if (!formatResult.valid) {
    errors.push(formatResult.error || 'Invalid format');
  }

  // Validate file size
  const sizeResult = validateFileSize(fileSize);
  if (!sizeResult.valid) {
    errors.push(sizeResult.error || 'Invalid file size');
  }

  // Validate dimensions if provided
  if (width !== undefined && height !== undefined) {
    const dimResult = validateDimensions(width, height);
    if (!dimResult.valid) {
      errors.push(dimResult.error || 'Invalid dimensions');
    }

    // Warn about very large images
    if (width > 4096 || height > 4096) {
      warnings.push('Large image detected - processing may be slow');
    }
  }

  // Warn about non-standard formats
  if (formatResult.format === 'bmp' || formatResult.format === 'tiff') {
    warnings.push(`${formatResult.format.toUpperCase()} format may have limited compatibility`);
  }

  return {
    valid: errors.length === 0,
    format: formatResult.format,
    errors,
    warnings,
  };
}

/**
 * Get user-friendly error message for validation errors
 */
export function getErrorMessage(error: string): string {
  const errorMessages: Record<string, string> = {
    'Unsupported image format':
      'This file format is not supported. Please use PNG, JPG, WebP, ICO, BMP, GIF, TIFF, or SVG.',
    'File size exceeds': 'The file is too large. Please use an image smaller than 50MB.',
    'File is empty': 'The file appears to be empty or corrupted.',
    'Image dimensions must be at least': 'The image is too small. Please use a larger image.',
    'Image dimensions cannot exceed': 'The image is too large. Please use a smaller image.',
    'Invalid format': 'This file is not a valid image or the format cannot be detected.',
  };

  for (const [key, message] of Object.entries(errorMessages)) {
    if (error.includes(key)) {
      return message;
    }
  }

  return error;
}
