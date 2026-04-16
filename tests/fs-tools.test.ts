import test from 'node:test';
import assert from 'node:assert';
import { agentCoreFileTools } from '../core/library/index.js';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';

const TEMP_DIR = 'temp_test_dir';

test('FS Tools: Basic Operations', async (t) => {
  // Setup
  await agentCoreFileTools.createDirectory(TEMP_DIR);

  await t.test('writeFile and readFile', async () => {
    const filePath = join(TEMP_DIR, 'hello.txt');
    const content = 'Hello, Agent!';
    await agentCoreFileTools.writeFile(filePath, content);
    
    const readContent = await agentCoreFileTools.readFile(filePath);
    assert.strictEqual(readContent, content);
  });

  await t.test('editFile', async () => {
    const filePath = join(TEMP_DIR, 'hello.txt');
    await agentCoreFileTools.editFile(filePath, {
      oldString: 'Agent',
      newString: 'World'
    });
    
    const readContent = await agentCoreFileTools.readFile(filePath);
    assert.strictEqual(readContent, 'Hello, World!');
  });

  await t.test('listDirectory', async () => {
    const list = await agentCoreFileTools.listDirectory(TEMP_DIR);
    assert.ok(list.some(entry => entry.name === 'hello.txt'));
  });

  await t.test('searchContent', async () => {
    const results = await agentCoreFileTools.searchContent(TEMP_DIR, 'World');
    assert.ok(results.length > 0);
    assert.strictEqual(results[0].preview, 'Hello, World!');
  });

  // Teardown
  await rm(TEMP_DIR, { recursive: true, force: true });
});
