import { afterEach, describe, expect, it, vi } from 'vitest';
import { isDev } from './isDev';

describe('isDev', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('is true outside production', () => {
    vi.stubEnv('NODE_ENV', 'development');
    expect(isDev()).toBe(true);
  });

  it('is false in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect(isDev()).toBe(false);
  });

  it('does not throw when process is undefined', () => {
    vi.stubGlobal('process', undefined);
    try {
      expect(isDev()).toBe(false);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
