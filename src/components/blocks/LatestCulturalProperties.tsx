/**
 * LatestCulturalProperties.tsx
 *
 * 最新の文化財一覧コンポーネント
 * APIから最新の文化財を取得して表示
 * 
 * ✅ 変更内容:
 * - リンク先を詳細ページ（/cultural-properties/[id]）に変更
 * 
 * ✅ Phase 3-3対応:
 * - React.memoで再レンダリングを最適化
 * - 画像コンポーネントの最適化
 */

import React, { useEffect, useState, memo } from 'react'
import Link from 'next/link'
import { cultural_property as culturalPropertyService } from '@/domains/services'
import { CulturalProperties } from '@/domains/models/cultural_property'
import { ListItemSkeleton } from '@/components/common/Skeleton'

type Props = {
  /** 表示件数（デフォルト: 5） */
  limit?: number
  /** タイトル（デフォルト: 最新の文化財） */
  title?: string
  /** タイトルアイコン */
  icon?: React.ReactNode
  /** もっと見るリンク先 */
  moreLink?: string
  /** もっと見るリンクテキスト */
  moreLinkText?: string
}

/**
 * 文化財リストアイテム（メモ化）
 */
const CulturalPropertyItem = memo<{
  property: CulturalProperties[number]
}>(({ property }) => {
  const linkHref = `/cultural-properties/${property.id}`
  const hasThumbnail = property.movies && property.movies.length > 0 && property.movies[0].thumbnail_url

  return (
    <Link
      href={linkHref}
      className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer"
    >
      {/* サムネイル */}
      <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 mr-3 flex-shrink-0">
        {hasThumbnail ? (
          <img
            src={property.movies![0].thumbnail_url!}
            alt={property.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-gray-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        )}
      </div>
      
      {/* 文化財情報 */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate group-hover:text-blue-600">
          {property.name}
        </p>
        <p className="text-xs text-gray-500 truncate">
          {property.address || '住所未設定'}
        </p>
      </div>
      
      {/* ムービー有無バッジ */}
      {property.movies && property.movies.length > 0 ? (
        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full flex-shrink-0">
          3D
        </span>
      ) : (
        <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full flex-shrink-0">
          登録中
        </span>
      )}
    </Link>
  )
})

CulturalPropertyItem.displayName = 'CulturalPropertyItem'

const LatestCulturalProperties: React.FC<Props> = memo(({
  limit = 5,
  title = '最新の文化財',
  icon = '🏛️',
  moreLink = '/cultural-properties',
  moreLinkText = 'もっと見る',
}) => {
  const [properties, setProperties] = useState<CulturalProperties>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await culturalPropertyService.getLatestProperties(limit)
        setProperties(data)
      } catch (err) {
        console.error('文化財の取得エラー:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [limit])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">{icon}</span>
          {title}
        </h2>
        <div className="space-y-3">
          {[...Array(limit)].map((_, i) => (
            <ListItemSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">{icon}</span>
          {title}
        </h2>
        <p className="text-gray-500 text-sm">文化財はまだ登録されていません</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="mr-2">{icon}</span>
          {title}
        </h2>
        {moreLink && (
          <Link
            href={moreLink}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
          >
            {moreLinkText} →
          </Link>
        )}
      </div>
      
      <div className="space-y-3">
        {properties.map((property) => (
          <CulturalPropertyItem key={property.id} property={property} />
        ))}
      </div>
    </div>
  )
})

LatestCulturalProperties.displayName = 'LatestCulturalProperties'

export default LatestCulturalProperties
