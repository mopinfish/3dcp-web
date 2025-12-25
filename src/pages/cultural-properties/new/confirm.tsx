/**
 * /cultural-properties/new/confirm.tsx
 *
 * 文化財登録確認画面
 *
 * Step 2: 入力内容の確認
 * - 入力内容の表示
 * - 登録実行 or 修正に戻る
 */

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { LayoutWithFooter } from '@/components/layouts/Layout'
import { useAuth } from '@/contexts/AuthContext'
import { useCulturalPropertyForm } from '@/contexts/CulturalPropertyFormContext'
import { ReadOnlyField } from '@/components/common/FormField'
import * as CulturalPropertyRepository from '@/infrastructures/repositories/cultural_property'
import * as MovieRepository from '@/infrastructures/repositories/movie'
import { ApiError } from '@/infrastructures/lib/errors'

/**
 * 確認画面コンテンツ（Contextを使用）
 */
function ConfirmContent() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { formData, isFormValid, setCreatedId } =
    useCulturalPropertyForm()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 認証チェック
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/signin?redirect=/cultural-properties/new')
    }
  }, [authLoading, isAuthenticated, router])

  // フォームデータの検証（入力画面をスキップした場合の対策）
  useEffect(() => {
    if (!authLoading && isAuthenticated && !isFormValid()) {
      router.push('/cultural-properties/new')
    }
  }, [authLoading, isAuthenticated, isFormValid, router])

  /**
   * 登録処理
   */
  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      // 1. 文化財を作成
      console.log('📝 Creating cultural property...')
      const createdProperty = await CulturalPropertyRepository.create(
        formData.culturalProperty,
      )
      console.log('✅ Cultural property created:', createdProperty.id)

      // 2. ムービーを作成（ある場合）
      if (formData.movies.length > 0) {
        console.log(`📹 Creating ${formData.movies.length} movies...`)
        for (const movie of formData.movies) {
          await MovieRepository.create({
            url: movie.url,
            title: movie.title || undefined,
            note: movie.note || undefined,
            cultural_property: createdProperty.id,
          })
        }
        console.log('✅ Movies created')
      }

      // 3. 完了画面へ遷移
      setCreatedId(createdProperty.id)
      router.push('/cultural-properties/new/complete')
    } catch (err) {
      console.error('❌ Registration failed:', err)

      if (err instanceof ApiError) {
        setError(err.getErrorMessage())
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('登録中にエラーが発生しました。再度お試しください。')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // 認証ローディング中
  if (authLoading) {
    return (
      <LayoutWithFooter>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600">読み込み中...</p>
          </div>
        </div>
      </LayoutWithFooter>
    )
  }

  // 未認証の場合は何も表示しない
  if (!isAuthenticated) {
    return null
  }

  const { culturalProperty, movies } = formData

  return (
    <LayoutWithFooter>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">入力内容の確認</h1>
          <p className="mt-2 text-gray-600">
            以下の内容で文化財を登録します。内容を確認してください。
          </p>
        </div>

        {/* ステップインジケーター */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full text-sm font-medium">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">
                入力
              </span>
            </div>
            <div className="w-16 h-0.5 bg-blue-600 mx-4"></div>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-medium">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">
                確認
              </span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300 mx-4"></div>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-gray-300 text-gray-600 rounded-full text-sm font-medium">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">
                完了
              </span>
            </div>
          </div>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <svg
                className="h-5 w-5 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  登録に失敗しました
                </h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* 基本情報 */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">基本情報</h2>
          </div>
          <div className="px-6 py-4">
            <dl className="divide-y divide-gray-200">
              <ReadOnlyField label="名称" value={culturalProperty.name} />
              <ReadOnlyField
                label="名称（かな）"
                value={culturalProperty.name_kana}
              />
              <ReadOnlyField
                label="名称（通称）"
                value={culturalProperty.name_gener}
              />
              <ReadOnlyField
                label="名称（英語）"
                value={culturalProperty.name_en}
              />
              <ReadOnlyField label="種別" value={culturalProperty.type} />
              <ReadOnlyField
                label="カテゴリ"
                value={culturalProperty.category}
              />
            </dl>
          </div>
        </div>

        {/* 所在地 */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">所在地</h2>
          </div>
          <div className="px-6 py-4">
            <dl className="divide-y divide-gray-200">
              <ReadOnlyField
                label="場所名"
                value={culturalProperty.place_name}
              />
              <ReadOnlyField label="住所" value={culturalProperty.address} />
              <ReadOnlyField
                label="緯度"
                value={culturalProperty.latitude}
              />
              <ReadOnlyField
                label="経度"
                value={culturalProperty.longitude}
              />
            </dl>
          </div>
        </div>

        {/* 追加情報 */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">追加情報</h2>
          </div>
          <div className="px-6 py-4">
            <dl className="divide-y divide-gray-200">
              <ReadOnlyField label="関連URL" value={culturalProperty.url} />
              <ReadOnlyField label="備考" value={culturalProperty.note} />
            </dl>
          </div>
        </div>

        {/* 3D映像 */}
        {movies.length > 0 && (
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                3D映像（{movies.length}件）
              </h2>
            </div>
            <div className="px-6 py-4">
              {movies.map((movie, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 mb-4 last:mb-0"
                >
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    3D映像 {index + 1}
                  </h3>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-xs text-gray-500">URL</dt>
                      <dd className="text-sm text-gray-900 break-all">
                        {movie.url}
                      </dd>
                    </div>
                    {movie.title && (
                      <div>
                        <dt className="text-xs text-gray-500">タイトル</dt>
                        <dd className="text-sm text-gray-900">{movie.title}</dd>
                      </div>
                    )}
                    {movie.note && (
                      <div>
                        <dt className="text-xs text-gray-500">備考</dt>
                        <dd className="text-sm text-gray-900">{movie.note}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ボタン */}
        <div className="flex justify-between">
          <Link
            href="/cultural-properties/new"
            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            ← 修正する
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-6 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? '登録中...' : 'この内容で登録する'}
          </button>
        </div>
      </div>
    </LayoutWithFooter>
  )
}

/**
 * ページコンポーネント
 */
export default function ConfirmCulturalPropertyPage() {
  return <ConfirmContent />
}
