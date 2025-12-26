/**
 * /cultural-properties/index.tsx
 *
 * 文化財一覧ページ
 * 
 * ✅ Phase 3-2対応:
 * - テキスト検索
 * - タグフィルタリング
 * - 3Dモデル有無でのフィルタリング
 * - ページネーション
 */

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { LayoutWithFooter } from '@/components/layouts/Layout'
import NavigationTab from '@/components/blocks/NavigationTab'
import { CulturalProperty } from '@/domains/models/cultural_property'
import { Tag } from '@/domains/models/tag'
import * as CulturalPropertyRepository from '@/infrastructures/repositories/cultural_property'
import { tag as tagService } from '@/domains/services'

const ITEMS_PER_PAGE = 12

export default function CulturalPropertiesListPage() {
  const router = useRouter()
  
  // 検索状態
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<number | null>(null)
  const [has3DModel, setHas3DModel] = useState<boolean | null>(null)
  
  // データ
  const [properties, setProperties] = useState<CulturalProperty[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // ページネーション
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  // タグを取得
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const fetchedTags = await tagService.getTags()
        setTags(fetchedTags)
      } catch (error) {
        console.error('Failed to fetch tags:', error)
      }
    }
    fetchTags()
  }, [])

  // URLパラメータから初期値を設定
  useEffect(() => {
    if (router.isReady) {
      const { q, tag, has_movies, page } = router.query
      if (q && typeof q === 'string') setSearchQuery(q)
      if (tag && typeof tag === 'string') setSelectedTag(parseInt(tag, 10))
      if (has_movies === 'true') setHas3DModel(true)
      if (has_movies === 'false') setHas3DModel(false)
      if (page && typeof page === 'string') setCurrentPage(parseInt(page, 10))
    }
  }, [router.isReady, router.query])

  // 文化財を取得
  const fetchProperties = useCallback(async () => {
    setIsLoading(true)
    try {
      const params: Record<string, string> = {
        ordering: '-updated_at',
      }
      
      if (searchQuery) {
        params.search = searchQuery
      }
      if (selectedTag) {
        params.tag_id = selectedTag.toString()
      }
      if (has3DModel !== null) {
        params.has_movies = has3DModel.toString()
      }
      
      const data = await CulturalPropertyRepository.get(params)
      setProperties(data)
      setTotalCount(data.length)
    } catch (error) {
      console.error('Failed to fetch properties:', error)
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, selectedTag, has3DModel])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  // URLを更新
  const updateURL = useCallback((newParams: Record<string, string | null>) => {
    const query: Record<string, string> = {}
    
    if (newParams.q !== null && newParams.q !== '') query.q = newParams.q
    else if (newParams.q === undefined && searchQuery) query.q = searchQuery
    
    if (newParams.tag !== null && newParams.tag !== '') query.tag = newParams.tag
    else if (newParams.tag === undefined && selectedTag) query.tag = selectedTag.toString()
    
    if (newParams.has_movies !== null && newParams.has_movies !== '') query.has_movies = newParams.has_movies
    else if (newParams.has_movies === undefined && has3DModel !== null) query.has_movies = has3DModel.toString()
    
    router.push({
      pathname: '/cultural-properties',
      query,
    }, undefined, { shallow: true })
  }, [router, searchQuery, selectedTag, has3DModel])

  // 検索実行
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    updateURL({ q: searchQuery })
  }

  // タグ選択
  const handleTagSelect = (tagId: number | null) => {
    setSelectedTag(tagId)
    setCurrentPage(1)
    updateURL({ tag: tagId?.toString() || null })
  }

  // 3Dモデルフィルタ
  const handleHas3DModelFilter = (value: boolean | null) => {
    setHas3DModel(value)
    setCurrentPage(1)
    updateURL({ has_movies: value?.toString() || null })
  }

  // 検索リセット
  const handleReset = () => {
    setSearchQuery('')
    setSelectedTag(null)
    setHas3DModel(null)
    setCurrentPage(1)
    router.push('/cultural-properties', undefined, { shallow: true })
  }

  // ページネーション
  const totalPages = Math.ceil(properties.length / ITEMS_PER_PAGE)
  const paginatedProperties = properties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <LayoutWithFooter>
      <NavigationTab />
      
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* ヘッダー */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            文化財一覧
          </h1>
          <p className="text-gray-600">
            登録されている文化財を検索・閲覧できます
          </p>
        </div>

        {/* 検索・フィルタセクション */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-4 sm:p-6 mb-6">
          {/* テキスト検索 */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="文化財名・住所で検索..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                検索
              </button>
            </div>
          </form>

          {/* フィルタオプション */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 3Dモデルフィルタ */}
            <div className="flex-shrink-0">
              <p className="text-sm font-medium text-gray-700 mb-2">3Dモデル</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleHas3DModelFilter(null)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors cursor-pointer ${
                    has3DModel === null
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  すべて
                </button>
                <button
                  onClick={() => handleHas3DModelFilter(true)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors cursor-pointer ${
                    has3DModel === true
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  3Dあり
                </button>
                <button
                  onClick={() => handleHas3DModelFilter(false)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors cursor-pointer ${
                    has3DModel === false
                      ? 'bg-gray-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  3Dなし
                </button>
              </div>
            </div>

            {/* タグフィルタ */}
            {tags.length > 0 && (
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 mb-2">タグ</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleTagSelect(null)}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors cursor-pointer ${
                      selectedTag === null
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    すべて
                  </button>
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => handleTagSelect(tag.id)}
                      className={`px-3 py-1.5 text-sm rounded-full transition-colors cursor-pointer ${
                        selectedTag === tag.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* アクティブフィルタ表示とリセット */}
          {(searchQuery || selectedTag || has3DModel !== null) && (
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    検索: {searchQuery}
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        updateURL({ q: null })
                      }}
                      className="ml-2 hover:text-blue-600 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedTag && (
                  <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                    タグ: {tags.find(t => t.id === selectedTag)?.name}
                    <button
                      onClick={() => handleTagSelect(null)}
                      className="ml-2 hover:text-purple-600 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                )}
                {has3DModel !== null && (
                  <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    3D: {has3DModel ? 'あり' : 'なし'}
                    <button
                      onClick={() => handleHas3DModelFilter(null)}
                      className="ml-2 hover:text-green-600 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
              <button
                onClick={handleReset}
                className="text-sm text-gray-600 hover:text-gray-900 underline cursor-pointer"
              >
                すべてクリア
              </button>
            </div>
          )}
        </div>

        {/* 結果件数 */}
        <div className="mb-4 text-sm text-gray-600">
          {isLoading ? (
            <span>読み込み中...</span>
          ) : (
            <span>{totalCount} 件の文化財が見つかりました</span>
          )}
        </div>

        {/* 文化財一覧 */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-5 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : paginatedProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedProperties.map((property) => (
              <Link
                key={property.id}
                href={`/cultural-properties/${property.id}`}
                className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="aspect-video relative bg-gray-200">
                  {property.movies && property.movies.length > 0 && property.movies[0].thumbnail_url ? (
                    <Image
                      src={property.movies[0].thumbnail_url}
                      alt={property.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized={property.movies[0].thumbnail_url.startsWith('http')}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <svg
                        className="w-12 h-12 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                  )}
                  {property.movies && property.movies.length > 0 && (
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded shadow">
                        3D
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 truncate mb-1">
                    {property.name}
                  </h3>
                  {property.type && (
                    <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded mb-2">
                      {property.type}
                    </span>
                  )}
                  {property.address && (
                    <p className="text-sm text-gray-500 truncate">
                      📍 {property.address}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-gray-500 mb-4">条件に一致する文化財が見つかりませんでした</p>
            <button
              onClick={handleReset}
              className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
            >
              フィルタをリセット
            </button>
          </div>
        )}

        {/* ページネーション */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer'
              }`}
            >
              前へ
            </button>
            
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1
                // 最初、最後、現在ページの前後を表示
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer'
                      }`}
                    >
                      {page}
                    </button>
                  )
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return <span key={page} className="px-2 text-gray-400">...</span>
                }
                return null
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer'
              }`}
            >
              次へ
            </button>
          </div>
        )}
      </div>
    </LayoutWithFooter>
  )
}
