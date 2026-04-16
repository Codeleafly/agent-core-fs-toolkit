import { mkdir } from 'node:fs/promises';
import { resolvePathWithinWorkspace } from '../../library/guards.js';
import { FSErrorCode, FSToolError } from '../../library/types.js';

export async function createDirectoryTool(dirPath: string): Promise<void> {
  const safePath = resolvePathWithinWorkspace(dirPath);

  try {
    await mkdir(safePath, { recursive: true });
  } catch (error: any) {
    throw new FSToolError(FSErrorCode.OPERATION_FAILED, `Create directory failed: ${error.message}`);
  }
}
