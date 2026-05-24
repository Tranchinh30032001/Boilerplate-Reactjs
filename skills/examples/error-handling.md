# Skill: Error Handling
> AI phải tuân theo pattern thống nhất này cho error handling toàn app.

---

## Error Layers

### 1. API Errors — xử lý trong apiClient
```typescript
// apiClient tự động handle:
// - 401 → redirect to login
// - 403 → show permission denied
// - 500 → show generic error toast
// Component KHÔNG cần xử lý những case này manually
```

### 2. Query Errors — hiển thị inline
```typescript
// ✅ Dùng ErrorMessage component
const { data, error, isError } = useUsers()
if (isError) return <ErrorMessage message={error.message} />

// ❌ console.error hoặc bỏ qua
if (isError) console.error(error)
```

### 3. Mutation Errors — toast notification
```typescript
// ✅
useMutation({
  mutationFn: userApi.create,
  onError: (error: ApiError) => {
    toast.error(error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.')
  },
})

// ❌ Alert hoặc console
onError: (error) => alert(error.message)
```

### 4. Form Validation Errors — inline dưới field
```typescript
// ✅ Dùng react-hook-form + zod
const schema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự'),
})

// Hiển thị lỗi inline
{errors.email && (
  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
)}
```

### 5. Unexpected Errors — Error Boundary
```typescript
// Wrap routes hoặc major sections với ErrorBoundary
<ErrorBoundary fallback={<ErrorPage />}>
  <FeatureComponent />
</ErrorBoundary>

// Không wrap individual small components
```

### 6. Error types
```typescript
// src/types/errors.ts — AI nên import từ đây
interface ApiError {
  message: string
  code: string
  status: number
}

// Không throw raw Error object từ API calls
// apiClient đã normalize về ApiError format
```

### 7. Logging
```typescript
// ✅ Dùng logger utility (không console.log trực tiếp)
import { logger } from '@/shared/utils/logger'
logger.error('Failed to load users', { userId, error })

// ❌
console.log('error:', error)
console.error(error)

// logger tự động:
// - Development: log ra console
// - Production: gửi lên error tracking (Sentry...)
```

### 8. User-facing error messages
- Luôn dùng tiếng Việt cho user-facing messages (trừ khi app multilingual)
- Không expose technical details cho user
- Luôn có "Thử lại" action khi có thể

```typescript
// ✅
'Không thể tải danh sách người dùng. Vui lòng thử lại.'

// ❌
'Error: Network request failed with status 500'
'TypeError: Cannot read property of undefined'
```
