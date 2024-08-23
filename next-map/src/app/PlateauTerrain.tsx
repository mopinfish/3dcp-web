import { CesiumTerrainProvider, IonResource } from 'cesium'
import React, { useContext, useEffect } from 'react'

import { ViewerContext } from './Viewer'

export const PlateauTerrain: React.FC = () => {
  const viewer = useContext(ViewerContext)
  useEffect(() => {
    if (viewer?.isDestroyed() !== false) {
      return
    }
    // https://github.com/Project-PLATEAU/plateau-streaming-tutorial/blob/main/terrain/plateau-terrain-streaming.md
    viewer.terrainProvider = new CesiumTerrainProvider({
      url: IonResource.fromAssetId(770371, {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5N2UyMjcwOS00MDY1LTQxYjEtYjZjMy00YTU0ZTg5MmViYWQiLCJpZCI6ODAzMDYsImlhdCI6MTY0Mjc0ODI2MX0.dkwAL1CcljUV7NA7fDbhXXnmyZQU_c-G5zRx8PtEcxE'
      })
    })
  }, [viewer])

  return null
}