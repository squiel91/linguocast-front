import { useEffect, useState, Dispatch, SetStateAction } from 'react'

export const useDebounce = <T>(initialValue: T, delay: number = 500): [T, Dispatch<SetStateAction<T>>, T] => {
  const [value, setValue] = useState<T>(initialValue)
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return [value, setValue, debouncedValue]
}
