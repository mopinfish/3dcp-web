'use client'

import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import React from 'react'
import { CulturalProperties } from '@/domains/models/cultural_property'

type MapProps = { properties: CulturalProperties }

export default function Map({ properties }: MapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const [selectedProperties, setSelectedProperties] = useState<CulturalProperties>([])
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null)

  useEffect(() => {
    if (!mapContainer.current || properties.length === 0) return
    // GeoJSON フィーチャーコレクションに変換
    const geojsonData: GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties> = {
      type: 'FeatureCollection',
      features: properties.map((item) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [item.longitude, item.latitude] },
        properties: {
          id: item.id,
          name: item.name,
          address: item.address,
          movies: item.movies,
          images: item.images,
          icon: selectedProperties.some((p) => p.id === item.id)
            ? 'selected_property_icon'
            : 'property_icon',
        },
      })),
    }
    // 文化財のレイヤー追加
    if (map.current) {
      // 文化財のデータをソースに追加
      if (map.current.getSource('cultural-properties')) {
        map.current.removeLayer('cultural_properties')
        map.current.removeSource('cultural-properties')
      }
      if (!map.current.getSource('cultural-properties')) {
        map.current.addSource('cultural-properties', {
          type: 'geojson',
          data: geojsonData || { type: 'FeatureCollection', features: [] },
        })
        // 文化財のレイヤー追加
        map.current.addLayer({
          id: 'cultural_properties',
          type: 'symbol',
          source: 'cultural-properties',
          layout: { 'icon-image': ['get', 'icon'], 'icon-size': 0.2 },
        })
      }
    }
  }, [properties, selectedProperties])

  useEffect(() => {
    if (!mapContainer.current || properties.length === 0) return

    const initialCenter: [number, number] = [139.79667139325397, 35.71489576634944]
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
          },
        },
        layers: [
          { id: 'simple-tiles', type: 'raster', source: 'raster-tiles', minzoom: 0, maxzoom: 22 },
        ],
      },
      center: initialCenter,
      zoom: 13,
    })

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right')

    map.current.on('load', async () => {
      if (!map.current) return

      // マーカー画像の読み込み
      const image = await map.current.loadImage('/img/marker_icon.png')
      map.current.addImage('property_icon', image.data)
      const selectedImage = await map.current.loadImage('/img/selected_marker_icon.png')
      map.current.addImage('selected_property_icon', selectedImage.data)
    })

    // クリックで地物を選択
    console.log('add event handler')
    map.current.on('click', 'cultural_properties', (event) => {
      if (!event.features) return
      const feature = event.features[0]
      const id = feature.properties?.id

      if (!id) return

      setSelectedProperties((prev) => {
        const exists = prev.some((p) => p.id === id)
        return exists
          ? prev.filter((p) => p.id !== id)
          : [...prev, properties.find((p) => p.id === id)!]
      })
    })

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [properties])

  // 現在地取得
  const handleGetCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      alert('このブラウザは位置情報をサポートしていません')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setCurrentLocation([longitude, latitude])

        // 現在地マーカーを追加
        if (map.current) {
          new maplibregl.Marker({ color: 'red' })
            .setLngLat([longitude, latitude])
            .addTo(map.current)
        }
      },
      (error) => {
        console.error('現在地取得失敗:', error)
      },
    )
  }

  // ルート表示
  const handleShowRoute = async () => {
    if (!currentLocation || selectedProperties.length === 0) {
      alert('現在地と目的地を選択してください')
      return
    }

    // 現在地から近い順にソート
    const sortedProperties = [...selectedProperties].sort(
      (a, b) =>
        Math.hypot(a.longitude - currentLocation[0], a.latitude - currentLocation[1]) -
        Math.hypot(b.longitude - currentLocation[0], b.latitude - currentLocation[1]),
    )

    // OSRM ルート検索用の座標リスト（現在地 + 選択地物）
    const coordinates = [
      [...currentLocation], // 現在地をスタート地点とする
      ...sortedProperties.map((p) => [p.longitude, p.latitude]),
    ]

    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coordinates
      .map((c) => c.join(','))
      .join(';')}?overview=full&geometries=geojson`

    try {
      const response = await fetch(osrmUrl)
      const data = await response.json()
      const route = data.routes[0]?.geometry

      if (route && map.current) {
        if (map.current.getSource('route')) {
          const source = map.current.getSource('route') as maplibregl.GeoJSONSource
          source.setData({ type: 'Feature', geometry: route, properties: {} })
        } else {
          map.current.addSource('route', {
            type: 'geojson',
            data: { type: 'Feature', geometry: route, properties: {} },
          })

          map.current.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {},
            paint: { 'line-color': '#FF5733', 'line-width': 5 },
          })
        }
      }
    } catch (error) {
      console.error('ルート取得失敗:', error)
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}>
        <button onClick={handleGetCurrentLocation} style={{ padding: '10px', marginRight: '10px' }}>
          現在地取得
        </button>
        <button onClick={handleShowRoute} style={{ padding: '10px' }}>
          ルート表示
        </button>
      </div>
      <div ref={mapContainer} style={{ width: '100vw', height: '100vh' }} />
    </div>
  )
}
