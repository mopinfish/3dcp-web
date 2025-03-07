import { CulturalPropertyRepository } from '../repositories'

type Repositories = {
  cultural_property: CulturalPropertyRepository | null
}

export default class CulturalPropertyService {
  constructor(
    readonly repositories: Repositories = {
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

  async getPropertiesByLocation(lat: number, lon: number, distance: number) {
    const props = { lat: lat.toString(), lon: lon.toString(), distance: distance.toString(), has_movies: 'true' } 
    try {
      const properties = await this.repositories.cultural_property?.get(props)
      if (!properties) return []
      return properties
    } catch (e) {
      console.error(e)
      return []
    }
  }

  async getPropertiesByTag(tagId: number) {
    const props = { tag_id: tagId.toString(), has_movies: 'true' }
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
