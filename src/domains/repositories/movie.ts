/**
 * movie.ts
 *
 * ムービー（Movie）のリポジトリインターフェース
 *
 * ✅ クリーンアーキテクチャ対応:
 * - 汎用的なクエリパラメータ対応
 */

import { Movie, Movies, MoviesResponse } from '../models'

export type getProps = Record<string, string>

type getReturn = Promise<Movies>
type get = (props: getProps) => getReturn

type findReturn = Promise<Movie>
type find = (id: number) => findReturn

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

export interface MovieRepository {
  get: get
  find: find
  // 新しいAPI（クリーンアーキテクチャ対応）
  findAll?: (params?: QueryParams) => Promise<Movies>
  findMy?: (params?: QueryParams) => Promise<MoviesResponse>
}
