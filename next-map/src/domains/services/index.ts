import { CulturalPropertyRepository } from '@/infrastructures/repositories'
import CulturalPropertyService from './cultural_property'
import { MovieRepository } from '@/infrastructures/repositories'
import MovieService from './movie'

export const cultural_property = new CulturalPropertyService({
  cultural_property: CulturalPropertyRepository,
})

export const movie = new MovieService({
  movie: MovieRepository,
})
