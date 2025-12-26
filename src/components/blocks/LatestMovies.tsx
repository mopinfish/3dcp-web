/**
 * LatestMovies.tsx
 *
 * 最新のムービー一覧コンポーネント
 * APIから最新のムービーを取得して表示
 * 
 * ✅ Phase 3-3対応:
 * - React.memoで再レンダリングを最適化
 * - 画像の遅延読み込み
 */

import React, { useEffect, useState, memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { movie as movieService } from '@/domains/services'
import { Movies, Movie } from '@/domains/models/movie'
import { ListItemSkeleton } from '@/components/common/Skeleton'

type Props = {
  /** 表示件数（デフォルト: 5） */
  limit?: number
  /** タイトル（デフォルト: 最新の3Dモデル） */
  title?: string
  /** タイトルアイコン */
  icon?: React.ReactNode
  /** もっと見るリンク先 */
  moreLink?: string
  /** もっと見るリンクテキスト */
  moreLinkText?: string
}

/**
 * ムービーリストアイテム（メモ化）
 */
const MovieItem = memo<{ movie: Movie }>(({ movie }) => {
  return (
    <Link
      href={`/luma/${movie.id}`}
      className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer"
    >
      {/* サムネイル */}
      <div className="w-16 h-12 rounded overflow-hidden bg-gray-100 mr-3 flex-shrink-0">
        {movie.thumbnail_url ? (
          <Image
            src={movie.thumbnail_url}
            alt={movie.title || '3Dモデル'}
            width={64}
            height={48}
            className="w-full h-full object-cover"
            loading="lazy"
            unoptimized={movie.thumbnail_url.startsWith('http')}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-blue-500 text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
            </svg>
          </div>
        )}
      </div>
      
      {/* ムービー情報 */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate group-hover:text-blue-600">
          {movie.title || '無題'}
        </p>
        <p className="text-xs text-gray-500 truncate">
          {movie.cultural_property ? `文化財ID: ${movie.cultural_property}` : '文化財未設定'}
        </p>
      </div>
      
      {/* 再生アイコン */}
      <div className="ml-2 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </Link>
  )
})

MovieItem.displayName = 'MovieItem'

const LatestMovies: React.FC<Props> = memo(({
  limit = 5,
  title = '最新の3Dモデル',
  icon = '🎬',
  moreLink = '/luma-list',
  moreLinkText = 'もっと見る',
}) => {
  const [movies, setMovies] = useState<Movies>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await movieService.getLatestMovies(limit)
        setMovies(data)
      } catch (err) {
        console.error('ムービーの取得エラー:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [limit])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">{icon}</span>
          {title}
        </h2>
        <div className="space-y-3">
          {[...Array(limit)].map((_, i) => (
            <ListItemSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (movies.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">{icon}</span>
          {title}
        </h2>
        <p className="text-gray-500 text-sm">3Dモデルはまだ登録されていません</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="mr-2">{icon}</span>
          {title}
        </h2>
        {moreLink && (
          <Link
            href={moreLink}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
          >
            {moreLinkText} →
          </Link>
        )}
      </div>
      
      <div className="space-y-3">
        {movies.map((movie) => (
          <MovieItem key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  )
})

LatestMovies.displayName = 'LatestMovies'

export default LatestMovies
