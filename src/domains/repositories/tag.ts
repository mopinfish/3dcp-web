import { Tag, Tags } from '../models'

export type getProps = Record<string, string>

type getReturn = Promise<Tags>
type get = (props: getProps) => getReturn

type findReturn = Promise<Tag>
type find = (id: number) => findReturn

export interface TagRepository {
  get: get
  find: find
}
