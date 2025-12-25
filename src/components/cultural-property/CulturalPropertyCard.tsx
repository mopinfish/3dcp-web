/**
 * CulturalPropertyCard.tsx
 *
 * 文化財のカードコンポーネント
 * マイページで自分が登録した文化財を表示するために使用
 */

import React from 'react'
import Link from 'next/link'
import { CulturalProperty } from '@/domains/models/cultural_property'

type CulturalPropertyCardProps = {
  property: CulturalProperty
  onDelete?: (id: number) => void
  showActions?: boolean
}

export function CulturalPropertyCard({
  property,
  onDelete,
  showActions = true,
}: CulturalPropertyCardProps) {
  const handleDelete = () => {
    if (
      onDelete &&
      window.confirm(`「${property.name}」を削除してもよろしいですか？`)
    ) {
      onDelete(property.id)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* サムネイル */}
      <div className="aspect-video bg-gray-100 relative">
        {property.movies && property.movies.length > 0 ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
            <svg
              className="w-12 h-12 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <span className="absolute bottom-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              3D映像 {property.movies.length}件
            </span>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <svg
              className="w-12 h-12 text-gray-300"
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
          </div>
        )}
      </div>

      {/* コンテンツ */}
      <div className="p-4">
        {/* 種別バッジ */}
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {property.type || '種別未設定'}
          </span>
          {property.category && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              {property.category}
            </span>
          )}
        </div>

        {/* 名称 */}
        <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2">
          {property.name}
        </h3>

        {/* 住所 */}
        <p className="text-sm text-gray-500 mb-3 flex items-start">
          <svg
            className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="line-clamp-1">{property.address || '住所未設定'}</span>
        </p>

        {/* アクションボタン */}
        {showActions && (
          <div className="flex gap-2 pt-3 border-t border-gray-100">
            <Link
              href={`/cultural-properties/${property.id}/edit`}
              className="
                flex-1 flex items-center justify-center
                px-3 py-2
                text-sm font-medium
                text-blue-700
                bg-blue-50
                rounded-lg
                hover:bg-blue-100
                transition-colors duration-200
              "
            >
              <svg
                className="w-4 h-4 mr-1.5"
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
              編集
            </Link>
            <button
              onClick={handleDelete}
              className="
                px-3 py-2
                text-sm font-medium
                text-red-700
                bg-red-50
                rounded-lg
                hover:bg-red-100
                transition-colors duration-200
              "
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * 文化財カードリストコンポーネント
 */
type CulturalPropertyCardListProps = {
  properties: CulturalProperty[]
  onDelete?: (id: number) => void
  isLoading?: boolean
  emptyMessage?: string
}

export function CulturalPropertyCardList({
  properties,
  onDelete,
  isLoading = false,
  emptyMessage = '登録された文化財はありません',
}: CulturalPropertyCardListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
          >
            <div className="aspect-video bg-gray-200" />
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded w-20 mb-3" />
              <div className="h-5 bg-gray-200 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
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
        <p className="mt-4 text-base text-gray-500">{emptyMessage}</p>
        <Link
          href="/cultural-properties/new"
          className="
            mt-4 inline-flex items-center
            px-4 py-2
            text-sm font-medium
            text-blue-700
            hover:text-blue-800
          "
        >
          <svg
            className="w-4 h-4 mr-1.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          文化財を登録する
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {properties.map((property) => (
        <CulturalPropertyCard
          key={property.id}
          property={property}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

export default CulturalPropertyCard
