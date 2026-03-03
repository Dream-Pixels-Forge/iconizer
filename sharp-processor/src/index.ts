/**
 * Iconizer Sharp Processor
 * 
 * High-performance image processing module using Sharp/libvips
 */

// Converter
export { convertImage, convertToIco, getSupportedFormats, isFormatSupported } from './converter';

// Resizer
export {
  resizeImage,
  generateMultipleSizes,
  generateThumbnail,
  getOptimalFitMode,
  type ResizeFit,
  type ResizeOptions,
} from './resizer';

// Quality
export {
  getQualitySettings,
  calculateOptimalQuality,
  estimateFileSize,
  getRecommendedQuality,
  QUALITY_PRESETS,
  type QualityPreset,
  type QualitySettings,
} from './quality';

// Errors
export {
  createProcessingError,
  categorizeError,
  getUserFriendlyMessage,
  isRecoverableError,
  logError,
} from './errors';

// Batch Processing
export { BatchQueue } from './batch';
export { Worker, WorkerPool } from './workerPool';
export { ProgressTracker } from './progress';

// Types
export type {
  ImageFormat,
  ImageSize,
  ProcessingOptions,
  ProcessingResult,
  BatchJob,
  JobStatus,
  ProgressEvent,
  ProcessingError,
  ProcessingErrorType,
} from './types';
