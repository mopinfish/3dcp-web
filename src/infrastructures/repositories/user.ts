/**
 * user.ts
 *
 * ユーザー関連のAPIリポジトリ
 *
 * ✅ 新規追加:
 * - アクティブユーザー一覧取得API
 */

import { Http } from '@/infrastructures/lib/http'
import { ActiveUsersResponse } from '@/domains/models/active_user'

const HOST = process.env.NEXT_PUBLIC_BACKEND_API_HOST

/**
 * 汎用的なクエリパラメータ型
 */
export type QueryParams = {
  limit?: number
  [key: string]: string | number | boolean | undefined
}

/**
 * クエリパラメータをURLSearchParamsに変換
 */
function buildQueryString(params?: QueryParams): string {
  if (!params) return ''
  
  const filteredParams = Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => [k, String(v)])
  
  if (filteredParams.length === 0) return ''
  
  return '?' + new URLSearchParams(filteredParams).toString()
}

/**
 * アクティブユーザー一覧を取得
 */
export async function findActiveUsers(params?: QueryParams): Promise<ActiveUsersResponse> {
  const queryString = buildQueryString(params)
  const url = `${HOST}/api/v1/auth/active-users/${queryString}`
  return await Http.get<ActiveUsersResponse>(url)
}

// デフォルトエクスポート
export const UserRepository = {
  findActiveUsers,
}
