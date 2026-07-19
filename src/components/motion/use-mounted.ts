import { useEffect, useLayoutEffect, useState } from "react";

/**
 * `useLayoutEffect` on the client, `useEffect` on the server — avoids React's
 * SSR warning while still running before the browser paints on the client.
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Returns `false` during server render and the first client render, then `true`
 * after mount (before paint). Reveal wrappers use it to render fully-visible,
 * un-transformed markup on the server and first paint — so content is never
 * hidden before hydration and stays visible with JavaScript disabled — and only
 * arm their entrance animation once mounted. Because the flip happens in a
 * layout effect (pre-paint), there is no visible flash.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useIsomorphicLayoutEffect(() => setMounted(true), []);
  return mounted;
}
