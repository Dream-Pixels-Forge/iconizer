import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format file size to human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format dimensions to string
 */
export function formatDimensions(width: number, height: number): string {
  return `${width}×${height}`;
}

/**
 * Get file extension from format
 */
export function getExtension(format: string): string {
  const extensions: Record<string, string> = {
    jpeg: 'jpg',
    jpg: 'jpg',
    png: 'png',
    webp: 'webp',
    ico: 'ico',
    bmp: 'bmp',
    gif: 'gif',
    tiff: 'tiff',
    svg: 'svg',
  };
  return extensions[format.toLowerCase()] || format.toLowerCase();
}

/**
 * Validate image format
 */
export function isValidFormat(format: string): boolean {
  const validFormats = ['png', 'jpg', 'jpeg', 'webp', 'ico', 'bmp', 'gif', 'tiff', 'svg'];
  return validFormats.includes(format.toLowerCase());
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Check if running on Windows
 */
export function isWindows(): boolean {
  return navigator.platform.toLowerCase().includes('win');
}

/**
 * Check if running on macOS
 */
export function isMacOS(): boolean {
  return navigator.platform.toLowerCase().includes('mac');
}

/**
 * Check if running on Linux
 */
export function isLinux(): boolean {
  return navigator.platform.toLowerCase().includes('linux');
}

/**
 * Calculate estimated processing time
 */
export function estimateProcessingTime(
  jobCount: number,
  avgTimePerJob: number = 500
): number {
  return jobCount * avgTimePerJob;
}

/**
 * Format time duration to human-readable string
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}
