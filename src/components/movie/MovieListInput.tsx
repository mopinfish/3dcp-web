/**
 * MovieListInput.tsx
 *
 * 複数ムービーを動的に追加・編集・削除できるコンポーネント
 *
 * 文化財登録フォームで使用し、ムービーを任意で追加できます。
 * スマートフォン対応のUI
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

/**
 * 共通のインプットスタイル
 */
const inputClassName = `
  block w-full
  px-4 py-3
  text-base text-gray-900
  placeholder-gray-400
  bg-white
  border-2 border-gray-200
  rounded-lg
  transition-all duration-200
  outline-none
  focus:border-blue-500
  focus:ring-2
  focus:ring-blue-500/20
`

const inputErrorClassName = `
  block w-full
  px-4 py-3
  text-base text-gray-900
  placeholder-gray-400
  bg-white
  border-2 border-red-400
  rounded-lg
  transition-all duration-200
  outline-none
  focus:border-red-500
  focus:ring-2
  focus:ring-red-500/20
`

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
              className="bg-gray-50 rounded-xl p-5 border-2 border-gray-200"
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-base font-semibold text-gray-800 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  3D映像 {index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="
                    px-3 py-1.5
                    text-sm font-medium
                    text-red-600
                    bg-red-50
                    rounded-lg
                    hover:bg-red-100
                    active:bg-red-200
                    transition-colors duration-200
                  "
                >
                  削除
                </button>
              </div>

              {/* URL */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  URL <span className="text-red-500 font-normal">*</span>
                </label>
                <input
                  type="url"
                  name="url"
                  value={movie.url}
                  onChange={(e) => handleExistingMovieChange(index, e)}
                  placeholder="https://lumalabs.ai/capture/..."
                  className={
                    errors[index]?.url ? inputErrorClassName : inputClassName
                  }
                />
                {errors[index]?.url && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors[index].url}
                  </p>
                )}
              </div>

              {/* タイトル */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  タイトル
                </label>
                <input
                  type="text"
                  name="title"
                  value={movie.title}
                  onChange={(e) => handleExistingMovieChange(index, e)}
                  placeholder="映像のタイトル"
                  className={inputClassName}
                />
              </div>

              {/* 備考 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  備考
                </label>
                <textarea
                  name="note"
                  value={movie.note}
                  onChange={(e) => handleExistingMovieChange(index, e)}
                  placeholder="映像についての説明"
                  rows={3}
                  className={`${inputClassName} resize-none`}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 新規追加フォーム */}
      {isAdding ? (
        <div className="bg-blue-50 rounded-xl p-5 border-2 border-blue-200">
          <h4 className="text-base font-semibold text-blue-800 mb-4 flex items-center">
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
            新しい3D映像を追加
          </h4>

          {/* URL */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              URL <span className="text-red-500 font-normal">*</span>
            </label>
            <input
              type="url"
              name="url"
              value={newMovie.url}
              onChange={handleNewMovieChange}
              placeholder="https://lumalabs.ai/capture/..."
              className={
                newMovieErrors.url ? inputErrorClassName : inputClassName
              }
            />
            {newMovieErrors.url && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <svg
                  className="w-4 h-4 mr-1.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {newMovieErrors.url}
              </p>
            )}
            <p className="mt-2 text-sm text-gray-500">
              Luma AIで生成した3D映像のURLを入力してください
            </p>
          </div>

          {/* タイトル */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              タイトル
            </label>
            <input
              type="text"
              name="title"
              value={newMovie.title}
              onChange={handleNewMovieChange}
              placeholder="映像のタイトル"
              className={inputClassName}
            />
          </div>

          {/* 備考 */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              備考
            </label>
            <textarea
              name="note"
              value={newMovie.note}
              onChange={handleNewMovieChange}
              placeholder="映像についての説明"
              rows={3}
              className={`${inputClassName} resize-none`}
            />
          </div>

          {/* ボタン */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="
                w-full sm:w-auto
                px-5 py-3
                text-base font-medium
                text-gray-700
                bg-white
                border-2 border-gray-300
                rounded-lg
                hover:bg-gray-50
                active:bg-gray-100
                transition-colors duration-200
              "
            >
              キャンセル
            </button>
            <button
              type="button"
              onClick={handleAdd}
              className="
                w-full sm:w-auto
                px-5 py-3
                text-base font-medium
                text-white
                bg-blue-600
                border-2 border-transparent
                rounded-lg
                hover:bg-blue-700
                active:bg-blue-800
                transition-colors duration-200
              "
            >
              追加する
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="
            w-full
            px-5 py-4
            text-base font-medium
            text-blue-700
            bg-blue-50
            border-2 border-blue-200 border-dashed
            rounded-xl
            hover:bg-blue-100
            active:bg-blue-200
            transition-colors duration-200
            flex items-center justify-center
          "
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
        <p className="text-sm text-gray-500 text-center">
          3D映像は後から追加することもできます。
        </p>
      )}
    </div>
  )
}

export default MovieListInput
