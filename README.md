# Agent-Core FS Toolkit

A secure, production-grade file system toolkit for AI agents. Built with TypeScript and ESM.

## Core Features

- **Workspace Bound:** Strictly operates within the current working directory.
- **Security-Centric:** Prevents directory traversal (`../`) and symlink escapes.
- **Modern ESM:** Pure ESM implementation with TypeScript support.
- **Comprehensive:** Tools for reading, writing, editing, searching, and managing file paths.

## Installation

```bash
npm install
npm run build
```

## Usage

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
