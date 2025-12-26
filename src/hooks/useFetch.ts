/**
 * useFetch.ts
 * 
 * 汎用的なデータフェッチングフック
 * 
 * ✅ Phase 3-3対応:
 * - ローディング状態管理
 * - エラーハンドリング
 * - キャッシュ機能（簡易版）
 * - 再フェッチ機能
 */

import { useState, useEffect, useCallback, useRef } from 'react'

type FetchState<T> = {
  data: T | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

// 簡易キャッシュ
const cache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5分

/**
 * 汎用データフェッチングフック
 */
export function useFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    enabled?: boolean
    cacheTime?: number
    onSuccess?: (data: T) => void
    onError?: (error: Error) => void
  } = {}
): FetchState<T> {
  const { enabled = true, cacheTime = CACHE_DURATION, onSuccess, onError } = options
  
  const [data, setData] = useState<T | null>(() => {
    // 初期値としてキャッシュを確認
    const cached = cache.get(key)
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      return cached.data as T
    }
    return null
  })
  const [isLoading, setIsLoading] = useState(!data)
  const [error, setError] = useState<Error | null>(null)
  
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const fetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await fetcherRef.current()
      setData(result)
      
      // キャッシュに保存
      cache.set(key, { data: result, timestamp: Date.now() })
      
      onSuccess?.(result)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }, [key, onSuccess, onError])

  useEffect(() => {
    if (!enabled) return
    
    // キャッシュが有効な場合はスキップ
    const cached = cache.get(key)
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      setData(cached.data as T)
      setIsLoading(false)
      return
    }
    
    fetch()
  }, [key, enabled, cacheTime, fetch])

  return {
    data,
    isLoading,
    error,
    refetch: fetch,
  }
}

/**
 * ページネーション付きデータフェッチングフック
 */
export function usePaginatedFetch<T>(
  key: string,
  fetcher: (page: number, limit: number) => Promise<{ data: T[]; total: number }>,
  options: {
    initialPage?: number
    limit?: number
    enabled?: boolean
  } = {}
): {
  data: T[]
  isLoading: boolean
  error: Error | null
  page: number
  totalPages: number
  total: number
  nextPage: () => void
  prevPage: () => void
  goToPage: (page: number) => void
  refetch: () => Promise<void>
} {
  const { initialPage = 1, limit = 12, enabled = true } = options
  
  const [page, setPage] = useState(initialPage)
  const [data, setData] = useState<T[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const fetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await fetcherRef.current(page, limit)
      setData(result.data)
      setTotal(result.total)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }, [page, limit])

  useEffect(() => {
    if (!enabled) return
    fetch()
  }, [enabled, fetch])

  const totalPages = Math.ceil(total / limit)

  return {
    data,
    isLoading,
    error,
    page,
    totalPages,
    total,
    nextPage: () => setPage(p => Math.min(p + 1, totalPages)),
    prevPage: () => setPage(p => Math.max(p - 1, 1)),
    goToPage: (newPage: number) => setPage(Math.max(1, Math.min(newPage, totalPages))),
    refetch: fetch,
  }
}

/**
 * キャッシュをクリア
 */
export function clearCache(key?: string) {
  if (key) {
    cache.delete(key)
  } else {
    cache.clear()
  }
}
