import { Http } from '@/infrastructures/lib'
import { CulturalProperties } from '@/domains/models/cultural_property'
import { Tag } from '@/domains/models'
import { getProps } from '@/domains/repositories/cultural_property'

const HOST = process.env.NEXT_PUBLIC_BACKEND_API_HOST

type CulturalPropertiesResponse = {
  count: number
  next: string | null
  previous: string | null
  results: CulturalProperties
}

export async function get(props: getProps): Promise<CulturalProperties> {
  const queries = new URLSearchParams(props).toString()
  const url = `${HOST}/api/v1/cultural_properties?${queries}`
  const res = await Http.get<Promise<CulturalPropertiesResponse>>(url)
  return res.results
}

export async function getByLocation(
  lat: number,
  lon: number,
  distance: number,
): Promise<CulturalProperties> {
  const url = `${HOST}/api/v1/cultural_properties?lat=${lat}&lon=${lon}&distance=${distance}`
  const res = await Http.get<Promise<CulturalPropertiesResponse>>(url)
  return res.results
}

export async function getByTag(tagId: number): Promise<CulturalProperties> {
  const url = `${HOST}/api/v1/cultural_properties?tag_id=${tagId}`
  const res = await Http.get<Promise<CulturalPropertiesResponse>>(url)
  return res.results
}

export async function getTags(): Promise<Tag[]> {
  const url = `${HOST}/api/v1/tags`
  return await Http.get<Promise<Tag[]>>(url)
}
