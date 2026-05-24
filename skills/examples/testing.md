# Skill: Testing
> AI phải tuân theo các rules này khi generate tests.

---

## Rules

### 1. File naming — co-located với source
```
src/features/auth/components/LoginForm.tsx
src/features/auth/components/LoginForm.test.tsx   ✅

src/tests/LoginForm.test.tsx   ❌  (không tách riêng folder tests)
```

### 2. Test structure: describe/it
```typescript
// ✅
describe('LoginForm', () => {
  it('renders email and password fields', () => { })
  it('shows error when email is invalid', () => { })
  it('calls onSubmit with credentials when form is submitted', () => { })
  it('disables submit button while loading', () => { })
})

// ❌
test('LoginForm works', () => { })  // Quá vague
```

### 3. Test behavior, không test implementation
```typescript
// ✅ Test những gì user thấy
expect(screen.getByRole('button', { name: /đăng nhập/i })).toBeInTheDocument()
expect(screen.getByText('Email không hợp lệ')).toBeInTheDocument()

// ❌ Không test internal state
expect(wrapper.state('isLoading')).toBe(false)
expect(component.find('Spinner').exists()).toBe(true)
```

### 4. Render với user-centric queries
```typescript
// ✅ Thứ tự ưu tiên
screen.getByRole('button', { name: /submit/i })    // 1. Role + accessible name
screen.getByLabelText('Email')                      // 2. Form label
screen.getByPlaceholderText('Enter email')          // 3. Placeholder
screen.getByText('Submit')                          // 4. Text content
screen.getByTestId('submit-btn')                    // 5. data-testid (last resort)
```

### 5. Mock strategy
```typescript
// External modules: vi.mock tại file level
vi.mock('@/services/apiClient')

// Specific function: vi.spyOn
vi.spyOn(authApi, 'login').mockResolvedValue({ token: 'mock-token' })

// Không mock React itself
// Không mock internal utilities — test chúng trực tiếp
```

### 6. Test data: dùng factories, không hard-code
```typescript
// ✅
import { createUser } from '@/shared/testUtils/user.factory'
const user = createUser({ role: 'admin' })

// ❌
const user = { id: '1', name: 'John', email: 'john@test.com', role: 'admin', ... }
```

### 7. Async testing
```typescript
// ✅
it('shows user data after loading', async () => {
  render(<UserProfile userId="1" />)
  expect(screen.getByRole('progressbar')).toBeInTheDocument()
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })
})
```

### 8. Coverage thresholds
- Statements: 80% minimum
- Branches: 75% minimum
- Feature mới không được làm giảm coverage
- Không dùng `/* istanbul ignore */` trừ khi có comment giải thích

### 9. Không test third-party libraries
- Không viết test để verify React Query caching behavior
- Không viết test để verify Zustand reactivity
- Chỉ test code của project
