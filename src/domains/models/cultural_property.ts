/**
 * cultural_property.ts
 *
 * 文化財（CulturalProperty）のドメインモデル定義
 *
 * ✅ 変更内容:
 * - UserBrief型を追加（作成者情報の簡易表示用）
 * - CulturalPropertyにcreated_by, created_at, updated_atを追加
 * - CulturalPropertyCreateRequest型を追加（作成用）
 * - CulturalPropertyUpdateRequest型を追加（更新用）
 */

import { Movies } from './movie'
import { Images } from './image'
import { Tags } from './tag'

/**
 * ユーザー簡易情報（作成者表示用）
 */
export type UserBrief = {
  id: number
  username: string
  name: string
}

/**
 * 文化財モデル
 */
export type CulturalProperty = {
  id: number
  name: string
  name_kana: string | null
  name_gener: string | null
  name_en: string | null
  category: string | null
  type: string
  place_name: string | null
  address: string
  latitude: number
  longitude: number
  url: string | null
  note: string | null
  geom: string
  tags: Tags
  movies: Movies
  images: Images
  // ✅ 新規追加フィールド
  created_by: UserBrief | null
  created_at: string | null
  updated_at: string | null
}

export type CulturalProperties = CulturalProperty[]

/**
 * 文化財作成リクエスト
 */
export type CulturalPropertyCreateRequest = {
  name: string
  name_kana?: string
  name_gener?: string
  name_en?: string
  category?: string
  type: string
  place_name?: string
  address: string
  latitude: number
  longitude: number
  url?: string
  note?: string
  tags?: number[] // タグID配列
}

/**
 * 文化財更新リクエスト
 */
export type CulturalPropertyUpdateRequest = Partial<CulturalPropertyCreateRequest>

/**
 * 文化財一覧レスポンス（ページネーション付き）
 */
export type CulturalPropertiesResponse = {
  count: number
  next: string | null
  previous: string | null
  results: CulturalProperties
}

/**
 * 文化財の種別オプション
 */
export const CULTURAL_PROPERTY_TYPES = [
  '有形文化財',
  '無形文化財',
  '民俗文化財',
  '記念物',
  '文化的景観',
  '伝統的建造物群',
  'その他',
] as const

export type CulturalPropertyType = (typeof CULTURAL_PROPERTY_TYPES)[number]

/**
 * 文化財のカテゴリオプション
 */
export const CULTURAL_PROPERTY_CATEGORIES = [
  '国指定',
  '都指定',
  '区指定',
  '市指定',
  '県指定',
  '登録文化財',
  'その他',
] as const

export type CulturalPropertyCategory = (typeof CULTURAL_PROPERTY_CATEGORIES)[number]
