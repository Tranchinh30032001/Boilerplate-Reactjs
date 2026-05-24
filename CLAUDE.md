# CLAUDE.md — Behavioral Guidelines
> Behavioral guidelines để giảm lỗi phổ biến khi AI coding. Merge với project-specific instructions khi cần.
> Nguồn gốc: Andrej Karpathy guidelines + team conventions của s3-fe.

**Tradeoff:** Các guidelines này ưu tiên cẩn thận hơn tốc độ. Với task đơn giản, dùng judgment.

---

## 1. Think Before Coding

**Không assume. Không giấu sự mơ hồ. Surface tradeoffs.**

Trước khi implement:
- State assumptions của bạn một cách rõ ràng. Nếu không chắc, hỏi.
- Nếu có nhiều cách hiểu, trình bày tất cả — không tự chọn im lặng.
- Nếu có cách đơn giản hơn, hãy nói ra. Push back khi cần thiết.
- Nếu có gì không rõ, dừng lại. Đặt tên cho điều đang mơ hồ. Hỏi.

## 2. Simplicity First

**Code tối thiểu để giải quyết bài toán. Không có gì mang tính suy đoán.**

- Không có features ngoài những gì được yêu cầu.
- Không abstract cho single-use code.
- Không tạo "flexibility" hoặc "configurability" nếu không được yêu cầu.
- Không error handling cho impossible scenarios.
- Nếu bạn viết 200 dòng và có thể viết 50 dòng, hãy rewrite.

Tự hỏi: "Một senior engineer có nói đây là overcomplicated không?" Nếu có, simplify.

## 3. Surgical Changes

**Chỉ chạm vào những gì cần thiết. Dọn dẹp mess của chính bạn.**

Khi edit code hiện có:
- Không "cải thiện" code lân cận, comments, hay formatting.
- Không refactor những thứ không bị hỏng.
- Match existing style, dù bạn sẽ làm khác đi.
- Nếu thấy dead code không liên quan, mention nó — không xóa.

Khi changes của bạn tạo ra orphans:
- Xóa imports/variables/functions mà THAY ĐỔI CỦA BẠN đã làm unused.
- Không xóa pre-existing dead code trừ khi được yêu cầu.

Test: Mọi dòng code thay đổi phải trace trực tiếp đến yêu cầu của user.

## 4. Goal-Driven Execution

**Định nghĩa success criteria. Loop cho đến khi verified.**

Transform tasks thành verifiable goals:
- "Add validation" → "Viết tests cho invalid inputs, rồi làm chúng pass"
- "Fix the bug" → "Viết test reproduce bug, rồi làm test pass"
- "Refactor X" → "Đảm bảo tests pass trước và sau"

Với multi-step tasks, state brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

---

## 5. Project-Specific Rules (s3-fe)

### File & Folder
- Mọi feature nằm trong `src/features/[name]/`
- Import cross-feature chỉ qua `src/features/[name]/index.ts`
- Shared components nằm trong `src/components/` (ui, common, layouts)
- Shared utils/hooks nằm trong `src/utils/` và `src/hooks/`
- Global types nằm trong `src/types/`

### React & TypeScript
- Functional components only — không class components
- Props interface: `[ComponentName]Props`
- Export: named exports, không default exports cho components
- Types over interfaces trừ khi cần extension

### API & State
- Mọi HTTP request qua `src/services/apiClient.ts`
- Server state dùng TanStack Query — không useState cho async data
- Global UI state dùng Zustand

### Testing
- **BẮT BUỘC (QUAN TRỌNG NHẤT):** Mọi logic/component/hook mới hoặc sửa đổi phải đi kèm file test tương ứng (*.test.ts hoặc *.test.tsx) ngay trong cùng thư mục. Không bàn giao code không có test.
- Test behavior, không test implementation details
- Coverage threshold: 80% statements, 75% branches

---

*Guidelines này hiệu quả khi: ít unnecessary changes trong diffs, ít rewrites do overcomplicated, và clarifying questions đến TRƯỚC khi implement thay vì sau khi mắc lỗi.*
