import test from 'node:test';
import assert from 'node:assert';
import { agentCoreFileTools } from '../core/library/index.js';
import { JobStatus } from '../core/library/types.js';

test('Shell Tools: Operations', async (t) => {
  await t.test('runShell: fast command', async () => {
    const result = await agentCoreFileTools.runShell('echo "hello shell"');
    assert.strictEqual(result.status, JobStatus.COMPLETED);
    assert.ok(result.output.includes('hello shell'));
    assert.ok(result.jobId.length === 8);
  });

  await t.test('runShell: dangerous command blocking', async () => {
    try {
      await agentCoreFileTools.runShell('rm -rf /');
      assert.fail('Should have blocked dangerous command');
    } catch (error: any) {
      assert.ok(error.message.includes('Dangerous shell command blocked'));
    }
  });

  await t.test('runShell: background execution (slow command)', async () => {
    // Note: We don't want to actually wait 15s in tests if we can help it, 
    // but the requirement says 15s blocking. 
    // For test speed, we'll verify it returns a running status if we simulate it or just wait.
    console.log('Testing slow command (will wait 15s)...');
    const result = await agentCoreFileTools.runShell('sleep 17 && echo "finished"');
    
    assert.strictEqual(result.status, JobStatus.RUNNING);
    const jobId = result.jobId;

    // Wait and check status
    const finalResult = await agentCoreFileTools.wait(jobId);
    assert.strictEqual(finalResult.status, JobStatus.COMPLETED);
    assert.ok(finalResult.output.includes('finished'));
  });

  await t.test('getToolStatus', async () => {
    const result = await agentCoreFileTools.runShell('sleep 2 && echo "done"');
    const status = await agentCoreFileTools.getToolStatus(result.jobId);
    assert.strictEqual(status.jobId, result.jobId);
  });
});
