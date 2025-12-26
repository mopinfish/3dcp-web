/**
 * about.tsx
 *
 * 3DCP - 3D Cultural Propertiesの概要・紹介ページ
 * サービスのミッション、特徴、チームについて説明
 */

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { LayoutWithFooter } from '@/components/layouts/Layout'

/**
 * 画像プレースホルダーコンポーネント
 * 実際の画像に差し替える際は、このコンポーネントをImageコンポーネントに置き換えてください
 *
 * 差し替え方法:
 * 1. public/img/ に画像ファイルを配置
 * 2. ImagePlaceholder コンポーネントを以下のように置き換え:
 *    <Image src="/img/your-image.png" alt="説明" width={幅} height={高さ} className="..." />
 */
function ImagePlaceholder({
  text,
  aspectRatio = 'aspect-video',
  className = '',
}: {
  text: string
  aspectRatio?: string
  className?: string
}) {
  return (
    <div
      className={`${aspectRatio} bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center ${className}`}
    >
      <div className="text-center p-4">
        <svg
          className="w-16 h-16 mx-auto text-blue-400 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-gray-500 text-sm">{text}</p>
      </div>
    </div>
  )
}

/**
 * 特徴カード
 */
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

const About: React.FC = () => {
  return (
    <LayoutWithFooter>
      {/* ヒーローセクション */}
      <section className="bg-gray-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            3DCP - 3D Cultural Properties
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
            地域の文化財を3Dで記録し、未来へ伝える
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            誰もが簡単に文化財を登録・共有できるプラットフォームで、
            地域の宝物をデジタルで保存し、世界中の人々と共有しましょう。
          </p>
        </div>
      </section>

      {/* ミッションセクション */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                私たちの使命
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                文化財は私たちの歴史や文化を反映する重要な資源です。
                しかし、多くの貴重な文化財が経年劣化や自然災害によって失われるリスクにさらされています。
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                3DCPは、最新の3D技術を活用して文化財をデジタルで保存し、
                その魅力を多くの人々に届けることを目指しています。
              </p>
              <p className="text-gray-600 leading-relaxed">
                地域の方々が気軽に文化財を登録し、世界中の人々がその価値を発見できる
                —そんなプラットフォームを作ることが私たちの使命です。
              </p>
            </div>
            {/* 
              画像の差し替え方法:
              1. public/img/mission.png を用意
              2. ImagePlaceholder を以下に置き換え:
              <Image 
                src="/img/mission.png" 
                alt="文化財のデジタル保存" 
                width={600} 
                height={400} 
                className="rounded-xl shadow-lg"
              />
            */}
            <ImagePlaceholder
              text="ミッションのイメージ画像"
              className="shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              3DCPの特徴
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              最新技術とオープンデータを活用し、
              誰もが参加できる文化財共有プラットフォームを提供します。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              }
              title="インタラクティブな地図"
              description="2D/3Dマップで文化財の位置を直感的に確認。周辺情報も合わせて探索できます。"
            />
            <FeatureCard
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
                  />
                </svg>
              }
              title="3Dモデル対応"
              description="Luma AI技術を活用し、文化財を360度から閲覧可能な3Dモデルとして記録できます。"
            />
            <FeatureCard
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              }
              title="ユーザー参加型"
              description="誰でもアカウントを作成し、地域の文化財情報を登録・共有することができます。"
            />
            <FeatureCard
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                  />
                </svg>
              }
              title="オープンデータ連携"
              description="自治体が公開する文化財オープンデータを自動的に取り込み、最新情報を提供します。"
            />
            <FeatureCard
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              }
              title="タグによる整理"
              description="自由にタグを追加して文化財を分類・検索。お気に入りのテーマで探索できます。"
            />
            <FeatureCard
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              }
              title="モバイル対応"
              description="スマートフォンやタブレットでも快適に利用可能。現地での文化財探索に最適です。"
            />
          </div>
        </div>
      </section>

      {/* 使い方セクション */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              3つのステップで始める
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              簡単な手順で、今すぐ文化財の探索や登録を始められます。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                アカウント作成
              </h3>
              <p className="text-gray-600">
                メールアドレスで簡単登録。無料でご利用いただけます。
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                文化財を探索
              </h3>
              <p className="text-gray-600">
                地図やリストから気になる文化財を見つけて、詳細を確認。
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                あなたも登録
              </h3>
              <p className="text-gray-600">
                地域の文化財を撮影し、3Dモデルと共に登録・共有。
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/howto"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              詳しい使い方を見る
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* オープンソース・コミュニティセクション */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* 
              画像の差し替え方法:
              1. public/img/community.png を用意
              2. ImagePlaceholder を以下に置き換え:
              <Image 
                src="/img/community.png" 
                alt="コミュニティ" 
                width={600} 
                height={400} 
                className="rounded-xl shadow-lg"
              />
            */}
            <ImagePlaceholder
              text="コミュニティのイメージ画像"
              className="shadow-lg order-2 md:order-1"
            />
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                オープンソース & コミュニティ
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                3DCPはシビックテック（Civic
                Tech）の精神に基づき開発されています。
                技術を通じて地域課題を解決し、より良い社会を作ることを目指しています。
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                このプロジェクトへの参加を歓迎します。
                文化財情報の提供、機能改善の提案、開発への参加など、
                様々な形でご協力いただけます。
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 未来への展望セクション */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">未来への展望</h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            私たちは、このウェブサイトを通じて地域の文化財への関心を高め、
            多くの人々がその魅力を体験できる場を提供していきます。
          </p>
          <p className="text-lg text-blue-200 mb-8">
            今後も技術革新を続けながら、より多くの文化財情報を収集・発信し、
            地域コミュニティとの連携を深めていく所存です。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/cultural-properties"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
            >
              文化財を探索する
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
            >
              アカウントを作成
            </Link>
          </div>
        </div>
      </section>

      {/* お問い合わせセクション */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            お問い合わせ
          </h2>
          <p className="text-gray-600 mb-8">
            ご質問やご要望がございましたら、お気軽にお問い合わせください。
          </p>
          <a
            href="mailto:mopinfish@gmail.com"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-lg"
          >
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            mopinfish@gmail.com
          </a>
        </div>
      </section>
    </LayoutWithFooter>
  )
}

export default About
