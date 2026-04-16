# AGENTS.md - Global Context for AI Tools

This file provides context for any AI agent (Claude, Gemini, GPT, etc.) working on this repository.

## Project Mission
To provide a **secure, restricted file system interface** for AI agents (**BETA**). This toolkit is the "sandbox" within which an agent operates.

## Tool-Specific Context
We maintain specialized context for different AI agents:
- **Cursor:** `.cursor/rules/*.mdc`
- **Gemini CLI:** `.gemini/GEMINI.md`
- **Windsurf:** `.windsurf/rules/core.md`
- **GitHub Copilot:** `.github/copilot-instructions.md`
- **Claude Code:** `CLAUDE.md`

## Immutable Rules
1. **Workspace Isolation:** Every FS operation must be checked against the workspace root.
2. **AI-First Interaction:** Prefer using the `fs` alias with `{ json: true }` in options for tool results.
3. **No Silent Failures:** Throw `FSToolError` for any operation that cannot be safely completed.
4. **Shell Sanitization:** Never execute shell commands that could compromise the host system.

## Project Structure
- `/core`: Source code.
  - `/library`: Shared guards, types, and unified API.
  - `/tools`: Modular tool implementations.
- `/docs`: Detailed API and Security documentation.
- `/tests`: Integrity and security verification suite.

## How to Update This Project
Before making changes:
1. Read `core/library/guards.ts` to understand the security model.
2. Check `README.md` for current feature status.
3. Ensure you have Node.js 20+ installed.

After making changes:
1. Run `npm run build`.
2. Run `npm run test`.
3. Update `docs/API.md` if function signatures changed.
