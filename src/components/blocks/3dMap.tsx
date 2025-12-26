/**
 * 3dMap.tsx
 * 
 * 3Dマップコンポーネント
 * 
 * ✅ 変更内容:
 * - ポップアップに文化財ID、名前、住所を渡すように変更
 * - ムービーがない文化財の場合はCulturalPropertyInfoPopupを表示
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { CulturalProperties } from '@/domains/models'
import { CulturalPropertyThreeCanvasPopup, CulturalPropertyInfoPopup } from './Popup'
import { createRoot } from 'react-dom/client'

const plateauSource: maplibregl.VectorSourceSpecification = {
  type: 'vector',
  tiles: ['https://indigo-lab.github.io/plateau-tokyo23ku-building-mvt-2020/{z}/{x}/{y}.pbf'],
  minzoom: 10,
  maxzoom: 16,
  attribution: '',
}
const plateauLayer: maplibregl.FillExtrusionLayerSpecification = {
  id: 'bldg',
  type: 'fill-extrusion',
  source: 'plateau',
  'source-layer': 'bldg',
  minzoom: 10,
  maxzoom: 20,
  paint: { 'fill-extrusion-color': '#797979', 'fill-extrusion-height': ['get', 'measuredHeight'] },
}
const initialStyles: { [key: string]: maplibregl.StyleSpecification } = {
  osm: {
    version: 8,
    sources: {
      osm: {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
      plateau: plateauSource,
    },
    layers: [
      { id: 'osm-layer', type: 'raster', source: 'osm', minzoom: 0, maxzoom: 19 },
      plateauLayer,
    ],
  },
}

type MapProps = { properties: CulturalProperties }

const Map3D = ({ properties }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const [styles, setStyles] = useState<Record<string, maplibregl.StyleSpecification>>(initialStyles)
  // GeoJSONフィーチャーコレクションに変換
  const geojsonData = useMemo(() => {
    return {
      type: 'FeatureCollection' as const,
      features: properties.map((item) => ({
        type: 'Feature' as const,
        geometry: { type: 'Point' as const, coordinates: [item.longitude, item.latitude] },
        properties: {
          id: item.id,
          name: item.name,
          address: item.address,
          type: item.type,
          movies: item.movies,
          images: item.images,
          thumb: item.images[0]?.image || '/img/noimage.png',
          hasMovies: item.movies && item.movies.length > 0,
        },
      })),
    }
  }, [properties])

  /**
   * 地図スタイルの読み込みおよび設定
   */
  const loadStyles = useCallback(() => {
    // propertiesが読み込まれてから下記の処理を実行
    if (properties.length === 0) return
    const otherSources: { [key: string]: maplibregl.GeoJSONSourceSpecification } = {
      cultural_properties: { type: 'geojson', data: geojsonData },
    }
    const otherLayers = [
      {
        id: 'cultural_properties',
        type: 'symbol',
        source: 'cultural_properties',
        layout: { 'icon-image': ['get', 'thumb'], 'icon-size': 0.2 },
      },
    ]
    if (!initialStyles.osm.sources.cultural_properties) {
      initialStyles.osm.sources = { ...initialStyles.osm.sources, ...otherSources }
      initialStyles.osm.layers = [
        ...initialStyles.osm.layers,
        ...(otherLayers as maplibregl.LayerSpecification[]),
      ]
    }
    setStyles(initialStyles)
  }, [properties, geojsonData])

  const onMapLoad = useCallback(
    async (mapInstance: maplibregl.Map) => {
      for (const feature of geojsonData.features) {
        const imageUrl = feature.properties ? feature.properties.thumb : '/img/noimage.png'
        if (mapInstance && !mapInstance.hasImage(imageUrl)) {
          try {
            const response = await fetch(imageUrl, {
              mode: 'cors', // CORSリクエストを明示
            })
            const blob = await response.blob()
            const imageBitmap = await createImageBitmap(blob)
            mapInstance.addImage(imageUrl, imageBitmap)
          } catch (error) {
            console.error('画像の読み込みエラー:', error)
          }
        }
      }

      console.log('すべてのアイコンがロードされました')

      // ポップアップを表示する
      mapInstance.on('click', 'cultural_properties', (event) => {
        if (event.features === undefined) return
        const feature = event.features[0]
        const coordinates = event.lngLat
        const featureProperties = feature.properties
        
        // 文化財情報を取得
        const culturalPropertyId = Number(featureProperties.id)
        const culturalPropertyName = featureProperties.name
        const address = featureProperties.address
        const type = featureProperties.type
        
        // ムービー情報を取得
        const moviesData = featureProperties.movies
        let movies = []
        try {
          movies = typeof moviesData === 'string' ? JSON.parse(moviesData) : moviesData
        } catch (e) {
          console.error('Movies parse error:', e)
        }

        const popupContainer = document.createElement('div')
        const popup = new maplibregl.Popup({
          offset: 10,
          closeButton: true,
          closeOnClick: true,
          maxWidth: '320px',
        })
          .setLngLat(coordinates)
          .setDOMContent(popupContainer)
          .addTo(mapInstance)

        const root = createRoot(popupContainer)
        
        // ムービーがある場合は3Dビューア付きポップアップを表示
        if (movies && movies.length > 0) {
          const movie = movies[0]
          const movieId = Number(movie.id)
          const url = '/luma/' + movie.id

          root.render(
            <CulturalPropertyThreeCanvasPopup 
              id={movieId} 
              url={url}
              culturalPropertyId={culturalPropertyId}
              culturalPropertyName={culturalPropertyName}
              address={address}
            />
          )
        } else {
          // ムービーがない場合は情報のみのポップアップを表示
          root.render(
            <CulturalPropertyInfoPopup
              culturalPropertyId={culturalPropertyId}
              name={culturalPropertyName}
              address={address}
              type={type}
            />
          )
        }

        // ポップアップが閉じられたときにReactコンポーネントをアンマウント
        popup.on('close', () => {
          root.unmount()
        })
      })
    },
    [geojsonData],
  )

  useEffect(() => {
    loadStyles()
    if (!mapContainer.current) return
    const mapInstance = new maplibregl.Map({
      container: mapContainer.current as HTMLElement,
      style: styles.osm,
      center: [139.79667139325397, 35.71489576634944],
      zoom: 13,
      pitch: 45,
      maxPitch: 85,
    })
    mapInstance.addControl(new maplibregl.NavigationControl())

    mapInstance.on('load', () => {
      onMapLoad(mapInstance)
    })
    mapInstance.on('mouseenter', 'cultural_properties', () => {
      mapInstance.getCanvas().style.cursor = 'pointer'
    })
    mapInstance.on('mouseleave', 'cultural_properties', () => {
      mapInstance.getCanvas().style.cursor = ''
    })

    return () => mapInstance.remove()
  }, [properties, styles, loadStyles, onMapLoad])

  return (
    <>
      <div ref={mapContainer} style={{ width: '100wh', height: '100vh' }}></div>
    </>
  )
}

export default Map3D
