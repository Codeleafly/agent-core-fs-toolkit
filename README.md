# Agent-Core FS Toolkit

A secure, production-grade file system toolkit for AI agents. Built with TypeScript and ESM.

## Core Features

- **Workspace Bound:** Strictly operates within the current working directory.
- **Security-Centric:** Prevents directory traversal (`../`) and symlink escapes.
- **Modern ESM:** Pure ESM implementation with TypeScript support.
- **Comprehensive:** Tools for reading, writing, editing, searching, and managing file paths.

## Installation

```bash
git clone https://github.com/Codeleafly/agent-core-fs-toolkit.git
cd agent-core-fs-toolkit
npm install
npm run build
```

## Branching & Contributions

- **main**: Stable production code.
- **beta**: Staging and release testing.
- **dev**: Active development.

Please read our [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Security Design

```typescript
import { agentCoreFileTools } from './core/library/index.js';

// Write a file
await agentCoreFileTools.writeFile('hello.txt', 'Hello, World!');

// Read a file
const content = await agentCoreFileTools.readFile('hello.txt');

// Edit a file
await agentCoreFileTools.editFile('hello.txt', {
  oldString: 'World',
  newString: 'Agent'
});

// Search content
const results = await agentCoreFileTools.searchContent('.', 'Agent', { recursive: true });
```

## Security Design

The library uses `resolvePathWithinWorkspace` to ensure all paths are normalized and validated against the workspace root. Any attempt to access files outside this boundary will throw a `FSToolError` with code `PATH_OUT_OF_BOUNDS`.

## Toolset

- `readFile`: Detects text vs binary, returns string or Buffer.
- `writeFile`: Creates directories as needed, enforces UTF-8.
- `editFile`: String and Regex replacement for text files.
- `removePath`: Safe deletion of files/folders.
- `searchContent`: Recursive grep-like search, skips binary.
- `listDirectory`: Metadata-rich directory listing.
- `createDirectory`: Recursive directory creation.
- `movePath`: Safe file/folder moving.
- `copyPath`: Recursive copying.
- `statPath`: File metadata retrieval.
- `runShell`: Executes safe shell commands. Blocks for 15s; if unfinished, returns an 8-digit **Job ID** and continues in background.
- `getToolStatus`: Retrieves real-time output and status (Running/Completed/Failed) using a Job ID.
- `wait`: Blocks until a specific job completes, polling every second for status updates.

## Shell Command Management

The toolkit includes a sophisticated **Job Manager** for handling long-running processes:

1. **Blocking & Background:** `runShell` attempts to finish within 15 seconds. If the task takes longer (e.g., a complex build), it yields a `jobId` so the agent can perform other tasks while the command runs.
2. **Monitoring:** Use `getToolStatus(jobId)` to check on progress without blocking.
3. **Synchronization:** Use `wait(jobId)` when you need to ensure a background task is finished before proceeding.

## Security Design

The `runShell` tool blocks dangerous patterns like:
- `rm -rf /`
- Root directory modifications
- Dangerous device writes (`dd`)
- Unauthorized permission changes (`chmod 777`)
