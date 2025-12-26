import { CulturalPropertyRepository, MovieRepository, TagRepository } from '@/infrastructures/repositories'
import { UserRepository } from '@/infrastructures/repositories/user'
import CulturalPropertyService from './cultural_property'
import MovieService from './movie'
import TagService from './tag'
import UserService from './user'

export const cultural_property = new CulturalPropertyService({
  cultural_property: CulturalPropertyRepository,
})

export const movie = new MovieService({
  movie: MovieRepository,
})

export const tag = new TagService({
  tag: TagRepository,
})

export const user = new UserService({
  user: UserRepository,
})
