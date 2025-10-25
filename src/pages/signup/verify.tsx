import React from 'react'
import Link from 'next/link'

export default function VerifyNotificationPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* アイコン */}
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100">
            <svg
              className="h-16 w-16 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          {/* タイトル */}
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            確認メールを送信しました
          </h2>

          {/* メッセージ */}
          <div className="mt-4 space-y-3 text-gray-600">
            <p>
              ご登録いただいたメールアドレスに確認メールを送信しました。
            </p>
            <p>
              メール内のリンクをクリックして、アカウントの認証を完了してください。
            </p>
            <p className="text-sm text-gray-500">
              ※ メールが届かない場合は、迷惑メールフォルダもご確認ください。
            </p>
          </div>

          {/* 注意事項 */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  確認メールのリンクは24時間有効です
                </h3>
                <p className="mt-2 text-sm text-blue-700">
                  期限が切れた場合は、再度サインアップからやり直してください。
                </p>
              </div>
            </div>
          </div>

          {/* リンク */}
          <div className="mt-8 space-y-4">
            <Link
              href="/"
              className="block w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              トップページへ戻る
            </Link>
            <Link
              href="/signin"
              className="block w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              サインイン画面へ
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}