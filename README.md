# Agent-Core FS Toolkit (BETA)

> **⚠️ WARNING:** This library is currently in **Beta** and is NOT yet recommended for critical production environments. However, it is **specially designed for building powerful AI agents** (like Cursor, Claude Code, or Gemini CLI).

## Why Agent-Core?

Building an AI agent that can interact with the local file system is usually complex. `agent-core-fs-toolkit` makes it **super simple**. 

- **AI-First Design:** Provides tools that LLMs can easily understand and use.
- **Local Access:** Gives your AI model safe, controlled access to the local computer's files and shell.
- **Super Simple Syntax:** No complex setup. Just import and run.
- **Zero Configuration:** Modular tools that "just work" out of the box.
- **JSON Ready:** Get structured results directly for your agent's context.

## Installation

```bash
git clone https://github.com/Codeleafly/agent-core-fs-toolkit.git
cd agent-core-fs-toolkit
npm install
npm run build
```

## Quick Start (Super Simple Syntax)

```typescript
import { fs } from 'agent-core-fs-toolkit';

// Read as string
const text = await fs.read('info.txt');

// Run shell and get JSON result for your agent
const result = await fs.shell('npm run build', { json: true });
console.log(result); // { jobId: "12345678", status: "COMPLETED", output: "..." }
```

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
