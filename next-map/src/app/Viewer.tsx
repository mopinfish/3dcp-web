import { Global, css } from '@emotion/react'
import styled from '@emotion/styled'
import { Viewer as CesiumViewer, Color } from 'cesium'
import React, {
  ComponentPropsWithRef,
  ForwardedRef,
  createContext,
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react'
import { mergeRefs } from 'react-merge-refs'
 
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect
 
export const ViewerContext = createContext<CesiumViewer | undefined>(undefined)
 
const Root = styled.div(css`
  position: relative;
  width: 100%;
  height: 100%;
`)
 
export interface ViewerProps extends ComponentPropsWithRef<typeof Root> {
  viewerRef?: ForwardedRef<CesiumViewer>
}
 
export const Viewer = forwardRef<HTMLDivElement, ViewerProps>(
  ({ viewerRef, children, ...props }, forwardedRef) => {
    const ref = useRef<HTMLDivElement>(null)
    const [viewer, setViewer] = useState<CesiumViewer>()
    useIsomorphicLayoutEffect(() => {
      if (ref.current == null) {
        setViewer(undefined)
        return
      }
      const viewer = new CesiumViewer(ref.current, {
        // 今回は使用しないため、すべての組み込みUIを非表示にします。
        animation: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: false,
        timeline: false,
        navigationHelpButton: false,
        navigationInstructionsInitiallyVisible: false
      })
 
      // Viewerのピクセル密度をデバイスのピクセル密度に合わせます。
      // 注意：レンダリング品質は向上しますが、GPUへの負荷は大きくなります。
      viewer.resolutionScale = window.devicePixelRatio
 
      // 今回は使用しないため、組み込みのImagery Layerを削除します。
      viewer.scene.imageryLayers.removeAll()
 
      // 視覚的なパラメータ調整です。
      const scene = viewer.scene
      scene.skyBox = undefined as any
      scene.globe.baseColor = Color.WHITE
 
      // デフォルトでは地形に対してデプステストが行われません（地面にめり込んでいる建物
      // やその部分が表示される）。PLATEAUの3D都市モデルを用いる場合には基本的にtrueに
      // することになるでしょう。
      scene.globe.depthTestAgainstTerrain = true
 
      setViewer(viewer)
      return () => {
        viewer.destroy()
      }
    }, [])
 
    // コンポーネント外から`viewerRef`経由でViewerオブジェクトを利用可能にします。
    useEffect(() => {
      if (typeof viewerRef === 'function') {
        viewerRef(viewer ?? null)
      } else if (viewerRef != null) {
        viewerRef.current = viewer ?? null
      }
    }, [viewerRef, viewer])
 
    return (
      <Root ref={mergeRefs([ref, forwardedRef])} {...props}>
        <Global
          // Viewerが作成するHTMLCanvasElementを`Root`を覆うサイズまで広げます。
          styles={css`
            .cesium-viewer,
            .cesium-viewer-cesiumWidgetContainer,
            .cesium-widget,
            .cesium-widget canvas {
              width: 100%;
              height: 100%;
            }
          `}
        />
        <ViewerContext.Provider value={viewer}>
          {children}
        </ViewerContext.Provider>
      </Root>
    )
  }
)