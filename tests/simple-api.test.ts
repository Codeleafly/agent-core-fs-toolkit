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

  // Teardown
  await rm(testFile, { force: true });
});
