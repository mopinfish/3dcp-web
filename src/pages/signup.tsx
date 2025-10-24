/**
 * signup.tsx
 *
 * サインアップ画面
 * 新規ユーザー登録フォーム
 *
 * ✅ 修正内容:
 * - signUp関数の返り値{ success, error }をチェックしてエラーメッセージを表示
 * - エラーがthrowされないためError Overlayは表示されない
 */

import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { SignUpRequest } from '@/domains/models/user'
import { ApiError } from '@/infrastructures/lib/errors'

export default function SignUpPage() {
  const router = useRouter()
  const { signUp } = useAuth()

  const [formData, setFormData] = useState<SignUpRequest>({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    name: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  /**
   * フォーム入力変更ハンドラー
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // 入力時にエラーをクリア
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }

    // パスワード確認フィールドの自動検証
    if (name === 'password' || name === 'password_confirm') {
      if (errors.password_confirm) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.password_confirm
          return newErrors
        })
      }
    }
  }

  /**
   * クライアントサイドバリデーション
   */
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    // ユーザー名の検証
    if (!formData.username.trim()) {
      newErrors.username = 'ユーザー名を入力してください'
    } else if (formData.username.length < 3) {
      newErrors.username = 'ユーザー名は3文字以上で入力してください'
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'ユーザー名は半角英数字とアンダースコアのみ使用できます'
    }

    // メールアドレスの検証
    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください'
    }

    // パスワードの検証
    if (!formData.password) {
      newErrors.password = 'パスワードを入力してください'
    } else if (formData.password.length < 8) {
      newErrors.password = 'パスワードは8文字以上で入力してください'
    }

    // パスワード確認の検証
    if (!formData.password_confirm) {
      newErrors.password_confirm = 'パスワード(確認)を入力してください'
    } else if (formData.password !== formData.password_confirm) {
      newErrors.password_confirm = 'パスワードが一致しません'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * APIエラーを解析してユーザーフレンドリーなメッセージに変換
   */
  const parseApiError = (error: unknown): Record<string, string> => {
    const newErrors: Record<string, string> = {}

    // ApiErrorインスタンスかチェック
    if (error instanceof ApiError) {
      const { status, data } = error

      // ネットワークエラー (status = 0)
      if (status === 0) {
        newErrors.submit =
          'ネットワークエラーが発生しました。インターネット接続を確認してください。'
        return newErrors
      }

      // 400 Bad Request - バリデーションエラー
      if (status === 400) {
        if (typeof data === 'object' && data !== null) {
          // non_field_errorsの処理
          if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
            newErrors.submit = data.non_field_errors.join(', ')
          }

          // フィールドごとのエラーを日本語化
          const fieldMapping: Record<string, string> = {
            username: 'username',
            email: 'email',
            password: 'password',
            password_confirm: 'password_confirm',
            name: 'name',
          }

          for (const [field, fieldErrors] of Object.entries(data)) {
            const mappedField = fieldMapping[field] || field

            if (Array.isArray(fieldErrors)) {
              // よくあるエラーメッセージの日本語化
              const translatedErrors = fieldErrors.map((err: string) => {
                if (typeof err === 'string') {
                  // ユーザー名関連
                  if (
                    err.toLowerCase().includes('username') &&
                    err.toLowerCase().includes('already')
                  ) {
                    return 'このユーザー名は既に使用されています'
                  }
                  // メールアドレス関連
                  if (
                    err.toLowerCase().includes('email') &&
                    err.toLowerCase().includes('already')
                  ) {
                    return 'このメールアドレスは既に登録されています'
                  }
                  if (
                    err.toLowerCase().includes('email') &&
                    err.toLowerCase().includes('invalid')
                  ) {
                    return '有効なメールアドレスを入力してください'
                  }
                  // パスワード関連
                  if (
                    err.toLowerCase().includes('password') &&
                    err.toLowerCase().includes('short')
                  ) {
                    return 'パスワードは8文字以上で入力してください'
                  }
                  if (
                    err.toLowerCase().includes('password') &&
                    err.toLowerCase().includes('common')
                  ) {
                    return 'このパスワードは一般的すぎます。別のパスワードを使用してください'
                  }
                  if (
                    err.toLowerCase().includes('password') &&
                    err.toLowerCase().includes('numeric')
                  ) {
                    return 'パスワードは数字のみでは設定できません'
                  }
                }
                return err
              })

              newErrors[mappedField] = translatedErrors.join(', ')
            } else if (typeof fieldErrors === 'string') {
              newErrors[mappedField] = fieldErrors
            }
          }

          if (Object.keys(newErrors).length > 0) {
            return newErrors
          }
        }

        newErrors.submit = '入力内容に誤りがあります。もう一度ご確認ください。'
        return newErrors
      }

      // 409 Conflict - 重複エラー
      if (status === 409) {
        newErrors.submit = 'このユーザー名またはメールアドレスは既に登録されています。'
        return newErrors
      }

      // 429 Too Many Requests
      if (status === 429) {
        newErrors.submit = '登録試行回数が多すぎます。しばらく時間をおいてから再度お試しください。'
        return newErrors
      }

      // 500 Internal Server Error
      if (status >= 500) {
        newErrors.submit =
          'サーバーエラーが発生しました。しばらく時間をおいてから再度お試しください。'
        return newErrors
      }

      // その他のエラー
      newErrors.submit = error.getErrorMessage() || '予期しないエラーが発生しました。'
      return newErrors
    }

    // 一般的なエラー
    if (error instanceof Error) {
      newErrors.submit = error.message || '予期しないエラーが発生しました。'
      return newErrors
    }

    // 不明なエラー
    newErrors.submit = '予期しないエラーが発生しました。'
    return newErrors
  }

  /**
   * フォーム送信ハンドラー
   *
   * ✅ 重要な変更:
   * - signUp関数の返り値{ success, error }をチェック
   * - エラーがthrowされないため、Next.jsのError Overlayは表示されない
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // クライアントサイドバリデーション
    if (!validate()) {
      return
    }

    setIsLoading(true)
    setErrors({}) // エラーをクリア

    // ✅ signUp関数を呼び出して結果オブジェクトを取得
    const result = await signUp(formData)

    // ✅ 結果をチェック
    if (result.success) {
      console.log('Sign up success:', result.data)

      // 登録成功後、メール確認画面へ遷移
      router.push('/signup/verify')
    } else {
      // ✅ エラーがある場合、エラーメッセージを表示
      console.error('Sign up error:', result.error)

      // エラーを解析してユーザーフレンドリーなメッセージに変換
      const parsedErrors = parseApiError(result.error)
      setErrors(parsedErrors)
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            新規アカウント登録
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            すでにアカウントをお持ちですか?{' '}
            <Link href="/signin" className="font-medium text-blue-600 hover:text-blue-500">
              サインイン
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* ユーザー名 */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                ユーザー名 <span className="text-red-500">*</span>
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
                  errors.username ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="yamada_taro"
                disabled={isLoading}
              />
              {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
              <p className="mt-1 text-xs text-gray-500">3文字以上の半角英数字とアンダースコア</p>
            </div>

            {/* メールアドレス */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="example@example.com"
                disabled={isLoading}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* 名前 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                名前
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="山田 太郎"
                disabled={isLoading}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* パスワード */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                パスワード <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="8文字以上"
                disabled={isLoading}
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* パスワード確認 */}
            <div>
              <label htmlFor="password_confirm" className="block text-sm font-medium text-gray-700">
                パスワード(確認) <span className="text-red-500">*</span>
              </label>
              <input
                id="password_confirm"
                name="password_confirm"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password_confirm}
                onChange={handleChange}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.password_confirm ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="もう一度入力"
                disabled={isLoading}
              />
              {errors.password_confirm && (
                <p className="mt-1 text-sm text-red-600">{errors.password_confirm}</p>
              )}
            </div>
          </div>

          {/* エラーメッセージ */}
          {errors.submit && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
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
                  登録中...
                </>
              ) : (
                'アカウントを登録'
              )}
            </button>
          </div>

          {/* 利用規約 */}
          <div className="text-xs text-gray-500 text-center">
            登録することで、
            <Link href="/terms" className="text-blue-600 hover:text-blue-500">
              利用規約
            </Link>
            および
            <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
              プライバシーポリシー
            </Link>
            に同意したものとみなされます
          </div>
        </form>
      </div>
    </div>
  )
}
