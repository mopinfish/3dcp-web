/**
 * Header.tsx
 * グローバルヘッダーコンポーネント (最終版)
 *
 * 機能:
 * - ロゴ表示
 * - ナビゲーションメニュー
 * - 認証状態に応じた表示切り替え
 *   - 未ログイン: ログイン・新規登録ボタン
 *   - ログイン済み: ユーザーメニュー
 * - レスポンシブ対応 (ハンバーガーメニュー)
 * - 適切なログアウト処理
 *
 * パス: src/components/blocks/Header.tsx
 */

'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/AuthContext'
import UserMenu from './UserMenu'

const Header: React.FC = () => {
  const { user, isLoading, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  // モバイルメニューの開閉
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // モバイル版ログアウト処理
  const handleMobileLogout = async () => {
    try {
      await logout()
      setIsMobileMenuOpen(false)
      router.push('/')
    } catch (error) {
      console.error('ログアウトエラー:', error)
      // エラーが発生してもローカルの認証情報はクリアされているため、
      // トップページへ遷移
      setIsMobileMenuOpen(false)
      router.push('/')
    }
  }

  // メニュー項目
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/map', label: 'Map' },
    { href: '/3d_map', label: '3D Map' },
  ]

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* ロゴ */}
          <Link href="/" className="relative w-20 h-20 flex-shrink-0">
            <Image
              src="/img/logo.png"
              alt="OPEN3D Map Logo"
              fill
              sizes="(max-width: 768px) 80px, 80px"
              style={{ objectFit: 'contain' }}
              priority
            />
          </Link>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-800 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* 認証セクション (デスクトップ) */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              // ローディング中: スケルトン表示
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : user ? (
              // ログイン済み: ユーザーメニュー表示
              <UserMenu />
            ) : (
              // 未ログイン: ログイン・新規登録ボタン表示
              <>
                <Link
                  href="/signin"
                  className="px-4 py-2 text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors duration-200"
                >
                  ログイン
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors duration-200 shadow-sm"
                >
                  新規登録
                </Link>
              </>
            )}
          </div>

          {/* モバイルメニューボタン */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            onClick={toggleMobileMenu}
            aria-label="メニュー"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              // 閉じるアイコン
              <svg
                className="w-6 h-6 text-gray-800"
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
            ) : (
              // ハンバーガーアイコン
              <svg
                className="w-6 h-6 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* モバイルメニュー */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 animate-slideDown">
            {/* ナビゲーション項目 */}
            <nav className="flex flex-col space-y-2 mb-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-3 text-gray-800 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* 認証セクション (モバイル) */}
            <div className="border-t border-gray-200 pt-4">
              {isLoading ? (
                // ローディング中: スケルトン表示
                <div className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ) : user ? (
                // ログイン済み: ユーザー情報とメニュー
                <div className="space-y-2">
                  {/* ユーザー情報 */}
                  <div className="px-4 py-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                        {(user.name || user.username).charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.name || user.username}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* メニュー項目 */}
                  <Link
                    href="/mypage"
                    className="flex items-center px-4 py-3 text-gray-800 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg
                      className="w-5 h-5 mr-3 text-gray-500"
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
                    マイページ
                  </Link>

                  <Link
                    href="/mypage/edit"
                    className="flex items-center px-4 py-3 text-gray-800 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg
                      className="w-5 h-5 mr-3 text-gray-500"
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
                    プロフィール編集
                  </Link>

                  {/* 区切り線 */}
                  <div className="border-t border-gray-200 my-2"></div>

                  {/* ログアウト */}
                  <button
                    onClick={handleMobileLogout}
                    className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    ログアウト
                  </button>
                </div>
              ) : (
                // 未ログイン: ログイン・新規登録ボタン
                <div className="space-y-2 px-4">
                  <Link
                    href="/signin"
                    className="block w-full px-4 py-3 text-center text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ログイン
                  </Link>
                  <Link
                    href="/signup"
                    className="block w-full px-4 py-3 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors duration-200 shadow-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    新規登録
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* アニメーションスタイル */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            max-height: 600px;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
          overflow: hidden;
        }
      `}</style>
    </header>
  )
}

export default Header
