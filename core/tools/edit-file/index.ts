import { readFile, writeFile } from 'node:fs/promises';
import { resolvePathWithinWorkspace } from '../../library/guards.js';
import { FSErrorCode, FSToolError } from '../../library/types.js';

export interface EditFileOptions {
  oldString?: string;
  newString?: string;
  pattern?: string | RegExp;
  replacement?: string;
  allowMultiple?: boolean;
}

export async function editFileTool(filePath: string, options: EditFileOptions): Promise<void> {
  const safePath = resolvePathWithinWorkspace(filePath);

  let content: string;
  try {
    content = await readFile(safePath, 'utf-8');
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      throw new FSToolError(FSErrorCode.FILE_NOT_FOUND, `File not found: ${filePath}`);
    }
    throw new FSToolError(FSErrorCode.OPERATION_FAILED, `Read failed: ${error.message}`);
  }

  let newContent: string;

  if (options.oldString !== undefined && options.newString !== undefined) {
    if (!content.includes(options.oldString)) {
      throw new FSToolError(FSErrorCode.OPERATION_FAILED, `Exact match for 'oldString' not found in file.`);
    }

    if (options.allowMultiple) {
      newContent = content.split(options.oldString).join(options.newString);
    } else {
      const parts = content.split(options.oldString);
      if (parts.length > 2) {
         throw new FSToolError(FSErrorCode.OPERATION_FAILED, `Multiple matches for 'oldString' found. Set allowMultiple: true to replace all.`);
      }
      newContent = content.replace(options.oldString, options.newString);
    }
  } else if (options.pattern !== undefined && options.replacement !== undefined) {
    const regex = options.pattern instanceof RegExp ? options.pattern : new RegExp(options.pattern, options.allowMultiple ? 'g' : '');
    
    if (!regex.test(content)) {
      throw new FSToolError(FSErrorCode.OPERATION_FAILED, `Regex pattern not found in file.`);
    }

    newContent = content.replace(regex, options.replacement);
  } else {
    throw new FSToolError(FSErrorCode.INVALID_INPUT, `Either (oldString and newString) or (pattern and replacement) must be provided.`);
  }

  try {
    await writeFile(safePath, newContent, 'utf-8');
  } catch (error: any) {
    throw new FSToolError(FSErrorCode.OPERATION_FAILED, `Write failed during edit: ${error.message}`);
  }
}
