import { readFileTool } from '../tools/read-file/index.js';
import { writeFileTool } from '../tools/write-file/index.js';
import { editFileTool } from '../tools/edit-file/index.js';
import { removePathTool } from '../tools/remove-path/index.js';
import { searchContentTool } from '../tools/search-content/index.js';
import { listDirectoryTool } from '../tools/list-directory/index.js';
import { createDirectoryTool } from '../tools/create-directory/index.js';
import { movePathTool } from '../tools/move-path/index.js';
import { copyPathTool } from '../tools/copy-path/index.js';
import { statPathTool } from '../tools/stat-path/index.js';
import { runShellTool } from '../tools/shell-command/index.js';
import { getToolStatusTool } from '../tools/shell-command/status.js';
import { waitTool } from '../tools/shell-command/wait.js';
import { jobManager } from '../tools/shell-command/job-manager.js';
import { CommonOptions } from './types.js';

export * from './types.js';
export * from './guards.js';

export const agentCoreFileTools = {
  readFile: readFileTool,
  writeFile: writeFileTool,
  editFile: editFileTool,
  removePath: removePathTool,
  searchContent: searchContentTool,
  listDirectory: listDirectoryTool,
  createDirectory: createDirectoryTool,
  movePath: movePathTool,
  copyPath: copyPathTool,
  statPath: statPathTool,
  runShell: runShellTool,
  getToolStatus: getToolStatusTool,
  wait: waitTool,
  abortJob: (jobId: string) => jobManager.abortJob(jobId),
};

/**
 * Super Simple AI-First API Alias
 */
export const fs = {
  /** Reads a file as string. Supports options.json for JSON response. */
  read: async (path: string, options: CommonOptions & { encoding?: BufferEncoding } = {}) => {
    const res = await readFileTool(path, options);
    return options.json ? JSON.stringify({ content: res.toString() }) : res.toString();
  },
  /** Writes content to a file. */
  write: async (path: string, content: string | Buffer, options: CommonOptions = {}) => {
    await writeFileTool(path, content);
    return options.json ? JSON.stringify({ success: true, path }) : undefined;
  },
  /** Edits a text file with string/regex replacement. */
  edit: async (path: string, options: CommonOptions & any = {}) => {
    await editFileTool(path, options);
    return options.json ? JSON.stringify({ success: true, path }) : undefined;
  },
  /** Runs a shell command. 15s blocking, then background. */
  shell: async (cmd: string, options: CommonOptions = {}) => {
    const res = await runShellTool(cmd);
    return options.json ? JSON.stringify(res) : res.output;
  },
  /** Checks status of a background job. */
  status: async (id: string, options: CommonOptions = {}) => {
    const res = await getToolStatusTool(id);
    return options.json ? JSON.stringify(res) : res.output;
  },
  /** Aborts a running background job. */
  abort: (id: string, options: CommonOptions = {}) => {
    jobManager.abortJob(id);
    return options.json ? JSON.stringify({ success: true, jobId: id }) : undefined;
  },
  /** Waits for a job to finish. */
  wait: async (id: string, options: CommonOptions = {}) => {
    const res = await waitTool(id);
    return options.json ? JSON.stringify(res) : res.output;
  },
  /** Lists directory contents. */
  ls: async (path: string, options: CommonOptions & { recursive?: boolean, includeMetadata?: boolean } = {}) => {
    const res = await listDirectoryTool(path, options);
    return options.json ? JSON.stringify(res) : res.map(e => `${e.type === 'directory' ? '[D]' : '[F]'} ${e.name}`).join('\n');
  },
  /** Creates a directory recursively. */
  mkdir: async (path: string, options: CommonOptions = {}) => {
    await createDirectoryTool(path);
    return options.json ? JSON.stringify({ success: true, path }) : undefined;
  },
  /** Removes a file or directory. */
  rm: async (path: string, options: CommonOptions & { recursive?: boolean } = {}) => {
    await removePathTool(path, options.recursive);
    return options.json ? JSON.stringify({ success: true, path }) : undefined;
  },
  /** Moves/renames a path. */
  mv: async (src: string, dst: string, options: CommonOptions & { overwrite?: boolean } = {}) => {
    await movePathTool(src, dst, options.overwrite);
    return options.json ? JSON.stringify({ success: true, src, dst }) : undefined;
  },
  /** Copies a path. */
  cp: async (src: string, dst: string, options: CommonOptions & { recursive?: boolean } = {}) => {
    await copyPathTool(src, dst, options.recursive);
    return options.json ? JSON.stringify({ success: true, src, dst }) : undefined;
  },
  /** Gets path metadata. */
  stat: async (path: string, options: CommonOptions = {}) => {
    const res = await statPathTool(path);
    return options.json ? JSON.stringify(res) : `Type: ${res.type}, Size: ${res.size}`;
  },
  /** Searches for text in files. */
  search: async (path: string, query: string, options: CommonOptions & { recursive?: boolean, isRegex?: boolean } = {}) => {
    const res = await searchContentTool(path, query, options);
    return options.json ? JSON.stringify(res) : res.map(r => `${r.path}:${r.line}:${r.column}: ${r.preview}`).join('\n');
  }
};


