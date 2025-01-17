import React, { useState, useEffect } from 'react'
import Map from '../components/Map'
import { LayoutWithFooter } from '@/components/layouts/Layout'
import { cultural_property as culturalPropertyService } from '@/domains/services'
import { CulturalProperties } from '@/domains/models/cultural_property'
import NavigationTab from '@/components/blocks/NavigationTab'

const MapScreen = () => {
  const [properties, setProperties] = useState<CulturalProperties>([])

  const actions = {
    onload: async () => {
      const properties = await culturalPropertyService.getProperties()
      setProperties(properties)
    },
  }

  useEffect(() => {
    actions.onload()
  }, [])

  return (
    <LayoutWithFooter>
      <NavigationTab />
      <Map properties={properties} />
    </LayoutWithFooter>
  )
}

export default MapScreen
