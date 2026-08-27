<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Guidance

## Overview

- This is the Copa ETec 2026 frontend, built with Next.js App Router, React 19, TypeScript, and Tailwind CSS.
- The sibling `copaetec-backend` project is the REST API and runs on port `4000` by default.
- The frontend runs on port `3000` by default and reads the backend URL from `NEXT_PUBLIC_API_URL`.
- Public tournament data is fetched from the backend through `lib/api.ts` and client-side authenticated requests use `lib/api-client.ts`.

## Local Development

- Use Node.js 20 or newer.
- Create `copaetec-frontend/.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:4000`.
- Configure `copaetec-backend/.env.local` from its `.env.example`, including `DATABASE_URL` and authentication variables.
- Start the backend before testing pages that fetch tournament data.
- Start with `npm run dev`; use `npm run build` to verify a production build and `npm run start` to serve it.
- If port `3000` is already in use, stop the stale Next.js process or use a different port and update OAuth configuration accordingly.

## Architecture Rules

- Keep database access in the backend. Do not add database-backed API routes to this frontend unless there is an explicit architectural decision to do so.
- Use `apiGet` for server components and `apiClient` for client components so the API base URL and session credentials remain consistent.
- Google OAuth is handled by the backend. For local development, Google Cloud must authorize `http://localhost:4000/api/auth/callback/google` and the backend must redirect to `http://localhost:3000`.
- Keep database initialization lazy in frontend code that imports database helpers, so builds do not require local secrets merely to evaluate a route.
- Do not commit `.env`, `.env.local`, tokens, OAuth secrets, database URLs, or other credentials.

## Changes and Verification

- Keep user-facing copy in Spanish unless the surrounding file clearly uses another language.
- After changes to routes, server actions, API clients, or environment handling, run `npm run build`.
- Do not edit the generated Next.js instruction block above; `next dev` maintains it automatically.
