/**
 * cultural_property.ts
 *
 * 文化財（CulturalProperty）のリポジトリインターフェース
 *
 * ✅ クリーンアーキテクチャ対応:
 * - 汎用的なクエリパラメータ対応
 */

import { CulturalProperties, CulturalPropertiesResponse, CulturalProperty } from '../models/cultural_property'

export type getProps = Record<string, string>

type getReturn = Promise<CulturalProperties>
type get = (props: getProps) => getReturn

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

export interface CulturalPropertyRepository {
  get: get
  // 新しいAPI（クリーンアーキテクチャ対応）
  findAll?: (params?: QueryParams) => Promise<CulturalProperties>
  find?: (id: number) => Promise<CulturalProperty>
  findMy?: (params?: QueryParams) => Promise<CulturalPropertiesResponse>
}
