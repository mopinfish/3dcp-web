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
const customSources: { [key: string]: maplibregl.SourceSpecification } = {
  plateau: plateauSource,
}
const customLayers: maplibregl.LayerSpecification[] = [plateauLayer]
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
    },
    layers: [
      {
        id: 'osm-layer',
        type: 'raster',
        source: 'osm',
        minzoom: 0,
        maxzoom: 19,
      },
    ],
  },
}

type MapProps = {
  properties: CulturalProperties
}

const Map3D = ({ properties }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<maplibregl.Map | null>(null)
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
  const loadStyles = async () => {
    /**
     * れきちずスタイルの読み込み
     */
    const response = await fetch(
      'https://mierune.github.io/rekichizu-style/styles/street/style.json',
    )
    const rekichizuStyle = await response.json()
    const styles: { [key: string]: maplibregl.StyleSpecification } = {
      ...initialStyles,
      rekichizu: rekichizuStyle,
    }
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

    /**
     * カスタムソースおよびカスタムレイヤーを追加
     */
    Object.keys(styles).forEach((key) => {
      styles[key].sources = { ...styles[key].sources, ...customSources, ...otherSources }
      styles[key].layers = [
        ...styles[key].layers,
        ...customLayers,
        ...(otherLayers as maplibregl.LayerSpecification[]),
      ]
    })

    setStyles(styles)
  }

  const onMapLoad = async (mapInstance: maplibregl.Map) => {
    const geojson = await fetch('./tokyo_ks.geojson').then((res) => res.json())

    // GeoJSON内の各ポイントについて画像を動的にロード
    const uniqueIcons = new Array<string>()
    geojson.features.forEach((feature: GeoJSON.Feature<GeoJSON.Geometry, { icon?: string }>) => {
      if (feature.properties && feature.properties.icon) {
        uniqueIcons.push(feature.properties.icon)
      }
    })

    // 各アイコン画像を事前にロードしてマップに追加
    for (const icon of uniqueIcons) {
      if (mapInstance && !mapInstance.hasImage(icon)) {
        const response = await fetch(icon)
        const blob = await response.blob()
        const imageBitmap = await createImageBitmap(blob)
        mapInstance.addImage(icon, imageBitmap)
      }
    }
    for (const property in properties) {
      const imageUrl = properties[property].images[0].image
      if (mapInstance && !mapInstance.hasImage(imageUrl)) {
        const response = await fetch(imageUrl)
        const blob = await response.blob()
        const imageBitmap = await createImageBitmap(blob)
        mapInstance.addImage(imageUrl, imageBitmap)
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

      console.log('click', id)
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
    if (!mapContainer.current) return
    loadStyles()
  }, [])

  useEffect(() => {
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

    setMap(mapInstance)

    return () => mapInstance.remove()
  }, [styles, properties])

  const switchStyle = (styleKey: 'osm' | 'konjaku' | 'rekichizu') => {
    if (map) {
      map.setStyle(styles[styleKey])
    }
  }

  return (
    <>
      <div ref={mapContainer} style={{ width: '100wh', height: '100vh' }}>
        <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}>
          <button onClick={() => switchStyle('osm')}>OpenStreetMap</button>
          {/**
         * CORSの問題を解消できるまで、今昔マップのスタイルはコメントアウト
        <button onClick={() => switchStyle('konjaku')}>今昔マップ</button>
         */}
          <button onClick={() => switchStyle('rekichizu')}>れきちず</button>
        </div>
      </div>
    </>
  )
}

export default Map3D
