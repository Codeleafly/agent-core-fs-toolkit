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
};

/**
 * Super Simple AI-First API Alias
 */
export const fs = {
  read: async (path: string, options: any = {}) => {
    const res = await readFileTool(path, options);
    return options.json ? JSON.stringify({ content: res.toString() }) : res.toString();
  },
  write: async (path: string, content: string | Buffer, options: any = {}) => {
    await writeFileTool(path, content);
    return options.json ? JSON.stringify({ success: true, path }) : undefined;
  },
  edit: async (path: string, options: any = {}) => {
    await editFileTool(path, options);
    return options.json ? JSON.stringify({ success: true, path }) : undefined;
  },
  shell: async (cmd: string, options: any = {}) => {
    const res = await runShellTool(cmd);
    return options.json ? JSON.stringify(res) : res.output;
  },
  status: async (id: string, options: any = {}) => {
    const res = await getToolStatusTool(id);
    return options.json ? JSON.stringify(res) : res.output;
  },
  wait: async (id: string, options: any = {}) => {
    const res = await waitTool(id);
    return options.json ? JSON.stringify(res) : res.output;
  },
  ls: async (path: string, options: any = {}) => {
    const res = await listDirectoryTool(path, options);
    return options.json ? JSON.stringify(res) : res.map(e => `${e.type === 'directory' ? '[D]' : '[F]'} ${e.name}`).join('\n');
  },
  mkdir: async (path: string, options: any = {}) => {
    await createDirectoryTool(path);
    return options.json ? JSON.stringify({ success: true, path }) : undefined;
  },
  rm: async (path: string, recursive = false, options: any = {}) => {
    await removePathTool(path, recursive);
    return options.json ? JSON.stringify({ success: true, path }) : undefined;
  },
  mv: async (src: string, dst: string, options: any = {}) => {
    await movePathTool(src, dst, options.overwrite);
    return options.json ? JSON.stringify({ success: true, src, dst }) : undefined;
  },
  cp: async (src: string, dst: string, options: any = {}) => {
    await copyPathTool(src, dst, options.recursive);
    return options.json ? JSON.stringify({ success: true, src, dst }) : undefined;
  },
  stat: async (path: string, options: any = {}) => {
    const res = await statPathTool(path);
    return options.json ? JSON.stringify(res) : `Type: ${res.type}, Size: ${res.size}`;
  },
  search: async (path: string, query: string, options: any = {}) => {
    const res = await searchContentTool(path, query, options);
    return options.json ? JSON.stringify(res) : res.map(r => `${r.path}:${r.line}:${r.column}: ${r.preview}`).join('\n');
  }
};


