import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { LayoutWithFooter } from '@/components/layouts/Layout'
import { cultural_property as culturalPropertyService } from '@/domains/services'
import { CulturalProperties } from '@/domains/models/cultural_property'
import NavigationTab from '@/components/blocks/NavigationTab'

const Map3D = dynamic(() => import('../components/blocks/3dMap'), {
  ssr: false,
})

const MapScreen3D: NextPage = () => {
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
      <Map3D properties={properties} />
    </LayoutWithFooter>
  )
}

export default MapScreen3D
