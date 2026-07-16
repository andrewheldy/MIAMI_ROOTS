/**
 * Join conditional class name fragments into a single space-separated string,
 * dropping any falsy entries. A deliberately tiny helper — enough to compose
 * Tailwind classes cleanly without pulling in a dependency.
 *
 * @example cn("p-2", isActive && "bg-forest", undefined) // "p-2 bg-forest"
 */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
