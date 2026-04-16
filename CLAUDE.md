# Agent-Core FS Toolkit - Project Context

## Tech Stack
- **Language:** TypeScript 5.x (Strict mode)
- **Runtime:** Node.js (ESM)
- **Resolution:** NodeNext
- **Test Runner:** node:test

## Core Architecture
This project is a secure file system toolkit for AI agents (**BETA**). Its primary goal is to provide FS operations that are safe from directory traversal and unauthorized access.

- `core/library/guards.ts`: Contains the `resolvePathWithinWorkspace` logic.
- `core/library/index.ts`: Exports `agentCoreFileTools` and a simplified `fs` alias.

## Critical Rules for AI Agents
1. **Security First:** Never implement a tool or modification that bypasses `resolvePathWithinWorkspace`.
2. **Simplified API:** Prefer using the `fs` alias (e.g., `fs.read`, `fs.shell`).
3. **JSON Results:** Use `{ json: true }` in `fs` methods for AI-friendly structured outputs.
4. **Shell Safety:** Use the `DANGEROUS_PATTERNS` blacklist in `core/tools/shell-command/index.ts`.
5. **Error Handling:** Always use `FSToolError`.
6. **No `any`:** Strict typing is mandatory.
7. **ESM Imports:** Always use `.js` extensions.

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
