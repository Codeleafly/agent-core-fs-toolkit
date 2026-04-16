import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { resolvePathWithinWorkspace } from '../../library/guards.js';
import { FSErrorCode, FSToolError, SearchResult } from '../../library/types.js';

export interface SearchOptions {
  recursive?: boolean;
  isRegex?: boolean;
}

export async function searchContentTool(
  searchPath: string,
  query: string,
  options: SearchOptions = {}
): Promise<SearchResult[]> {
  const safePath = resolvePathWithinWorkspace(searchPath);
  const results: SearchResult[] = [];
  const regex = options.isRegex ? new RegExp(query) : null;
  const WORKSPACE_ROOT = process.cwd();

  async function walk(currentPath: string) {
    const stats = await stat(currentPath);

    if (stats.isDirectory()) {
      const entries = await readdir(currentPath);
      for (const entry of entries) {
        const fullPath = join(currentPath, entry);
        if (options.recursive) {
          await walk(fullPath);
        } else {
           const entryStats = await stat(fullPath);
           if (entryStats.isFile()) {
             await searchInFile(fullPath);
           }
        }
      }
    } else if (stats.isFile()) {
      await searchInFile(currentPath);
    }
  }

  async function searchInFile(filePath: string) {
    try {
      const buffer = await readFile(filePath);
      // Skip binary
      for (let i = 0; i < Math.min(buffer.length, 1024); i++) {
        if (buffer[i] === 0) return;
      }

      const content = buffer.toString('utf-8');
      const lines = content.split('\n');
      const relPath = relative(WORKSPACE_ROOT, filePath);

      lines.forEach((line, index) => {
        let match = false;
        let column = -1;

        if (regex) {
          const matchObj = regex.exec(line);
          if (matchObj) {
            match = true;
            column = matchObj.index + 1;
          }
        } else if (line.includes(query)) {
          match = true;
          column = line.indexOf(query) + 1;
        }

        if (match) {
          results.push({
            path: relPath,
            line: index + 1,
            column,
            preview: line.trim()
          });
        }
      });
    } catch (e) {
      // Ignore errors for individual files (e.g. permission or disappearing files)
    }
  }

  try {
    await walk(safePath);
    return results;
  } catch (error: any) {
    throw new FSToolError(FSErrorCode.OPERATION_FAILED, `Search failed: ${error.message}`);
  }
}
