/**
 * tag.ts
 * 
 * タグ関連のAPIリポジトリ
 * 
 * ✅ Phase 3-3対応:
 * - タグ一覧取得
 * - タグ検索
 * - タグ作成（認証必須）
 */

import { Http } from '@/infrastructures/lib/http'
import { Tag, Tags } from '@/domains/models/tag'

const HOST = process.env.NEXT_PUBLIC_BACKEND_API_HOST

type TagResponse = Tag

type TagsResponse = {
  count: number
  next: string | null
  previous: string | null
  results: Tags
}

export type GetTagsParams = {
  name?: string
  search?: string
}

export type CreateTagParams = {
  name: string
  description?: string
}

/**
 * タグ一覧を取得
 */
export async function get(params?: GetTagsParams): Promise<Tags> {
  const queries = params ? new URLSearchParams(params as Record<string, string>).toString() : ''
  const url = `${HOST}/api/v1/tags${queries ? `?${queries}` : ''}`
  const res = await Http.get<TagsResponse>(url)
  // descriptionがnullの場合は空文字に変換
  return res.results.map(tag => ({
    ...tag,
    description: tag.description || ''
  }))
}

/**
 * タグ詳細を取得
 */
export async function find(id: number): Promise<Tag> {
  const url = `${HOST}/api/v1/tags/${id}`
  const result = await Http.get<TagResponse>(url)
  return {
    ...result,
    description: result.description || ''
  }
}

/**
 * タグを作成（認証必須）
 */
export async function create(params: CreateTagParams): Promise<Tag> {
  const url = `${HOST}/api/v1/tags/`
  const result = await Http.post<TagResponse>(url, params)
  return {
    ...result,
    description: result.description || ''
  }
}

/**
 * タグ名で検索（部分一致）
 */
export async function search(query: string): Promise<Tags> {
  const url = `${HOST}/api/v1/tags?name=${encodeURIComponent(query)}`
  const res = await Http.get<TagsResponse>(url)
  return res.results.map(tag => ({
    ...tag,
    description: tag.description || ''
  }))
}
