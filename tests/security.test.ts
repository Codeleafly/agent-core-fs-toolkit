import test from 'node:test';
import assert from 'node:assert';
import { resolvePathWithinWorkspace } from '../core/library/guards.js';
import { FSErrorCode } from '../core/library/types.js';

test('Security Guard: resolvePathWithinWorkspace', async (t) => {
  await t.test('should allow paths within workspace', () => {
    const path = 'test.txt';
    const resolved = resolvePathWithinWorkspace(path);
    assert.ok(resolved.endsWith('test.txt'));
  });

  await t.test('should block directory traversal escaping root', () => {
    try {
      resolvePathWithinWorkspace('../outside.txt');
      assert.fail('Should have thrown an error');
    } catch (error: any) {
      assert.strictEqual(error.code, FSErrorCode.PATH_OUT_OF_BOUNDS);
    }
  });

  await t.test('should block absolute paths outside root', () => {
    try {
      resolvePathWithinWorkspace('/tmp/test.txt');
      assert.fail('Should have thrown an error');
    } catch (error: any) {
      assert.strictEqual(error.code, FSErrorCode.PATH_OUT_OF_BOUNDS);
    }
  });
});
