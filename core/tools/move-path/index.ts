import { rename, stat, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { resolvePathWithinWorkspace } from '../../library/guards.js';
import { FSErrorCode, FSToolError } from '../../library/types.js';

export async function movePathTool(source: string, destination: string, overwrite: boolean = false): Promise<void> {
  const safeSource = resolvePathWithinWorkspace(source);
  const safeDest = resolvePathWithinWorkspace(destination);

  try {
    if (!overwrite) {
      try {
        await stat(safeDest);
        throw new FSToolError(FSErrorCode.FILE_EXISTS, `Destination already exists: ${destination}`);
      } catch (e: any) {
        if (e.code !== 'ENOENT') throw e;
      }
    }

    const destDir = dirname(safeDest);
    await mkdir(destDir, { recursive: true });

    await rename(safeSource, safeDest);
  } catch (error: any) {
    if (error instanceof FSToolError) throw error;
    if (error.code === 'ENOENT') {
      throw new FSToolError(FSErrorCode.FILE_NOT_FOUND, `Source not found: ${source}`);
    }
    throw new FSToolError(FSErrorCode.OPERATION_FAILED, `Move failed: ${error.message}`);
  }
}
