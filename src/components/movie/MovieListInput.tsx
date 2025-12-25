/**
 * MovieListInput.tsx
 *
 * 複数ムービーを動的に追加・編集・削除できるコンポーネント
 *
 * 文化財登録フォームで使用し、ムービーを任意で追加できます。
 */

import React, { useState } from 'react'
import { MovieFormData } from '@/domains/models/movie'

type MovieListInputProps = {
  movies: MovieFormData[]
  onAdd: (movie: MovieFormData) => void
  onUpdate: (index: number, movie: MovieFormData) => void
  onRemove: (index: number) => void
  errors?: Record<number, Record<string, string>>
}

/**
 * 空のムービーフォームデータ
 */
const emptyMovie: MovieFormData = {
  url: '',
  title: '',
  note: '',
}

export function MovieListInput({
  movies,
  onAdd,
  onUpdate,
  onRemove,
  errors = {},
}: MovieListInputProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newMovie, setNewMovie] = useState<MovieFormData>(emptyMovie)
  const [newMovieErrors, setNewMovieErrors] = useState<Record<string, string>>(
    {},
  )

  /**
   * 新規ムービーの入力変更
   */
  const handleNewMovieChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setNewMovie((prev) => ({
      ...prev,
      [name]: value,
    }))

    // エラーをクリア
    if (newMovieErrors[name]) {
      setNewMovieErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  /**
   * 新規ムービーを追加
   */
  const handleAdd = () => {
    // バリデーション
    const errors: Record<string, string> = {}
    if (!newMovie.url || newMovie.url.trim() === '') {
      errors.url = 'URLは必須です'
    } else if (
      !newMovie.url.startsWith('http://') &&
      !newMovie.url.startsWith('https://')
    ) {
      errors.url = '有効なURLを入力してください'
    }

    if (Object.keys(errors).length > 0) {
      setNewMovieErrors(errors)
      return
    }

    onAdd(newMovie)
    setNewMovie(emptyMovie)
    setIsAdding(false)
    setNewMovieErrors({})
  }

  /**
   * 既存ムービーの入力変更
   */
  const handleExistingMovieChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    const updated = {
      ...movies[index],
      [name]: value,
    }
    onUpdate(index, updated)
  }

  /**
   * 追加をキャンセル
   */
  const handleCancel = () => {
    setIsAdding(false)
    setNewMovie(emptyMovie)
    setNewMovieErrors({})
  }

  return (
    <div className="space-y-4">
      {/* 既存ムービーリスト */}
      {movies.length > 0 && (
        <div className="space-y-4">
          {movies.map((movie, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-sm font-medium text-gray-700">
                  3D映像 {index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  削除
                </button>
              </div>

              {/* URL */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="url"
                  value={movie.url}
                  onChange={(e) => handleExistingMovieChange(index, e)}
                  placeholder="https://lumalabs.ai/capture/..."
                  className={`block w-full rounded-md shadow-sm sm:text-sm ${
                    errors[index]?.url
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                />
                {errors[index]?.url && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors[index].url}
                  </p>
                )}
              </div>

              {/* タイトル */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  タイトル
                </label>
                <input
                  type="text"
                  name="title"
                  value={movie.title}
                  onChange={(e) => handleExistingMovieChange(index, e)}
                  placeholder="映像のタイトル"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              {/* 備考 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  備考
                </label>
                <textarea
                  name="note"
                  value={movie.note}
                  onChange={(e) => handleExistingMovieChange(index, e)}
                  placeholder="映像についての説明"
                  rows={2}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 新規追加フォーム */}
      {isAdding ? (
        <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
          <h4 className="text-sm font-medium text-blue-700 mb-3">
            新しい3D映像を追加
          </h4>

          {/* URL */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="url"
              value={newMovie.url}
              onChange={handleNewMovieChange}
              placeholder="https://lumalabs.ai/capture/..."
              className={`block w-full rounded-md shadow-sm sm:text-sm ${
                newMovieErrors.url
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
            />
            {newMovieErrors.url && (
              <p className="mt-1 text-sm text-red-600">{newMovieErrors.url}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Luma AIで生成した3D映像のURLを入力してください
            </p>
          </div>

          {/* タイトル */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              タイトル
            </label>
            <input
              type="text"
              name="title"
              value={newMovie.title}
              onChange={handleNewMovieChange}
              placeholder="映像のタイトル"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          {/* 備考 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              備考
            </label>
            <textarea
              name="note"
              value={newMovie.note}
              onChange={handleNewMovieChange}
              placeholder="映像についての説明"
              rows={2}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          {/* ボタン */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="button"
              onClick={handleAdd}
              className="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              追加
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200"
        >
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          3D映像を追加
        </button>
      )}

      {/* 説明 */}
      {movies.length === 0 && !isAdding && (
        <p className="text-sm text-gray-500">
          3D映像は後から追加することもできます。
        </p>
      )}
    </div>
  )
}

export default MovieListInput
