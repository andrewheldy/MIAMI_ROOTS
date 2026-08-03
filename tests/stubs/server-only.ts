/**
 * Test stub for the `server-only` package.
 *
 * Outside a React Server Components graph, `server-only` resolves to a build
 * that throws on import — which is exactly its job in an application bundle,
 * and exactly wrong in a test that renders server modules on purpose. This
 * stub is the same no-op the `react-server` export condition would select.
 *
 * The real boundary is unaffected: Next.js enforces it at build time, ESLint
 * blocks privileged imports from shared UI, and `npm run test:bundle` asserts
 * no client chunk carries service-role material.
 */
export {};
