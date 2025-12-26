/**
 * Popup.tsx
 *
 * マップ上のポップアップコンポーネント
 * 
 * ✅ 変更内容:
 * - CulturalPropertyThreeCanvasPopupに文化財詳細ページへのリンクを追加
 * - 文化財名と住所を表示するように改善
 */

import React, { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ThreeCanvas } from './ThreeCanvas'

const Loading: React.FC = () => {
  return <div>Loading...</div>
}

type CulturalPropertyPopupProps = { 
  name: string
  imageUrl: string
  url: string
  address: string 
}

export const CulturalPropertyPopup: React.FC<CulturalPropertyPopupProps> = ({
  name,
  imageUrl,
  url,
  address,
}) => {
  return (
    <div className="w-full flex flex-col">
      <Image
        src={imageUrl}
        alt={name}
        className="w-full h-[100px] object-contain rounded"
        width={600}
        height={400}
      />
      <h3 className="mt-2 mb-1 text-lg font-semibold">{name}</h3>
      <p className="mb-2 text-sm text-gray-600">{address}</p>
      <div className="mt-2 flex justify-center w-full">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-800 transition"
        >
          3Dモデルを見る
        </a>
      </div>
    </div>
  )
}

type CulturalPropertyThreeCanvasPopupProps = { 
  id: number
  url: string
  culturalPropertyId?: number
  culturalPropertyName?: string
  address?: string
}

export const CulturalPropertyThreeCanvasPopup: React.FC<CulturalPropertyThreeCanvasPopupProps> = ({
  id,
  url,
  culturalPropertyId,
  culturalPropertyName,
  address,
}) => {
  const popupRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={popupRef} className="w-full flex flex-col min-w-[280px]">
      {/* 文化財情報ヘッダー */}
      {culturalPropertyName && (
        <div className="mb-3 pb-2 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
            {culturalPropertyName}
          </h3>
          {address && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-1">{address}</p>
          )}
        </div>
      )}

      {/* 3Dキャンバス */}
      <div className="flex justify-center w-full">
        {!id ? <Loading /> : <ThreeCanvas id={id} />}
      </div>

      {/* ボタンエリア */}
      <div className="mt-3 flex flex-col gap-2">
        {/* 3Dモデルを大きな画面で見るボタン */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
          <svg
            className="w-4 h-4 mr-2"
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
          大きな画面で見る
        </a>

        {/* 文化財詳細ページへのリンク */}
        {culturalPropertyId && (
          <a
            href={`/cultural-properties/${culturalPropertyId}`}
            className="inline-flex items-center justify-center px-4 py-2 bg-white text-gray-700 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition cursor-pointer"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            詳細情報を見る
          </a>
        )}
      </div>
    </div>
  )
}

/**
 * ムービーがない文化財用のポップアップ
 */
type CulturalPropertyInfoPopupProps = {
  culturalPropertyId: number
  name: string
  address?: string
  type?: string
}

export const CulturalPropertyInfoPopup: React.FC<CulturalPropertyInfoPopupProps> = ({
  culturalPropertyId,
  name,
  address,
  type,
}) => {
  return (
    <div className="w-full flex flex-col min-w-[250px] p-1">
      {/* 文化財情報 */}
      <div className="mb-3">
        <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
          {name}
        </h3>
        {address && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{address}</p>
        )}
        {type && (
          <span className="inline-block mt-2 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">
            {type}
          </span>
        )}
      </div>

      {/* プレースホルダー画像 */}
      <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-3">
        <div className="text-center text-gray-400">
          <svg
            className="w-10 h-10 mx-auto mb-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <p className="text-xs">3Dモデル未登録</p>
        </div>
      </div>

      {/* 詳細ページへのリンク */}
      <a
        href={`/cultural-properties/${culturalPropertyId}`}
        className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition cursor-pointer"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        詳細情報を見る
      </a>
    </div>
  )
}
