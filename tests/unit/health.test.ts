import { describe, expect, it } from 'vitest';
import { checkHealth } from '../../src/lib/health';

describe('checkHealth', () => {
  it('reports ok status', () => {
    expect(checkHealth().status).toBe('ok');
  });

  it('returns a valid ISO timestamp', () => {
    const { timestamp } = checkHealth();
    expect(() => new Date(timestamp).toISOString()).not.toThrow();
    expect(new Date(timestamp).toISOString()).toBe(timestamp);
  });
});
