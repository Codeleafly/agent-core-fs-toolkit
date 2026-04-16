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

