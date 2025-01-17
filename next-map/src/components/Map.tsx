'use client'

import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import React from 'react'
import Link from 'next/link'
import { renderToStaticMarkup } from 'react-dom/server'
import { CulturalProperties } from '@/domains/models/cultural_property'

const PopupHtml: React.FC<{ name: string; url: string }> = ({ name, url }) => {
  return (
    <div>
      <Link href={url} rel="noopener noreferrer" target="_blank">
        {name}
      </Link>
      {/**
      <form id="popup-form">
        <label htmlFor="name">名前:</label>
        <input type="text" id="name" name="name" required />
        <button type="submit">送信</button>
      </form>
      */}
    </div>
  )
}

type MapProps = {
  properties: CulturalProperties
}

export default function Map({ properties }: MapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<maplibregl.Map | null>(null)

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
        movies: item.movies,
        // その他必要なプロパティを追加
      },
    })),
  }

  useEffect(() => {
    if (properties && mapContainer.current) {
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
        center: [139.7975443779719, 35.678396026551994],
        zoom: 13,
      })

      map.current.addControl(new maplibregl.NavigationControl(), 'top-right')
      map.current.on('load', async () => {
        if (map.current === null) return

        // 地図の読み込み完了後に実行
        const image = await map.current.loadImage('/img/marker_icon.png')
        map.current.addImage('property_icon', image.data)

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
      })

      map.current.on('click', 'cultural_properties', (event) => {
        if (event.features === undefined) return
        const feature = event.features[0]
        const coordinates = event.lngLat
        const property = feature.properties
        const name = property.name
        const movie = JSON.parse(property.movies)[0]
        const url = '/luma/' + movie.id

        // ポップアップを表示する
        new maplibregl.Popup({
          offset: 10, // ポップアップの位置
          closeButton: false, // 閉じるボタンの表示
        })
          .setLngLat(coordinates)
          .setHTML(renderToStaticMarkup(<PopupHtml name={name} url={url} />))
          .addTo(map.current!)
      })
    }

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [properties])

  return <div ref={mapContainer} style={{ width: '100wh', height: '100vh' }} />
}
