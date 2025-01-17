import { CulturalPropertyRepository } from '../repositories'

type Reporitories = {
  cultural_property: CulturalPropertyRepository | null
}

export default class ScoresService {
  constructor(
    readonly repositories: Reporitories = {
      cultural_property: null,
    },
  ) {}

  async getProperties() {
    const props = {has_movies: 'true'}
    const properties = await this.repositories.cultural_property?.get(props)
    if (!properties) return []
    return properties
  }
}
