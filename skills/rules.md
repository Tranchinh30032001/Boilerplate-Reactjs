# Skills — Compact Rules Reference
> AI: Đọc file này trước khi code. 
> - Nếu xây dựng Feature/Page mới, xem quy trình chuẩn tại: [skills/feature-guide.md](file:///Users/chinhtv/Resource/Company/practice-s3/skills/feature-guide.md)
> - Nếu cần code example cho rule cụ thể: đọc `skills/examples/[category].md`.

---

## Component
- Functional only — no class components
- Props interface: `[ComponentName]Props`
- Named export only — no default export cho components
- File naming: PascalCase (`UserCard.tsx`)
- No inline styles — Tailwind classes only, dùng `cn()` cho conditional
- Max 150 lines/component — tách sub-component nếu vượt
- Business logic vào custom hooks — component chỉ chứa JSX + event bindings
- Conditional render: dùng ternary — không dùng `&&` với non-boolean (tránh render `0`)
- Event handler prefix: `handle` — `handleClick`, `handleSubmit`
- Không define component bên trong component khác

## Testing
- Test file co-located: `ComponentName.test.tsx` cùng folder với source
- Structure: `describe('[Component]') / it('[behavior]')`
- Test behavior không test implementation — dùng `screen.getByRole`, không `component.state`
- Query priority: `getByRole` > `getByLabelText` > `getByText` > `getByTestId`
- Mock external modules ở file level: `vi.mock('@/services/apiClient')`
- Test data qua factory functions — không hard-code inline literals
- Async assertions: dùng `waitFor`
- Coverage minimum: 80% statements, 75% branches — feature mới không được giảm coverage
- Không test behavior của third-party libraries (React Query caching, Zustand reactivity)

## API & Data Fetching
- MỌI HTTP request qua `src/services/apiClient.ts` — không dùng `axios` hoặc `fetch` trực tiếp
- `apiClient` đã wrap axios: auth header, error normalize, 401 redirect — không xử lý lại trong features
- API functions: `src/services/[domain]/[name]Api.ts` — pure functions, no React deps
- Server state + caching: TanStack Query — không dùng `useState + useEffect` để fetch data
- React Router v7: chỉ dùng để routing — không dùng loaders/actions để fetch data
- Query keys: `['resource']` / `['resource', id]` / `['resource', 'list', filters]`
- Luôn render loading state và error state trong component
- Mutations: `invalidateQueries` trong `onSuccess`, toast trong `onError`

## Styling
- Tailwind utility classes only — không inline styles, không custom CSS trừ khi Tailwind không đủ
- Conditional / merged classes: dùng `cn()` từ `@/shared/utils/cn`
- Mobile-first: base = mobile, `md:` / `lg:` cho breakpoint lớn hơn
- Không dùng arbitrary values (`p-[17px]`) trừ khi design yêu cầu pixel-perfect
- Component nhiều variants: dùng CVA (`class-variance-authority`)
- Dark mode: `dark:` prefix của Tailwind

## Error Handling
- `apiClient` xử lý 401/500 globally — component không cần handle lại
- Query error: hiển thị `<ErrorMessage>` inline, không crash silent
- Mutation error: toast notification trong `onError`
- Form validation: `react-hook-form + zod`, error message inline dưới field
- Unexpected error: wrap routes/sections với `<ErrorBoundary>`
- Logging: `logger.error()` từ `@/shared/utils/logger` — không `console.log` trực tiếp
- User-facing messages: tiếng Việt, không expose technical details

## Performance
> Chỉ apply khi relevant — không over-optimize code đơn giản

- Parallel requests: `Promise.all` cho independent operations — không waterfall
- Lazy load: `React.lazy + Suspense` cho components nặng (charts, editors, modals lớn)
- Barrel imports: không import từ `shared/components/index` — import file trực tiếp
- Preload on hover: `import('./HeavyPage')` trong `onMouseEnter` để cải thiện perceived speed
- Defer third-party: `requestIdleCallback` cho analytics, tracking
- Derived state: tính trong render — không sync qua `useEffect`
- Default non-primitive props: hoist ra ngoài component — không tạo `[]` hay `{}` inline trong JSX
- Functional setState: `setState(prev => ...)` để callbacks stable, không cần `state` trong deps
- `useDeferredValue`: cho expensive list render — giữ input responsive
- `startTransition`: cho non-urgent UI updates (tab switch, filter change)
- Refs cho transient values: mouse position, scroll offset — không `useState` cho giá trị không cần re-render
- Zustand selector: subscribe derived boolean (`s => s.user?.role === 'admin'`) — không subscribe raw object
