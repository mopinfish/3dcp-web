/**
 * TagInput.tsx
 * 
 * タグ入力コンポーネント
 * 
 * ✅ Phase 3-3対応:
 * - 既存タグの選択
 * - 新規タグの作成
 * - タグの追加・削除
 * - オートコンプリート機能
 */

import React, { useState, useEffect, useCallback, useRef, memo } from 'react'
import * as TagRepository from '@/infrastructures/repositories/tag'
import { Tag } from '@/domains/models/tag'

type TagInputProps = {
  selectedTags: Tag[]
  onTagsChange: (tags: Tag[]) => void
  disabled?: boolean
}

const TagInput = memo(function TagInput({ 
  selectedTags, 
  onTagsChange, 
  disabled = false 
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState<Tag[]>([])
  const [allTags, setAllTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // 全タグを取得
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await TagRepository.get()
        setAllTags(tags)
      } catch (error) {
        console.error('Failed to fetch tags:', error)
      }
    }
    fetchTags()
  }, [])

  // 入力値に基づいてサジェストをフィルタ
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = allTags.filter(
        tag => 
          tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
          !selectedTags.some(s => s.id === tag.id)
      )
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }, [inputValue, allTags, selectedTags])

  // 外側クリックでサジェスト閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // タグを追加
  const handleAddTag = useCallback((tag: Tag) => {
    if (!selectedTags.some(t => t.id === tag.id)) {
      onTagsChange([...selectedTags, tag])
    }
    setInputValue('')
    setShowSuggestions(false)
    inputRef.current?.focus()
  }, [selectedTags, onTagsChange])

  // タグを削除
  const handleRemoveTag = useCallback((tagId: number) => {
    onTagsChange(selectedTags.filter(t => t.id !== tagId))
  }, [selectedTags, onTagsChange])

  // 新規タグを作成
  const handleCreateTag = useCallback(async () => {
    const tagName = inputValue.trim()
    if (!tagName) return

    // 既存タグとの重複チェック
    const existingTag = allTags.find(
      t => t.name.toLowerCase() === tagName.toLowerCase()
    )
    if (existingTag) {
      handleAddTag(existingTag)
      return
    }

    setIsCreating(true)
    try {
      const newTag = await TagRepository.create({ name: tagName })
      setAllTags(prev => [...prev, newTag])
      handleAddTag(newTag)
    } catch (error) {
      console.error('Failed to create tag:', error)
      alert('タグの作成に失敗しました')
    } finally {
      setIsCreating(false)
    }
  }, [inputValue, allTags, handleAddTag])

  // Enterキーでタグ作成
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (suggestions.length > 0) {
        handleAddTag(suggestions[0])
      } else if (inputValue.trim()) {
        handleCreateTag()
      }
    } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
      handleRemoveTag(selectedTags[selectedTags.length - 1].id)
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }, [suggestions, inputValue, selectedTags, handleAddTag, handleCreateTag, handleRemoveTag])

  // 入力中かどうかをチェック（新規作成ボタン表示用）
  const canCreateNewTag = inputValue.trim() && 
    !allTags.some(t => t.name.toLowerCase() === inputValue.trim().toLowerCase()) &&
    !selectedTags.some(t => t.name.toLowerCase() === inputValue.trim().toLowerCase())

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        タグ
      </label>
      
      {/* 選択済みタグ + 入力フィールド */}
      <div 
        className={`
          flex flex-wrap items-center gap-2 p-2 
          border border-gray-300 rounded-lg 
          focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500
          ${disabled ? 'bg-gray-100' : 'bg-white'}
        `}
      >
        {/* 選択済みタグ */}
        {selectedTags.map(tag => (
          <span
            key={tag.id}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
          >
            {tag.name}
            {!disabled && (
              <button
                type="button"
                onClick={() => handleRemoveTag(tag.id)}
                className="w-4 h-4 flex items-center justify-center text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-full cursor-pointer"
              >
                ×
              </button>
            )}
          </span>
        ))}

        {/* 入力フィールド */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={selectedTags.length === 0 ? "タグを入力..." : ""}
          className="flex-1 min-w-[120px] border-none outline-none text-sm bg-transparent"
        />
      </div>

      {/* サジェスト */}
      {showSuggestions && (suggestions.length > 0 || canCreateNewTag) && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {/* 既存タグのサジェスト */}
          {suggestions.map(tag => (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleAddTag(tag)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              {tag.name}
              {tag.description && (
                <span className="text-gray-400 text-xs ml-2">{tag.description}</span>
              )}
            </button>
          ))}

          {/* 新規作成オプション */}
          {canCreateNewTag && (
            <button
              type="button"
              onClick={handleCreateTag}
              disabled={isCreating}
              className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 border-t border-gray-100 flex items-center gap-2 cursor-pointer"
            >
              {isCreating ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-green-500 border-t-transparent rounded-full"></span>
                  作成中...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  「{inputValue.trim()}」を新しいタグとして作成
                </>
              )}
            </button>
          )}
        </div>
      )}

      <p className="mt-1 text-xs text-gray-500">
        既存のタグを選択するか、新しいタグを入力してEnterで作成できます
      </p>
    </div>
  )
})

export default TagInput
