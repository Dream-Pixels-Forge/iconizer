import type { ProcessingError, ProcessingErrorType } from './types';

/**
 * Error message catalog
 */
const ERROR_MESSAGES: Record<ProcessingErrorType, string> = {
  'invalid-format': 'The image format is not supported or invalid',
  'file-not-found': 'The specified image file could not be found',
  'permission-denied': 'Permission denied when accessing the file',
  'out-of-memory': 'Not enough memory to process the image',
  'conversion-failed': 'Failed to convert the image',
  'resize-failed': 'Failed to resize the image',
  'unknown': 'An unknown error occurred during processing',
};

/**
 * Create a processing error object
 */
export function createProcessingError(
  type: ProcessingErrorType,
  message?: string,
  options?: {
    jobId?: string;
    recoverable?: boolean;
    originalError?: Error;
  }
): ProcessingError {
  return {
    type,
    message: message || ERROR_MESSAGES[type],
    jobId: options?.jobId,
    recoverable: options?.recoverable ?? true,
  };
}

/**
 * Categorize an error from Sharp or Node.js
 */
export function categorizeError(error: unknown): ProcessingError {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // Check for specific error types
    if (message.includes('unsupported') || message.includes('format')) {
      return createProcessingError('invalid-format', error.message);
    }

    if (message.includes('not found') || message.includes('no such file')) {
      return createProcessingError('file-not-found', error.message, { recoverable: false });
    }

    if (message.includes('permission') || message.includes('access')) {
      return createProcessingError('permission-denied', error.message, { recoverable: false });
    }

    if (message.includes('memory') || message.includes('alloc')) {
      return createProcessingError('out-of-memory', error.message, { recoverable: false });
    }

    if (message.includes('convert') || message.includes('transform')) {
      return createProcessingError('conversion-failed', error.message);
    }

    if (message.includes('resize')) {
      return createProcessingError('resize-failed', error.message);
    }
  }

  // Unknown error
  return createProcessingError(
    'unknown',
    error instanceof Error ? error.message : 'Unknown error occurred'
  );
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: ProcessingError): string {
  const messages: Record<ProcessingErrorType, string> = {
    'invalid-format':
      'This file format is not supported. Please use PNG, JPG, WebP, BMP, GIF, TIFF, or SVG.',
    'file-not-found':
      'The image file could not be found. Please check if the file exists.',
    'permission-denied':
      'Unable to access the file. Please check file permissions.',
    'out-of-memory':
      'Not enough memory to process this image. Try a smaller image or close other applications.',
    'conversion-failed':
      'Failed to convert the image. The file may be corrupted.',
    'resize-failed':
      'Failed to resize the image. Please check the dimensions.',
    'unknown':
      'An unexpected error occurred. Please try again.',
  };

  return messages[error.type] || error.message;
}

/**
 * Check if error is recoverable
 */
export function isRecoverableError(error: ProcessingError): boolean {
  const nonRecoverableTypes: ProcessingErrorType[] = [
    'file-not-found',
    'permission-denied',
    'out-of-memory',
  ];

  return !nonRecoverableTypes.includes(error.type);
}

/**
 * Log error for debugging
 */
export function logError(
  error: ProcessingError,
  context?: {
    jobId?: string;
    inputPath?: string;
    outputPath?: string;
    options?: Record<string, unknown>;
  }
): void {
  console.error('[ImageProcessor Error]', {
    type: error.type,
    message: error.message,
    recoverable: error.recoverable,
    ...context,
  });
}
