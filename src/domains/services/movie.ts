import { MovieRepository } from '../repositories'

type Reporitories = {
  movie: MovieRepository | null
}

export default class MovieService {
  constructor(
    readonly repositories: Reporitories = {
      movie: null,
    },
  ) {}

  async getMovies() {
    const props = {}
    try {
      const movies = await this.repositories.movie?.get(props)
      if (!movies) return []
      return movies
    } catch (e) {
      console.error(e)
      return []
    }
  }

  async findMovie(id: number) {
    try {
      const movie = await this.repositories.movie?.find(id)
      if (!movie) return null
      return movie
    } catch (e) {
      console.error(e)
      return null
    }
  }
}
