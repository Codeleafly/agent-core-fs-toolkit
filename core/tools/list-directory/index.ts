import { readdir, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { resolvePathWithinWorkspace } from '../../library/guards.js';
import { FSErrorCode, FSToolError, ListEntry, FileMetadata } from '../../library/types.js';

export interface ListDirectoryOptions {
  recursive?: boolean;
  includeMetadata?: boolean;
}

export async function listDirectoryTool(
  dirPath: string,
  options: ListDirectoryOptions = {}
): Promise<ListEntry[]> {
  const safePath = resolvePathWithinWorkspace(dirPath);
  const WORKSPACE_ROOT = process.cwd();
  const results: ListEntry[] = [];

  async function walk(currentPath: string) {
    let entries;
    try {
      entries = await readdir(currentPath, { withFileTypes: true });
    } catch (error: any) {
       if (error.code === 'ENOTDIR') {
         throw new FSToolError(FSErrorCode.NOT_A_DIRECTORY, `Path '${dirPath}' is not a directory.`);
       }
       throw error;
    }

    for (const entry of entries) {
      const fullPath = join(currentPath, entry.name);
      const relPath = relative(WORKSPACE_ROOT, fullPath);
      
      let type: 'file' | 'directory' | 'other' = 'other';
      if (entry.isFile()) type = 'file';
      else if (entry.isDirectory()) type = 'directory';

      const listEntry: ListEntry = {
        name: entry.name,
        path: relPath,
        type
      };

      if (options.includeMetadata) {
        const stats = await stat(fullPath);
        listEntry.metadata = {
          type,
          size: stats.size,
          atime: stats.atime,
          mtime: stats.mtime,
          ctime: stats.ctime,
          birthtime: stats.birthtime
        };
      }

      results.push(listEntry);

      if (options.recursive && entry.isDirectory()) {
        await walk(fullPath);
      }
    }
  }

  try {
    await walk(safePath);
    return results;
  } catch (error: any) {
    if (error instanceof FSToolError) throw error;
    throw new FSToolError(FSErrorCode.OPERATION_FAILED, `List failed: ${error.message}`);
  }
}
