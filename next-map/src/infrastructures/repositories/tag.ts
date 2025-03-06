import { Http } from '@/infrastructures/lib'
import { Tag, Tags } from '@/domains/models'
import { getProps } from '@/domains/repositories/movie'

const HOST = process.env.NEXT_PUBLIC_BACKEND_API_HOST

type TagResponse = Tag
type TagsResponse = {
  count: number
  next: string | null
  previous: string | null
  results: Tags
}

export async function get(props: getProps): Promise<Tags> {
  const queries = new URLSearchParams(props).toString()
  const url = `${HOST}/api/v1/tags?${queries}`
  const res = await Http.get<Promise<TagsResponse>>(url)
  const results = res['results']
  return results
}

export async function find(id: number): Promise<Tag> {
  const url = `${HOST}/api/v1/tags/${id}`
  const result = await Http.get<Promise<TagResponse>>(url)
  return result
}
