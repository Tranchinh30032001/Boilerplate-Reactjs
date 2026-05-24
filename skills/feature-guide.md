# AI Guideline — Feature Development Workflow

Quy trình chuẩn hóa để xây dựng một Feature hoàn chỉnh (nhiều màn hình) trong dự án `practice-s3`. 
AI bắt buộc phải tuân thủ cấu trúc và luồng xử lý này để tiết kiệm token và tránh sinh code dư thừa.

---

## 1. Thiết kế Kiến Trúc Feature (Ví dụ: Domain "Works")

Khi phát triển một domain lớn như `works` bao gồm các màn hình: *Đăng ký công việc (Register), Chi tiết (Detail), Chỉnh sửa (Edit), Danh sách (List)*. 
Chúng ta phân rã cấu trúc theo nguyên lý **Tách biệt mối quan tâm (Separation of Concerns)**:

```
src/
├── pages/
│   └── works/                     ← Thin Page Components (Chỉ dùng cho routing)
│       ├── ListPage.tsx
│       ├── DetailPage.tsx
│       ├── CreatePage.tsx
│       └── EditPage.tsx
│
├── features/
│   └── works/                     ← Chứa toàn bộ Logic + Layout của domain Works
│       ├── index.ts               ← Barrel export (Chỉ export các Feature chính ra ngoài)
│       ├── types.ts               ← CHỈ CẦN 1 file phẳng chứa cả Type & Zod Schemas
│       ├── components/            ← Các sub-component dùng riêng trong nội bộ Works
│       │   ├── WorkForm.tsx       
│       │   ├── WorkCard.tsx       
│       │   └── WorkFilters.tsx    
│       ├── hooks/                 ← Hooks xử lý server state của riêng Works
│       │   └── useWorks.ts
│       ├── ListFeature.tsx        
│       ├── DetailFeature.tsx      
│       ├── CreateFeature.tsx      
│       └── EditFeature.tsx        
```

---

## 2. Quản Lý Schemas & Types (Nguyên tắc leo thang 3 cấp)

Để tránh phình to thư mục ("Folder Hell") và lãng phí token của AI, việc định nghĩa Types và Zod Schemas tuân theo quy tắc:

1. **Cấp độ 1 (Inline - Nội bộ):** Nếu schema/type chỉ dùng trong 1 file duy nhất (Ví dụ: `LoginFormValues` chỉ dùng trong `LoginForm.tsx`), hãy định nghĩa trực tiếp ở đầu file đó.
2. **Cấp độ 2 (Feature-level file):** Nếu schema/type dùng chung giữa các file trong feature (Ví dụ: `WorkFormValues` dùng cho cả `CreateFeature` và `WorkForm`), hãy gom tất cả vào **một file phẳng duy nhất** tên là `types.ts` nằm ở thư mục gốc của feature (Ví dụ: `src/features/works/types.ts`). *Tuyệt đối không tạo thư mục `types/` hay `schemas/` riêng.*
3. **Cấp độ 3 (Global-level file):** Các kiểu dữ liệu dùng chung toàn dự án hoặc thực thể core (Ví dụ: `User`, `ApiError`) định nghĩa tại `src/types/index.ts`.

---

## 2. Vai Trò Của Từng Thư Mục

### A. Pages (`src/pages/works/`)
* **Nguyên tắc:** **Cực kỳ mỏng (Thin Page). Không chứa logic nghiệp vụ, không chứa API calls, không chứa state.**
* **Nhiệm vụ:**
  1. Đọc params từ URL (ví dụ: `id` từ `useParams`).
  2. Import Feature Component tương ứng từ `src/features/works` và truyền params vào.
* **Mẫu Code (`src/pages/works/DetailPage.tsx`):**
  ```tsx
  import { useParams } from 'react-router'
  import { WorkDetailFeature } from '@/features/works'

  export const WorkDetailPage = () => {
    const { id } = useParams<{ id: string }>()

    if (!id) return <div>ID không hợp lệ</div>

    return <WorkDetailFeature id={id} />
  }
  ```

### B. Features (`src/features/works/`)
* **Nguyên tắc:** **Độc lập và Khép kín.** Mọi logic nghiệp vụ, state quản lý, UI Layout chính nằm ở đây.
* **Quy ước Export (`src/features/works/index.ts`):**
  Chỉ export các component cấp cao nhất phục vụ cho Pages. Không được export các sub-components hoặc hooks nội bộ ra ngoài.
  ```typescript
  export { WorkListFeature } from './ListFeature'
  export { WorkDetailFeature } from './DetailFeature'
  export { WorkCreateFeature } from './CreateFeature'
  export { WorkEditFeature } from './EditFeature'
  ```

### C. Share Form Pattern (Tối ưu DRY - Don't Repeat Yourself)
Đối với màn hình **Tạo mới (Create)** và **Chỉnh sửa (Edit)**, chúng ta dùng chung một Form UI component là `WorkForm.tsx`.
* `WorkForm` chỉ render form, xử lý validate qua `zod` và nhận data ban đầu (nếu là Edit) cùng hàm callback `onSubmit`.
* **Mẫu Code (`src/features/works/components/WorkForm.tsx`):**
  ```tsx
  import { useForm } from 'react-hook-form'
  import { z } from 'zod'

  export const workSchema = z.object({
    title: z.string().min(3, 'Tiêu đề tối thiểu 3 ký tự'),
    description: z.string().optional(),
  })

  export type WorkFormValues = z.infer<typeof workSchema>

  interface WorkFormProps {
    defaultValues?: Partial<WorkFormValues>
    onSubmit: (values: WorkFormValues) => void
    isPending: boolean
  }

  export const WorkForm = ({ defaultValues, onSubmit, isPending }: WorkFormProps) => {
    const { register, handleSubmit } = useForm<WorkFormValues>({ defaultValues })
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Input fields */}
        <button type="submit" disabled={isPending}>Lưu</button>
      </form>
    )
  }
  ```
* `CreateFeature.tsx` và `EditFeature.tsx` sẽ bọc ngoài `WorkForm` và tiêm logic mutation tương ứng:
  * `CreateFeature.tsx` gọi API tạo mới.
  * `EditFeature.tsx` fetch data chi tiết cũ đổ vào `defaultValues`, sau đó gọi API cập nhật.

---

## 3. Luồng Xây Dựng 7 Bước Dành Cho AI

Khi được giao xây dựng một feature mới, AI phải thực hiện tuần tự:

1. **Bước 1: Khai báo API Client** (`src/services/works/worksApi.ts`).
2. **Bước 2: Tạo Custom Hooks** (`src/features/works/hooks/useWorks.ts`) bọc lấy các query/mutation của TanStack Query.
3. **Bước 3: Viết Component UI nội bộ** (`src/features/works/components/`).
4. **Bước 4: Tạo Feature Page** (`ListFeature.tsx`, `CreateFeature.tsx`,...). Kết nối UI component với Custom Hooks.
5. **Bước 5: Viết Unit Test** đặt ngay cạnh file code (`ListFeature.test.tsx`).
6. **Bước 6: Tạo Thin Page Component** (`src/pages/works/`).
7. **Bước 7: Đăng ký Router** trong hệ thống định tuyến chính.
