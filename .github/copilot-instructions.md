# GitHub Copilot Instructions — s3-fe

## Project Overview
React 19 + TypeScript 6 + Vite frontend project. Read AGENTS.md for full context.

## Tech Stack
- React 19, TypeScript 6, Vite
- TanStack Query v5 for server state, Zustand for global state
- Tailwind CSS v4 + shadcn/ui
- Vitest + React Testing Library

## Coding Standards

### Components
- Functional components only, never class components
- Props: `interface [Name]Props { ... }`
- Named exports: `export const MyComponent = ...`
- No inline styles — Tailwind CSS v4 classes only (use `cn()` for conditional merging)
- Max 150 lines per component, split if larger

### File Organization
- Features: `src/features/[name]/{components,hooks,types.ts,index.ts}` (All sub-feature imports must go through its `index.ts` barrel file)
- Shared:
  - `src/components/ui/` - Shadcn UI primitives (DO NOT edit manually)
  - `src/components/common/` - Custom reusable components (Card, LoadingSpinner)
  - `src/components/layouts/` - Wrapper layouts and route shells (AppLayout, ProtectedRoute)
  - `src/utils/` - Global helpers (cn, logger)
  - `src/hooks/` - Global custom hooks (useDebounce, useLocalStorage)

### API Calls
- Always use `src/services/apiClient.ts`, never raw axios or fetch
- Use `useQuery` / `useMutation` from TanStack Query
- Query keys: `['resource']`, `['resource', id]`, `['resource', 'list', filters]`

### Schemas & Types
- Follow the 3-level escalation rule in [skills/feature-guide.md](file:///Users/chinhtv/Resource/Company/practice-s3/skills/feature-guide.md):
  1. Inline: define inside the component if only used there.
  2. Feature: define in a single flat `src/features/[name]/types.ts` if shared inside the feature.
  3. Global: define in `src/types/index.ts` for core model entities.

### Tests
- **CRITICAL REQUIREMENT:** Any new code logic, components, or hooks (and modifications to existing ones) MUST have a corresponding co-located test file (`*.test.ts` or `*.test.tsx`) created simultaneously. Do not deliver untested logic.
- Co-located test files: `ComponentName.test.tsx` in the same directory as the source.
- Test behavior, not implementation: use `screen.getByRole`, not internal state
- Mock external modules at file level with `vi.mock`
