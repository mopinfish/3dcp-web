import { MapboxStyleImageryProvider } from 'cesium'
import React, { useContext, useEffect } from 'react'

import { ViewerContext } from './Viewer'

export type MapboxImageryProps = Pick<
  MapboxStyleImageryProvider.ConstructorOptions,
  'accessToken' | 'username' | 'styleId'
>

export const MapboxImagery: React.FC<MapboxImageryProps> = ({ accessToken, username, styleId }) => {
  const viewer = useContext(ViewerContext)
  useEffect(() => {
    if (viewer?.isDestroyed() !== false) {
      return
    }
    const imageryLayer = viewer.imageryLayers.addImageryProvider(
      new MapboxStyleImageryProvider({
        accessToken,
        username,
        styleId,
        scaleFactor: true,
      }),
    )
    return () => {
      if (!viewer.isDestroyed()) {
        viewer.imageryLayers.remove(imageryLayer)
      }
    }
  }, [accessToken, username, styleId, viewer])

  return null
}
