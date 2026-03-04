/**
 * Adjustment Pipeline (v1.1.0)
 * 
 * Applies image adjustments in the correct order:
 * 1. Transform (crop, rotate, flip)
 * 2. Color corrections (brightness, contrast, saturation, etc.)
 * 3. Filters (grayscale, sepia, blur, sharpen)
 * 4. Overlay (watermark)
 */

import type { Adjustments } from '../types';

/**
 * Adjustment pipeline configuration
 */
export interface AdjustmentPipelineConfig {
  adjustments: Adjustments;
  sourcePath: string;
  outputPath: string;
  format?: string;
  quality?: number;
}

/**
 * Pipeline result
 */
export interface PipelineResult {
  success: boolean;
  outputPath?: string;
  error?: string;
  processingTime?: number;
}

/**
 * Apply all adjustments to an image
 * 
 * @param config - Pipeline configuration
 * @returns Pipeline result
 */
export async function applyAdjustments(
  config: AdjustmentPipelineConfig
): Promise<PipelineResult> {
  const startTime = performance.now();
  
  try {
    const { adjustments, sourcePath, outputPath, format = 'png', quality = 90 } = config;
    
    // TODO: Implement with Tauri/Rust backend
    // This is a placeholder for the actual implementation
    
    // The actual implementation will:
    // 1. Load the image
    // 2. Apply transform operations (crop, rotate, flip)
    // 3. Apply color adjustments (brightness, contrast, saturation, etc.)
    // 4. Apply filters (grayscale, sepia, blur, sharpen)
    // 5. Apply watermark if present
    // 6. Save the result
    
    // Placeholder implementation
    console.log('Applying adjustments:', adjustments);
    console.log(`Source: ${sourcePath}, Output: ${outputPath}, Format: ${format}`);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const endTime = performance.now();
    
    return {
      success: true,
      outputPath,
      processingTime: endTime - startTime,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return {
      success: false,
      error: errorMessage,
      processingTime: performance.now() - startTime,
    };
  }
}

/**
 * Apply brightness adjustment
 * 
 * @param imageData - Image data to modify
 * @param value - Brightness value (-100 to 100)
 * @returns Modified image data
 */
export function applyBrightness(
  imageData: ImageData,
  value: number
): ImageData {
  const data = imageData.data;
  const factor = value / 100;
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = clamp(data[i] + factor * 255);     // R
    data[i + 1] = clamp(data[i + 1] + factor * 255); // G
    data[i + 2] = clamp(data[i + 2] + factor * 255); // B
    // Alpha channel unchanged
  }
  
  return imageData;
}

/**
 * Apply contrast adjustment
 * 
 * @param imageData - Image data to modify
 * @param value - Contrast value (-100 to 100)
 * @returns Modified image data
 */
export function applyContrast(
  imageData: ImageData,
  value: number
): ImageData {
  const data = imageData.data;
  const factor = (259 * (value + 255)) / (255 * (259 - value));
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = clamp(factor * (data[i] - 128) + 128);     // R
    data[i + 1] = clamp(factor * (data[i + 1] - 128) + 128); // G
    data[i + 2] = clamp(factor * (data[i + 2] - 128) + 128); // B
  }
  
  return imageData;
}

/**
 * Apply saturation adjustment
 * 
 * @param imageData - Image data to modify
 * @param value - Saturation value (-100 to 100)
 * @returns Modified image data
 */
export function applySaturation(
  imageData: ImageData,
  value: number
): ImageData {
  const data = imageData.data;
  const factor = 1 + value / 100;
  
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.2989 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    
    data[i] = clamp(gray + factor * (data[i] - gray));     // R
    data[i + 1] = clamp(gray + factor * (data[i + 1] - gray)); // G
    data[i + 2] = clamp(gray + factor * (data[i + 2] - gray)); // B
  }
  
  return imageData;
}

/**
 * Apply hue rotation
 * 
 * @param imageData - Image data to modify
 * @param degrees - Hue rotation in degrees (0 to 360)
 * @returns Modified image data
 */
export function applyHueRotation(
  imageData: ImageData,
  degrees: number
): ImageData {
  const data = imageData.data;
  const rad = (degrees * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Convert to YUV-like space for hue rotation
    const y = 0.299 * r + 0.587 * g + 0.114 * b;
    const u = -0.147 * r - 0.289 * g + 0.436 * b;
    const v = 0.615 * r - 0.515 * g - 0.100 * b;
    
    // Rotate hue
    const uRot = u * cos - v * sin;
    const vRot = u * sin + v * cos;
    
    // Convert back to RGB
    data[i] = clamp(y + 1.140 * vRot);     // R
    data[i + 1] = clamp(y - 0.395 * uRot - 0.581 * vRot); // G
    data[i + 2] = clamp(y + 2.032 * uRot);     // B
  }
  
  return imageData;
}

/**
 * Apply grayscale filter
 * 
 * @param imageData - Image data to modify
 * @returns Modified image data
 */
export function applyGrayscale(imageData: ImageData): ImageData {
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    data[i] = gray;     // R
    data[i + 1] = gray; // G
    data[i + 2] = gray; // B
  }
  
  return imageData;
}

/**
 * Apply sepia filter
 * 
 * @param imageData - Image data to modify
 * @returns Modified image data
 */
export function applySepia(imageData: ImageData): ImageData {
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    data[i] = clamp(0.393 * r + 0.769 * g + 0.189 * b);     // R
    data[i + 1] = clamp(0.349 * r + 0.686 * g + 0.168 * b); // G
    data[i + 2] = clamp(0.272 * r + 0.534 * g + 0.131 * b); // B
  }
  
  return imageData;
}

/**
 * Clamp value between 0 and 255
 */
function clamp(value: number): number {
  return Math.max(0, Math.min(255, value));
}

/**
 * Validate adjustments
 * 
 * @param adjustments - Adjustments to validate
 * @returns Validation result
 */
export function validateAdjustments(adjustments: Partial<Adjustments>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Validate brightness
  if (adjustments.brightness !== undefined && 
      (adjustments.brightness < -100 || adjustments.brightness > 100)) {
    errors.push('Brightness must be between -100 and 100');
  }
  
  // Validate contrast
  if (adjustments.contrast !== undefined && 
      (adjustments.contrast < -100 || adjustments.contrast > 100)) {
    errors.push('Contrast must be between -100 and 100');
  }
  
  // Validate saturation
  if (adjustments.saturation !== undefined && 
      (adjustments.saturation < -100 || adjustments.saturation > 100)) {
    errors.push('Saturation must be between -100 and 100');
  }
  
  // Validate hue
  if (adjustments.hue !== undefined && 
      (adjustments.hue < 0 || adjustments.hue > 360)) {
    errors.push('Hue must be between 0 and 360 degrees');
  }
  
  // Validate vibrance
  if (adjustments.vibrance !== undefined && 
      (adjustments.vibrance < -100 || adjustments.vibrance > 100)) {
    errors.push('Vibrance must be between -100 and 100');
  }
  
  // Validate blur
  if (adjustments.blur !== undefined && 
      (adjustments.blur < 0 || adjustments.blur > 20)) {
    errors.push('Blur must be between 0 and 20px');
  }
  
  // Validate sharpen
  if (adjustments.sharpen !== undefined && 
      (adjustments.sharpen < 0 || adjustments.sharpen > 10)) {
    errors.push('Sharpen must be between 0 and 10px');
  }
  
  // Validate watermark opacity
  if (adjustments.watermark?.opacity !== undefined && 
      (adjustments.watermark.opacity < 0 || adjustments.watermark.opacity > 100)) {
    errors.push('Watermark opacity must be between 0 and 100');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get default adjustments
 * 
 * @returns Default adjustment values
 */
export function getDefaultAdjustments(): Adjustments {
  return {
    brightness: 0,
    contrast: 0,
    saturation: 0,
    hue: 0,
    vibrance: 0,
    redBalance: 0,
    greenBalance: 0,
    blueBalance: 0,
    grayscale: false,
    sepia: false,
    blur: 0,
    sharpen: 0,
    rotate: 0,
    flipHorizontal: false,
    flipVertical: false,
    crop: undefined,
    watermark: undefined,
  };
}

/**
 * Check if adjustments have any non-default values
 * 
 * @param adjustments - Adjustments to check
 * @returns True if any adjustments are applied
 */
export function hasAdjustments(adjustments: Partial<Adjustments>): boolean {
  const defaults = getDefaultAdjustments();
  
  for (const key in adjustments) {
    const adjKey = key as keyof Adjustments;
    const value = adjustments[adjKey];
    const defaultValue = defaults[adjKey];
    
    if (typeof value === 'object' && value !== null) {
      // Handle watermark object
      if (JSON.stringify(value) !== JSON.stringify(defaultValue)) {
        return true;
      }
    } else if (value !== defaultValue) {
      return true;
    }
  }
  
  return false;
}
