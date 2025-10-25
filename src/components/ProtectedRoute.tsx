import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/AuthContext'

type ProtectedRouteProps = {
  children: React.ReactNode
}

/**
 * 認証が必要なページを保護するコンポーネント
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // ログイン後に元のページに戻れるように、リダイレクト先を保存
      const redirectUrl = `/signin?redirect=${encodeURIComponent(router.asPath)}`
      router.push(redirectUrl)
    }
  }, [isAuthenticated, isLoading, router])

  // ローディング中
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  // 未認証の場合は何も表示しない（リダイレクト中）
  if (!isAuthenticated) {
    return null
  }

  // 認証済みの場合は子コンポーネントを表示
  return <>{children}</>
}