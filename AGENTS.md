<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# HireLoop client

Single-package Next.js (App Router) app: `app/` (routes), `components/` (shadcn-style UI), `hooks/`, `lib/`. No test framework, no CI — verification is `npm run lint && npm run typecheck && npm run build`.

## Commands

- `npm run dev` / `build` / `lint` (bare `eslint`) / `format` (prettier) / `typecheck`
- There is no `test` script; don't invent one.
- `npm run format` only covers `.ts`/`.tsx` files.

## Stack quirks

- Next.js **16.4.4** + React 19.3 + Tailwind **v4** — see the generated block above before assuming older APIs.
- Tailwind v4 has **no config file**: theme, dark variant, and design tokens live in `app/globals.css` (`@theme inline`, `@custom-variant dark`). Edit tokens there, not in a `tailwind.config.*`.
- Code style is **no semicolons** (`.prettierrc`: `semi: false`) and double quotes. Prettier sorts Tailwind classes via `prettier-plugin-tailwindcss`.
- shadcn uses the **`base-nova`** style with Base UI (`components.json`), not the default Radix-based style. Add components with `npx shadcn@latest add <name>`; they land in `components/ui/`.
- Path alias `@/*` → repo root (`@/components/ui/button`, `@/lib/utils`).
- Root layout (`app/layout.tsx`) mounts `ThemeProvider` (next-themes) and wires Inter to the CSS var `--font-sans`; `suppressHydrationWarning` on `<html>` is required by next-themes.
