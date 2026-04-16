export enum FSErrorCode {
  PATH_OUT_OF_BOUNDS = 'PATH_OUT_OF_BOUNDS',
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  DIRECTORY_NOT_FOUND = 'DIRECTORY_NOT_FOUND',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  FILE_EXISTS = 'FILE_EXISTS',
  DIRECTORY_EXISTS = 'DIRECTORY_EXISTS',
  NOT_A_TEXT_FILE = 'NOT_A_TEXT_FILE',
  NOT_A_DIRECTORY = 'NOT_A_DIRECTORY',
  INVALID_INPUT = 'INVALID_INPUT',
  OPERATION_FAILED = 'OPERATION_FAILED',
}

export class FSToolError extends Error {
  constructor(public code: FSErrorCode, message: string) {
    super(message);
    this.name = 'FSToolError';
  }
}

export interface FileMetadata {
  type: 'file' | 'directory' | 'other';
  size: number;
  atime: Date;
  mtime: Date;
  ctime: Date;
  birthtime: Date;
}

export interface SearchResult {
  path: string;
  line: number;
  column: number;
  preview: string;
}

export interface ListEntry {
  name: string;
  path: string;
  type: 'file' | 'directory' | 'other';
  metadata?: FileMetadata;
}

export enum JobStatus {
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  TIMEOUT = 'TIMEOUT',
}

export interface JobInfo {
  id: string;
  command: string;
  status: JobStatus;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  startTime: number;
  endTime?: number;
}

export interface ShellResult {
  jobId: string;
  status: JobStatus;
  output: string;
  error?: string;
}

