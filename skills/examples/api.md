# Skill: API & Data Fetching
> AI phải tuân theo các rules này khi generate API calls và data fetching.

---

## Rules

### 1. LUÔN dùng apiClient — không bao giờ dùng raw fetch
```typescript
// ✅
import { apiClient } from '@/services/apiClient'
const response = await apiClient.get<User[]>('/users')

// ❌
const response = await fetch('/api/users')
const response = await axios.get('/users')
```

### 2. TanStack Query cho MỌI server state
```typescript
// ✅ Query (đọc data)
export const useUsers = (filters?: UserFilters) => {
  return useQuery({
    queryKey: ['users', 'list', filters],
    queryFn: () => userApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 phút
  })
}

// ✅ Mutation (ghi data)
export const useCreateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: userApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

// ❌ Không dùng useState + useEffect cho API calls
const [users, setUsers] = useState([])
useEffect(() => { fetch('/users').then(r => r.json()).then(setUsers) }, [])
```

### 3. API functions nằm trong `features/[name]/services/[name]Api.ts`
```typescript
// src/features/users/services/userApi.ts
export const userApi = {
  getAll: (filters?: UserFilters) =>
    apiClient.get<UserListResponse>('/users', { params: filters }),

  getById: (id: string) =>
    apiClient.get<User>(`/users/${id}`),

  create: (data: CreateUserDto) =>
    apiClient.post<User>('/users', data),

  update: (id: string, data: UpdateUserDto) =>
    apiClient.patch<User>(`/users/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/users/${id}`),
}
```

### 4. Query key conventions
```typescript
// List tất cả: ['resource']
queryKey: ['users']

// List với filters: ['resource', 'list', filters]
queryKey: ['users', 'list', { role: 'admin', page: 1 }]

// Single item: ['resource', id]
queryKey: ['users', userId]

// Nested resource: ['parent', parentId, 'child']
queryKey: ['users', userId, 'posts']
```

### 5. Luôn handle loading & error states trong UI
```typescript
// ✅
const UserList = () => {
  const { data, isLoading, error } = useUsers()

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} />
  if (!data?.length) return <EmptyState />

  return <ul>{data.map(user => <UserItem key={user.id} user={user} />)}</ul>
}

// ❌ Bỏ qua loading/error states
const UserList = () => {
  const { data } = useUsers()
  return <ul>{data?.map(...)}</ul>
}
```

### 6. Optimistic updates cho UX tốt
```typescript
// Với mutations ảnh hưởng nhiều đến UX, dùng optimistic update
const useToggleTodo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: todoApi.toggle,
    onMutate: async (todoId) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      const previous = queryClient.getQueryData(['todos'])
      queryClient.setQueryData(['todos'], (old: Todo[]) =>
        old.map(t => t.id === todoId ? { ...t, done: !t.done } : t)
      )
      return { previous }
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(['todos'], context?.previous)
    },
  })
}
```
