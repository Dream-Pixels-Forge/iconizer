import type { ProgressEvent } from '../types';

/**
 * Progress tracker for batch operations
 */
export class ProgressTracker {
  private totalJobs: number = 0;
  private completedJobs: number = 0;
  private failedJobs: number = 0;
  private jobProgress: Map<string, number> = new Map();
  private startTime: number | null = null;
  private onProgress?: (event: ProgressEvent) => void;

  /**
   * Initialize tracker with job count
   */
  initialize(totalJobs: number): void {
    this.totalJobs = totalJobs;
    this.completedJobs = 0;
    this.failedJobs = 0;
    this.jobProgress.clear();
    this.startTime = Date.now();
  }

  /**
   * Set progress callback
   */
  onProgressUpdate(callback: (event: ProgressEvent) => void): void {
    this.onProgress = callback;
  }

  /**
   * Update job progress
   */
  updateJobProgress(jobId: string, progress: number, stage?: ProgressEvent['stage']): void {
    this.jobProgress.set(jobId, progress);

    const overallProgress = this.calculateOverallProgress();
    const eta = this.calculateETA();

    this.emitProgress({
      jobId,
      progress: overallProgress,
      stage: stage || 'processing',
      message: this.getStatusMessage(overallProgress),
      eta,
    });
  }

  /**
   * Mark job as completed
   */
  completeJob(jobId: string): void {
    this.completedJobs++;
    this.jobProgress.set(jobId, 100);

    const overallProgress = this.calculateOverallProgress();

    this.emitProgress({
      jobId,
      progress: overallProgress,
      stage: 'saving',
      message: `Completed ${this.completedJobs} of ${this.totalJobs}`,
      eta: this.calculateETA(),
    });
  }

  /**
   * Mark job as failed
   */
  failJob(jobId: string): void {
    this.failedJobs++;
    this.jobProgress.set(jobId, 0);

    const overallProgress = this.calculateOverallProgress();

    this.emitProgress({
      jobId,
      progress: overallProgress,
      stage: 'saving',
      message: `Failed: ${this.failedJobs} jobs`,
      eta: this.calculateETA(),
    });
  }

  /**
   * Calculate overall progress
   */
  private calculateOverallProgress(): number {
    if (this.totalJobs === 0) return 0;

    const totalProgress = Array.from(this.jobProgress.values()).reduce(
      (sum, progress) => sum + progress,
      0
    );

    return Math.floor(totalProgress / this.totalJobs);
  }

  /**
   * Calculate estimated time remaining
   */
  private calculateETA(): number | undefined {
    if (!this.startTime || this.completedJobs === 0) return undefined;

    const elapsed = Date.now() - this.startTime;
    const avgTimePerJob = elapsed / (this.completedJobs + this.failedJobs);
    const remainingJobs = this.totalJobs - this.completedJobs - this.failedJobs;

    return Math.floor(avgTimePerJob * remainingJobs);
  }

  /**
   * Get status message
   */
  private getStatusMessage(progress: number): string {
    const completed = this.completedJobs;
    const total = this.totalJobs;
    const failed = this.failedJobs;

    if (failed > 0) {
      return `${completed}/${total} completed (${failed} failed) - ${progress}%`;
    }

    return `${completed}/${total} completed - ${progress}%`;
  }

  /**
   * Emit progress event
   */
  private emitProgress(event: ProgressEvent): void {
    this.onProgress?.(event);
  }

  /**
   * Get progress statistics
   */
  getStats(): {
    total: number;
    completed: number;
    failed: number;
    remaining: number;
    progress: number;
    eta?: number;
  } {
    return {
      total: this.totalJobs,
      completed: this.completedJobs,
      failed: this.failedJobs,
      remaining: this.totalJobs - this.completedJobs - this.failedJobs,
      progress: this.calculateOverallProgress(),
      eta: this.calculateETA(),
    };
  }

  /**
   * Reset tracker
   */
  reset(): void {
    this.totalJobs = 0;
    this.completedJobs = 0;
    this.failedJobs = 0;
    this.jobProgress.clear();
    this.startTime = null;
  }

  /**
   * Format ETA to human-readable string
   */
  static formatETA(ms: number): string {
    if (ms < 1000) return '< 1s';
    if (ms < 60000) return `${Math.floor(ms / 1000)}s`;
    if (ms < 3600000) return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
    return `${Math.floor(ms / 3600000)}h ${Math.floor((ms % 3600000) / 60000)}m`;
  }
}
