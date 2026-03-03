/**
 * Image format types supported by the processor
 */
export type ImageFormat =
  | 'png'
  | 'jpg'
  | 'jpeg'
  | 'webp'
  | 'ico'
  | 'bmp'
  | 'gif'
  | 'tiff'
  | 'svg';

/**
 * Image size configuration
 */
export interface ImageSize {
  width: number;
  height: number;
}

/**
 * Processing options for image conversion
 */
export interface ProcessingOptions {
  format: ImageFormat;
  size: ImageSize;
  quality?: number;
  maintainAspectRatio?: boolean;
  backgroundColor?: string;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

/**
 * Processing result
 */
export interface ProcessingResult {
  success: boolean;
  outputPath?: string;
  outputBuffer?: Buffer;
  width: number;
  height: number;
  format: string;
  size: number;
  error?: string;
}

/**
 * Batch processing job
 */
export interface BatchJob {
  id: string;
  inputPath: string;
  inputBuffer?: Buffer;
  options: ProcessingOptions;
  outputPath?: string;
  outputBuffer?: Buffer;
  status: JobStatus;
  progress: number;
  error?: string;
}

/**
 * Progress event
 */
export interface ProgressEvent {
  jobId: string;
  progress: number;
  stage: 'loading' | 'converting' | 'resizing' | 'saving' | 'processing';
  message: string;
  eta?: number;
}

/**
 * Job status types
 */
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

/**
 * Error types for image processing
 */
export type ProcessingErrorType =
  | 'invalid-format'
  | 'file-not-found'
  | 'permission-denied'
  | 'out-of-memory'
  | 'conversion-failed'
  | 'resize-failed'
  | 'unknown';

/**
 * Processing error
 */
export interface ProcessingError {
  type: ProcessingErrorType;
  message: string;
  jobId?: string;
  recoverable: boolean;
}
