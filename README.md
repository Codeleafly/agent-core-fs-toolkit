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

The `fs` alias provides a high-level, easy-to-use interface specifically designed for AI agents.

```typescript
import { fs } from 'agent-core-fs-toolkit';

// Read as string
const text = await fs.read('info.txt');

// Run shell and get JSON result for your agent
const result = await fs.shell('npm run build', { json: true });
console.log(result); // { jobId: "12345678", status: "COMPLETED", output: "..." }

// List files
const files = await fs.ls('.');
```

## Toolset (fs Alias)

- `fs.read(path, options)`: Read file content.
- `fs.write(path, content, options)`: Write content to file.
- `fs.edit(path, options)`: Edit text file.
- `fs.shell(command, options)`: Run shell command (15s blocking then background).
- `fs.status(jobId, options)`: Check background job status.
- `fs.abort(jobId, options)`: Terminate a background job.
- `fs.wait(jobId, options)`: Wait for job completion.
- `fs.ls(path, options)`: List directory.
- `fs.rm(path, options)`: Remove file/folder (use `{ recursive: true }` for folders).
- `fs.mkdir(path, options)`: Create directory.
- `fs.mv(src, dst, options)`: Move/rename.
- `fs.cp(src, dst, options)`: Copy path.
- `fs.stat(path, options)`: Get metadata.
- `fs.search(path, query, options)`: Search content.

*All methods support `{ json: true }` in options to return a stringified JSON result.*

## Security Design

The library is built with security as a core principle:
1. **Workspace Boundary:** Uses `resolvePathWithinWorkspace` to ensure all paths are normalized and validated against the workspace root. Any escape attempt throws `PATH_OUT_OF_BOUNDS`.
2. **Shell Safety:** The `runShell` tool blocks dangerous patterns like `rm -rf /`, root modifications, and unauthorized `chmod` calls.

## Job Management

For long-running processes:
1. **Auto-Background:** `runShell` attempts to finish within 15 seconds. If it takes longer, it yields a `jobId` and continues in the background.
2. **Monitoring:** Use `fs.status(jobId)` to check progress.
3. **Control:** Use `fs.abort(jobId)` to kill a process or `fs.wait(jobId)` to block until it's done.

## Branching & Contributions

- **main**: Stable production code.
- **beta**: Staging and release testing.
- **dev**: Active development.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.
