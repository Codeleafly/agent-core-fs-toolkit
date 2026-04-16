import { FSErrorCode, FSToolError, ShellResult, JobStatus } from '../../library/types.js';
import { jobManager } from './job-manager.js';

const DANGEROUS_PATTERNS = [
  /rm\s+-rf\s+\//,
  /rm\s+-rf\s+\/etc/,
  /rm\s+-rf\s+\/bin/,
  /rm\s+-rf\s+\/usr/,
  /mkfs/,
  /dd\s+if=\/dev\/zero/,
  />\s+\/dev\//,
  /chmod\s+.*777/,
];

function isCommandDangerous(command: string): boolean {
  return DANGEROUS_PATTERNS.some((pattern) => pattern.test(command));
}

export async function runShellTool(command: string): Promise<ShellResult> {
  if (isCommandDangerous(command)) {
    throw new FSToolError(FSErrorCode.PERMISSION_DENIED, 'Dangerous shell command blocked.');
  }

  const jobId = jobManager.createJob(command);
  const runPromise = jobManager.runJob(jobId);

  // Wait for 15 seconds or completion
  const timeoutPromise = new Promise<void>((resolve) => {
    setTimeout(resolve, 15000);
  });

  await Promise.race([runPromise, timeoutPromise]);

  const job = jobManager.getJob(jobId)!;

  return {
    jobId,
    status: job.status,
    output: job.stdout + job.stderr,
    error: job.status === JobStatus.FAILED ? job.stderr : undefined,
  };
}
