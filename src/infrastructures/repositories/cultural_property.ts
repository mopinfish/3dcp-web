/**
 * cultural_property.ts
 *
 * 文化財（CulturalProperty）のAPIリポジトリ
 *
 * ✅ 変更内容:
 * - create: 文化財作成API
 * - update: 文化財更新API
 * - remove: 文化財削除API
 * - getMy: 自分の文化財一覧取得API
 * - getById: 文化財詳細取得API
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
import { getProps } from '@/domains/repositories/cultural_property'

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
 * 文化財一覧を取得
 */
export async function get(props: getProps): Promise<CulturalProperties> {
  const queries = new URLSearchParams(props).toString()
  const url = `${HOST}/cp_api/cultural_property/?${queries}`
  const res = await Http.get<CulturalPropertiesResponse>(url)
  return res.results
}

/**
 * 文化財詳細を取得
 */
export async function getById(id: number): Promise<CulturalProperty> {
  const url = `${HOST}/cp_api/cultural_property/${id}/`
  return await Http.get<CulturalProperty>(url)
}

/**
 * 位置情報で文化財を検索
 */
export async function getByLocation(
  lat: number,
  lon: number,
  distance: number,
): Promise<CulturalProperties> {
  const url = `${HOST}/cp_api/cultural_property/?lat=${lat}&lon=${lon}&distance=${distance}`
  const res = await Http.get<CulturalPropertiesResponse>(url)
  return res.results
}

/**
 * タグで文化財を検索
 */
export async function getByTag(tagId: number): Promise<CulturalProperties> {
  const url = `${HOST}/cp_api/cultural_property/?tag_id=${tagId}`
  const res = await Http.get<CulturalPropertiesResponse>(url)
  return res.results
}

/**
 * タグ一覧を取得
 */
export async function getTags(): Promise<Tag[]> {
  const url = `${HOST}/cp_api/tag/`
  const res = await Http.get<{ count: number; results: Tag[] }>(url)
  return res.results
}

/**
 * 自分が作成した文化財一覧を取得
 */
export async function getMy(): Promise<CulturalPropertiesResponse> {
  const url = `${HOST}/cp_api/cultural_property/my/`
  const headers = getAuthHeaders()

  console.log('culturalPropertyRepo: getMy API call started')

  try {
    const result = await Http.get<CulturalPropertiesResponse>(url, headers)
    console.log('culturalPropertyRepo: getMy API call successful')
    return result
  } catch (error) {
    console.error('culturalPropertyRepo: getMy API call failed:', error)
    throw error
  }
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

// デフォルトエクスポート（後方互換性のため）
export const CulturalPropertyRepository = {
  get,
  getById,
  getByLocation,
  getByTag,
  getTags,
  getMy,
  create,
  update,
  remove,
}
