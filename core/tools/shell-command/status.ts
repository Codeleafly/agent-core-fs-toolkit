import { FSErrorCode, FSToolError, ShellResult } from '../../library/types.js';
import { jobManager } from './job-manager.js';

export async function getToolStatusTool(jobId: string): Promise<ShellResult> {
  const job = jobManager.getJob(jobId);
  if (!job) {
    throw new FSToolError(FSErrorCode.OPERATION_FAILED, `Job with ID ${jobId} not found.`);
  }

  return {
    jobId,
    status: job.status,
    output: job.stdout + job.stderr,
    error: job.status === 'FAILED' ? job.stderr : undefined,
  };
}
