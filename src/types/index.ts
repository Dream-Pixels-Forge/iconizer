/**
 * Image format types supported by Iconizer
 */
export type ImageFormat = 'png' | 'jpg' | 'jpeg' | 'webp' | 'ico' | 'bmp' | 'gif' | 'tiff' | 'svg';

/**
 * Preset size configuration
 */
export interface PresetSize {
  id: string;
  name: string;
  width: number;
  height: number;
  description?: string;
  category: 'favicon' | 'icon' | 'app' | 'social' | 'other';
}

/**
 * Custom size configuration
 */
export interface CustomSize {
  id: string;
  width: number;
  height: number;
  maintainAspectRatio: boolean;
}

/**
 * Output format configuration
 */
export interface OutputFormat {
  id: ImageFormat;
  name: string;
  description: string;
  supportsTransparency: boolean;
  isLossy: boolean;
  qualitySettings: boolean;
}

/**
 * Conversion configuration state
 */
export interface ConversionConfig {
  selectedSizes: string[];
  customSizes: CustomSize[];
  selectedFormats: ImageFormat[];
  quality: number;
  maintainAspectRatio: boolean;
  backgroundColor?: string;
}

/**
 * Image file metadata
 */
export interface ImageMetadata {
  name: string;
  path: string;
  format: ImageFormat;
  width: number;
  height: number;
  size: number;
  hasTransparency: boolean;
  colorSpace?: string;
}

/**
 * Import state for managing loaded images
 */
export interface ImportState {
  images: ImageMetadata[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Processing job status
 */
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

/**
 * Processing job
 */
export interface ProcessingJob {
  id: string;
  sourceImage: ImageMetadata;
  targetSize: { width: number; height: number };
  targetFormat: ImageFormat;
  status: JobStatus;
  progress: number;
  outputPath?: string;
  error?: string;
}

/**
 * Batch processing state
 */
export interface BatchState {
  jobs: ProcessingJob[];
  isProcessing: boolean;
  overallProgress: number;
  estimatedTimeRemaining?: number;
  completedCount: number;
  failedCount: number;
}

/**
 * Output configuration
 */
export interface OutputConfig {
  destinationPath: string;
  namingPattern: string;
  organization: 'flat' | 'by-size' | 'by-format' | 'by-size-and-format';
  overwriteBehavior: 'skip' | 'overwrite' | 'rename';
}

/**
 * Application settings
 */
export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  defaultOutputPath?: string;
  defaultOrganization: OutputConfig['organization'];
  defaultNamingPattern: string;
  rememberLastPath: boolean;
  openFolderAfterCompletion: boolean;
  maxConcurrentJobs: number;
}

/**
 * Preset configuration for quick selections
 */
export interface Preset {
  id: string;
  name: string;
  description: string;
  sizes: string[];
  formats: ImageFormat[];
  isDefault: boolean;
}

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

/**
 * Progress event
 */
export interface ProgressEvent {
  jobId: string;
  progress: number;
  stage: 'loading' | 'converting' | 'resizing' | 'saving';
  message: string;
}
