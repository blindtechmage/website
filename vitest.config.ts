import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      // `cloudflare:email` is a virtual module only resolvable in the
      // Workers runtime; unit tests run in Node, so it's aliased to a
      // minimal shim. See tests/shims/cloudflare-email.ts.
      'cloudflare:email': new URL('./tests/shims/cloudflare-email.ts', import.meta.url).pathname,
      // `cloudflare:workers` (the `env` export) is likewise only resolvable
      // in the Workers runtime. See tests/shims/cloudflare-workers.ts.
      'cloudflare:workers': new URL('./tests/shims/cloudflare-workers.ts', import.meta.url)
        .pathname,
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
});
