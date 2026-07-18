import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**", "coverage/**", "next-env.d.ts"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Keep ESLint out of the formatter's lane; Prettier owns formatting.
  ...compat.extends("prettier"),
  {
    // Privileged Supabase modules stay out of shared UI and content code.
    // (Runtime enforcement is `server-only` inside the modules themselves;
    // this rule catches the mistake at lint time in code that should never
    // need privileged access regardless of where it renders.)
    files: ["src/components/**/*.{ts,tsx}", "src/content/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/lib/supabase/service",
              message:
                "The service-role client is server-only and never belongs in shared UI or content modules. Use it from server code with a justification comment.",
            },
            {
              name: "@/lib/supabase/server",
              message:
                "The user-scoped server client belongs in server code (pages, actions, route handlers), not shared UI or content modules.",
            },
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
