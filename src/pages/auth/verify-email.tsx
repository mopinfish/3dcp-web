import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import * as authRepo from '@/infrastructures/repositories/auth'

type VerifyStatus = 'verifying' | 'success' | 'error'

export default function VerifyEmailPage() {
  const router = useRouter()
  const [status, setStatus] = useState<VerifyStatus>('verifying')
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    const verifyEmail = async () => {
      // router.queryが準備完了するまで待つ
      if (!router.isReady) return

      const token = router.query.token as string

      if (!token) {
        setStatus('error')
        setMessage('認証トークンが見つかりません。')
        return
      }

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
        setMessage(
          'メール認証に失敗しました。トークンの有効期限が切れているか、無効なトークンです。',
        )
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
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                メール認証中...
              </h2>
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
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                認証完了しました!
              </h2>
              <p className="mt-4 text-gray-600">{message}</p>
              <p className="mt-2 text-sm text-gray-500">
                3秒後に自動的にサインイン画面へ移動します...
              </p>
              <div className="mt-8">
                <Link
                  href="/signin"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  今すぐサインインする
                </Link>
              </div>
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
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                認証に失敗しました
              </h2>
              <p className="mt-4 text-gray-600">{message}</p>

              <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      再度サインアップしてください
                    </h3>
                    <p className="mt-2 text-sm text-yellow-700">
                      認証リンクの有効期限は24時間です。期限が切れた場合は、もう一度サインアップからやり直してください。
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <Link
                  href="/signup"
                  className="block w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  サインアップへ戻る
                </Link>
                <Link
                  href="/"
                  className="block w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  トップページへ戻る
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}