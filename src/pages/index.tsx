/**
 * index.tsx
 *
 * ホーム画面（ダッシュボード）
 *
 * ✅ UI改善対応:
 * - ダッシュボード形式のレイアウト
 * - 最新の文化財（5件）
 * - 最新のムービー（5件）
 * - アクティブユーザー（5件）
 * - お知らせ（JSONファイルから読み込み）
 */

import React from 'react'
import Link from 'next/link'
import { LayoutWithFooter } from '@/components/layouts/Layout'
import NavigationTab from '@/components/blocks/NavigationTab'
import LatestCulturalProperties from '@/components/blocks/LatestCulturalProperties'
import LatestMovies from '@/components/blocks/LatestMovies'
import ActiveUserRanking from '@/components/blocks/ActiveUserRanking'
import AnnouncementList from '@/components/blocks/AnnouncementList'

const Home = () => {
  return (
    <LayoutWithFooter>
      <NavigationTab />
      
      {/* メインコンテンツ */}
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* ヒーローセクション */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8 shadow-sm">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              3D文化財共有サイト
            </h1>
          </div>
          <p className="text-gray-600 mb-6 max-w-2xl">
            文化財の3Dモデルを登録・共有できるプラットフォームです。
            地域の貴重な文化財をデジタルで保存し、世界中の人々と共有しましょう。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/3d_map"
              className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              3Dマップを見る
            </Link>
            <Link
              href="/luma-list"
              className="inline-flex items-center px-5 py-2.5 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors border border-gray-300 cursor-pointer"
            >
              <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              3Dモデル一覧
            </Link>
            <Link
              href="/cultural-properties/new"
              className="inline-flex items-center px-5 py-2.5 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors border border-gray-300 cursor-pointer"
            >
              <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              文化財を登録
            </Link>
          </div>
        </div>

        {/* ダッシュボードグリッド */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 最新の文化財 */}
          <LatestCulturalProperties 
            limit={5} 
            moreLink="/3d_map"
            moreLinkText="マップで見る"
          />
          
          {/* 最新のムービー */}
          <LatestMovies 
            limit={5}
            moreLink="/luma-list"
            moreLinkText="すべて見る"
          />
        </div>

        {/* アクティブユーザーセクション */}
        <div className="mb-8">
          <ActiveUserRanking limit={5} />
        </div>

        {/* お知らせセクション */}
        <div className="mb-8">
          <AnnouncementList />
        </div>

        {/* クイックリンク */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            クイックリンク
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/map"
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <svg className="w-8 h-8 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm text-gray-700 font-medium">2Dマップ</span>
            </Link>
            <Link
              href="/3d_map"
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <svg className="w-8 h-8 text-purple-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
              <span className="text-sm text-gray-700 font-medium">3Dマップ</span>
            </Link>
            <Link
              href="/import"
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <svg className="w-8 h-8 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span className="text-sm text-gray-700 font-medium">CSVインポート</span>
            </Link>
            <Link
              href="/about"
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <svg className="w-8 h-8 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-gray-700 font-medium">このサイトについて</span>
            </Link>
          </div>
        </div>
      </div>
    </LayoutWithFooter>
  )
}

export default Home
