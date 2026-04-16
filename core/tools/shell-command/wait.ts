import { FSErrorCode, FSToolError, ShellResult, JobStatus } from '../../library/types.js';
import { jobManager } from './job-manager.js';

export async function waitTool(jobId: string, onProgress?: (result: ShellResult) => void): Promise<ShellResult> {
  let job = jobManager.getJob(jobId);
  if (!job) {
    throw new FSToolError(FSErrorCode.OPERATION_FAILED, `Job with ID ${jobId} not found.`);
  }

  while (job.status === JobStatus.RUNNING) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    job = jobManager.getJob(jobId)!;
    if (onProgress) {
      onProgress({
        jobId,
        status: job.status,
        output: job.stdout + job.stderr,
      });
    }
  }

  return {
    jobId,
    status: job.status,
    output: job.stdout + job.stderr,
    error: job.status === JobStatus.FAILED ? job.stderr : undefined,
  };
}
