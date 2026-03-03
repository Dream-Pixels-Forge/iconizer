import { type BatchJob } from '../types';
import { convertImage } from './converter';

/**
 * Worker for processing individual jobs
 */
export class Worker {
  private id: string;
  private currentJob: BatchJob | null = null;
  private isBusy = false;
  private shouldCancel = false;

  constructor(id: string) {
    this.id = id;
  }

  /**
   * Process a job
   */
  async process(job: BatchJob): Promise<void> {
    this.currentJob = job;
    this.isBusy = true;
    this.shouldCancel = false;

    try {
      job.status = 'processing';
      job.progress = 10;

      // Read input buffer (in real implementation, read from file system)
      const inputBuffer = job.inputBuffer;
      if (!inputBuffer) {
        throw new Error('No input buffer provided');
      }

      job.progress = 30;

      // Convert image
      const result = await convertImage(inputBuffer, job.options);

      job.progress = 90;

      if (!result.success || !result.outputBuffer) {
        throw new Error(result.error || 'Conversion failed');
      }

      // Store output buffer (in real implementation, write to file system)
      job.outputBuffer = result.outputBuffer;
      job.progress = 100;
      job.status = 'completed';
    } catch (error) {
      job.status = 'failed';
      job.error = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    } finally {
      this.isBusy = false;
      this.currentJob = null;
    }
  }

  /**
   * Cancel current job
   */
  cancel(): void {
    this.shouldCancel = true;
    if (this.currentJob) {
      this.currentJob.status = 'cancelled';
    }
  }

  /**
   * Check if worker is busy
   */
  busy(): boolean {
    return this.isBusy;
  }

  /**
   * Get worker ID
   */
  getId(): string {
    return this.id;
  }
}

/**
 * Worker pool for parallel processing
 */
export class WorkerPool {
  private workers: Worker[] = [];
  private maxWorkers: number;
  private jobQueue: BatchJob[] = [];
  private processingCount = 0;
  private onComplete?: (job: BatchJob) => void;
  private onError?: (job: BatchJob, error: Error) => void;

  constructor(maxWorkers: number = 4) {
    this.maxWorkers = maxWorkers;
    this.initializeWorkers();
  }

  /**
   * Initialize workers
   */
  private initializeWorkers(): void {
    for (let i = 0; i < this.maxWorkers; i++) {
      this.workers.push(new Worker(`worker-${i}`));
    }
  }

  /**
   * Set callbacks
   */
  setCallbacks(callbacks: {
    onComplete?: (job: BatchJob) => void;
    onError?: (job: BatchJob, error: Error) => void;
  }): void {
    this.onComplete = callbacks.onComplete;
    this.onError = callbacks.onError;
  }

  /**
   * Add a job to the pool
   */
  async addJob(job: BatchJob): Promise<void> {
    this.jobQueue.push(job);
    await this.processQueue();
  }

  /**
   * Add multiple jobs to the pool
   */
  async addJobs(jobs: BatchJob[]): Promise<void> {
    this.jobQueue.push(...jobs);
    await this.processQueue();
  }

  /**
   * Process jobs from queue
   */
  private async processQueue(): Promise<void> {
    while (this.jobQueue.length > 0) {
      const availableWorker = this.workers.find(w => !w.busy());
      if (!availableWorker) {
        // Wait for a worker to become available
        await this.sleep(10);
        continue;
      }

      const job = this.jobQueue.shift();
      if (!job) continue;

      this.processingCount++;

      // Process job asynchronously
      availableWorker.process(job).then(
        () => {
          this.processingCount--;
          this.onComplete?.(job);
        },
        (error) => {
          this.processingCount--;
          this.onError?.(job, error);
        }
      );
    }
  }

  /**
   * Wait for all jobs to complete
   */
  async waitForCompletion(): Promise<void> {
    while (this.jobQueue.length > 0 || this.processingCount > 0) {
      await this.sleep(10);
    }
  }

  /**
   * Cancel all pending jobs
   */
  cancelAll(): void {
    this.jobQueue = [];
    this.workers.forEach(worker => worker.cancel());
  }

  /**
   * Get pool statistics
   */
  getStats(): {
    queueLength: number;
    processingCount: number;
    maxWorkers: number;
    availableWorkers: number;
  } {
    return {
      queueLength: this.jobQueue.length,
      processingCount: this.processingCount,
      maxWorkers: this.maxWorkers,
      availableWorkers: this.workers.filter(w => !w.busy()).length,
    };
  }

  /**
   * Sleep helper
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
