/**
 * signin.tsx
 *
 * サインイン画面
 * ユーザー名またはメールアドレスとパスワードでログイン
 *
 * ✅ 修正内容:
 * - signIn関数の返り値{ success, error }をチェックしてエラーメッセージを表示
 * - try-catchは残すが、エラーがthrowされないためError Overlayは表示されない
 */

import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { ApiError } from '@/infrastructures/lib/errors'
import type { SignInRequest } from '@/domains/models/user'

export default function SignInPage() {
  const router = useRouter()
  const { signIn } = useAuth()

  const [formData, setFormData] = useState<SignInRequest>({
    username: '',
    password: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  /**
   * 入力値の変更ハンドラー
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // 入力時にエラーをクリア
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  /**
   * クライアントサイドバリデーション
   */
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) {
      newErrors.username = 'ユーザー名またはメールアドレスを入力してください'
    }

    if (!formData.password) {
      newErrors.password = 'パスワードを入力してください'
    } else if (formData.password.length < 8) {
      newErrors.password = 'パスワードは8文字以上で入力してください'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * APIエラーを解析してユーザーフレンドリーなメッセージに変換
   */
  const parseApiError = (error: unknown): Record<string, string> => {
    const newErrors: Record<string, string> = {}

    console.log('=== Error Debug ===')
    console.log('Error:', error)
    console.log('Error type:', typeof error)
    console.log('Is ApiError:', error instanceof ApiError)

    // ApiErrorインスタンスかチェック
    if (error instanceof ApiError) {
      const { status, data } = error

      console.log('Status:', status)
      console.log('Data:', data)
      console.log('Data type:', typeof data)

      // ネットワークエラー (status = 0)
      if (status === 0) {
        newErrors.submit =
          'ネットワークエラーが発生しました。インターネット接続を確認してください。'
        return newErrors
      }

      // 400 Bad Request - バリデーションエラー
      if (status === 400) {
        if (typeof data === 'object' && data !== null) {
          // non_field_errorsの処理(スネークケース)
          if ('non_field_errors' in data) {
            const nonFieldErrors = (data as any).non_field_errors
            console.log('non_field_errors:', nonFieldErrors)

            if (Array.isArray(nonFieldErrors) && nonFieldErrors.length > 0) {
              // 配列の各要素を文字列に変換
              const errorMessages = nonFieldErrors.map((err: any) => {
                // ErrorDetailオブジェクトの場合
                if (typeof err === 'object' && err !== null) {
                  return err.string || err.message || err.toString()
                }
                return String(err)
              })
              newErrors.submit = errorMessages.join(', ')
              console.log('Set submit error:', newErrors.submit)
              return newErrors
            }
          }

          // nonFieldErrors(キャメルケース)の処理
          if ('nonFieldErrors' in data) {
            const nonFieldErrors = (data as any).nonFieldErrors
            if (Array.isArray(nonFieldErrors) && nonFieldErrors.length > 0) {
              const errorMessages = nonFieldErrors.map((err: any) => {
                if (typeof err === 'object' && err !== null) {
                  return err.string || err.message || err.toString()
                }
                return String(err)
              })
              newErrors.submit = errorMessages.join(', ')
              return newErrors
            }
          }

          // detailフィールドの処理
          if ('detail' in data) {
            newErrors.submit = String((data as any).detail)
            return newErrors
          }

          // errorフィールドの処理
          if ('error' in data) {
            newErrors.submit = String((data as any).error)
            return newErrors
          }

          // messageフィールドの処理
          if ('message' in data) {
            newErrors.submit = String((data as any).message)
            return newErrors
          }

          // フィールドごとのエラー
          for (const [field, fieldErrors] of Object.entries(data)) {
            console.log(`Field: ${field}, Errors:`, fieldErrors)

            if (field === 'username' || field === 'password') {
              if (Array.isArray(fieldErrors)) {
                newErrors[field] = fieldErrors
                  .map((err) => {
                    if (typeof err === 'object' && err !== null) {
                      return (err as any).string || (err as any).message || String(err)
                    }
                    return String(err)
                  })
                  .join(', ')
              } else if (typeof fieldErrors === 'string') {
                newErrors[field] = fieldErrors
              } else if (typeof fieldErrors === 'object' && fieldErrors !== null) {
                newErrors[field] =
                  (fieldErrors as any).string || (fieldErrors as any).message || String(fieldErrors)
              }
            }
          }

          if (Object.keys(newErrors).length > 0) {
            return newErrors
          }
        }

        // データが文字列の場合
        if (typeof data === 'string') {
          newErrors.submit = data
          return newErrors
        }

        newErrors.submit = '入力内容に誤りがあります。もう一度ご確認ください。'
        return newErrors
      }

      // 401 Unauthorized - 認証エラー
      if (status === 401) {
        newErrors.submit = 'メールアドレス/ユーザー名またはパスワードが正しくありません。'
        return newErrors
      }

      // 403 Forbidden
      if (status === 403) {
        newErrors.submit =
          'アクセスが拒否されました。アカウントが無効化されている可能性があります。'
        return newErrors
      }

      // 429 Too Many Requests
      if (status === 429) {
        newErrors.submit =
          'ログイン試行回数が多すぎます。しばらく時間をおいてから再度お試しください。'
        return newErrors
      }

      // 500 Internal Server Error
      if (status >= 500) {
        newErrors.submit =
          'サーバーエラーが発生しました。しばらく時間をおいてから再度お試しください。'
        return newErrors
      }
    }

    // Error オブジェクトの場合
    if (error instanceof Error) {
      newErrors.submit = error.message || '予期しないエラーが発生しました。'
      return newErrors
    }

    // 不明なエラー
    console.log('Unknown error type')
    newErrors.submit = '予期しないエラーが発生しました。'
    return newErrors
  }

  /**
   * フォーム送信ハンドラー
   *
   * ✅ 重要な変更:
   * - signIn関数の返り値{ success, error }をチェック
   * - エラーがthrowされないため、Next.jsのError Overlayは表示されない
   */
  const handleSubmit = async (e: React.FormEvent) => {
    // デフォルトのフォーム送信を防ぐ
    e.preventDefault()

    // クライアントサイドバリデーション
    if (!validate()) {
      return
    }

    setIsLoading(true)
    setErrors({}) // エラーをクリア

    console.log('=== SignIn Attempt ===')
    console.log('Username/Email:', formData.username)
    console.log('Password length:', formData.password.length)

    // ✅ signIn関数を呼び出して結果オブジェクトを取得
    const result = await signIn(formData)

    // ✅ 結果をチェック
    if (result.success) {
      console.log('SignIn successful')

      // サインイン成功後、リダイレクト先へ遷移
      const redirect = (router.query.redirect as string) || '/mypage'
      await router.push(redirect)
    } else {
      // ✅ エラーがある場合、エラーメッセージを表示
      console.error('=== SignIn Error ===')
      console.error('Error:', result.error)

      // エラーを解析してユーザーフレンドリーなメッセージに変換
      const parsedErrors = parseApiError(result.error)
      console.log('Parsed errors:', parsedErrors)

      // エラーをstateにセット
      setErrors(parsedErrors)
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* ヘッダー */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">サインイン</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            または{' '}
            <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              新規登録
            </Link>
          </p>
        </div>

        {/* フォーム */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* ユーザー名/メールアドレス */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                ユーザー名またはメールアドレス
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={formData.username}
                onChange={handleChange}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.username ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="user@example.com"
              />
              {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
            </div>

            {/* パスワード */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="********"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
          </div>

          {/* パスワードを忘れた場合のリンク */}
          <div className="flex items-center justify-end">
            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                パスワードをお忘れですか?
              </Link>
            </div>
          </div>

          {/* 全体のエラーメッセージ */}
          {errors.submit && (
            <div className="rounded-md bg-red-50 border border-red-200 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800 whitespace-pre-line">{errors.submit}</p>
                </div>
              </div>
            </div>
          )}

          {/* 送信ボタン */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  サインイン中...
                </>
              ) : (
                'サインイン'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
