import test from 'node:test';
import assert from 'node:assert';
import { fs } from '../core/library/index.js';
import { rm } from 'node:fs/promises';

test('Simplified API (fs alias)', async (t) => {
  const testFile = 'simple_test.txt';

  await t.test('fs.write and fs.read', async () => {
    await fs.write(testFile, 'Simple Content');
    const content = await fs.read(testFile);
    assert.strictEqual(content, 'Simple Content');
  });

  await t.test('fs.read with json: true', async () => {
    const json = await fs.read(testFile, { json: true });
    const parsed = JSON.parse(json);
    assert.strictEqual(parsed.content, 'Simple Content');
  });

  await t.test('fs.shell with json: true', async () => {
    const json = await fs.shell('echo "test"', { json: true });
    const parsed = JSON.parse(json);
    assert.ok(parsed.jobId);
    assert.ok(parsed.output.includes('test'));
  });

  await t.test('fs.ls (non-json)', async () => {
    const output = await fs.ls('.');
    assert.ok(output.includes('[F] package.json'));
  });

  await t.test('fs.mkdir and fs.rm', async () => {
    const dir = 'test_dir_to_rm';
    await fs.mkdir(dir);
    await fs.rm(dir, { recursive: true });
    try {
      await fs.stat(dir);
      assert.fail('Directory should have been removed');
    } catch (e: any) {
      assert.strictEqual(e.code, 'FILE_NOT_FOUND');
    }
  });

  // Teardown
  await rm(testFile, { force: true });
});
