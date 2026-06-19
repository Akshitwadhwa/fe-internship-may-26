import { useEffect, useRef, useState } from 'react'
import type { Item } from '../types'
import { searchItems } from '../services/mockApi'
import { useDebounce } from './useDebounce'

export interface UseSearchReturn {
  query: string
  setQuery: (q: string) => void
  results: Item[]
  isLoading: boolean
  error: string | null
}

export function useSearch(): UseSearchReturn {
  const [query, setQuery] = useState(() => new URLSearchParams(window.location.search).get('q') ?? '')
  const [results, setResults] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debouncedQuery = useDebounce(query, 300)
  const requestIdRef = useRef(0)

  useEffect(() => {
    requestIdRef.current += 1
  }, [query])

  useEffect(() => {
    const url = new URL(window.location.href)

    if (query.trim()) {
      url.searchParams.set('q', query)
    } else {
      url.searchParams.delete('q')
    }

    window.history.replaceState(null, '', url)
  }, [query])

  useEffect(() => {
    const requestId = requestIdRef.current
    let isCancelled = false

    const runSearch = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const items = await searchItems(debouncedQuery)

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
    }

    runSearch()

    return () => {
      isCancelled = true
    }
  }, [debouncedQuery])

  return { query, setQuery, results, isLoading, error }
}
