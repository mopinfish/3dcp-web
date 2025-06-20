import React, { useEffect, useState, useMemo } from 'react'
import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { LayoutWithFooter } from '@/components/layouts/Layout'
import { cultural_property as culturalPropertyService } from '@/domains/services'
import { CulturalProperties } from '@/domains/models/cultural_property'
import NavigationTab from '@/components/blocks/NavigationTab'
import SearchConditionTab from '@/components/blocks/SearchConditionTab'

const Map3D = dynamic(() => import('../components/blocks/3dMap'), { ssr: false })

const MapScreen3D: NextPage = () => {
  const [properties, setProperties] = useState<CulturalProperties>([])

  const actions = useMemo(
    () => ({
      onload: () => {
        culturalPropertyService
          .getProperties()
          .then(setProperties)
          .catch((error) => {
            console.error('Error fetching cultural properties:', error)
          })
      },
    }),
    [],
  )

  useEffect(() => {
    actions.onload()
  }, [actions])
  return (
    <LayoutWithFooter>
      <NavigationTab />
      {/* 検索条件タブを追加 */}
      <SearchConditionTab onUpdateProperties={setProperties} />

      <Map3D properties={properties} />
    </LayoutWithFooter>
  )
}

export default MapScreen3D
