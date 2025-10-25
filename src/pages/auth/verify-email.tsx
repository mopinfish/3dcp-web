/**
 * verify-email.tsx
 *
 * メール認証ページ
 * メールに記載されたリンクからアクセスし、トークンを検証してメールアドレスを認証する
 */

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import * as authRepo from '@/infrastructures/repositories/auth'
import { ApiError } from '@/infrastructures/lib/errors'

type VerificationStatus = 'verifying' | 'success' | 'error'

export default function VerifyEmailPage() {
  const router = useRouter()
  const [status, setStatus] = useState<VerificationStatus>('verifying')
  const [message, setMessage] = useState<string>('')
  const [errorDetails, setErrorDetails] = useState<string>('')

  useEffect(() => {
    const verifyEmail = async () => {
      // router.queryが準備完了するまで待つ
      if (!router.isReady) return

      const token = router.query.token as string

      if (!token) {
        setStatus('error')
        setMessage('認証トークンが見つかりません。')
        setErrorDetails('URLにトークンパラメータが含まれていません。')
        return
      }

      console.log('Verifying email with token:', token.substring(0, 10) + '...')

      try {
        const response = await authRepo.verifyEmail({ token })
        setStatus('success')
        setMessage(response.message || 'メール認証が完了しました。')

        // 3秒後にサインイン画面へリダイレクト
        setTimeout(() => {
          router.push('/signin')
        }, 3000)
      } catch (error) {
        console.error('Verification failed:', error)
        setStatus('error')

        // ApiErrorの場合、詳細なエラーメッセージを表示
        if (error instanceof ApiError) {
          const errorMessage = error.getErrorMessage()
          setMessage('メール認証に失敗しました')
          setErrorDetails(errorMessage)

          console.log('API Error Status:', error.status)
          console.log('API Error Data:', error.data)
        } else {
          setMessage('メール認証に失敗しました')
          setErrorDetails('予期しないエラーが発生しました。')
        }
      }
    }

    verifyEmail()
  }, [router.isReady, router.query.token, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* ローディング中 */}
          {status === 'verifying' && (
            <>
              <div className="mx-auto flex items-center justify-center h-24 w-24">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">メール認証中...</h2>
              <p className="mt-2 text-gray-600">しばらくお待ちください</p>
            </>
          )}

          {/* 成功 */}
          {status === 'success' && (
            <>
              <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100">
                <svg
                  className="h-16 w-16 text-green-600"
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
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">認証完了しました!</h2>
              <p className="mt-2 text-gray-600">{message}</p>
              <p className="mt-2 text-sm text-gray-500">
                3秒後にサインイン画面へ自動的に移動します...
              </p>
            </>
          )}

          {/* エラー */}
          {status === 'error' && (
            <>
              <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100">
                <svg
                  className="h-16 w-16 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">{message}</h2>

              {/* エラー詳細 */}
              {errorDetails && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
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
                      <p className="text-sm text-red-800 whitespace-pre-line">{errorDetails}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 対処方法 */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-blue-800">対処方法</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>認証リンクの有効期限は24時間です</li>
                    <li>期限切れの場合は、再度サインアップしてください</li>
                    <li>すでに認証済みの場合は、サインインしてください</li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {/* アクションボタン */}
          {status !== 'verifying' && (
            <div className="mt-8 space-y-4">
              {status === 'error' && (
                <>
                  <Link
                    href="/signup"
                    className="block w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    新規登録画面へ
                  </Link>
                  <Link
                    href="/signin"
                    className="block w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    サインイン画面へ
                  </Link>
                </>
              )}
              <Link
                href="/"
                className="block w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                トップページへ戻る
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
