# Skill: Performance Optimization
> Adapted từ Vercel's react-best-practices skill (github.com/vercel-labs/agent-skills).
> Đã lọc bỏ toàn bộ Next.js/RSC-specific rules. Chỉ giữ những gì applicable với React 18 + Vite SPA.
>
> AI: Áp dụng khi viết component mới, review code, hoặc optimize performance.
> KHÔNG áp dụng: server-side caching, React Server Components, Server Actions — project này là pure SPA.

---

## Tóm tắt nhanh — Đọc trước

| Priority | Category | Số rules |
|----------|----------|---------|
| 🔴 CRITICAL | Eliminating Waterfalls | 5 |
| 🔴 CRITICAL | Bundle Size | 5 |
| 🟠 HIGH | Re-render Optimization | 15 |
| 🟡 MEDIUM | Rendering Performance | 8 |
| 🟢 LOW-MEDIUM | JavaScript Performance | 13 |
| 🔵 LOW | Advanced Patterns | 4 |

**Đã loại bỏ hoàn toàn:** Server-Side Performance (10 rules) — toàn bộ Next.js/RSC specific, không applicable.

---

## 🔴 CRITICAL: Eliminating Waterfalls

Waterfall = request B phải chờ request A xong mới chạy. Đây là nguyên nhân #1 gây app chậm.

### 1. `async-parallel` — Promise.all cho independent operations

```typescript
// ❌ Waterfall: B chờ A, C chờ B
const user = await getUser(id)
const posts = await getPosts(id)
const settings = await getSettings(id)

// ✅ Parallel: cả 3 chạy cùng lúc
const [user, posts, settings] = await Promise.all([
  getUser(id),
  getPosts(id),
  getSettings(id),
])
```

### 2. `async-defer-await` — Await muộn nhất có thể

```typescript
// ❌ Await sớm rồi mới dùng
const data = await fetchData()
doSomethingSync()
use(data)

// ✅ Start promise sớm, await khi cần
const dataPromise = fetchData()  // bắt đầu ngay
doSomethingSync()                // chạy song song
const data = await dataPromise   // await khi thực sự cần
```

### 3. `async-cheap-condition-before-await` — Check điều kiện đơn giản trước khi await

```typescript
// ❌ Await feature flag rồi mới check permission
const isEnabled = await getFeatureFlag('new-dashboard')
if (!user.hasPermission) return null  // nên check cái này trước

// ✅ Check sync condition trước
if (!user.hasPermission) return null
const isEnabled = await getFeatureFlag('new-dashboard')
```

### 4. `async-suspense-boundaries` — Dùng Suspense để stream content song song

```typescript
// ❌ Component cha await tất cả → toàn trang chờ
const UserProfile = async ({ id }) => {
  const [user, posts] = await Promise.all([getUser(id), getPosts(id)])
  return <div>...</div>
}

// ✅ Tách Suspense boundaries → mỗi phần load độc lập
const UserProfilePage = ({ id }) => (
  <div>
    <Suspense fallback={<UserSkeleton />}>
      <UserInfo id={id} />
    </Suspense>
    <Suspense fallback={<PostsSkeleton />}>
      <UserPosts id={id} />
    </Suspense>
  </div>
)
```

### 5. `async-dependencies` — Dùng `Promise.allSettled` khi partial failure OK

```typescript
// ✅ Khi 1 request fail không nên block các request khác
const results = await Promise.allSettled([
  fetchCriticalData(),
  fetchOptionalData(),
])
const critical = results[0].status === 'fulfilled' ? results[0].value : null
const optional = results[1].status === 'fulfilled' ? results[1].value : null
```

---

## 🔴 CRITICAL: Bundle Size

Bundle lớn = app load chậm. Ảnh hưởng trực tiếp đến First Contentful Paint.

### 6. `bundle-barrel-imports` — Import trực tiếp, không qua barrel files

```typescript
// ❌ Barrel import kéo theo toàn bộ module
import { Button, Input, Modal, Table } from '@/shared/components'

// ✅ Import trực tiếp
import { Button } from '@/shared/components/Button'
import { Input } from '@/shared/components/Input'

// ⚠️ Ngoại lệ: feature index.ts — đây là public API boundary, không phải barrel
import { useAuth } from '@/features/auth'  // OK — đây là intended public API
```

### 7. `bundle-dynamic-imports` — Lazy load components nặng

```typescript
import { lazy, Suspense } from 'react'

// ❌ Import static cho heavy components
import { ChartDashboard } from './ChartDashboard'
import { RichTextEditor } from './RichTextEditor'

// ✅ Lazy load — chỉ tải khi user cần
const ChartDashboard = lazy(() => import('./ChartDashboard'))
const RichTextEditor = lazy(() => import('./RichTextEditor'))

// Dùng với Suspense
<Suspense fallback={<Skeleton />}>
  <ChartDashboard />
</Suspense>
```

**Candidates để lazy load:** Chart libraries, rich text editors, PDF viewers, code editors, map components, modal content nặng.

### 8. `bundle-defer-third-party` — Load analytics/tracking sau khi hydration xong

```typescript
// ❌ Load ngay khi app mount
useEffect(() => {
  loadAnalytics()
  loadHotjar()
}, [])

// ✅ Defer sau khi browser idle
useEffect(() => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      loadAnalytics()
      loadHotjar()
    })
  } else {
    setTimeout(() => {
      loadAnalytics()
      loadHotjar()
    }, 1000)
  }
}, [])
```

### 9. `bundle-conditional` — Load module chỉ khi feature được activate

```typescript
// ❌ Import static feature có thể không bao giờ dùng
import { AdminPanel } from './AdminPanel'
const Component = () => user.isAdmin ? <AdminPanel /> : null

// ✅ Chỉ tải khi user thực sự là admin
const AdminPanel = lazy(() => import('./AdminPanel'))
const Component = () => (
  user.isAdmin
    ? <Suspense fallback={null}><AdminPanel /></Suspense>
    : null
)
```

### 10. `bundle-preload` — Preload on hover/focus để perceived speed tốt hơn

```typescript
// ✅ Trigger preload khi user hover — trước khi họ click
const handleMouseEnter = () => {
  import('./HeavyPage')  // bắt đầu tải trước
}

<Link to="/dashboard" onMouseEnter={handleMouseEnter}>
  Dashboard
</Link>
```

---

## 🟠 HIGH: Re-render Optimization

Re-render không cần thiết gây jank, đặc biệt với list lớn hoặc component phức tạp.

### 11. `rerender-no-inline-components` — Không define component bên trong component

```typescript
// ❌ ListItem được tạo lại mỗi lần UserList render → mất memoization
const UserList = ({ users }) => {
  const ListItem = ({ user }) => <div>{user.name}</div>  // ❌
  return users.map(u => <ListItem key={u.id} user={u} />)
}

// ✅ Define bên ngoài
const ListItem = ({ user }: { user: User }) => <div>{user.name}</div>

const UserList = ({ users }: { users: User[] }) => (
  users.map(u => <ListItem key={u.id} user={u} />)
)
```

### 12. `rerender-derived-state-no-effect` — Tính derived state trong render, không dùng useEffect

```typescript
// ❌ useEffect để sync derived state → extra render
const [items, setItems] = useState([])
const [filteredItems, setFilteredItems] = useState([])
useEffect(() => {
  setFilteredItems(items.filter(i => i.active))
}, [items])

// ✅ Tính trực tiếp trong render
const [items, setItems] = useState([])
const filteredItems = items.filter(i => i.active)  // derive during render

// ✅ Nếu expensive: dùng useMemo
const filteredItems = useMemo(
  () => items.filter(i => i.active),
  [items]
)
```

### 13. `rerender-memo-with-default-value` — Hoist default non-primitive props

```typescript
// ❌ Array/object literal mới mỗi lần render → phá vỡ memo
const Parent = () => (
  <MemoizedChild
    options={['a', 'b', 'c']}   // ❌ new array mỗi render
    config={{ size: 'lg' }}      // ❌ new object mỗi render
  />
)

// ✅ Hoist ra ngoài component
const DEFAULT_OPTIONS = ['a', 'b', 'c']
const DEFAULT_CONFIG = { size: 'lg' }

const Parent = () => (
  <MemoizedChild options={DEFAULT_OPTIONS} config={DEFAULT_CONFIG} />
)
```

### 14. `rerender-functional-setstate` — Dùng functional setState cho stable callbacks

```typescript
// ❌ count trong dependency gây recreate callback mỗi render
const increment = useCallback(() => {
  setCount(count + 1)
}, [count])

// ✅ Functional setState — không cần count trong deps
const increment = useCallback(() => {
  setCount(prev => prev + 1)
}, [])  // stable callback
```

### 15. `rerender-lazy-state-init` — Truyền function vào useState cho expensive initialization

```typescript
// ❌ Chạy lại mỗi render dù chỉ dùng lần đầu
const [data, setData] = useState(parseHeavyData(rawData))

// ✅ Chỉ chạy 1 lần khi mount
const [data, setData] = useState(() => parseHeavyData(rawData))
```

### 16. `rerender-use-deferred-value` — Defer render đắt tiền để giữ input responsive

```typescript
// ✅ Search input không bị lag dù list lớn
const [query, setQuery] = useState('')
const deferredQuery = useDeferredValue(query)

return (
  <>
    <input value={query} onChange={e => setQuery(e.target.value)} />
    {/* Render này có thể lag mà không ảnh hưởng input */}
    <SearchResults query={deferredQuery} />
  </>
)
```

### 17. `rerender-transitions` — startTransition cho non-urgent state updates

```typescript
import { startTransition } from 'react'

// ✅ Tab switch không block UI interaction
const handleTabChange = (tab: string) => {
  startTransition(() => {
    setActiveTab(tab)  // non-urgent — React có thể interrupt nếu user đang type
  })
}
```

### 18. `rerender-defer-reads` — Không subscribe state chỉ dùng trong callbacks

```typescript
// ❌ Component re-render mỗi khi theme thay đổi dù chỉ dùng trong handler
const theme = useThemeStore(s => s.theme)
const handleExport = () => exportWithTheme(theme)

// ✅ Đọc trực tiếp từ store trong callback — không subscribe
const getTheme = useThemeStore(s => s.getTheme)  // stable getter
const handleExport = () => exportWithTheme(getTheme())
```

### 19. `rerender-split-combined-hooks` — Tách hooks có independent dependencies

```typescript
// ❌ 1 hook subscribe nhiều state → re-render khi bất kỳ thay đổi
const { user, theme, notifications } = useAppStore()

// ✅ Tách riêng — mỗi component chỉ re-render khi state của nó thay đổi
const user = useAppStore(s => s.user)
const theme = useAppStore(s => s.theme)
const notifications = useAppStore(s => s.notifications)
```

### 20. `rerender-use-ref-transient-values` — Dùng ref cho giá trị thay đổi thường xuyên không cần re-render

```typescript
// ❌ Mỗi mouse move gây re-render
const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

// ✅ Ref không trigger re-render
const mousePos = useRef({ x: 0, y: 0 })
useEffect(() => {
  const handler = (e: MouseEvent) => {
    mousePos.current = { x: e.clientX, y: e.clientY }
  }
  window.addEventListener('mousemove', handler)
  return () => window.removeEventListener('mousemove', handler)
}, [])
```

### 21. `rerender-move-effect-to-event` — Logic interaction thuộc về event handler, không useEffect

```typescript
// ❌ useEffect react to state change
const [submitted, setSubmitted] = useState(false)
useEffect(() => {
  if (submitted) {
    showSuccessToast()
    router.push('/success')
  }
}, [submitted])

// ✅ Xử lý trực tiếp trong event handler
const handleSubmit = async () => {
  await submitForm()
  showSuccessToast()
  router.push('/success')
}
```

### 22. `rerender-derived-state` — Subscribe derived boolean, không raw value

```typescript
// ❌ Re-render khi bất kỳ user property thay đổi
const user = useAuthStore(s => s.user)
if (user?.role === 'admin') { ... }

// ✅ Chỉ re-render khi isAdmin thay đổi
const isAdmin = useAuthStore(s => s.user?.role === 'admin')
```

### 23. `rerender-dependencies` — Dùng primitive dependencies trong useEffect/useMemo

```typescript
// ❌ Object reference thay đổi mỗi render → effect chạy lại liên tục
useEffect(() => {
  fetchData(options)
}, [options])  // options là object

// ✅ Destructure ra primitives
const { page, limit, search } = options
useEffect(() => {
  fetchData({ page, limit, search })
}, [page, limit, search])
```

### 24. `rerender-simple-expression-in-memo` — Không dùng memo cho expression đơn giản

```typescript
// ❌ Memo overhead lớn hơn lợi ích
const fullName = useMemo(() => `${firstName} ${lastName}`, [firstName, lastName])

// ✅ Đủ đơn giản để tính trực tiếp
const fullName = `${firstName} ${lastName}`
```

### 25. `rerender-memo` — Memo cho expensive computations

```typescript
// ✅ Chỉ memo khi computation thực sự đắt
const processedData = useMemo(
  () => heavyDataTransform(rawData),  // O(n²) hoặc tương đương
  [rawData]
)
```

---

## 🟡 MEDIUM: Rendering Performance

### 26. `rendering-conditional-render` — Ternary thay vì `&&` để tránh render "0"

```typescript
// ❌ Nếu count = 0, React render "0" ra DOM
{count && <Badge count={count} />}

// ✅ Ternary rõ ràng
{count > 0 ? <Badge count={count} /> : null}

// ✅ Hoặc convert sang boolean
{!!count && <Badge count={count} />}
```

### 27. `rendering-hoist-jsx` — Extract static JSX ra ngoài component

```typescript
// ❌ JSX object mới mỗi render
const Component = () => {
  const emptyState = <div className="empty">No data</div>
  return data.length ? <List data={data} /> : emptyState
}

// ✅ Hoist ra ngoài — reference stable
const EMPTY_STATE = <div className="empty">No data</div>

const Component = ({ data }) => (
  data.length ? <List data={data} /> : EMPTY_STATE
)
```

### 28. `rendering-usetransition-loading` — useTransition thay vì boolean loading state

```typescript
// ❌ 2 state updates → 2 renders
const [isLoading, setIsLoading] = useState(false)
const handleClick = async () => {
  setIsLoading(true)
  await doWork()
  setIsLoading(false)
}

// ✅ useTransition — 1 state, React quản lý
const [isPending, startTransition] = useTransition()
const handleClick = () => {
  startTransition(async () => {
    await doWork()
  })
}
```

### 29. `rendering-content-visibility` — `content-visibility: auto` cho long list

```css
/* ✅ Browser skip render off-screen items */
.list-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 80px; /* estimated height */
}
```

### 30. `rendering-resource-hints` — Preload critical resources

```typescript
import { preload, preinit } from 'react-dom'

// ✅ Preload fonts, critical CSS
const App = () => {
  preload('/fonts/inter.woff2', { as: 'font', crossOrigin: 'anonymous' })
  return <div>...</div>
}
```

### 31. `rendering-animate-svg-wrapper` — Animate div wrapper, không SVG trực tiếp

```typescript
// ❌ Animate SVG gây layout thrashing
<svg style={{ transform: `scale(${scale})` }}>

// ✅ Wrap trong div, animate div
<div style={{ transform: `scale(${scale})` }}>
  <svg>...</svg>
</div>
```

### 32. `rendering-svg-precision` — Giảm độ chính xác coordinates trong SVG

```html
<!-- ❌ Quá nhiều decimal → file lớn, parse chậm -->
<path d="M 10.12345678 20.98765432 L 50.11111111 60.22222222"/>

<!-- ✅ 1-2 decimal là đủ -->
<path d="M 10.1 21 L 50.1 60.2"/>
```

### 33. `rendering-script-defer-async` — Luôn dùng defer hoặc async cho script tags

```html
<!-- ❌ Block HTML parsing -->
<script src="analytics.js"></script>

<!-- ✅ defer: chạy sau khi parse xong, giữ thứ tự -->
<script src="analytics.js" defer></script>

<!-- ✅ async: chạy ngay khi download xong, không đảm bảo thứ tự -->
<script src="independent-widget.js" async></script>
```

---

## 🟢 LOW-MEDIUM: JavaScript Performance

### 34. `js-index-maps` — Dùng Map cho repeated lookups thay vì Array.find

```typescript
// ❌ O(n) mỗi lần tìm
const getUser = (id: string) => users.find(u => u.id === id)

// ✅ Build Map 1 lần → O(1) lookup
const userMap = new Map(users.map(u => [u.id, u]))
const getUser = (id: string) => userMap.get(id)
```

### 35. `js-set-map-lookups` — Set/Map cho membership checks

```typescript
// ❌ O(n) includes check
const ALLOWED_ROLES = ['admin', 'moderator', 'editor']
if (ALLOWED_ROLES.includes(user.role)) { ... }

// ✅ O(1) Set lookup
const ALLOWED_ROLES = new Set(['admin', 'moderator', 'editor'])
if (ALLOWED_ROLES.has(user.role)) { ... }
```

### 36. `js-combine-iterations` — Kết hợp filter + map trong 1 pass

```typescript
// ❌ 2 lần duyệt array
const result = items
  .filter(item => item.active)
  .map(item => item.name)

// ✅ 1 lần duyệt với flatMap hoặc reduce
const result = items.flatMap(item => item.active ? [item.name] : [])
```

### 37. `js-early-exit` — Return sớm để tránh nested conditionals

```typescript
// ❌ Deeply nested
const processUser = (user) => {
  if (user) {
    if (user.isActive) {
      if (user.hasPermission) {
        return doWork(user)
      }
    }
  }
  return null
}

// ✅ Guard clauses
const processUser = (user) => {
  if (!user) return null
  if (!user.isActive) return null
  if (!user.hasPermission) return null
  return doWork(user)
}
```

### 38. `js-length-check-first` — Check array length trước expensive comparison

```typescript
// ❌ JSON.stringify chạy kể cả khi array khác length
if (JSON.stringify(arr1) === JSON.stringify(arr2)) { ... }

// ✅ Short-circuit khi length khác
if (arr1.length === arr2.length && JSON.stringify(arr1) === JSON.stringify(arr2)) { ... }
```

### 39. `js-hoist-regexp` — Hoist RegExp ra ngoài loop/render

```typescript
// ❌ RegExp object mới mỗi lần gọi
const isEmail = (str: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)

// ✅ Hoist — compile 1 lần
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const isEmail = (str: string) => EMAIL_REGEX.test(str)
```

### 40. `js-cache-function-results` — Cache kết quả computation đắt ở module level

```typescript
// ✅ Module-level cache cho pure functions
const formatCache = new Map<string, string>()

const formatCurrency = (value: number, locale: string): string => {
  const key = `${value}-${locale}`
  if (formatCache.has(key)) return formatCache.get(key)!
  const result = new Intl.NumberFormat(locale, { style: 'currency', currency: 'VND' }).format(value)
  formatCache.set(key, result)
  return result
}
```

### 41. `js-tosorted-immutable` — Dùng `toSorted()` thay vì `sort()` để tránh mutation

```typescript
// ❌ sort() mutate array gốc → bug khó tìm
const sorted = items.sort((a, b) => a.name.localeCompare(b.name))

// ✅ toSorted() trả về array mới, không mutate
const sorted = items.toSorted((a, b) => a.name.localeCompare(b.name))
```

### 42. `js-flatmap-filter` — flatMap để map + filter trong 1 pass

```typescript
// ❌ 2 passes
const adminEmails = users.filter(u => u.role === 'admin').map(u => u.email)

// ✅ 1 pass
const adminEmails = users.flatMap(u => u.role === 'admin' ? [u.email] : [])
```

### 43. `js-request-idle-callback` — Defer non-critical work khi browser idle

```typescript
// ✅ Defer analytics, preloading, non-critical updates
useEffect(() => {
  const id = requestIdleCallback(() => {
    prefetchNextPageData()
    trackPageView()
  })
  return () => cancelIdleCallback(id)
}, [])
```

### 44. `js-min-max-loop` — Loop thay vì sort cho min/max

```typescript
// ❌ sort() là O(n log n) chỉ để lấy min/max
const max = Math.max(...items.map(i => i.value))  // spread + sort

// ✅ O(n) loop
const max = items.reduce((acc, item) => Math.max(acc, item.value), -Infinity)
```

### 45. `js-batch-dom-css` — Group CSS changes để tránh layout thrashing

```typescript
// ❌ Mỗi style change trigger reflow
element.style.width = '100px'
element.style.height = '100px'
element.style.margin = '10px'

// ✅ Group changes qua className hoặc cssText
element.className = 'expanded'
// hoặc
element.style.cssText = 'width: 100px; height: 100px; margin: 10px'
```

### 46. `client-event-listeners` — Deduplicate global event listeners

```typescript
// ❌ Mỗi component thêm listener của nó
const ComponentA = () => {
  useEffect(() => {
    window.addEventListener('resize', handleResizeA)
    return () => window.removeEventListener('resize', handleResizeA)
  }, [])
}

// ✅ Tạo shared hook dùng chung
// src/shared/hooks/useWindowResize.ts
export const useWindowResize = (callback: (size: WindowSize) => void) => {
  // Listeners được share giữa các components dùng hook này
  useEffect(() => {
    const handler = throttle(() => callback(getWindowSize()), 100)
    window.addEventListener('resize', handler, { passive: true })
    return () => window.removeEventListener('resize', handler)
  }, [callback])
}
```

### 47. `client-passive-event-listeners` — Passive listeners cho scroll/touch

```typescript
// ❌ Default listener có thể block scroll
window.addEventListener('scroll', handler)
window.addEventListener('touchstart', handler)

// ✅ Passive: báo browser "handler này không call preventDefault()"
// → browser không cần chờ JS, scroll smooth hơn
window.addEventListener('scroll', handler, { passive: true })
window.addEventListener('touchstart', handler, { passive: true })
```

---

## 🔵 LOW: Advanced Patterns

### 48. `advanced-use-latest` — useLatest để giữ callback reference stable

```typescript
// Pattern: wrap value trong ref để luôn có latest value trong closures
function useLatest<T>(value: T) {
  const ref = useRef(value)
  useLayoutEffect(() => { ref.current = value })
  return ref
}

// Dùng khi: callback cần access latest state mà không re-subscribe
const latestOnChange = useLatest(onChange)
useEffect(() => {
  const subscription = subscribe(data => latestOnChange.current(data))
  return subscription.unsubscribe
}, [])  // empty deps — stable subscription
```

### 49. `advanced-init-once` — Initialize app-level setup 1 lần duy nhất

```typescript
// ❌ useEffect chạy 2 lần trong StrictMode dev
useEffect(() => {
  initAnalytics()
  initSentry()
}, [])

// ✅ Module-level — chạy đúng 1 lần
let initialized = false
export const initApp = () => {
  if (initialized) return
  initialized = true
  initAnalytics()
  initSentry()
}

// main.tsx
initApp()
ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
```

### 50. `advanced-event-handler-refs` — Store event handlers trong refs

```typescript
// ✅ Event handler stable reference, không cần recreate
const handlerRef = useRef<((e: Event) => void) | null>(null)
handlerRef.current = (e) => {
  // Có access tới latest props/state qua closure
  handleEvent(e, currentProp)
}

useEffect(() => {
  const listener = (e: Event) => handlerRef.current?.(e)
  element.addEventListener('custom-event', listener)
  return () => element.removeEventListener('custom-event', listener)
}, [])  // element thay đổi thì re-subscribe, handler thay đổi thì không
```

### 51. `advanced-effect-event-deps` — Không đưa `useEffectEvent` results vào deps

```typescript
// useEffectEvent (React experimental) — tạo stable callback không cần deps
const onConnected = useEffectEvent(() => {
  showToast(`Connected to ${roomId} as ${name}`)  // reads latest roomId, name
})

useEffect(() => {
  const connection = createConnection(roomId)
  connection.on('connected', onConnected)
  // ✅ onConnected KHÔNG trong deps — nó luôn stable
  return () => connection.disconnect()
}, [roomId])  // chỉ reconnect khi roomId thay đổi
```

---

## Checklist khi Review Code

**Bundle:**
- [ ] Component nặng (> 50KB) đã lazy load chưa?
- [ ] Có barrel import (`index.ts`) ở shared components không?
- [ ] Third-party scripts có defer không?

**Re-renders:**
- [ ] Có component defined bên trong component không? (`rerender-no-inline-components`)
- [ ] Có derived state được sync qua useEffect không? (`rerender-derived-state-no-effect`)
- [ ] Default props có phải object/array literal không? (`rerender-memo-with-default-value`)
- [ ] setState có cần functional update không? (`rerender-functional-setstate`)

**Data fetching:**
- [ ] Independent requests có chạy parallel không? (`async-parallel`)
- [ ] Suspense boundaries đã được tách để stream content chưa?

**JS:**
- [ ] Repeated array lookups đã dùng Map chưa?
- [ ] sort() có đang được dùng để lấy min/max không?
- [ ] RegExp có đang được tạo trong loop/render không?

---

*Nguồn: Adapted từ [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) (MIT License).*
*Đã loại bỏ: server-cache-react, server-cache-lru, server-auth-actions, server-dedup-props, server-hoist-static-io, server-no-shared-module-state, server-serialization, server-parallel-fetching, server-parallel-nested-fetching, server-after-nonblocking, client-swr-dedup (dùng TanStack Query thay), rendering-hydration-suppress-warning, rendering-activity (React 19 experimental).*
