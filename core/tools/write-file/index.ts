import { writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { resolvePathWithinWorkspace } from '../../library/guards.js';
import { FSErrorCode, FSToolError } from '../../library/types.js';

export async function writeFileTool(filePath: string, content: string | Buffer): Promise<void> {
  const safePath = resolvePathWithinWorkspace(filePath);

  try {
    const dir = dirname(safePath);
    await mkdir(dir, { recursive: true });

    await writeFile(safePath, content, { encoding: 'utf-8' });
  } catch (error: any) {
    throw new FSToolError(FSErrorCode.OPERATION_FAILED, `Write failed: ${error.message}`);
  }
}
