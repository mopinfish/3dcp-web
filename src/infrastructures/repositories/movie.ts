/**
 * movie.ts
 *
 * ムービー（Movie）のAPIリポジトリ
 *
 * ✅ クリーンアーキテクチャ対応:
 * - 汎用的なクエリパラメータ対応
 * - 具体的なフィルタリング・件数指定はService層で実施
 */

import { Http } from '@/infrastructures/lib/http'
import {
  Movie,
  Movies,
  MoviesResponse,
  MovieCreateRequest,
  MovieUpdateRequest,
} from '@/domains/models/movie'

const HOST = process.env.NEXT_PUBLIC_BACKEND_API_HOST

/**
 * 汎用的なクエリパラメータ型
 */
export type QueryParams = {
  ordering?: string
  limit?: number
  offset?: number
  search?: string
  cultural_property?: number | string
  created_by?: string
  [key: string]: string | number | boolean | undefined
}

/**
 * 認証ヘッダーを生成
 */
function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') {
    return {}
  }
  const token = localStorage.getItem('auth_token')
  if (!token) {
    return {}
  }
  return {
    Authorization: `Token ${token}`,
  }
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
 * ムービー一覧を取得（汎用的なクエリパラメータ対応）
 */
export async function findAll(params?: QueryParams): Promise<Movies> {
  const queryString = buildQueryString(params)
  const url = `${HOST}/cp_api/movie/${queryString}`
  const res = await Http.get<MoviesResponse>(url)
  return res.results
}

/**
 * ムービー詳細を取得
 */
export async function find(id: number): Promise<Movie> {
  const url = `${HOST}/cp_api/movie/${id}/`
  return await Http.get<Movie>(url)
}

/**
 * 自分が作成したムービー一覧を取得
 */
export async function findMy(params?: QueryParams): Promise<MoviesResponse> {
  const queryString = buildQueryString(params)
  const url = `${HOST}/cp_api/movie/my/${queryString}`
  const headers = getAuthHeaders()

  console.log('movieRepo: findMy API call started')

  try {
    const result = await Http.get<MoviesResponse>(url, headers)
    console.log('movieRepo: findMy API call successful')
    return result
  } catch (error) {
    console.error('movieRepo: findMy API call failed:', error)
    throw error
  }
}

/**
 * ムービーを作成
 */
export async function create(data: MovieCreateRequest): Promise<Movie> {
  const url = `${HOST}/cp_api/movie/`
  const headers = getAuthHeaders()

  console.log('movieRepo: create API call started')
  console.log('movieRepo: Request data:', data)

  try {
    const result = await Http.post<Movie>(url, data, headers)
    console.log('movieRepo: create API call successful')
    console.log('movieRepo: Created ID:', result.id)
    return result
  } catch (error) {
    console.error('movieRepo: create API call failed:', error)
    throw error
  }
}

/**
 * ムービーを更新
 */
export async function update(
  id: number,
  data: MovieUpdateRequest,
): Promise<Movie> {
  const url = `${HOST}/cp_api/movie/${id}/`
  const headers = getAuthHeaders()

  console.log('movieRepo: update API call started')
  console.log('movieRepo: ID:', id)
  console.log('movieRepo: Request data:', data)

  try {
    const result = await Http.patch<Movie>(url, data, headers)
    console.log('movieRepo: update API call successful')
    return result
  } catch (error) {
    console.error('movieRepo: update API call failed:', error)
    throw error
  }
}

/**
 * ムービーを削除
 */
export async function remove(id: number): Promise<void> {
  const url = `${HOST}/cp_api/movie/${id}/`
  const headers = getAuthHeaders()

  console.log('movieRepo: remove API call started')
  console.log('movieRepo: ID:', id)

  try {
    await Http.delete<void>(url, headers)
    console.log('movieRepo: remove API call successful')
  } catch (error) {
    console.error('movieRepo: remove API call failed:', error)
    throw error
  }
}

/**
 * サムネイルを再生成
 */
export async function regenerateThumbnail(id: number): Promise<Movie> {
  const url = `${HOST}/cp_api/movie/${id}/regenerate_thumbnail/`
  const headers = getAuthHeaders()

  console.log('movieRepo: regenerateThumbnail API call started')
  console.log('movieRepo: ID:', id)

  try {
    const result = await Http.post<{ message: string; movie: Movie }>(url, {}, headers)
    console.log('movieRepo: regenerateThumbnail API call successful')
    return result.movie
  } catch (error) {
    console.error('movieRepo: regenerateThumbnail API call failed:', error)
    throw error
  }
}

// 後方互換性のためのエクスポート
export type getProps = Record<string, string>

export async function get(props: getProps): Promise<Movies> {
  return findAll(props as QueryParams)
}

export async function getMy(): Promise<MoviesResponse> {
  return findMy()
}

// デフォルトエクスポート（後方互換性のため）
export const MovieRepository = {
  // 新しいAPI（クリーンアーキテクチャ対応）
  findAll,
  find,
  findMy,
  create,
  update,
  remove,
  regenerateThumbnail,
  // 後方互換性のためのAPI
  get,
  getMy,
}
