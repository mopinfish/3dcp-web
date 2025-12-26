/**
 * MovieCard.tsx
 *
 * ムービーのカードコンポーネント
 * マイページで自分が登録したムービーを表示するために使用
 * 
 * ✅ 変更内容:
 * - thumbnail_urlをAPIレスポンスから使用
 * - サムネイルがない場合はプレースホルダーを表示
 */

import React from 'react'
import Link from 'next/link'
import { Movie } from '@/domains/models/movie'

type MovieCardProps = {
  movie: Movie
  onDelete?: (id: number) => void
  showActions?: boolean
}

export function MovieCard({
  movie,
  onDelete,
  showActions = true,
}: MovieCardProps) {
  const handleDelete = () => {
    if (
      onDelete &&
      window.confirm(
        `「${movie.title || 'この3D映像'}」を削除してもよろしいですか？`,
      )
    ) {
      onDelete(movie.id)
    }
  }

  // APIから取得したthumbnail_urlを使用
  const thumbnailUrl = movie.thumbnail_url || null

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* サムネイル */}
      <Link href={`/luma/${movie.id}`} className="block">
        <div className="aspect-video bg-gray-900 relative overflow-hidden group">
          {thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnailUrl}
              alt={movie.title || '3D映像'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // サムネイルが取得できない場合はプレースホルダーを表示
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          ) : (
            // プレースホルダー
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
              <svg
                className="w-16 h-16 text-white/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          {/* 再生アイコンオーバーレイ */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-blue-600 ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          {/* 3Dバッジ */}
          <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
            3D
          </span>
        </div>
      </Link>

      {/* コンテンツ */}
      <div className="p-4">
        {/* タイトル */}
        <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2">
          {movie.title || `3D映像 #${movie.id}`}
        </h3>

        {/* 関連文化財（IDのみ表示） */}
        {movie.cultural_property && (
          <p className="text-sm text-gray-500 mb-2 flex items-center">
            <svg
              className="w-4 h-4 mr-1 flex-shrink-0 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span className="line-clamp-1">
              文化財に紐付け済み
            </span>
          </p>
        )}

        {/* メモ */}
        {movie.note && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{movie.note}</p>
        )}

        {/* アクションボタン */}
        {showActions && (
          <div className="flex gap-2 pt-3 border-t border-gray-100">
            <Link
              href={`/luma/${movie.id}`}
              className="
                flex-1 flex items-center justify-center
                px-3 py-2
                text-sm font-medium
                text-gray-700
                bg-gray-100
                rounded-lg
                hover:bg-gray-200
                transition-colors
              "
            >
              <svg
                className="w-4 h-4 mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              表示
            </Link>
            
            <Link
              href={`/movies/${movie.id}/edit`}
              className="
                flex-1 flex items-center justify-center
                px-3 py-2
                text-sm font-medium
                text-blue-700
                bg-blue-50
                rounded-lg
                hover:bg-blue-100
                transition-colors
              "
            >
              <svg
                className="w-4 h-4 mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              編集
            </Link>
            
            {onDelete && (
              <button
                onClick={handleDelete}
                className="
                  flex items-center justify-center
                  px-3 py-2
                  text-sm font-medium
                  text-red-700
                  bg-red-50
                  rounded-lg
                  hover:bg-red-100
                  transition-colors
                "
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * MovieCardList
 * 
 * ムービーカードのリスト表示コンポーネント
 */
type MovieCardListProps = {
  movies: Movie[]
  onDelete?: (id: number) => void
  isLoading?: boolean
  emptyMessage?: string
}

export function MovieCardList({
  movies,
  onDelete,
  isLoading = false,
  emptyMessage = '登録された3D映像はありません',
}: MovieCardListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
          >
            <div className="aspect-video bg-gray-200" />
            <div className="p-4">
              <div className="h-5 bg-gray-200 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        <p className="mt-4 text-base text-gray-500">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onDelete={onDelete} />
      ))}
    </div>
  )
}

export default MovieCard
