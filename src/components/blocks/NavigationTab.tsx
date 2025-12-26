/**
 * NavigationTab.tsx
 *
 * ナビゲーションタブコンポーネント
 *
 * ✅ UI改善対応:
 * - ホーム画面がダッシュボードに変更されたため、タブ構成を更新
 * - アクティブ状態の判定ロジックを改善
 * 
 * ✅ Phase 2対応:
 * - 3Dマップへのリンクを削除（2Dマップを主体に）
 * - 3Dモデル登録へのリンクを追加
 */

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'

type TabItem = {
  href: string
  label: string
  icon?: React.ReactNode
}

const NavigationTab: React.FC = () => {
  const router = useRouter()

  const tabs: TabItem[] = [
    {
      href: '/',
      label: 'ホーム',
      icon: (
        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      href: '/map',
      label: 'マップ',
      icon: (
        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      href: '/luma-list',
      label: '3Dモデル一覧',
      icon: (
        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      href: '/movies/new',
      label: '3Dモデル登録',
      icon: (
        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
  ]

  /**
   * アクティブ状態を判定
   * - 完全一致でチェック
   * - ホーム（/）は完全一致のみ
   */
  const isActive = (href: string): boolean => {
    if (href === '/') {
      return router.pathname === '/'
    }
    return router.pathname === href || router.pathname.startsWith(href + '/')
  }

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-center md:justify-start flex-wrap py-2 -mb-px">
          {tabs.map(({ href, label, icon }) => {
            const active = isActive(href)
            return (
              <Link key={href} href={href}>
                <button
                  className={clsx(
                    'inline-flex items-center px-4 py-2.5 mx-1 text-sm font-medium rounded-t-lg transition-colors duration-200 cursor-pointer',
                    active
                      ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  {icon}
                  {label}
                </button>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default NavigationTab
