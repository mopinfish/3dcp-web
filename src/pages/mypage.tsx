/**
 * /mypage.tsx
 *
 * マイページ
 * - ユーザープロフィール
 * - マイ文化財セクション
 * - マイムービーセクション
 */

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import { CulturalPropertyCardList } from '@/components/cultural-property/CulturalPropertyCard'
import { MovieCardList } from '@/components/movie/MovieCard'
import { CulturalProperty } from '@/domains/models/cultural_property'
import { Movie } from '@/domains/models/movie'
import * as CulturalPropertyRepository from '@/infrastructures/repositories/cultural_property'
import * as MovieRepository from '@/infrastructures/repositories/movie'

function MyPageContent() {
  const router = useRouter()
  const { user, logout } = useAuth()

  // マイ文化財
  const [myProperties, setMyProperties] = useState<CulturalProperty[]>([])
  const [propertiesLoading, setPropertiesLoading] = useState(true)

  // マイムービー
  const [myMovies, setMyMovies] = useState<Movie[]>([])
  const [moviesLoading, setMoviesLoading] = useState(true)

  /**
   * マイ文化財を取得
   */
  const fetchMyProperties = useCallback(async () => {
    setPropertiesLoading(true)
    try {
      const response = await CulturalPropertyRepository.getMy()
      setMyProperties(response.results)
    } catch (error) {
      console.error('Failed to fetch my properties:', error)
    } finally {
      setPropertiesLoading(false)
    }
  }, [])

  /**
   * マイムービーを取得
   */
  const fetchMyMovies = useCallback(async () => {
    setMoviesLoading(true)
    try {
      const response = await MovieRepository.getMy()
      setMyMovies(response.results)
    } catch (error) {
      console.error('Failed to fetch my movies:', error)
    } finally {
      setMoviesLoading(false)
    }
  }, [])

  /**
   * 文化財を削除
   */
  const handleDeleteProperty = async (id: number) => {
    try {
      await CulturalPropertyRepository.remove(id)
      setMyProperties((prev) => prev.filter((p) => p.id !== id))
    } catch (error) {
      console.error('Failed to delete property:', error)
      alert('削除に失敗しました。再度お試しください。')
    }
  }

  /**
   * ムービーを削除
   */
  const handleDeleteMovie = async (id: number) => {
    try {
      await MovieRepository.remove(id)
      setMyMovies((prev) => prev.filter((m) => m.id !== id))
    } catch (error) {
      console.error('Failed to delete movie:', error)
      alert('削除に失敗しました。再度お試しください。')
    }
  }

  /**
   * ログアウト
   */
  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // 初回データ取得
  useEffect(() => {
    fetchMyProperties()
    fetchMyMovies()
  }, [fetchMyProperties, fetchMyMovies])

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                マイページ
              </h1>
              <Link
                href="/"
                className="hidden sm:inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                <svg
                  className="mr-1 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                トップページ
              </Link>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              ログアウト
            </button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* プロフィールカード */}
          <div className="lg:col-span-1">
            <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100">
              <div className="px-4 py-6 sm:p-6">
                {/* アバター */}
                <div className="flex justify-center">
                  <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center ring-4 ring-gray-100">
                    {user.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.avatar}
                        alt={user.name || user.username}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <svg
                        className="h-16 w-16 sm:h-20 sm:w-20 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* ユーザー情報 */}
                <div className="mt-5 text-center">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {user.name || user.username}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">@{user.username}</p>

                  {/* メール認証バッジ */}
                  <div className="mt-4">
                    {user.is_email_verified ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <svg
                          className="mr-1 h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        メール認証済み
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        <svg
                          className="mr-1 h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        メール未認証
                      </span>
                    )}
                  </div>
                </div>

                {/* 統計 */}
                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-5">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {myProperties.length}
                    </p>
                    <p className="text-xs text-gray-500">登録文化財</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {myMovies.length}
                    </p>
                    <p className="text-xs text-gray-500">3D映像</p>
                  </div>
                </div>

                {/* アクションボタン */}
                <div className="mt-6 space-y-3">
                  <Link
                    href="/mypage/edit"
                    className="w-full inline-flex justify-center items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    プロフィールを編集
                  </Link>
                  <Link
                    href="/cultural-properties/new"
                    className="w-full inline-flex justify-center items-center px-4 py-2.5 border-2 border-blue-600 text-sm font-medium rounded-lg text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    文化財を登録
                  </Link>
                </div>
              </div>
            </div>

            {/* 基本情報（デスクトップのみ） */}
            <div className="hidden lg:block mt-6 bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">
                  基本情報
                </h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      メールアドレス
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                  </div>
                  {user.bio && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        自己紹介
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.bio}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      登録日
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {user.date_joined
                        ? new Date(user.date_joined).toLocaleDateString('ja-JP')
                        : '不明'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* 右側コンテンツ */}
          <div className="lg:col-span-2 space-y-6">
            {/* マイ文化財セクション */}
            <section className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
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
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    マイ文化財
                    {myProperties.length > 0 && (
                      <span className="ml-2 bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {myProperties.length}
                      </span>
                    )}
                  </h3>
                  <Link
                    href="/cultural-properties/new"
                    className="
                      inline-flex items-center
                      px-4 py-2
                      text-sm font-medium
                      text-blue-700
                      bg-blue-50
                      rounded-lg
                      hover:bg-blue-100
                      transition-colors duration-200
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    新規登録
                  </Link>
                </div>

                <CulturalPropertyCardList
                  properties={myProperties}
                  onDelete={handleDeleteProperty}
                  isLoading={propertiesLoading}
                  emptyMessage="登録した文化財はまだありません"
                />
              </div>
            </section>

            {/* マイムービーセクション */}
            <section className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-purple-600"
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
                    マイ3D映像
                    {myMovies.length > 0 && (
                      <span className="ml-2 bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {myMovies.length}
                      </span>
                    )}
                  </h3>
                </div>

                <MovieCardList
                  movies={myMovies}
                  onDelete={handleDeleteMovie}
                  isLoading={moviesLoading}
                  emptyMessage="登録した3D映像はまだありません"
                />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function MyPage() {
  return (
    <ProtectedRoute>
      <MyPageContent />
    </ProtectedRoute>
  )
}
