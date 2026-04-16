# Agent-Core FS Toolkit - Project Context

## Tech Stack
- **Language:** TypeScript 5.x (Strict mode)
- **Runtime:** Node.js (ESM)
- **Resolution:** NodeNext
- **Test Runner:** node:test

## Core Architecture
This project is a secure file system toolkit for AI agents. Its primary goal is to provide FS operations that are safe from directory traversal and unauthorized access.

- `core/library/guards.ts`: Contains the `resolvePathWithinWorkspace` logic. **All tools must use this.**
- `core/tools/`: Each tool is an isolated ESM module.
- `core/tools/shell-command/job-manager.ts`: Manages background processes (Job ID based).

## Critical Rules for AI Agents
1. **Security First:** Never implement a tool or modification that bypasses `resolvePathWithinWorkspace`.
2. **Path Normalization:** Always normalize paths before performing any FS operation.
3. **Shell Safety:** Use the `DANGEROUS_PATTERNS` blacklist in `core/tools/shell-command/index.ts` for any shell execution logic.
4. **Error Handling:** Always use `FSToolError` with appropriate `FSErrorCode`.
5. **No `any`:** Strict typing is mandatory. Use interfaces defined in `core/library/types.ts`.
6. **ESM Imports:** Always use `.js` extensions in imports (e.g., `import { x } from './y.js'`).

## Specialized Agent Folders
- **Cursor Rules:** `.cursor/rules/`
- **Gemini CLI Rules:** `.gemini/GEMINI.md`
- **Windsurf Rules:** `.windsurf/rules/`
- **GitHub Copilot:** `.github/copilot-instructions.md`

## Commands
- **Build:** `npm run build`
- **Test:** `npm run test`
- **Type Check:** `npm run type-check`
- **Dev:** `npm run dev`

## File System Boundary
The workspace root is the absolute boundary. No tool should ever access `/etc`, `/home` (above workspace), or system directories.
