import { Movie, Movies } from '../models'

export type getProps = Record<string, string>

type getReturn = Promise<Movies>
type get = (props: getProps) => getReturn

type findReturn = Promise<Movie>
type find = (id: number) => findReturn

export interface MovieRepository {
  get: get
  find: find
}
