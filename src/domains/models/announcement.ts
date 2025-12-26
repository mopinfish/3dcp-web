/**
 * announcement.ts
 *
 * お知らせのドメインモデル定義
 */

/**
 * お知らせの種類
 */
export type AnnouncementType = 'info' | 'warning' | 'important'

/**
 * お知らせモデル
 */
export type Announcement = {
  id: number
  title: string
  content: string
  date: string
  type: AnnouncementType
  is_important?: boolean
}

export type Announcements = Announcement[]

/**
 * お知らせJSONファイルの形式
 */
export type AnnouncementsFile = {
  announcements: Announcements
}
