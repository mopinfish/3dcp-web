import React, { useState, useEffect } from 'react'
import Map from '../components/Map'
import { LayoutWithFooter } from '@/components/layouts/Layout'
import { cultural_property as culturalPropertyService } from '@/domains/services'
import { CulturalProperties } from '@/domains/models/cultural_property'
import NavigationTab from '@/components/blocks/NavigationTab'
import SearchConditionTab from '@/components/blocks/SearchConditionTab'

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
      {/* 検索条件タブを追加 */}
      <SearchConditionTab onUpdateProperties={setProperties} />

      <Map properties={properties} />
    </LayoutWithFooter>
  )
}

export default MapScreen
