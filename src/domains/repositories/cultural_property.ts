import { CulturalProperties } from '../models/cultural_property'

export type getProps = Record<string, string>

type getReturn = Promise<CulturalProperties>
type get = (props: getProps) => getReturn

export interface CulturalPropertyRepository {
  get: get
}
