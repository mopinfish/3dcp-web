import { Viewer as CesiumViewer, Color } from 'cesium'
import React, {
  ComponentPropsWithRef,
  ForwardedRef,
  createContext,
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { mergeRefs } from 'react-merge-refs'

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export const ViewerContext = createContext<CesiumViewer | undefined>(undefined)

export interface ViewerProps extends ComponentPropsWithRef<'div'> {
  viewerRef?: ForwardedRef<CesiumViewer>
}

export const Viewer = forwardRef<HTMLDivElement, ViewerProps>(
  ({ viewerRef, children, className = '', ...props }, forwardedRef) => {
    const ref = useRef<HTMLDivElement>(null)
    const [viewer, setViewer] = useState<CesiumViewer>()

    useIsomorphicLayoutEffect(() => {
      if (ref.current == null) {
        setViewer(undefined)
        return
      }

      const viewer = new CesiumViewer(ref.current, {
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
        navigationInstructionsInitiallyVisible: false,
      })

      viewer.resolutionScale = window.devicePixelRatio
      viewer.scene.imageryLayers.removeAll()

      const scene = viewer.scene
      scene.globe.baseColor = Color.WHITE
      scene.globe.depthTestAgainstTerrain = true

      setViewer(viewer)

      return () => {
        viewer.destroy()
      }
    }, [])

    useEffect(() => {
      if (typeof viewerRef === 'function') {
        viewerRef(viewer ?? null)
      } else if (viewerRef != null) {
        viewerRef.current = viewer ?? null
      }
    }, [viewerRef, viewer])

    return (
      <div
        ref={mergeRefs([ref, forwardedRef])}
        className={`relative w-full h-full ${className}`}
        {...props}
      >
        {/* Tailwindではcanvasに直接スタイルが当たらない場合があるため、明示的にstyleも補助 */}
        <style jsx global>{`
          .cesium-viewer,
          .cesium-viewer-cesiumWidgetContainer,
          .cesium-widget,
          .cesium-widget canvas {
            width: 100%;
            height: 100%;
          }
        `}</style>
        <ViewerContext.Provider value={viewer}>{children}</ViewerContext.Provider>
      </div>
    )
  },
)
Viewer.displayName = 'Viewer'
