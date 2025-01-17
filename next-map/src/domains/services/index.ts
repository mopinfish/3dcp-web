import { CulturalPropertyRepository } from '@/infrastructures/repositories'
import CulturalPropertyService from './cultural_property'

export const cultural_property = new CulturalPropertyService({
  cultural_property: CulturalPropertyRepository,
})
