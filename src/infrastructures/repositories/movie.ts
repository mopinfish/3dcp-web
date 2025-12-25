/**
 * movie.ts
 *
 * ムービー（Movie）のAPIリポジトリ
 *
 * ✅ 変更内容:
 * - create: ムービー作成API
 * - update: ムービー更新API
 * - remove: ムービー削除API
 * - getMy: 自分のムービー一覧取得API
 */

import { Http } from '@/infrastructures/lib/http'
import {
  Movie,
  Movies,
  MoviesResponse,
  MovieCreateRequest,
  MovieUpdateRequest,
} from '@/domains/models/movie'
import { getProps } from '@/domains/repositories/movie'

const HOST = process.env.NEXT_PUBLIC_BACKEND_API_HOST

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
 * ムービー一覧を取得
 */
export async function get(props: getProps): Promise<Movies> {
  const queries = new URLSearchParams(props).toString()
  const url = `${HOST}/cp_api/movie/?${queries}`
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
export async function getMy(): Promise<MoviesResponse> {
  const url = `${HOST}/cp_api/movie/my/`
  const headers = getAuthHeaders()

  console.log('movieRepo: getMy API call started')

  try {
    const result = await Http.get<MoviesResponse>(url, headers)
    console.log('movieRepo: getMy API call successful')
    return result
  } catch (error) {
    console.error('movieRepo: getMy API call failed:', error)
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

// デフォルトエクスポート（後方互換性のため）
export const MovieRepository = {
  get,
  find,
  getMy,
  create,
  update,
  remove,
}
