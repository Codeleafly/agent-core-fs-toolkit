import { cp, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { resolvePathWithinWorkspace } from '../../library/guards.js';
import { FSErrorCode, FSToolError } from '../../library/types.js';

export async function copyPathTool(source: string, destination: string, recursive: boolean = true): Promise<void> {
  const safeSource = resolvePathWithinWorkspace(source);
  const safeDest = resolvePathWithinWorkspace(destination);

  try {
    const destDir = dirname(safeDest);
    await mkdir(destDir, { recursive: true });

    await cp(safeSource, safeDest, { recursive });
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      throw new FSToolError(FSErrorCode.FILE_NOT_FOUND, `Source not found: ${source}`);
    }
    throw new FSToolError(FSErrorCode.OPERATION_FAILED, `Copy failed: ${error.message}`);
  }
}
