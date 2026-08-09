// Vitest runs in Node, not the Workers runtime, so the virtual
// `cloudflare:email` module isn't resolvable. This test-only shim
// mirrors just enough of the real `EmailMessage` shape (from/to/raw)
// for unit tests that construct one and pass it to a mocked binding.
export class EmailMessage {
  constructor(
    public readonly from: string,
    public readonly to: string,
    public readonly raw: string
  ) {}
}
