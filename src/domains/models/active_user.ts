/**
 * active_user.ts
 *
 * アクティブユーザーのドメインモデル定義
 */

/**
 * アクティブユーザーモデル
 */
export type ActiveUser = {
  id: number
  username: string
  name: string | null
  avatar: string | null
  avatar_url: string | null
  cultural_property_count: number
  movie_count: number
  total_count: number
}

export type ActiveUsers = ActiveUser[]

/**
 * アクティブユーザーAPIレスポンス
 */
export type ActiveUsersResponse = {
  users: ActiveUsers
  count: number
}
