# React 19 + TypeScript 6 + Tailwind CSS v4 Boilerplate
🚀 **Boilerplate chuyên nghiệp, sẵn sàng cho các dự án ReactJS lớn và tối ưu hóa tối đa cho các công cụ AI (Cursor, Copilot, Cline, Gemini).**

[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-blue?logo=vite)](https://vite.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![ESLint](https://img.shields.io/badge/ESLint-Strict_Zero_Warnings-4b32c3?logo=eslint)](https://eslint.org/)
[![Husky](https://img.shields.io/badge/Husky-Enabled-green?logo=git)](https://typicode.github.io/husky/)

---

## 📌 Tổng Quan Dự Án
Đây là bộ khung dự án (Boilerplate) Single Page Application (SPA) chuẩn quốc tế, được xây dựng từ **First Principles** nhằm đạt hiệu năng tối đa, kiến trúc phân tách rõ ràng (separation of concerns), và được cấu hình sẵn để làm việc cực kỳ ăn ý với các trợ lý AI mã nguồn lớn. 

Dự án tích hợp kỷ luật kiểm soát chất lượng code nghiêm ngặt giúp loại bỏ hoàn toàn các lỗi xung đột hoặc suy thoái (regressions) khi dự án phình to.

---

## 🛠️ Tech Stack & Key Decisions

* **Core:** React 19 + TypeScript 6 + Vite 8
* **Styling:** Tailwind CSS v4 (Engine biên dịch CSS mới cực nhanh) + shadcn/ui
* **Server State & Cache:** TanStack Query v5 (Không dùng `useEffect` thủ công để fetch dữ liệu)
* **Global State:** Zustand (Quản lý UI state tập trung, gọn nhẹ)
* **Routing:** React Router v7 (Chỉ dùng định tuyến thuần, tải dữ liệu sau thông qua TanStack Query)
* **Testing:** Vitest + React Testing Library (Đảm bảo độ phủ kiểm thử)
* **API Wrapper:** Axios bọc trong `apiClient` trung tâm hỗ trợ tự động xử lý token và mã hóa lỗi đồng bộ.

---

## 📁 Cấu Trúc Thư Mục Chuẩn Hóa

Thư mục được tổ chức theo cấu trúc hướng tính năng (Feature-based) thay vì phân mảnh cơ học:

```
src/
├── pages/            ← Các component Page mỏng (Thin Pages), đại diện 1:1 với Route URL, không chứa logic.
├── features/         ← Logic nghiệp vụ chính, được gom cụm và cô lập theo Domain (Ví dụ: auth, works).
│   └── [feature]/
│       ├── index.ts          ← Barrel Export (Chỉ xuất các API, Component cấp cao ra ngoài).
│       ├── types.ts          ← File phẳng duy nhất chứa cả Type & Zod Schemas của riêng Feature.
│       ├── components/       ← Các sub-component dùng riêng trong nội bộ Feature.
│       └── hooks/            ← Hooks xử lý dữ liệu (React Query) của riêng Feature.
├── components/       ← Các UI dùng chung cho toàn bộ dự án.
│   ├── ui/           ← Shadcn UI primitives (Cấm sửa đổi trực tiếp).
│   ├── common/       ← Các custom component tái sử dụng (Button, Spinner, Card...).
│   └── layouts/      ← Các wrapper layout bọc khung trang (AppLayout, ProtectedRoute).
├── services/         ← Quản lý các lệnh gọi API qua apiClient trung tâm.
├── store/            ← Các Zustand stores toàn cục.
├── utils/            ← Các hàm helper toàn cục (cn, logger).
└── types/            ← Định nghĩa kiểu dữ liệu thực thể cốt lõi toàn cục (User, ApiError).
```

---

## 🤖 AI-Optimized Development (Lập trình cùng AI)

Dự án được tích hợp sẵn các chỉ dẫn nâng cao dành cho các công cụ AI để giảm tối đa chi phí Token và tăng độ chính xác của mã nguồn được sinh ra:

1. **[`.cursorrules`](.cursorrules):** Quy tắc tự động định hướng cho **Cursor Editor** hiểu toàn bộ kiến trúc, style và các quyết định kỹ thuật của dự án.
2. **[`.github/copilot-instructions.md`](.github/copilot-instructions.md):** Chỉ dẫn chi tiết cho **GitHub Copilot**.
3. **[`skills/rules.md`](skills/rules.md) & [`skills/feature-guide.md`](skills/feature-guide.md):** Tài liệu đặc tả chuẩn viết code và luồng xây dựng feature mới dành cho AI.

### ⚠️ Quy tắc Vàng: Không Viết Logic Nếu Không Có Test!
Bất kỳ mã logic (component, hook, utility) nào do AI hay lập trình viên viết ra **bắt buộc** phải đi kèm một file unit test tương ứng nằm ngay tại thư mục đó (`ComponentName.test.tsx` hoặc `helper.test.ts`). Không bàn giao code nếu không có test bảo vệ.

---

## 🛡️ Kỷ Luật Thép: Git Commit Hook (Husky + ESLint)

Dự án áp dụng cấu hình kiểm soát chất lượng code tuyệt đối trước khi đưa lên kho lưu trữ:
* **Husky Pre-commit Hook:** Tự động quét linter trước mỗi lần commit qua lệnh:
  ```bash
  npx eslint . --max-warnings=0
  ```
* **Luật 0 Cảnh Báo:** Nếu mã nguồn chứa dù chỉ **1 cảnh báo (1 warning)** của ESLint, lệnh commit sẽ bị từ chối ngay lập tức. Điều này giúp loại bỏ code thừa, biến unused hay lỗi định dạng ngay tại local của lập trình viên.

---

## ⚡ Bắt Đầu Phát Triển

### 1. Cài đặt Dependencies
Dự án được khóa bằng hệ thống quản lý gói **Yarn**:
```bash
yarn install
```

### 2. Cấu hình Môi trường
Tạo file `.env` từ file mẫu:
```bash
cp .env.example .env
```

### 3. Chạy Development Server
```bash
yarn dev
```

### 4. Chạy Lint Check (Đảm bảo 0 warnings)
```bash
yarn lint
```

### 5. Chạy Kiểm Thử (Tests)
```bash
yarn test
```

### 6. Biên dịch và Đóng gói Sản xuất (Build)
```bash
yarn build
```
