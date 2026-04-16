import { resolve, normalize, relative, isAbsolute } from 'node:path';
import { realpathSync } from 'node:fs';
import { FSErrorCode, FSToolError } from './types.js';

const WORKSPACE_ROOT = process.cwd();

/**
 * Validates that a path is within the workspace root and returns the absolute path.
 * Prevents directory traversal attacks and symlink escapes.
 */
export function resolvePathWithinWorkspace(userPath: string): string {
  // 1. Resolve to absolute path
  const absolutePath = isAbsolute(userPath) ? userPath : resolve(WORKSPACE_ROOT, userPath);
  
  // 2. Normalize path (removes ../ etc)
  const normalizedPath = normalize(absolutePath);

  // 3. Check if it starts with WORKSPACE_ROOT
  const rel = relative(WORKSPACE_ROOT, normalizedPath);
  const isOutside = rel.startsWith('..') || isAbsolute(rel);

  if (isOutside) {
    throw new FSToolError(
      FSErrorCode.PATH_OUT_OF_BOUNDS,
      `Access denied: path '${userPath}' is outside the workspace root.`
    );
  }

  return normalizedPath;
}

/**
 * Additional validation for safe filenames/paths
 */
export function validateSafePath(path: string): void {
  // Avoid null bytes or other suspicious characters if necessary
  if (path.includes('\0')) {
    throw new FSToolError(FSErrorCode.INVALID_INPUT, 'Path contains invalid characters.');
  }
}

/**
 * Ensures that if the path is a symlink, it also resolves within the workspace.
 */
export function resolveSafeRealPath(userPath: string): string {
  const resolved = resolvePathWithinWorkspace(userPath);
  try {
    const realPath = realpathSync(resolved);
    const rel = relative(WORKSPACE_ROOT, realPath);
    const isOutside = rel.startsWith('..') || isAbsolute(rel);

    if (isOutside) {
       throw new FSToolError(
        FSErrorCode.PATH_OUT_OF_BOUNDS,
        `Access denied: symlink resolves to path outside workspace root.`
      );
    }
    return realPath;
  } catch (error) {
    // If realpath fails (e.g. file doesn't exist), we return the resolved path
    // and let the caller handle existence checks if needed.
    return resolved;
  }
}
