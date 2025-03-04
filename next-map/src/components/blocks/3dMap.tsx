import React, { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { CulturalProperties } from '@/domains/models'

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
const facilityPointSource: maplibregl.GeoJSONSourceSpecification = {
  type: 'geojson',
  data: './tokyo_ks.geojson',
}
const facilityPointLayer: maplibregl.SymbolLayerSpecification = {
  id: 'facility_point',
  type: 'symbol',
  source: 'facility_point',
  layout: {
    'icon-image': ['get', 'icon'], // GeoJSON内の`icon`プロパティを参照
    'icon-size': 0.2,
  },
  paint: {
    'icon-halo-width': 2,
    'icon-halo-color': '#fff',
    'icon-halo-blur': 1,
    'icon-translate': [0, -2],
    'icon-translate-anchor': 'viewport',
    'icon-opacity': 0.9,
  },
}
const customSources: { [key: string]: maplibregl.SourceSpecification } = {
  plateau: plateauSource,
  facility_point: facilityPointSource,
}
const customLayers: maplibregl.LayerSpecification[] = [plateauLayer, facilityPointLayer]
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
    /**
        // ソースを追加
        map.current.addSource('cultural-properties', {
          type: 'geojson',
          data: geojsonData,
        })

        // ポイントを表示するレイヤーの追加
        map.current.addLayer({
          id: 'cultural_properties',
          type: 'symbol',
          source: 'cultural-properties',
          layout: {
            'icon-image': 'property_icon',
            'icon-size': 0.2,
          },
        })
    */

    /**
     * カスタムソースおよびカスタムレイヤーを追加
     */
    Object.keys(styles).forEach((key) => {
      styles[key].sources = { ...styles[key].sources, ...customSources }
      styles[key].layers = [...styles[key].layers, ...customLayers]
      console.log(key)
      console.log(styles[key])
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

    console.log('すべてのアイコンがロードされました')
  }
  const onClickFacilityPoint = (mapInstance: maplibregl.Map, e: maplibregl.MapLayerMouseEvent) => {
    if (e.features && e.features.length > 0) {
      const feature = e.features[0]
      const coordinates: [number, number] =
        feature.geometry.type === 'Point'
          ? ((feature.geometry as GeoJSON.Point).coordinates.slice(0, 2) as [number, number])
          : [0, 0]

      const name = feature.properties?.P12_001 || 'No name'

      new maplibregl.Popup().setLngLat(coordinates).setHTML(`<h3>${name}</h3>`).addTo(map)
    }
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
      center: [139.745461, 35.65856],
      zoom: 14,
      pitch: 45,
      maxPitch: 85,
    })
    mapInstance.addControl(new maplibregl.NavigationControl())

    mapInstance.on('load', () => {
      onMapLoad(mapInstance)
    })
    mapInstance.on('mouseenter', 'facility_point', () => {
      mapInstance.getCanvas().style.cursor = 'pointer'
    })
    mapInstance.on('mouseleave', 'facility_point', () => {
      mapInstance.getCanvas().style.cursor = ''
    })
    mapInstance.on('click', 'facility_point', (e) => {
      onClickFacilityPoint(mapInstance, e)
    })

    setMap(mapInstance)

    return () => mapInstance.remove()
  }, [styles])

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
