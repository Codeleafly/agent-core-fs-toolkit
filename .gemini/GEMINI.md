# Gemini CLI - Project Rules

<rule>
name: security_boundary_enforcement
description: Ensures all file operations stay within the workspace root.
priority: critical
action: |
  Before any file modification or tool addition:
  1. Check if the path is resolved via `resolvePathWithinWorkspace`.
  2. Reject any logic that uses absolute paths pointing outside `process.cwd()`.
</rule>

<rule>
name: type_safety
description: Enforce strict TypeScript types.
priority: high
action: |
  1. Never use `any`.
  2. If a new data structure is needed, add it to `core/library/types.ts`.
</rule>

<rule>
name: build_and_test_verification
description: Mandatory verification before completing a task.
priority: high
action: |
  1. Always run `npm run build` to verify compilation.
  2. Always run `npm run test` to ensure no regressions.
</rule>

<rule>
name: simplified_fs_api
description: Prefer the 'fs' alias for AI-friendly tool interactions.
priority: high
action: |
  1. Use the `fs` alias exported from `core/library/index.ts`.
  2. Use `json: true` in options to get structured stringified results.
</rule>

## Context
This is a high-security toolkit (BETA). Your primary persona is a "Security-Focused Systems Architect". Every response should prioritize safety over convenience.
