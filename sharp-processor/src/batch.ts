import type { BatchJob, JobStatus } from '../types';

/**
 * Batch job queue with priority support
 */
export class BatchQueue {
  private queue: BatchJob[] = [];
  private processingJobs: Map<string, BatchJob> = new Map();
  private completedJobs: Map<string, BatchJob> = new Map();
  private failedJobs: Map<string, BatchJob> = new Map();

  /**
   * Add a job to the queue
   */
  enqueue(job: BatchJob): void {
    job.status = 'pending';
    job.progress = 0;
    this.queue.push(job);
  }

  /**
   * Add multiple jobs to the queue
   */
  enqueueMany(jobs: BatchJob[]): void {
    jobs.forEach(job => this.enqueue(job));
  }

  /**
   * Get the next job from the queue
   */
  dequeue(): BatchJob | undefined {
    const job = this.queue.shift();
    if (job) {
      job.status = 'processing';
      this.processingJobs.set(job.id, job);
    }
    return job;
  }

  /**
   * Get job by ID
   */
  getJob(jobId: string): BatchJob | undefined {
    return (
      this.queue.find(j => j.id === jobId) ||
      this.processingJobs.get(jobId) ||
      this.completedJobs.get(jobId) ||
      this.failedJobs.get(jobId)
    );
  }

  /**
   * Mark job as completed
   */
  completeJob(jobId: string): void {
    const job = this.processingJobs.get(jobId);
    if (job) {
      job.status = 'completed';
      job.progress = 100;
      this.processingJobs.delete(jobId);
      this.completedJobs.set(jobId, job);
    }
  }

  /**
   * Mark job as failed
   */
  failJob(jobId: string, error?: string): void {
    const job = this.processingJobs.get(jobId);
    if (job) {
      job.status = 'failed';
      job.error = error;
      this.processingJobs.delete(jobId);
      this.failedJobs.set(jobId, job);
    }
  }

  /**
   * Cancel a job
   */
  cancelJob(jobId: string): void {
    const queueIndex = this.queue.findIndex(j => j.id === jobId);
    if (queueIndex !== -1) {
      const job = this.queue[queueIndex];
      job.status = 'cancelled';
      this.queue.splice(queueIndex, 1);
      return;
    }

    const processingJob = this.processingJobs.get(jobId);
    if (processingJob) {
      processingJob.status = 'cancelled';
      this.processingJobs.delete(jobId);
      this.failedJobs.set(jobId, processingJob);
    }
  }

  /**
   * Get queue statistics
   */
  getStats(): {
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    total: number;
  } {
    return {
      pending: this.queue.length,
      processing: this.processingJobs.size,
      completed: this.completedJobs.size,
      failed: this.failedJobs.size,
      total:
        this.queue.length +
        this.processingJobs.size +
        this.completedJobs.size +
        this.failedJobs.size,
    };
  }

  /**
   * Get all jobs by status
   */
  getJobsByStatus(status?: JobStatus): BatchJob[] {
    const allJobs = [
      ...this.queue,
      ...Array.from(this.processingJobs.values()),
      ...Array.from(this.completedJobs.values()),
      ...Array.from(this.failedJobs.values()),
    ];

    if (!status) return allJobs;

    return allJobs.filter(job => job.status === status);
  }

  /**
   * Clear completed and failed jobs
   */
  clearCompleted(): void {
    this.completedJobs.clear();
    this.failedJobs.clear();
  }

  /**
   * Check if queue is empty
   */
  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  /**
   * Check if all jobs are done
   */
  isAllDone(): boolean {
    return this.queue.length === 0 && this.processingJobs.size === 0;
  }
}
