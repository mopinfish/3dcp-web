/**
 * AnnouncementList.tsx
 *
 * お知らせ一覧コンポーネント
 * JSONファイルからお知らせを読み込んで表示
 */

import React, { useEffect, useState } from 'react'
import { Announcements, AnnouncementsFile, AnnouncementType } from '@/domains/models/announcement'

type Props = {
  /** お知らせJSONファイルのパス（デフォルト: /data/announcements.json） */
  jsonPath?: string
  /** 最大表示件数 */
  limit?: number
  /** タイトル（デフォルト: お知らせ） */
  title?: string
  /** タイトルアイコン */
  icon?: React.ReactNode
}

const typeStyles: Record<AnnouncementType, string> = {
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  important: 'bg-red-50 border-red-200 text-red-800',
}

const typeIcons: Record<AnnouncementType, string> = {
  info: 'ℹ️',
  warning: '⚠️',
  important: '🔴',
}

const AnnouncementList: React.FC<Props> = ({
  jsonPath = '/data/announcements.json',
  limit,
  title = 'お知らせ',
  icon = '📢',
}) => {
  const [announcements, setAnnouncements] = useState<Announcements>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(jsonPath)
        if (!res.ok) {
          throw new Error('お知らせの読み込みに失敗しました')
        }
        const data: AnnouncementsFile = await res.json()
        const items = limit ? data.announcements.slice(0, limit) : data.announcements
        setAnnouncements(items)
      } catch (err) {
        console.error('お知らせの取得エラー:', err)
        setError('お知らせを読み込めませんでした')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [jsonPath, limit])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">{icon}</span>
          {title}
        </h2>
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">{icon}</span>
          {title}
        </h2>
        <p className="text-gray-500 text-sm">{error}</p>
      </div>
    )
  }

  if (announcements.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">{icon}</span>
          {title}
        </h2>
        <p className="text-gray-500 text-sm">現在お知らせはありません</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">{icon}</span>
        {title}
      </h2>
      
      <div className="space-y-3">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className={`p-4 rounded-lg border ${typeStyles[announcement.type]}`}
          >
            <div className="flex items-start">
              <span className="mr-2 text-lg">{typeIcons[announcement.type]}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium">{announcement.title}</h3>
                  <span className="text-xs opacity-70">{announcement.date}</span>
                </div>
                <p className="text-sm opacity-80">{announcement.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AnnouncementList
