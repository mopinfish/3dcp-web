/**
 * luma-list.tsx
 * 
 * 3Dモデルリストページ
 * 
 * ✅ 変更内容:
 * - JSONファイルからの読み込みからAPI経由に変更
 * - thumbnail_urlをAPIレスポンスから直接使用
 * - サムネイルがない場合はプレースホルダーを表示
 */

import React, { useEffect, useState } from 'react'
import { LayoutWithFooter } from '@/components/layouts/Layout'
import { Movie } from '@/domains/models/movie'
import { movie as movieService } from '@/domains/services'
import Link from 'next/link'
import Image from 'next/image'

const LumaList: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        // API経由でムービーデータを取得（thumbnail_urlが含まれる）
        const movieData = await movieService.getMovies()
        setMovies(movieData)
      } catch (err) {
        console.error('Error loading movies:', err)
        setError('ムービーデータの読み込みに失敗しました')
        
        // フォールバック: 旧方式のJSONファイルから読み込み
        try {
          const movieResponse = await fetch('/data/luma-movies.json')
          if (movieResponse.ok) {
            const movieData = await movieResponse.json()
            setMovies(movieData)
            setError(null)
          }
        } catch (fallbackErr) {
          console.error('Fallback loading also failed:', fallbackErr)
        }
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <LayoutWithFooter>
        <div className="max-w-screen-xl mx-auto p-8">
          <h1 className="text-2xl mb-8 text-gray-800">Loading...</h1>
        </div>
      </LayoutWithFooter>
    )
  }

  if (error && movies.length === 0) {
    return (
      <LayoutWithFooter>
        <div className="max-w-screen-xl mx-auto p-8">
          <h1 className="text-2xl mb-4 text-gray-800">Luma.ai 3Dモデルリスト</h1>
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
            {error}
          </div>
        </div>
      </LayoutWithFooter>
    )
  }

  return (
    <LayoutWithFooter>
      <div className="max-w-screen-xl mx-auto p-8">
        <h1 className="text-2xl mb-8 text-gray-800">Luma.ai 3Dモデルリスト</h1>
        
        {movies.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <p>登録されている3Dモデルはありません</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {movies.map((movie) => {
              // APIから取得したthumbnail_urlを使用
              const thumbnailUrl = movie.thumbnail_url || null
              
              return (
                <div
                  key={movie.id}
                  className="rounded-lg overflow-hidden shadow-md bg-white transform transition-transform duration-300 hover:-translate-y-1"
                >
                  <Link href={`/luma/${movie.id}`} className="block">
                    <div className="w-full h-52 bg-gray-200 flex items-center justify-center relative overflow-hidden group">
                      {thumbnailUrl ? (
                        <Image
                          src={thumbnailUrl}
                          alt={movie.title || `Movie ${movie.id}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          width={600}
                          height={400}
                          unoptimized={thumbnailUrl.startsWith('http')}
                          onError={(e) => {
                            // エラー時は非表示にしてプレースホルダーを表示
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
                      <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                        3D
                      </div>
                      {/* ホバー時の再生アイコン */}
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
                    </div>
                  </Link>
                  
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {movie.title || `Movie ${movie.id}`}
                    </h2>
                    {movie.note && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{movie.note}</p>
                    )}
                    <div className="flex gap-2">
                      <Link
                        href={`/luma/${movie.id}`}
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-800 transition"
                      >
                        3Dモデルを見る
                      </Link>

                      <a
                        href={movie.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-700 transition"
                      >
                        Luma.aiで見る
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </LayoutWithFooter>
  )
}

export default LumaList
