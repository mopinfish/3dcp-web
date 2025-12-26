/**
 * movie.ts
 *
 * ムービー（Movie）のドメインモデル定義
 *
 * ✅ 変更内容:
 * - Movieにcreated_by, created_at, updated_atを追加
 * - Movieにthumbnail_urlを追加（サムネイル画像URL）
 * - MovieCreateRequest型を追加（作成用）
 * - MovieUpdateRequest型を追加（更新用）
 */

import { UserBrief } from './cultural_property'

/**
 * ムービーモデル
 */
export type Movie = {
  id: number
  url: string
  title: string | null
  note: string | null
  cultural_property?: number | null
  // 作成者・タイムスタンプフィールド
  created_by?: UserBrief | null
  created_at?: string | null
  updated_at?: string | null
  // ✅ 新規追加: サムネイル画像URL
  thumbnail_url?: string | null
}

export type Movies = Movie[]

/**
 * ムービー作成リクエスト
 */
export type MovieCreateRequest = {
  url: string
  title?: string
  note?: string
  cultural_property?: number
}

/**
 * ムービー更新リクエスト
 */
export type MovieUpdateRequest = Partial<MovieCreateRequest>

/**
 * ムービー一覧レスポンス（ページネーション付き）
 */
export type MoviesResponse = {
  count: number
  next: string | null
  previous: string | null
  results: Movies
}

/**
 * フォーム用のムービー入力データ
 * （IDがない状態での入力用）
 */
export type MovieFormData = {
  id?: number // 編集時のみ存在
  url: string
  title: string
  note: string
}
