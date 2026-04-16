import { stat } from 'node:fs/promises';
import { resolvePathWithinWorkspace } from '../../library/guards.js';
import { FSErrorCode, FSToolError, FileMetadata } from '../../library/types.js';

export async function statPathTool(filePath: string): Promise<FileMetadata> {
  const safePath = resolvePathWithinWorkspace(filePath);

  try {
    const s = await stat(safePath);
    let type: 'file' | 'directory' | 'other' = 'other';
    if (s.isFile()) type = 'file';
    else if (s.isDirectory()) type = 'directory';

    return {
      type,
      size: s.size,
      atime: s.atime,
      mtime: s.mtime,
      ctime: s.ctime,
      birthtime: s.birthtime
    };
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      throw new FSToolError(FSErrorCode.FILE_NOT_FOUND, `Path not found: ${filePath}`);
    }
    throw new FSToolError(FSErrorCode.OPERATION_FAILED, `Stat failed: ${error.message}`);
  }
}
