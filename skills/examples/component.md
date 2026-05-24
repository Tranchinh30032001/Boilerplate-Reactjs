# Skill: React Component
> AI phải tuân theo các rules này khi generate React components.

---

## Rules

### 1. Luôn dùng functional components
```typescript
// ✅ Đúng
const UserCard = ({ user }: UserCardProps) => {
  return <div>{user.name}</div>
}

// ❌ Không bao giờ dùng class components
class UserCard extends React.Component { }
```

### 2. Props interface: `[ComponentName]Props`
```typescript
// ✅
interface UserCardProps {
  user: User
  onSelect?: (id: string) => void
  className?: string
}

// ❌
interface Props { ... }       // Quá generic
interface IUserCardProps { ... } // Không dùng prefix "I"
```

### 3. Named export — không default export cho components
```typescript
// ✅
export const UserCard = ({ user }: UserCardProps) => { ... }

// ❌
export default function UserCard() { ... }
```

### 4. File naming: PascalCase
```
UserCard.tsx          ✅
UserCard.test.tsx     ✅
UserCard.stories.tsx  ✅
userCard.tsx          ❌
user-card.tsx         ❌
```

### 5. Không inline styles — chỉ dùng Tailwind
```typescript
// ✅
<div className="flex items-center gap-2 p-4 rounded-lg">

// ❌
<div style={{ display: 'flex', gap: 8, padding: 16 }}>
```

### 6. Giới hạn kích thước: 150 dòng
- Component > 150 dòng → tách thành sub-components
- Sub-components nằm cùng folder, không export ra ngoài feature

### 7. Business logic vào custom hooks
```typescript
// ✅ Component chỉ có UI
const UserCard = ({ userId }: UserCardProps) => {
  const { user, isLoading } = useUser(userId)  // logic trong hook
  return isLoading ? <Spinner /> : <div>{user.name}</div>
}

// ❌ Logic trong component body
const UserCard = ({ userId }: UserCardProps) => {
  const [user, setUser] = useState(null)
  useEffect(() => {
    fetch(`/api/users/${userId}`).then(...)  // không làm thế này
  }, [userId])
  ...
}
```

### 8. Conditional rendering
```typescript
// ✅ Rõ ràng
{isLoading && <Spinner />}
{error && <ErrorMessage message={error.message} />}
{data && <UserList users={data} />}

// ✅ Ternary cho simple cases
{isLoading ? <Spinner /> : <Content />}

// ❌ Nested ternary — dùng early return hoặc tách component
{a ? b ? c : d : e}
```

### 9. Event handlers: prefix "handle"
```typescript
// ✅
const handleClick = () => { ... }
const handleSubmit = (e: FormEvent) => { ... }

// ❌
const onClick = () => { ... }
const submit = () => { ... }
```
