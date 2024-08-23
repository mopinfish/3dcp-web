import { JulianDate } from 'cesium'
import React, { useContext, useEffect } from 'react'
 
import { ViewerContext } from './Viewer'
 
export const Clock: React.FC = () => {
  const viewer = useContext(ViewerContext)
  useEffect(() => {
    if (viewer?.isDestroyed() !== false) {
      return
    }
    JulianDate.fromDate(new Date(2022, 0, 1, 13), viewer.clock.currentTime)
  }, [viewer])
 
  return null
}