/**
 * /movies/[id]/edit.tsx
 *
 * ムービー編集画面
 *
 * - 既存のムービー情報を編集
 * - 所有者のみ編集可能
 */

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { LayoutWithFooter } from '@/components/layouts/Layout'
import { useAuth } from '@/contexts/AuthContext'
import { TextInput, TextArea } from '@/components/common/FormField'
import { Movie, MovieUpdateRequest } from '@/domains/models/movie'
import * as MovieRepository from '@/infrastructures/repositories/movie'

export default function EditMoviePage() {
  const router = useRouter()
  const { id } = router.query
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()

  const [movie, setMovie] = useState<Movie | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState('')

  // フォームデータ
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    note: '',
  })

  /**
   * ムービーデータを取得
   */
  const fetchMovie = useCallback(async () => {
    if (!id || typeof id !== 'string') return

    setIsLoading(true)
    try {
      const data = await MovieRepository.find(parseInt(id, 10))
      setMovie(data)

      // フォームデータを初期化
      setFormData({
        url: data.url || '',
        title: data.title || '',
        note: data.note || '',
      })
    } catch (error) {
      console.error('Failed to fetch movie:', error)
      setErrors({ general: '3D映像の取得に失敗しました' })
    } finally {
      setIsLoading(false)
    }
  }, [id])

  // 認証チェックとデータ取得
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/signin?redirect=/movies/${id}/edit`)
      return
    }

    if (router.isReady && id) {
      fetchMovie()
    }
  }, [authLoading, isAuthenticated, router, id, fetchMovie])

  /**
   * 入力変更ハンドラ
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // エラーをクリア
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  /**
   * バリデーション
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.url || formData.url.trim() === '') {
      newErrors.url = 'URLは必須です'
    } else if (
      !formData.url.startsWith('http://') &&
      !formData.url.startsWith('https://')
    ) {
      newErrors.url = '有効なURLを入力してください'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * 保存処理
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !movie) return

    setIsSaving(true)
    setSuccessMessage('')

    try {
      const updateData: MovieUpdateRequest = {
        url: formData.url,
        title: formData.title || undefined,
        note: formData.note || undefined,
      }

      await MovieRepository.update(movie.id, updateData)
      setSuccessMessage('保存しました')

      // 2秒後にマイページへ遷移
      setTimeout(() => {
        router.push('/mypage')
      }, 2000)
    } catch (error) {
      console.error('Failed to update movie:', error)
      setErrors({ general: '保存に失敗しました。再度お試しください。' })
    } finally {
      setIsSaving(false)
    }
  }

  // 認証ローディング中
  if (authLoading || isLoading) {
    return (
      <LayoutWithFooter>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">読み込み中...</p>
          </div>
        </div>
      </LayoutWithFooter>
    )
  }

  // 未認証
  if (!isAuthenticated) {
    return null
  }

  // ムービーが見つからない
  if (!movie) {
    return (
      <LayoutWithFooter>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600">3D映像が見つかりませんでした</p>
            <Link
              href="/mypage"
              className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              マイページに戻る
            </Link>
          </div>
        </div>
      </LayoutWithFooter>
    )
  }

  // 所有者チェック
  const isOwner = movie.created_by?.id === user?.id
  if (!isOwner && movie.created_by) {
    return (
      <LayoutWithFooter>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="bg-red-50 rounded-xl p-6">
              <svg
                className="mx-auto h-12 w-12 text-red-400"
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
              <p className="mt-4 text-lg font-medium text-red-800">
                この3D映像を編集する権限がありません
              </p>
              <Link
                href="/mypage"
                className="mt-4 inline-flex items-center text-red-600 hover:text-red-800"
              >
                マイページに戻る
              </Link>
            </div>
          </div>
        </div>
      </LayoutWithFooter>
    )
  }

  return (
    <LayoutWithFooter>
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
        {/* ヘッダー */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/mypage"
            className="
              inline-flex items-center
              text-gray-600 hover:text-gray-900
              mb-4
              py-2
              -ml-2 px-2
              rounded-lg
              hover:bg-gray-100
              transition-colors duration-200
            "
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
            マイページに戻る
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            3D映像を編集
          </h1>
          <p className="mt-2 text-base text-gray-600">
            「{movie.title || `3D映像 #${movie.id}`}」の情報を編集します
          </p>
        </div>

        {/* 成功メッセージ */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-green-600 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-green-800 font-medium">{successMessage}</p>
            </div>
            <p className="mt-1 text-sm text-green-700 ml-7">
              まもなくマイページへ移動します...
            </p>
          </div>
        )}

        {/* エラーメッセージ */}
        {errors.general && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-600 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-red-800 font-medium">{errors.general}</p>
            </div>
          </div>
        )}

        {/* フォーム */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white shadow-sm rounded-xl p-5 sm:p-6 mb-6 sm:mb-8 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center">
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
              3D映像情報
            </h2>

            <TextInput
              label="URL"
              name="url"
              type="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://lumalabs.ai/capture/..."
              required
              error={errors.url}
              description="Luma AIで生成した3D映像のURLを入力してください"
            />

            <TextInput
              label="タイトル"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="映像のタイトル"
            />

            <TextArea
              label="備考"
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="映像についての説明"
              rows={4}
            />

            {/* プレビューリンク */}
            {formData.url && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  プレビュー
                </p>
                <Link
                  href={`/luma/${movie.id}`}
                  target="_blank"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
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
                  3D映像を表示
                </Link>
              </div>
            )}
          </div>

          {/* 送信ボタン */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pb-8">
            <Link
              href="/mypage"
              className="
                w-full sm:w-auto
                px-6 py-3.5
                text-base font-medium text-center
                text-gray-700
                bg-white
                border-2 border-gray-300
                rounded-xl
                hover:bg-gray-50
                active:bg-gray-100
                transition-colors duration-200
              "
            >
              キャンセル
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className={`
                w-full sm:w-auto
                px-8 py-3.5
                text-base font-semibold
                text-white
                bg-purple-600
                border-2 border-transparent
                rounded-xl
                hover:bg-purple-700
                active:bg-purple-800
                transition-all duration-200
                shadow-md hover:shadow-lg
                flex items-center justify-center
                ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isSaving ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  保存中...
                </>
              ) : (
                <>
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  保存する
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </LayoutWithFooter>
  )
}
