# Windsurf Core Rules

- **Strict Path Safety:** All file operations must pass through `resolvePathWithinWorkspace`.
- **ESM Compliance:** Use `.js` in all internal imports.
- **Verification:** Every change must be followed by `npm run build && npm test`.
- **Job Management:** Use `runShell` for commands that might exceed 15 seconds.
