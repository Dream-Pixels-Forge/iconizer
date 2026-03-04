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

// ============================================
// Batch Editing Types (v1.1.0)
// ============================================

/**
 * Adjustment values for image editing
 */
export interface Adjustments {
  // Basic adjustments (-100 to 100)
  brightness: number;
  contrast: number;
  saturation: number;
  
  // Color corrections
  hue: number; // 0 to 360 degrees
  vibrance: number; // -100 to 100
  
  // RGB balance (-100 to 100)
  redBalance: number;
  greenBalance: number;
  blueBalance: number;
  
  // Filters
  grayscale: boolean;
  sepia: boolean;
  blur: number; // 0 to 20px
  sharpen: number; // 0 to 10px
  
  // Transform
  rotate: number; // degrees
  flipHorizontal: boolean;
  flipVertical: boolean;
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  
  // Watermark
  watermark?: {
    type: 'text' | 'image';
    text?: string;
    imagePath?: string;
    position: 'top-left' | 'top-center' | 'top-right' | 
              'middle-left' | 'middle-center' | 'middle-right' | 
              'bottom-left' | 'bottom-center' | 'bottom-right';
    opacity: number; // 0 to 100
    scale?: number; // for image watermark
    fontSize?: number; // for text watermark
    color?: string; // for text watermark
  };
}

/**
 * Adjustment preset
 */
export interface AdjustmentPreset {
  id: string;
  name: string;
  description?: string;
  adjustments: Partial<Adjustments>;
  createdAt: number;
  updatedAt: number;
  isDefault: boolean;
}

/**
 * Adjustment history entry for undo/redo
 */
export interface AdjustmentHistoryEntry {
  id: string;
  timestamp: number;
  adjustments: Partial<Adjustments>;
  action: 'adjustment' | 'preset-applied' | 'reset';
  presetId?: string;
}

/**
 * Batch edit job
 */
export interface BatchEditJob {
  id: string;
  imagePath: string;
  adjustments: Adjustments;
  status: JobStatus;
  progress: number;
  outputPath?: string;
  error?: string;
}

/**
 * Batch editing state
 */
export interface BatchEditState {
  // Current adjustments being applied
  currentAdjustments: Adjustments;
  
  // Selected images for batch editing
  selectedImages: string[]; // image paths
  
  // Saved presets
  presets: AdjustmentPreset[];
  
  // History for undo/redo
  history: AdjustmentHistoryEntry[];
  historyIndex: number;
  
  // Batch processing state
  isApplying: boolean;
  batchProgress: number;
  batchResults: {
    success: number;
    failed: number;
    skipped: number;
  };
  
  // UI state
  activePanel: 'adjustments' | 'filters' | 'transform' | 'watermark' | 'presets';
  showPreview: boolean;
  previewMode: 'before' | 'after' | 'split' | 'slider';
}

/**
 * Adjustment action types
 */
export type AdjustmentAction =
  | { type: 'SET_ADJUSTMENT'; payload: { key: keyof Adjustments; value: any } }
  | { type: 'SET_MULTIPLE_ADJUSTMENTS'; payload: Partial<Adjustments> }
  | { type: 'RESET_ADJUSTMENT'; payload: { key: keyof Adjustments } }
  | { type: 'RESET_ALL_ADJUSTMENTS' }
  | { type: 'SELECT_IMAGES'; payload: string[] }
  | { type: 'ADD_TO_SELECTION'; payload: string }
  | { type: 'REMOVE_FROM_SELECTION'; payload: string }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'SAVE_PRESET'; payload: { name: string; description?: string } }
  | { type: 'LOAD_PRESET'; payload: string } // preset id
  | { type: 'DELETE_PRESET'; payload: string } // preset id
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'APPLY_BATCH' }
  | { type: 'CANCEL_BATCH' }
  | { type: 'SET_ACTIVE_PANEL'; payload: BatchEditState['activePanel'] }
  | { type: 'SET_PREVIEW_MODE'; payload: BatchEditState['previewMode'] }
  | { type: 'TOGGLE_PREVIEW' };
