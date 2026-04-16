import { readFile } from 'node:fs/promises';
import { resolvePathWithinWorkspace } from '../../library/guards.js';
import { FSErrorCode, FSToolError } from '../../library/types.js';

export interface ReadFileOptions {
  encoding?: BufferEncoding;
}

/**
 * Detects if a buffer is likely binary or text.
 */
function isBinary(buffer: Buffer): boolean {
  for (let i = 0; i < Math.min(buffer.length, 1024); i++) {
    if (buffer[i] === 0) return true;
  }
  return false;
}

export async function readFileTool(filePath: string, options: ReadFileOptions = {}): Promise<string | Buffer> {
  const safePath = resolvePathWithinWorkspace(filePath);

  try {
    const content = await readFile(safePath);
    
    if (options.encoding) {
      return content.toString(options.encoding);
    }

    if (isBinary(content)) {
      return content; // Return Buffer for binary
    }

    return content.toString('utf-8');
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      throw new FSToolError(FSErrorCode.FILE_NOT_FOUND, `File not found: ${filePath}`);
    }
    throw new FSToolError(FSErrorCode.OPERATION_FAILED, `Read failed: ${error.message}`);
  }
}
