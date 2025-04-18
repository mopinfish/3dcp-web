import { Http } from '@/infrastructures/lib'
import { Movie, Movies } from '@/domains/models'
import { getProps } from '@/domains/repositories/movie'

const HOST = process.env.NEXT_PUBLIC_BACKEND_API_HOST

type MovieResponse = Movie
type MoviesResponse = {
  count: number
  next: string | null
  previous: string | null
  results: Movies
}

export async function get(props: getProps): Promise<Movies> {
  const queries = new URLSearchParams(props).toString()
  const url = `${HOST}/api/v1/movies?${queries}`
  const res = await Http.get<Promise<MoviesResponse>>(url)
  const results = res['results']
  return results
}

export async function find(id: number): Promise<Movie> {
  const url = `${HOST}/api/v1/movies/${id}`
  const result = await Http.get<Promise<MovieResponse>>(url)
  return result
}
