'use client'

import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import React from 'react'

export default function Map() {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<maplibregl.Map | null>(null)

  useEffect(() => {
    if (map.current) return // マップが既に初期化されている場合は何もしない

    if (mapContainer.current) {
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
            {
              id: 'simple-tiles',
              type: 'raster',
              source: 'raster-tiles',
              minzoom: 0,
              maxzoom: 22,
            },
          ],
        },
        center: [139.767, 35.6814], // 東京の座標
        zoom: 11,
      })

      map.current.addControl(new maplibregl.NavigationControl(), 'top-right')
      map.current.on('load', async () => {
        if (map.current === null) return

        // 地図の読み込み完了後に実行
        const image = await map.current.loadImage('/img/property_icon.png')
        map.current.addImage('property_icon', image.data)

        // GeoJSONファイルを外部から読み込む
        map.current.addSource('cultural_properties', {
          type: 'geojson',
          data: '/data/koto_cultural_properties.geojson', // GeoJSONファイルへのパス
        })

        // ポイントを表示するレイヤーの追加
        map.current.addLayer({
          id: 'cultural_properties',
          type: 'symbol',
          source: 'cultural_properties',
          layout: {
            'icon-image': 'property_icon',
            'icon-size': 0.1,
          },
        })
      })

      map.current.on('click', 'cultural_properties', (event) => {
        if (event.features === undefined) return
        const feature = event.features[0]
        const coordinates = event.lngLat
        const name = feature.properties['名称']

        // ポップアップを表示する
        new maplibregl.Popup({
          offset: 10, // ポップアップの位置
          closeButton: false, // 閉じるボタンの表示
        })
          .setLngLat(coordinates)
          .setHTML(name)
          .addTo(map.current!)
      })
    }

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [])

  return <div ref={mapContainer} style={{ width: '100%', height: '400px' }} />
}
