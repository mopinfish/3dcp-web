/**
 * TagFilter.tsx
 * 
 * タグフィルターコンポーネント
 * 
 * ✅ Phase 3-3対応:
 * - タグ一覧を表示
 * - 選択したタグでフィルタリング
 * - 複数タグ選択対応
 */

import React, { useState, useEffect, memo } from 'react'
import * as TagRepository from '@/infrastructures/repositories/tag'
import { Tag } from '@/domains/models/tag'

type TagFilterProps = {
  selectedTagIds: number[]
  onTagSelect: (tagIds: number[]) => void
  multiSelect?: boolean
  className?: string
}

const TagFilter = memo(function TagFilter({
  selectedTagIds,
  onTagSelect,
  multiSelect = false,
  className = '',
}: TagFilterProps) {
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const fetchedTags = await TagRepository.get()
        setTags(fetchedTags)
      } catch (error) {
        console.error('Failed to fetch tags:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTags()
  }, [])

  const handleTagClick = (tagId: number) => {
    if (multiSelect) {
      if (selectedTagIds.includes(tagId)) {
        onTagSelect(selectedTagIds.filter(id => id !== tagId))
      } else {
        onTagSelect([...selectedTagIds, tagId])
      }
    } else {
      if (selectedTagIds.includes(tagId)) {
        onTagSelect([])
      } else {
        onTagSelect([tagId])
      }
    }
  }

  const handleClearAll = () => {
    onTagSelect([])
  }

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-sm text-gray-500">タグ読み込み中...</span>
      </div>
    )
  }

  if (tags.length === 0) {
    return null
  }

  // 表示するタグ数（展開時は全部、通常は5個まで）
  const displayTags = isExpanded ? tags : tags.slice(0, 5)
  const hasMore = tags.length > 5

  return (
    <div className={`${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium text-gray-700">タグ:</span>
        {selectedTagIds.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs text-gray-500 hover:text-gray-700 underline cursor-pointer"
          >
            クリア
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {displayTags.map(tag => {
          const isSelected = selectedTagIds.includes(tag.id)
          return (
            <button
              key={tag.id}
              onClick={() => handleTagClick(tag.id)}
              className={`
                px-3 py-1 text-sm rounded-full border transition-colors cursor-pointer
                ${isSelected 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600'
                }
              `}
            >
              {tag.name}
            </button>
          )
        })}

        {/* もっと見る/閉じるボタン */}
        {hasMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            {isExpanded ? '閉じる ▲' : `他${tags.length - 5}件 ▼`}
          </button>
        )}
      </div>
    </div>
  )
})

export default TagFilter
