import { spawn, ChildProcess } from 'node:child_process';
import { JobStatus, JobInfo } from '../../library/types.js';

export class JobManager {
  private static instance: JobManager;
  private jobs: Map<string, JobInfo> = new Map();
  private processes: Map<string, ChildProcess> = new Map();

  private constructor() {}

  public static getInstance(): JobManager {
    if (!JobManager.instance) {
      JobManager.instance = new JobManager();
    }
    return JobManager.instance;
  }

  public generateJobId(): string {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  }

  public createJob(command: string): string {
    const id = this.generateJobId();
    const job: JobInfo = {
      id,
      command,
      status: JobStatus.RUNNING,
      stdout: '',
      stderr: '',
      exitCode: null,
      startTime: Date.now(),
    };
    this.jobs.set(id, job);
    return id;
  }

  public runJob(id: string): Promise<void> {
    const job = this.jobs.get(id);
    if (!job) return Promise.reject(new Error('Job not found'));

    const child = spawn(job.command, { shell: true });
    this.processes.set(id, child);

    child.stdout.on('data', (data) => {
      job.stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      job.stderr += data.toString();
    });

    return new Promise((resolve) => {
      child.on('close', (code) => {
        job.exitCode = code;
        job.status = code === 0 ? JobStatus.COMPLETED : JobStatus.FAILED;
        job.endTime = Date.now();
        this.processes.delete(id);
        resolve();
      });

      child.on('error', (err) => {
        job.status = JobStatus.FAILED;
        job.stderr += `\nError spawning process: ${err.message}`;
        job.endTime = Date.now();
        this.processes.delete(id);
        resolve();
      });
    });
  }

  public getJob(id: string): JobInfo | undefined {
    return this.jobs.get(id);
  }

  public isFinished(id: string): boolean {
    const job = this.jobs.get(id);
    return job ? job.status !== JobStatus.RUNNING : true;
  }

  public abortJob(id: string): void {
    const proc = this.processes.get(id);
    const job = this.jobs.get(id);
    if (proc && job) {
      proc.kill('SIGTERM');
      job.status = JobStatus.ABORTED;
      job.endTime = Date.now();
      this.processes.delete(id);
    }
  }
}

export const jobManager = JobManager.getInstance();
