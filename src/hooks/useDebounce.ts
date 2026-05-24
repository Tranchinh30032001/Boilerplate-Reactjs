import { useState, useEffect } from 'react'

/**
 * Delay value update until user stops typing.
 * @example
 * const debouncedSearch = useDebounce(searchInput, 300)
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
