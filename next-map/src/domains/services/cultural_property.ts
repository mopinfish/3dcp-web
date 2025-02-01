import { CulturalPropertyRepository } from '../repositories'

type Reporitories = {
  cultural_property: CulturalPropertyRepository | null
}

export default class CulturalPropertyService {
  constructor(
    readonly repositories: Reporitories = {
      cultural_property: null,
    },
  ) {}

  async getProperties() {
    const props = { has_movies: 'true' }
    try {
      const properties = await this.repositories.cultural_property?.get(props)
      if (!properties) return []
      return properties
    } catch (e) {
      console.error(e)
      return []
    }
  }
}
