import { Http } from '@/infrastructures/lib'
import { CulturalProperties } from '@/domains/models/cultural_property'
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
  const results = res['results']
  return results
}
