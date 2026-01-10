# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-01-10

### Added

- **Real-time Collaboration**: Implemented collaborative document editing using Socket.io
  - Socket.io server for real-time bidirectional communication
  - Collaborative editor component with live cursor and presence indicators
  - User avatars showing active collaborators
  - Real-time document synchronization across multiple users
  - New `/dashboard/collaborative` page for accessing the feature

- **Monorepo with pnpm**: Migrated from npm workspaces to pnpm for better performance
  - Added `pnpm-workspace.yaml` configuration
  - Root-level scripts to manage all apps from a single command
  - `pnpm dev` starts Socket.io server + host + remote concurrently
  - `pnpm build` builds all applications in the correct order
  - Filter commands: `pnpm --filter <app> <script>`

### Changed

- Replaced all `npm` commands with `pnpm` equivalents
- Updated project structure documentation
- Added Socket.io to dependencies (`socket.io` and `socket.io-client`)

---

## [1.0.0] - 2026-01-10

### Security

- **CRITICAL**: Updated `next` from `13.4.7` to `14.2.35` to fix multiple security vulnerabilities:
  - CVE-2025-66478 (React2Shell)
  - CVE-2025-55184 (DoS via infinite loop)
  - CVE-2025-55183 (Source Code Exposure)
  - SSRF in Server Actions
  - HTTP Request Smuggling
  - Authorization Bypass in Middleware
  - Cache Poisoning vulnerabilities
  - Image Optimization vulnerabilities

- Updated `@module-federation/nextjs-mf` from `6.7.1` to `8.8.50` to fix:
  - Koa vulnerabilities (XSS, Open Redirect, ReDoS)

- Updated `eslint-config-next` from `latest` to `15.0.1` to fix:
  - Glob CLI command injection vulnerability

### Changed

- Pinned dependency versions to avoid breaking changes:
  - `tailwindcss`: `latest` → `^3.4.1`
  - `postcss`: `latest` → `^8.4.35`
  - `autoprefixer`: `latest` → `^10.4.17`
  - `eslint`: `latest` → `^8.56.0`
  - `@types/node`: `latest` → `^20.11.5`

- Updated npm scripts to use Unix-compatible environment variables (removed Windows `set` command)

### Fixed

- Removed deprecated `import "tailwindcss/tailwind.css"` from `table.tsx` component
- Added missing `@headlessui/tailwindcss` dependency required by `tailwind.config.js`

### Compatibility

- This update maintains compatibility with the existing Module Federation architecture
- Both `host` and `remote` applications continue to work together seamlessly
- No breaking changes to the application functionality

### How to Run

```bash
# Terminal 1 - Start the remote (port 3011)
cd apps/remote && npm run dev

# Terminal 2 - Start the host (port 3010)
cd apps/host && ANALYTICS_REMOTE_URL=http://localhost:3011 npm run dev
```

Then open http://localhost:3010 in your browser.
