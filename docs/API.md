# API Reference

The `agent-core-fs-toolkit` provides a high-level `fs` alias designed for AI agents and a set of modular tools under `agentCoreFileTools`.

## `fs` Alias (Recommended for AI Agents)

All `fs` methods take an optional `options` object. If `options.json` is true, the method returns a stringified JSON representation of the result.

### File Operations
- `fs.read(path, options)`: Reads file content.
- `fs.write(path, content, options)`: Writes content.
- `fs.edit(path, options)`: Edits text file. Supports `oldString`/`newString` or `pattern`/`replacement`.
- `fs.search(path, query, options)`: Searches for text.

### Directory Operations
- `fs.ls(path, options)`: Lists contents.
- `fs.mkdir(path, options)`: Creates directory recursively.
- `fs.rm(path, options)`: Removes path. Use `{ recursive: true }` for directories.

### Path Management
- `fs.mv(src, dst, options)`: Moves or renames.
- `fs.cp(src, dst, options)`: Copies path.
- `fs.stat(path, options)`: Gets metadata.

### Shell & Job Management
- `fs.shell(command, options)`: Runs a command with a 15s blocking window.
- `fs.status(jobId, options)`: Non-blocking check of a job's current state.
- `fs.abort(jobId, options)`: Terminates a running job.
- `fs.wait(jobId, options)`: Blocks until the job is completed or failed.

---

## Detailed Tool Reference (`agentCoreFileTools`)

For low-level tool usage, see the following signatures.

### `runShell(command: string): Promise<ShellResult>`
Runs a shell command with a 15-second "blocking window".
- **Parameters:** `command` (string).
- **Return:** `ShellResult` containing `jobId`, `status`, and `output`.
- **Behavior:** Returns `COMPLETED` if fast; returns `RUNNING` with a `jobId` if it exceeds 15s.

### `getToolStatus(jobId: string): Promise<ShellResult>`
Non-blocking check of a job's current state.
- **Return:** Current `stdout` + `stderr` and `JobStatus`.

### `wait(jobId: string): Promise<ShellResult>`
Blocks the current execution until the job reaches a terminal state (`COMPLETED` or `FAILED`).
- **Interval:** Polls every 1,000ms.

---

## Data Types

### `JobStatus`
- `RUNNING`
- `COMPLETED`
- `FAILED`
- `ABORTED`
- `TIMEOUT`

### `ShellResult`
```typescript
interface ShellResult {
  jobId: string;
  status: JobStatus;
  output: string;
  error?: string;
}
```
