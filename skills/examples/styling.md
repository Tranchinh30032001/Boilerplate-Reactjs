# Skill: Styling
> AI phải tuân theo các rules này khi generate CSS/styling.

---

## Rules

### 1. Chỉ dùng Tailwind utility classes
```typescript
// ✅
<div className="flex items-center gap-4 rounded-lg bg-white p-6 shadow-sm">

// ❌ Inline styles
<div style={{ display: 'flex', alignItems: 'center' }}>

// ❌ Custom CSS classes trừ khi không thể dùng Tailwind
<div className="my-custom-class">
```

### 2. Dùng `cn()` helper để merge classes
```typescript
import { cn } from '@/shared/utils/cn'

// ✅ Conditional classes
<div className={cn(
  'flex items-center p-4',
  isActive && 'bg-blue-50',
  isDisabled && 'opacity-50 cursor-not-allowed',
  className  // Allow override từ parent
)}>

// ❌
<div className={`flex items-center ${isActive ? 'bg-blue-50' : ''}`}>
```

### 3. Responsive: mobile-first
```typescript
// ✅ Mobile first, breakpoint cho larger screens
<div className="flex-col md:flex-row lg:gap-8">
//              ^ mobile    ^ tablet     ^ desktop

// ❌ Desktop first
<div className="flex-row sm:flex-col">
```

### 4. Design tokens — không magic numbers
```typescript
// ✅ Dùng Tailwind scale
<div className="p-4 gap-2 text-sm rounded-md">

// ❌ Arbitrary values khi không cần thiết
<div className="p-[17px] gap-[9px] text-[13px]">

// ✅ Arbitrary values chỉ khi design yêu cầu pixel perfect
<div className="h-[72px]">  // header height cụ thể
```

### 5. Component variants với CVA (class-variance-authority)
```typescript
// ✅ Dùng CVA cho components nhiều variants
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}
```

### 6. Dark mode: dùng Tailwind dark: prefix
```typescript
// ✅
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
```

### 7. Animations: dùng Tailwind transitions
```typescript
// ✅
<div className="transition-all duration-200 ease-in-out hover:scale-105">

// ❌ Custom CSS animations trừ khi phức tạp
```
