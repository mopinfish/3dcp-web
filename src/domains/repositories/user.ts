/**
 * user.ts
 *
 * ユーザー関連のリポジトリインターフェース
 */

import { ActiveUsersResponse } from '../models/active_user'

/**
 * 汎用的なクエリパラメータ型
 */
export type QueryParams = {
  limit?: number
  [key: string]: string | number | boolean | undefined
}

export interface UserRepository {
  findActiveUsers: (params?: QueryParams) => Promise<ActiveUsersResponse>
}
