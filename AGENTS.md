# s3-fe — AI Navigation Guide
> 🤖 Đọc file này TRƯỚC TIÊN. Đủ để hiểu 80% project.

---

## Dự án này là gì?
_(Điền mô tả ngắn gọn: app làm gì, cho ai)_

## Tech Stack
- **Framework:** React 19 + TypeScript 6 + Vite
- **Routing:** React Router v7 — chỉ dùng routing, không dùng loaders/actions
- **Server state + cache:** TanStack Query v5
- **Global state:** Zustand
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Testing:** Vitest + React Testing Library
- **HTTP:** Axios wrapped trong `src/services/apiClient.ts` — mọi request đi qua đây

---

## Folder Map

| Cần biết về...                   | Đọc file này                        |
|----------------------------------|-------------------------------------|
| Coding rules (compact)           | `skills/rules.md`                   |
| Code examples / patterns         | `skills/examples/[category].md`     |
| Feature đang làm trong sprint    | `specs/_active.md`                  |
| Spec của feature cụ thể          | `specs/features/[name]/spec.md`     |

**Source structure:**
```
src/
├── pages/        ← Thin route components, map 1:1 với route, không có logic
├── features/     ← Logic + layout đầy đủ, map 1:1 với pages
│   └── [name]/
│       ├── index.tsx         ← Main feature component
│       ├── components/       ← Components riêng của feature
│       └── hooks/            ← Hooks riêng của feature
├── components/   ← Shared UI dùng chung toàn app
│   ├── ui/       ← Shadcn UI primitives (Button, Dialog... không sửa đổi trực tiếp)
│   ├── common/   ← Custom shared components (LoadingSpinner, Avatar...)
│   └── layouts/  ← Wrapper layouts & route shells (AppLayout, ProtectedRoute...)
├── services/     ← Tất cả API calls, tổ chức theo domain
│   ├── apiClient.ts          ← Axios base instance
│   └── [domain]/[name]Api.ts
├── store/        ← Zustand stores
├── hooks/        ← Generic hooks dùng chung (useDebounce, useLocalStorage...)
├── utils/        ← Helper functions (cn, logger...)
└── types/        ← Global TypeScript types
```

---

## Key Decisions
> Những quyết định đã chốt. AI không đề xuất thay đổi những thứ này.

- **React + Vite, không Next.js** — pure SPA, không cần SSR
- **React Router v7 chỉ để routing** — không dùng loaders/actions (navigate ngay, data load sau qua TanStack Query)
- **TanStack Query cho server state** — không dùng `useState + useEffect` để fetch data
- **Zustand cho global UI state** — không dùng Redux
- **Tailwind only** — không inline styles, không CSS modules

---

## Coding Rules (Non-Negotiable)
1. Đọc `skills/rules.md` trước khi code — nếu cần example đọc `skills/examples/`
2. Đọc `specs/features/[name]/spec.md` trước khi implement feature
3. Match existing code style — không refactor những gì không được yêu cầu
4. Nếu task không rõ → hỏi trước, không tự assume
5. **BẮT BUỘC:** Mọi logic/component/hook mới sinh hoặc sửa đổi phải đi kèm file test tương ứng (*.test.ts/*.test.tsx) ngay tại thư mục đó.

## AI Không Được
- Import từ `src/features/[x]/` internals — chỉ dùng `index.ts`
- Dùng `axios` trực tiếp — chỉ dùng `apiClient` wrapper
- Tạo global state mới không có lý do rõ ràng
- Generate code ngoài scope của spec/task được giao
- Xóa hoặc sửa code không liên quan đến task
- **Bàn giao code logic/component/hook mới hoặc sửa đổi mà không viết unit test đi kèm.**

---

## Current Focus
_(Cập nhật sprint focus tại đây — xem `specs/_active.md`)_
