import { rm, stat } from 'node:fs/promises';
import { resolvePathWithinWorkspace } from '../../library/guards.js';
import { FSErrorCode, FSToolError } from '../../library/types.js';

export async function removePathTool(pathToRemove: string, recursive: boolean = false): Promise<void> {
  const safePath = resolvePathWithinWorkspace(pathToRemove);

  try {
    const stats = await stat(safePath);
    if (stats.isDirectory() && !recursive) {
      throw new FSToolError(FSErrorCode.INVALID_INPUT, `Path '${pathToRemove}' is a directory. Set 'recursive: true' to delete it.`);
    }

    await rm(safePath, { recursive, force: true });
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // Already gone or doesn't exist, which is fine for a delete tool
      return;
    }
    if (error instanceof FSToolError) throw error;
    throw new FSToolError(FSErrorCode.OPERATION_FAILED, `Remove failed: ${error.message}`);
  }
}
