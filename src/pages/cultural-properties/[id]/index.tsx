/**
 * /cultural-properties/[id]/index.tsx
 *
 * 文化財詳細ページ
 * - 文化財の詳細情報を表示
 * - 紐づいている3Dモデル一覧を表示
 * - 所有者のみ編集ページへのリンクを表示
 */

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { LayoutWithFooter } from '@/components/layouts/Layout'
import { useAuth } from '@/contexts/AuthContext'
import { CulturalProperty } from '@/domains/models/cultural_property'
import * as CulturalPropertyRepository from '@/infrastructures/repositories/cultural_property'

export default function CulturalPropertyDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const { user } = useAuth()

  const [property, setProperty] = useState<CulturalProperty | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProperty = useCallback(async () => {
    if (!id || typeof id !== 'string') return
    setIsLoading(true)
    setError(null)
    try {
      const data = await CulturalPropertyRepository.getById(parseInt(id, 10))
      setProperty(data)
    } catch (err) {
      console.error('Failed to fetch property:', err)
      setError('文化財の取得に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (router.isReady && id) {
      fetchProperty()
    }
  }, [router.isReady, id, fetchProperty])

  if (isLoading) {
    return (
      <LayoutWithFooter>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </LayoutWithFooter>
    )
  }

  if (error || !property) {
    return (
      <LayoutWithFooter>
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
              {error || '文化財が見つかりませんでした'}
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

  const isOwner = property.created_by?.id === user?.id
  const hasMovies = property.movies && property.movies.length > 0

  // 更新日時のフォーマット
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <LayoutWithFooter>
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
            <li>
              <Link href="/3d_map" className="hover:text-blue-600 cursor-pointer">
                3Dマップ
              </Link>
            </li>
            <li className="mx-2">/</li>
            <li className="text-gray-900 font-medium truncate max-w-[200px]">
              {property.name}
            </li>
          </ol>
        </nav>

        {/* ヘッダー部分 */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden mb-6">
          {/* メイン画像エリア */}
          <div className="relative bg-gradient-to-br from-blue-50 to-purple-50">
            {hasMovies && property.movies[0].thumbnail_url ? (
              <div className="aspect-video relative">
                <Image
                  src={property.movies[0].thumbnail_url}
                  alt={property.name}
                  fill
                  className="object-cover"
                  unoptimized={property.movies[0].thumbnail_url.startsWith('http')}
                />
                {/* 3Dモデルへのリンクオーバーレイ */}
                <Link
                  href={`/luma/${property.movies[0].id}`}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <div className="bg-white/90 rounded-full p-4 shadow-lg">
                    <svg
                      className="w-12 h-12 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
                      />
                    </svg>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="aspect-video flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <svg
                    className="w-20 h-20 mx-auto mb-2"
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
                  <p className="text-sm">3Dモデル未登録</p>
                </div>
              </div>
            )}

            {/* カテゴリバッジ */}
            {property.category && (
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/90 text-gray-800 shadow-sm">
                  {property.category}
                </span>
              </div>
            )}

            {/* 3Dバッジ */}
            {hasMovies && (
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-500 text-white shadow-sm">
                  3D
                </span>
              </div>
            )}
          </div>

          {/* 文化財情報 */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {property.name}
                </h1>
                {property.name_kana && (
                  <p className="text-sm text-gray-500">{property.name_kana}</p>
                )}
              </div>
              {isOwner && (
                <Link
                  href={`/cultural-properties/${property.id}/edit`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 mr-2"
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
              )}
            </div>

            {/* 種別 */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700">
                {property.type}
              </span>
              {property.tags && property.tags.length > 0 && property.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                >
                  {tag.name}
                </span>
              ))}
            </div>

            {/* 住所 */}
            <div className="flex items-start text-gray-600 mb-4">
              <svg
                className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
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
              <span>{property.address}</span>
            </div>

            {/* 場所名 */}
            {property.place_name && (
              <div className="flex items-start text-gray-600 mb-4">
                <svg
                  className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
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
                <span>{property.place_name}</span>
              </div>
            )}

            {/* 備考 */}
            {property.note && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">備考</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{property.note}</p>
              </div>
            )}

            {/* 外部リンク */}
            {property.url && (
              <div className="mb-4">
                <a
                  href={property.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 cursor-pointer"
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
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  外部サイトを見る
                </a>
              </div>
            )}

            {/* メタ情報 */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-100">
              {property.created_by && (
                <div className="flex items-center">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  登録者: {property.created_by.name || property.created_by.username}
                </div>
              )}
              {property.updated_at && (
                <div className="flex items-center">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  更新: {formatDate(property.updated_at)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3Dモデル一覧 */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
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
            3Dモデル ({property.movies?.length || 0}件)
          </h2>

          {hasMovies ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {property.movies.map((movie) => (
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
                    {/* ホバー時の再生アイコン */}
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
                    <p className="font-medium text-gray-900 group-hover:text-blue-600 truncate">
                      {movie.title || '3Dモデル'}
                    </p>
                    {movie.note && (
                      <p className="text-sm text-gray-500 truncate mt-1">{movie.note}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
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
              <p>3Dモデルはまだ登録されていません</p>
              {isOwner && (
                <Link
                  href={`/cultural-properties/${property.id}/edit`}
                  className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-800 cursor-pointer"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  3Dモデルを追加する
                </Link>
              )}
            </div>
          )}
        </div>

        {/* マップで見るボタン */}
        <div className="flex justify-center">
          <Link
            href={`/3d_map?lat=${property.latitude}&lng=${property.longitude}&zoom=16`}
            className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
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
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            3Dマップで場所を確認する
          </Link>
        </div>
      </div>
    </LayoutWithFooter>
  )
}
