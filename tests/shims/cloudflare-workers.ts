// Vitest runs in Node, not the Workers runtime, so the virtual
// `cloudflare:workers` module isn't resolvable. This test-only shim
// exposes a mutable `env` object that route-level tests populate with
// mock bindings before invoking the handler under test.
export const env = {} as Cloudflare.Env;
