/**
 * SearchConditionTab.tsx
 * 
 * マップ画面用の検索・フィルタリングコンポーネント
 * 
 * ✅ Phase 3-2対応:
 * - テキスト検索を追加
 * - 3Dモデルフィルタを追加
 * - 検索リセット機能を追加
 * - UIを改善
 */

import React, { useEffect, useState } from 'react'
import { cultural_property as culturalPropertyService, tag as tagService } from '@/domains/services'
import { CulturalProperties, Tag } from '@/domains/models'

type Props = {
  onUpdateProperties: (properties: CulturalProperties) => void
}

const SearchConditionTab: React.FC<Props> = ({ onUpdateProperties }) => {
  const [tags, setTags] = useState<Tag[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<number | null>(null)
  const [has3DModel, setHas3DModel] = useState<boolean | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const fetchedTags = await tagService.getTags()
        setTags(fetchedTags)
      } catch (error) {
        console.error('タグの取得に失敗しました:', error)
      }
    }
    fetchTags()
  }, [])

  // 検索実行
  const executeSearch = async (params: {
    search?: string
    tag_id?: string
    has_movies?: string
    lat?: string
    lon?: string
    distance?: string
  }) => {
    setIsSearching(true)
    try {
      const properties = await culturalPropertyService.getAllProperties()
      
      // クライアント側でフィルタリング（APIがサポートしていない場合のフォールバック）
      let filtered = properties

      if (params.search) {
        const query = params.search.toLowerCase()
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(query) ||
          (p.address && p.address.toLowerCase().includes(query))
        )
      }

      if (params.has_movies === 'true') {
        filtered = filtered.filter(p => p.movies && p.movies.length > 0)
      } else if (params.has_movies === 'false') {
        filtered = filtered.filter(p => !p.movies || p.movies.length === 0)
      }

      onUpdateProperties(filtered)
    } catch (error) {
      console.error('検索に失敗しました:', error)
    } finally {
      setIsSearching(false)
    }
  }

  // テキスト検索
  const handleTextSearch = (e: React.FormEvent) => {
    e.preventDefault()
    executeSearch({
      search: searchQuery,
      has_movies: has3DModel !== null ? has3DModel.toString() : undefined,
    })
  }

  // 現在地から検索
  const handleSearchByLocation = () => {
    if ('geolocation' in navigator) {
      setIsSearching(true)
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          try {
            const properties = await culturalPropertyService.getPropertiesByLocation(
              latitude,
              longitude,
              3000,
            )
            onUpdateProperties(properties)
          } catch (error) {
            console.error('検索に失敗しました:', error)
          } finally {
            setIsSearching(false)
          }
        },
        (error) => {
          console.error('位置情報の取得に失敗しました:', error)
          setIsSearching(false)
          alert('位置情報の取得に失敗しました')
        },
      )
    } else {
      alert('このブラウザは位置情報をサポートしていません')
    }
  }

  // タグで検索
  const handleSearchByTag = async (tagId: number) => {
    setSelectedTag(tagId)
    setIsSearching(true)
    try {
      const properties = await culturalPropertyService.getPropertiesByTag(tagId)
      onUpdateProperties(properties)
    } catch (error) {
      console.error('検索に失敗しました:', error)
    } finally {
      setIsSearching(false)
    }
  }

  // 3Dモデルフィルタ
  const handleHas3DModelFilter = (value: boolean | null) => {
    setHas3DModel(value)
    executeSearch({
      search: searchQuery,
      has_movies: value !== null ? value.toString() : undefined,
    })
  }

  // 検索をリセット
  const handleReset = async () => {
    setSearchQuery('')
    setSelectedTag(null)
    setHas3DModel(null)
    setIsSearching(true)
    try {
      const properties = await culturalPropertyService.getAllProperties()
      onUpdateProperties(properties)
    } catch (error) {
      console.error('リセットに失敗しました:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const hasActiveFilters = searchQuery || selectedTag || has3DModel !== null

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      {/* トグルボタン（モバイル） */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between sm:hidden cursor-pointer"
      >
        <span className="flex items-center text-gray-700 font-medium">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          検索・フィルタ
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
              フィルタ中
            </span>
          )}
        </span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 検索・フィルタ内容 */}
      <div className={`px-4 py-4 ${isExpanded ? 'block' : 'hidden'} sm:block`}>
        {/* テキスト検索 */}
        <form onSubmit={handleTextSearch} className="mb-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="文化財名・住所で検索..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
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
              disabled={isSearching}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
            >
              検索
            </button>
          </div>
        </form>

        {/* フィルタボタン */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {/* 現在地から検索 */}
          <button
            onClick={handleSearchByLocation}
            disabled={isSearching}
            className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            現在地から探す
          </button>

          {/* 3Dモデルフィルタ */}
          <div className="flex items-center gap-1 border-l border-gray-300 pl-2 ml-1">
            <span className="text-xs text-gray-500 mr-1">3D:</span>
            <button
              onClick={() => handleHas3DModelFilter(null)}
              className={`px-2 py-1 text-xs rounded ${
                has3DModel === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } cursor-pointer`}
            >
              すべて
            </button>
            <button
              onClick={() => handleHas3DModelFilter(true)}
              className={`px-2 py-1 text-xs rounded ${
                has3DModel === true
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } cursor-pointer`}
            >
              あり
            </button>
            <button
              onClick={() => handleHas3DModelFilter(false)}
              className={`px-2 py-1 text-xs rounded ${
                has3DModel === false
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } cursor-pointer`}
            >
              なし
            </button>
          </div>

          {/* リセットボタン */}
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              disabled={isSearching}
              className="inline-flex items-center px-3 py-1.5 text-gray-600 text-sm hover:text-gray-900 cursor-pointer"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              リセット
            </button>
          )}
        </div>

        {/* タグフィルタ */}
        {tags.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-2">タグから探す:</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => handleSearchByTag(tag.id)}
                  disabled={isSearching}
                  className={`px-3 py-1 text-xs border rounded-full transition-colors cursor-pointer ${
                    selectedTag === tag.id
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-blue-600 text-blue-600 bg-white hover:bg-blue-50'
                  } disabled:opacity-50`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ローディング表示 */}
        {isSearching && (
          <div className="mt-3 text-center text-sm text-gray-500">
            <span className="inline-block animate-spin mr-2">⏳</span>
            検索中...
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchConditionTab
