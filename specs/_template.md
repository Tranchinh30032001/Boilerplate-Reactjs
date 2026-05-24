# Feature Spec: [Feature Name]
**Status:** Draft / Review / Approved / Done
**Owner:** [Tên]
**Created:** YYYY-MM-DD

---

## ⚡ Quick Criteria
> AI: Đọc phần này trước. Đủ để bắt đầu code.
> Chỉ đọc tiếp các section bên dưới khi cần clarify edge cases hoặc data models.

**Goal:** _(1 câu: feature này làm gì)_

**Skills cần áp dụng:** `skills/rules.md` — sections: [component] [api] [testing] _(xóa section không liên quan)_

**Done when:**
- [ ] _(Criterion 1 — ngắn, testable)_
- [ ] _(Criterion 2)_
- [ ] _(Criterion 3)_

**KHÔNG làm:** _(liệt kê 1-2 thứ out of scope quan trọng nhất)_

---

## Detail (đọc khi cần)

### Overview
_(1-2 câu: feature này làm gì và tại sao cần có)_

---

### User Stories
- As a **[role]**, I want to **[action]** so that **[benefit]**
- As a **[role]**, I want to **[action]** so that **[benefit]**

---

### Acceptance Criteria (đầy đủ)
- [ ] _(Criterion — cụ thể, có thể test được)_
- [ ] _(Criterion)_
- [ ] _(Criterion)_

---

### Data Models

```typescript
// Types AI nên dùng cho feature này
interface [FeatureName] {
  id: string
  // thêm fields
}
```

---

### API Contracts

```
GET /api/[endpoint]
Response: { data: [FeatureName][], total: number }

POST /api/[endpoint]
Body: { ... }
Response: { data: [FeatureName] }
```

---

### Edge Cases
- Nếu [edge case 1] xảy ra → xử lý như thế nào?
- Nếu [edge case 2] xảy ra → xử lý như thế nào?

---

### Out of Scope
> AI KHÔNG implement những phần này cho feature này.
- _(Thing 1)_
- _(Thing 2)_

---

### UI Notes
- _(Link Figma hoặc mô tả layout ngắn gọn)_
- _(Component chính cần tạo)_
