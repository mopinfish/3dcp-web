/**
 * cultural_property.ts
 *
 * 文化財（CulturalProperty）のAPIリポジトリ
 *
 * ✅ クリーンアーキテクチャ対応:
 * - 汎用的なクエリパラメータ対応
 * - 具体的なフィルタリング・件数指定はService層で実施
 */

import { Http } from '@/infrastructures/lib/http'
import {
  CulturalProperty,
  CulturalProperties,
  CulturalPropertiesResponse,
  CulturalPropertyCreateRequest,
  CulturalPropertyUpdateRequest,
} from '@/domains/models/cultural_property'
import { Tag } from '@/domains/models'

const HOST = process.env.NEXT_PUBLIC_BACKEND_API_HOST

/**
 * 汎用的なクエリパラメータ型
 */
export type QueryParams = {
  ordering?: string
  limit?: number
  offset?: number
  search?: string
  has_movies?: boolean | string
  lat?: string
  lon?: string
  distance?: string
  tag_id?: string
  tag_name?: string
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
 * 文化財一覧を取得（汎用的なクエリパラメータ対応）
 */
export async function findAll(params?: QueryParams): Promise<CulturalProperties> {
  const queryString = buildQueryString(params)
  const url = `${HOST}/cp_api/cultural_property/${queryString}`
  const res = await Http.get<CulturalPropertiesResponse>(url)
  return res.results
}

/**
 * 文化財詳細を取得
 */
export async function find(id: number): Promise<CulturalProperty> {
  const url = `${HOST}/cp_api/cultural_property/${id}/`
  return await Http.get<CulturalProperty>(url)
}

/**
 * 自分が作成した文化財一覧を取得
 */
export async function findMy(params?: QueryParams): Promise<CulturalPropertiesResponse> {
  const queryString = buildQueryString(params)
  const url = `${HOST}/cp_api/cultural_property/my/${queryString}`
  const headers = getAuthHeaders()

  console.log('culturalPropertyRepo: findMy API call started')

  try {
    const result = await Http.get<CulturalPropertiesResponse>(url, headers)
    console.log('culturalPropertyRepo: findMy API call successful')
    return result
  } catch (error) {
    console.error('culturalPropertyRepo: findMy API call failed:', error)
    throw error
  }
}

/**
 * タグ一覧を取得
 */
export async function findTags(): Promise<Tag[]> {
  const url = `${HOST}/cp_api/tag/`
  const res = await Http.get<{ count: number; results: Tag[] }>(url)
  return res.results
}

/**
 * 文化財を作成
 */
export async function create(
  data: CulturalPropertyCreateRequest,
): Promise<CulturalProperty> {
  const url = `${HOST}/cp_api/cultural_property/`
  const headers = getAuthHeaders()

  console.log('culturalPropertyRepo: create API call started')
  console.log('culturalPropertyRepo: Request data:', data)

  try {
    const result = await Http.post<CulturalProperty>(url, data, headers)
    console.log('culturalPropertyRepo: create API call successful')
    console.log('culturalPropertyRepo: Created ID:', result.id)
    return result
  } catch (error) {
    console.error('culturalPropertyRepo: create API call failed:', error)
    throw error
  }
}

/**
 * 文化財を更新
 */
export async function update(
  id: number,
  data: CulturalPropertyUpdateRequest,
): Promise<CulturalProperty> {
  const url = `${HOST}/cp_api/cultural_property/${id}/`
  const headers = getAuthHeaders()

  console.log('culturalPropertyRepo: update API call started')
  console.log('culturalPropertyRepo: ID:', id)
  console.log('culturalPropertyRepo: Request data:', data)

  try {
    const result = await Http.patch<CulturalProperty>(url, data, headers)
    console.log('culturalPropertyRepo: update API call successful')
    return result
  } catch (error) {
    console.error('culturalPropertyRepo: update API call failed:', error)
    throw error
  }
}

/**
 * 文化財を削除
 */
export async function remove(id: number): Promise<void> {
  const url = `${HOST}/cp_api/cultural_property/${id}/`
  const headers = getAuthHeaders()

  console.log('culturalPropertyRepo: remove API call started')
  console.log('culturalPropertyRepo: ID:', id)

  try {
    await Http.delete<void>(url, headers)
    console.log('culturalPropertyRepo: remove API call successful')
  } catch (error) {
    console.error('culturalPropertyRepo: remove API call failed:', error)
    throw error
  }
}

// 後方互換性のためのエクスポート
// 古いgetPropsベースのインターフェースもサポート
export type getProps = Record<string, string>

export async function get(props: getProps): Promise<CulturalProperties> {
  return findAll(props as QueryParams)
}

export async function getById(id: number): Promise<CulturalProperty> {
  return find(id)
}

export async function getByLocation(
  lat: number,
  lon: number,
  distance: number,
): Promise<CulturalProperties> {
  return findAll({
    lat: lat.toString(),
    lon: lon.toString(),
    distance: distance.toString(),
  })
}

export async function getByTag(tagId: number): Promise<CulturalProperties> {
  return findAll({ tag_id: tagId.toString() })
}

export async function getTags(): Promise<Tag[]> {
  return findTags()
}

export async function getMy(): Promise<CulturalPropertiesResponse> {
  return findMy()
}

// デフォルトエクスポート（後方互換性のため）
export const CulturalPropertyRepository = {
  // 新しいAPI（クリーンアーキテクチャ対応）
  findAll,
  find,
  findMy,
  findTags,
  create,
  update,
  remove,
  // 後方互換性のためのAPI
  get,
  getById,
  getByLocation,
  getByTag,
  getTags,
  getMy,
}
