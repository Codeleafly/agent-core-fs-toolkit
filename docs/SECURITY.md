# Security Architecture

The `agent-core-fs-toolkit` is designed to be used by AI agents, where path validation is critical to prevent accidental or malicious file system access outside the intended workspace.

## Path Validation Logic

All tools utilize the `resolvePathWithinWorkspace` guard:

1.  **Resolution:** Converts relative paths to absolute paths using the workspace root.
2.  **Normalization:** Removes `../`, `./`, and redundant slashes.
3.  **Boundary Check:** Compares the resulting path against the workspace root.
4.  **Symlink Safety:** (Optional) Resolves real paths to ensure symlinks don't point outside the root.

## Error Codes

When a security violation occurs, the library throws a `FSToolError` with the code `PATH_OUT_OF_BOUNDS`.

```typescript
try {
  await agentCoreFileTools.readFile('../outside.txt');
} catch (error) {
  if (error.code === 'PATH_OUT_OF_BOUNDS') {
    console.error('Security alert: AI attempted to escape workspace.');
  }
}
```

## Best Practices

- Always initialize the library in the intended workspace root.
- Use the `recursive: false` flag for deletions unless necessary.
- Monitor `FSToolError` logs for unexpected path access attempts.
