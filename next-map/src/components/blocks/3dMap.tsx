import React, { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { CulturalProperties } from '@/domains/models'
import { CulturalPropertyThreeCanvasPopup } from './Popup'
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
  paint: {
    'fill-extrusion-color': '#797979',
    'fill-extrusion-height': ['get', 'measuredHeight'],
  },
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
      {
        id: 'osm-layer',
        type: 'raster',
        source: 'osm',
        minzoom: 0,
        maxzoom: 19,
      },
      plateauLayer,
    ],
  },
}

type MapProps = {
  properties: CulturalProperties
}

const Map3D = ({ properties }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const [styles, setStyles] = useState<Record<string, maplibregl.StyleSpecification>>(initialStyles)
  // GeoJSONフィーチャーコレクションに変換
  const geojsonData: GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties> = {
    type: 'FeatureCollection',
    features: properties.map((item) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [item.longitude, item.latitude],
      },
      properties: {
        id: item.id,
        name: item.name,
        address: item.address,
        movies: item.movies,
        images: item.images,
        thumb: item.images[0].image,
        // その他必要なプロパティを追加
      },
    })),
  }

  /**
   * 地図スタイルの読み込みおよび設定
   */
  const loadStyles = () => {
    // propertiesが読み込まれてから下記の処理を実行
    if (properties.length === 0) return
    const otherSources: { [key: string]: maplibregl.GeoJSONSourceSpecification } = {
      cultural_properties: {
        type: 'geojson',
        data: geojsonData,
      },
    }
    const otherLayers = [
      {
        id: 'cultural_properties',
        type: 'symbol',
        source: 'cultural_properties',
        layout: {
          'icon-image': ['get', 'thumb'],
          'icon-size': 0.2,
        },
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
  }

  const onMapLoad = async (mapInstance: maplibregl.Map) => {
    for (const feature of geojsonData.features) {
      const imageUrl = feature.properties ? feature.properties.thumb : '/img/noimage.png'
      if (mapInstance && !mapInstance.hasImage(imageUrl)) {
        try {
          const response = await fetch(imageUrl, {
            mode: "cors", // CORSリクエストを明示
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
      const property = feature.properties
      const movie = JSON.parse(property.movies)[0]
      const id = Number(movie.id)
      const url = '/luma/' + movie.id

      const popupContainer = document.createElement('div') // 動的コンテンツ用のコンテナ
      // ポップアップを表示する
      const popup = new maplibregl.Popup({
        offset: 10, // ポップアップの位置
        closeButton: false, // 閉じるボタンの表示
      })
        .setLngLat(coordinates)
        .setDOMContent(popupContainer) // HTMLではなくDOM要素を設定
        .addTo(mapInstance)

      // Reactコンポーネントをポップアップ内のコンテナにマウント
      const root = createRoot(popupContainer)
      root.render(<CulturalPropertyThreeCanvasPopup id={id} url={url} />)

      // ポップアップが閉じられたときにReactコンポーネントをアンマウント
      popup.on('close', () => {
        root.unmount()
      })
    })
  }

  useEffect(() => {
    loadStyles()
    if (!mapContainer.current) return
    const mapInstance = new maplibregl.Map({
      container: mapContainer.current as HTMLElement,
      style: styles.osm,
      center: [139.7975443779719, 35.678396026551994],
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
  }, [properties, styles])

  return (
    <>
      <div ref={mapContainer} style={{ width: '100wh', height: '100vh' }}></div>
    </>
  )
}

export default Map3D
