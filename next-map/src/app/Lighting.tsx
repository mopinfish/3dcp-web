import { Cartesian3 } from 'cesium'
import React, { useContext, useEffect } from 'react'
 
import { ViewerContext } from './Viewer'
 
// 適当な球面調和関数の係数
// https://cesium.com/learn/cesiumjs/ref-doc/ImageBasedLighting.html#sphericalHarmonicCoefficients
const sphericalHarmonicCoefficients = [
  new Cartesian3(1.5, 1.5, 1.5), // L_0,0
  new Cartesian3(1.25, 1.25, 1.25), // L_1,-1
  new Cartesian3(1.5, 1.5, 1.5), // L_1,0
  new Cartesian3(-1.25, -1.25, -1.25), // L_1,1
  new Cartesian3(-1, -1, -1), // L_2,-2
  new Cartesian3(1.25, 1.25, 1.25), // L_2,-1
  new Cartesian3(0, 0, 0), // L_2,0
  new Cartesian3(-1, -1, -1), // L_2,1
  new Cartesian3(-0, -0, -0) // L_2,2
]
 
export const Lighting: React.FC = () => {
  const viewer = useContext(ViewerContext)
  useEffect(() => {
    if (viewer?.isDestroyed() !== false) {
      return
    }
    const scene = viewer.scene
    scene.light.intensity = 5
    scene.sphericalHarmonicCoefficients = sphericalHarmonicCoefficients
 
    // シャドウマップの有効化とパラメータ調整。
    // 4096pxのシャドウマップはGPUによっては負荷が大きすぎるかもしれません。その場合は
    // `size`を2048にしたり、`softShadows`をfalseにしてください。
    scene.shadowMap.enabled = true
    scene.shadowMap.size = 4096
    scene.shadowMap.softShadows = true
    scene.shadowMap.darkness = 0.5
 
    // シャドウマップのZファイティングを避けるために非公開APIのnormalOffsetScaleを調
    // 整します。ブラウザやGPUドライバによっては不要かもしれません。
    ;(scene.shadowMap as any)._primitiveBias.normalOffsetScale = 5
  }, [viewer])
 
  return null
}