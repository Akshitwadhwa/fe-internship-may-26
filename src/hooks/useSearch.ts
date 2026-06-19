import { useEffect, useRef, useState } from 'react'
import type { Item } from '../types'
import { searchItems } from '../services/mockApi'

export interface UseSearchReturn {
  query: string
  setQuery: (q: string) => void
  results: Item[]
  isLoading: boolean
  error: string | null
}

export function useSearch(): UseSearchReturn {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const requestIdRef = useRef(0)

  useEffect(() => {
    const requestId = ++requestIdRef.current
    let isCancelled = false

    const timerId = window.setTimeout(async () => {
      setIsLoading(true)
      setError(null)

      try {
        const items = await searchItems(query)

        if (!isCancelled && requestId === requestIdRef.current) {
          setResults(items)
        }
      } catch (err) {
        if (!isCancelled && requestId === requestIdRef.current) {
          setResults([])
          setError(err instanceof Error ? err.message : 'Something went wrong while searching.')
        }
      } finally {
        if (!isCancelled && requestId === requestIdRef.current) {
          setIsLoading(false)
        }
      }
    }, 300)

    return () => {
      isCancelled = true
      window.clearTimeout(timerId)
    }
  }, [query])

  return { query, setQuery, results, isLoading, error }
}
