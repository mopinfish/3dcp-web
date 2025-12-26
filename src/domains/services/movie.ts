/**
 * movie.ts
 *
 * ムービー（Movie）のサービス層
 *
 * ✅ クリーンアーキテクチャ対応:
 * - 具体的なユースケースを実装
 * - Repository層は汎用的なAPI、Service層で具体的なパラメータを指定
 */

import { MovieRepository } from '../repositories'
import { Movie, Movies } from '../models/movie'

type Repositories = {
  movie: MovieRepository | null
}

export default class MovieService {
  constructor(
    readonly repositories: Repositories = {
      movie: null,
    },
  ) {}

  /**
   * 全てのムービーを取得
   */
  async getMovies(): Promise<Movies> {
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

  /**
   * 最新のムービーを取得（ホーム画面用）
   * @param limit 取得件数（デフォルト: 5）
   */
  async getLatestMovies(limit: number = 5): Promise<Movies> {
    const props = {
      ordering: '-updated_at',
      limit: limit.toString(),
    }
    try {
      const movies = await this.repositories.movie?.get(props)
      if (!movies) return []
      return movies
    } catch (e) {
      console.error(e)
      return []
    }
  }

  /**
   * 文化財に紐づくムービーを取得
   */
  async getMoviesByCulturalProperty(culturalPropertyId: number): Promise<Movies> {
    const props = {
      cultural_property: culturalPropertyId.toString(),
    }
    try {
      const movies = await this.repositories.movie?.get(props)
      if (!movies) return []
      return movies
    } catch (e) {
      console.error(e)
      return []
    }
  }

  /**
   * ムービーを検索
   */
  async searchMovies(query: string): Promise<Movies> {
    const props = {
      search: query,
    }
    try {
      const movies = await this.repositories.movie?.get(props)
      if (!movies) return []
      return movies
    } catch (e) {
      console.error(e)
      return []
    }
  }

  /**
   * ムービー詳細を取得
   */
  async findMovie(id: number): Promise<Movie | null> {
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
