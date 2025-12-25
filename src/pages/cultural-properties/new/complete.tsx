/**
 * /cultural-properties/new/complete.tsx
 *
 * 文化財登録完了画面
 *
 * Step 3: 登録完了
 * - 完了メッセージ
 * - 登録した文化財へのリンク
 * - 次のアクションへの誘導
 */

import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { LayoutWithFooter } from '@/components/layouts/Layout'
import { useAuth } from '@/contexts/AuthContext'
import { useCulturalPropertyForm } from '@/contexts/CulturalPropertyFormContext'

/**
 * 完了画面コンテンツ（Contextを使用）
 */
function CompleteContent() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { createdId, resetForm } = useCulturalPropertyForm()

  // 認証チェック
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/signin')
    }
  }, [authLoading, isAuthenticated, router])

  // createdIdがない場合は入力画面へリダイレクト
  useEffect(() => {
    if (!authLoading && isAuthenticated && !createdId) {
      router.push('/cultural-properties/new')
    }
  }, [authLoading, isAuthenticated, createdId, router])

  /**
   * 新規登録画面へ（フォームをリセット）
   */
  const handleNewRegistration = () => {
    resetForm()
    router.push('/cultural-properties/new')
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

  // 未認証またはcreatedIdがない場合
  if (!isAuthenticated || !createdId) {
    return null
  }

  return (
    <LayoutWithFooter>
      <div className="max-w-3xl mx-auto px-4 py-8">
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
            <div className="w-16 h-0.5 bg-green-500 mx-4"></div>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full text-sm font-medium">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">
                確認
              </span>
            </div>
            <div className="w-16 h-0.5 bg-green-500 mx-4"></div>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full text-sm font-medium">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">
                完了
              </span>
            </div>
          </div>
        </div>

        {/* 完了メッセージ */}
        <div className="bg-white shadow rounded-lg p-8 text-center">
          {/* 成功アイコン */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg
              className="h-10 w-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            登録が完了しました！
          </h1>

          <p className="text-gray-600 mb-8">
            文化財の登録が正常に完了しました。
            <br />
            登録された情報は地図上で確認できます。
          </p>

          {/* 登録ID表示 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-500">登録ID</p>
            <p className="text-lg font-mono font-semibold text-gray-900">
              {createdId}
            </p>
          </div>

          {/* アクションボタン */}
          <div className="space-y-4">
            <Link
              href="/"
              className="block w-full py-3 px-4 text-center text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              地図で確認する
            </Link>

            <button
              onClick={handleNewRegistration}
              className="block w-full py-3 px-4 text-center text-sm font-medium text-blue-700 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200"
            >
              続けて別の文化財を登録
            </button>

            <Link
              href="/mypage"
              className="block w-full py-3 px-4 text-center text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              マイページへ
            </Link>
          </div>
        </div>

        {/* ヒント */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">💡 ヒント</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>
              • 登録した文化財は「マイページ」からいつでも編集できます
            </li>
            <li>• 3D映像は後から追加することも可能です</li>
            <li>• 他のユーザーも登録した文化財を閲覧できます</li>
          </ul>
        </div>
      </div>
    </LayoutWithFooter>
  )
}

/**
 * ページコンポーネント
 */
export default function CompleteCulturalPropertyPage() {
  return <CompleteContent />
}
