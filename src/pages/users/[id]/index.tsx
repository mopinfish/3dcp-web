/**
 * /users/[id]/index.tsx
 *
 * 公開ユーザープロフィールページ
 * 
 * ✅ Phase 3対応:
 * - 他ユーザーの公開プロフィールを表示
 * - そのユーザーが登録した文化財・3Dモデルの一覧を表示
 */

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { LayoutWithFooter } from '@/components/layouts/Layout'
import NavigationTab from '@/components/blocks/NavigationTab'
import { CulturalProperty } from '@/domains/models/cultural_property'
import { Movie } from '@/domains/models/movie'
import * as UserRepository from '@/infrastructures/repositories/user'
import * as CulturalPropertyRepository from '@/infrastructures/repositories/cultural_property'
import * as MovieRepository from '@/infrastructures/repositories/movie'

type PublicUserProfile = UserRepository.PublicUserProfile

export default function UserProfilePage() {
  const router = useRouter()
  const { id } = router.query

  const [user, setUser] = useState<PublicUserProfile | null>(null)
  const [properties, setProperties] = useState<CulturalProperty[]>([])
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // タブ管理
  const [activeTab, setActiveTab] = useState<'properties' | 'movies'>('properties')

  const fetchUserProfile = useCallback(async () => {
    if (!id || typeof id !== 'string') return
    setIsLoading(true)
    setError(null)
    
    try {
      const userId = parseInt(id, 10)
      const userData = await UserRepository.getById(userId)
      setUser(userData)

      // ユーザーの文化財を取得
      // get()はCulturalProperties配列を直接返す
      const propertiesData = await CulturalPropertyRepository.get({
        created_by: userId.toString(),
        ordering: '-updated_at',
      })
      setProperties(propertiesData || [])

      // ユーザーのムービーを取得
      // get()はMovies配列を直接返す
      const moviesData = await MovieRepository.get({
        created_by: userId.toString(),
        ordering: '-updated_at',
      })
      setMovies(moviesData || [])

    } catch (err) {
      console.error('Failed to fetch user profile:', err)
      setError('ユーザーが見つかりませんでした')
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (router.isReady && id) {
      fetchUserProfile()
    }
  }, [router.isReady, id, fetchUserProfile])

  // 日付フォーマット
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '不明'
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <LayoutWithFooter>
        <NavigationTab />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
      </LayoutWithFooter>
    )
  }

  if (error || !user) {
    return (
      <LayoutWithFooter>
        <NavigationTab />
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <div className="bg-red-50 rounded-xl p-8">
            <svg
              className="w-16 h-16 text-red-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-lg font-medium text-red-800 mb-4">
              {error || 'ユーザーが見つかりませんでした'}
            </p>
            <Link
              href="/"
              className="inline-flex items-center text-red-600 hover:text-red-800 cursor-pointer"
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              トップページに戻る
            </Link>
          </div>
        </div>
      </LayoutWithFooter>
    )
  }

  return (
    <LayoutWithFooter>
      <NavigationTab />
      
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        {/* パンくずリスト */}
        <nav className="mb-6">
          <ol className="flex items-center text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-blue-600 cursor-pointer">
                トップ
              </Link>
            </li>
            <li className="mx-2">/</li>
            <li className="text-gray-900 font-medium">
              {user.name || user.username}さんのプロフィール
            </li>
          </ol>
        </nav>

        {/* プロフィールヘッダー */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* アバター */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-200 ring-4 ring-gray-100">
                {user.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt={user.name || user.username}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                    unoptimized={user.avatar_url.startsWith('http')}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                    <svg
                      className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* ユーザー情報 */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                {user.name || user.username}
              </h1>
              <p className="text-gray-500 mb-4">@{user.username}</p>

              {/* 自己紹介 */}
              {user.bio && (
                <p className="text-gray-600 mb-4 whitespace-pre-wrap">{user.bio}</p>
              )}

              {/* 統計 */}
              <div className="flex justify-center sm:justify-start gap-6 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {user.cultural_property_count}
                  </p>
                  <p className="text-xs text-gray-500">登録文化財</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {user.movie_count}
                  </p>
                  <p className="text-xs text-gray-500">3Dモデル</p>
                </div>
              </div>

              {/* 登録日 */}
              <p className="text-sm text-gray-500">
                <svg
                  className="w-4 h-4 inline-block mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {formatDate(user.date_joined)} に登録
              </p>
            </div>
          </div>
        </div>

        {/* タブナビゲーション */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('properties')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'properties'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <svg
                className="w-4 h-4 inline-block mr-1.5"
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
              文化財 ({properties.length})
            </button>
            <button
              onClick={() => setActiveTab('movies')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'movies'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <svg
                className="w-4 h-4 inline-block mr-1.5"
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
              3Dモデル ({movies.length})
            </button>
          </div>

          {/* コンテンツ */}
          <div className="p-4">
            {activeTab === 'properties' && (
              <>
                {properties.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {properties.map((property) => (
                      <Link
                        key={property.id}
                        href={`/cultural-properties/${property.id}`}
                        className="group block bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
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
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
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
                              <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                                3D
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium text-gray-900 group-hover:text-blue-600 truncate">
                            {property.name}
                          </h3>
                          {property.type && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                              {property.type}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <svg
                      className="w-12 h-12 mx-auto mb-2 text-gray-300"
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
                    <p>登録された文化財はありません</p>
                  </div>
                )}
              </>
            )}

            {activeTab === 'movies' && (
              <>
                {movies.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {movies.map((movie) => (
                      <Link
                        key={movie.id}
                        href={`/luma/${movie.id}`}
                        className="group block bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="aspect-video relative bg-gray-200">
                          {movie.thumbnail_url ? (
                            <Image
                              src={movie.thumbnail_url}
                              alt={movie.title || '3Dモデル'}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              unoptimized={movie.thumbnail_url.startsWith('http')}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
                              <svg
                                className="w-12 h-12 text-white/50"
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
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                              <svg
                                className="w-6 h-6 text-blue-600 ml-1"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium text-gray-900 group-hover:text-purple-600 truncate">
                            {movie.title || '3Dモデル'}
                          </h3>
                          {movie.note && (
                            <p className="text-sm text-gray-500 truncate mt-1">{movie.note}</p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <svg
                      className="w-12 h-12 mx-auto mb-2 text-gray-300"
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
                    <p>登録された3Dモデルはありません</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </LayoutWithFooter>
  )
}
