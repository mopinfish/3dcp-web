/**
 * UserMenu.tsx
 * ログイン済みユーザー用のドロップダウンメニューコンポーネント
 *
 * 機能:
 * - ユーザー名とアイコンの表示
 * - ドロップダウンメニュー (マイページ、プロフィール編集、ログアウト)
 * - メニュー外クリックで自動的に閉じる
 * - ESCキーでメニューを閉じる
 * - アクセシビリティ対応
 */

'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/AuthContext'

interface UserMenuProps {
  className?: string
}

const UserMenu: React.FC<UserMenuProps> = ({ className = '' }) => {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // メニューの開閉をトグル
  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  // メニューを閉じる
  const closeMenu = () => {
    setIsOpen(false)
  }

  // ログアウト処理
  const handleLogout = async () => {
    try {
      await logout()
      closeMenu()
      router.push('/')
    } catch (error) {
      console.error('ログアウトエラー:', error)
      // エラーが発生してもローカルの認証情報はクリアされているため、
      // トップページへ遷移
      router.push('/')
    }
  }

  // メニュー外クリックの検知
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu()
      }
    }

    // メニューが開いている時のみイベントリスナーを追加
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // ESCキーでメニューを閉じる
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey)
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [isOpen])

  // ユーザーが存在しない場合は何も表示しない
  if (!user) {
    return null
  }

  // 表示するユーザー名 (name が存在すればそれを、なければ username を使用)
  const displayName = user.name || user.username

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      {/* ユーザーメニューボタン */}
      <button
        onClick={toggleMenu}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="ユーザーメニュー"
      >
        {/* ユーザーアイコン */}
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
          {displayName.charAt(0).toUpperCase()}
        </div>

        {/* ユーザー名 (デスクトップのみ表示) */}
        <span className="hidden md:block text-gray-800 font-medium">{displayName}</span>

        {/* ドロップダウンアイコン */}
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* ドロップダウンメニュー */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fadeIn"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu"
        >
          {/* ユーザー情報セクション (モバイルのみ) */}
          <div className="md:hidden px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900">{displayName}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>

          {/* マイページ */}
          <Link
            href="/mypage"
            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
            role="menuitem"
            onClick={closeMenu}
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

          {/* プロフィール編集 */}
          <Link
            href="/mypage/edit"
            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
            role="menuitem"
            onClick={closeMenu}
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
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
            role="menuitem"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      )}

      {/* アニメーションスタイル */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}

export default UserMenu
