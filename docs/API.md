# API Reference

## Table of Contents
- [readFile](#readfile)
- [writeFile](#writefile)
- [editFile](#editfile)
- [removePath](#removepath)
- [searchContent](#searchcontent)
- [listDirectory](#listdirectory)
- [createDirectory](#createdirectory)
- [movePath](#movepath)
- [copyPath](#copypath)
- [statPath](#statpath)

---

### `readFile(filePath: string, options?: ReadFileOptions): Promise<string | Buffer>`
Reads the content of a file. Automatically detects binary vs text.

### `writeFile(filePath: string, content: string | Buffer): Promise<void>`
Writes content to a file. Creates parent directories if they don't exist.

### `editFile(filePath: string, options: EditFileOptions): Promise<void>`
Modifies a text file using string replacement or regex.
- `oldString` / `newString`
- `pattern` / `replacement`
- `allowMultiple`: (boolean) Replace all occurrences.

### `removePath(pathToRemove: string, recursive?: boolean): Promise<void>`
Deletes a file or directory.

### `searchContent(searchPath: string, query: string, options?: SearchOptions): Promise<SearchResult[]>`
Searches for text within files.
- `recursive`: (boolean)
- `isRegex`: (boolean)

### `listDirectory(dirPath: string, options?: ListDirectoryOptions): Promise<ListEntry[]>`
Lists contents of a directory with optional metadata.

### `createDirectory(dirPath: string): Promise<void>`
Creates a directory and its parents.

### `movePath(source: string, destination: string, overwrite?: boolean): Promise<void>`
Moves or renames a path.

### `copyPath(source: string, destination: string, recursive?: boolean): Promise<void>`
Copies a path.

### `statPath(filePath: string): Promise<FileMetadata>`
Retrieves metadata for a path.
