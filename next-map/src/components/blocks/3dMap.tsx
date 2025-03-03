import React, { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const Map3D = () => {
  const mapContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    const style: maplibregl.StyleSpecification = {
      version: 8,
      sources: {
        osm: {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        },
        plateau: {
          type: 'vector',
          tiles: [
            'https://indigo-lab.github.io/plateau-tokyo23ku-building-mvt-2020/{z}/{x}/{y}.pbf',
          ],
          minzoom: 10,
          maxzoom: 16,
          attribution:
            "データの出典:<a href='https://github.com/indigo-lab/plateau-tokyo23ku-building-mvt-2020'>plateau-tokyo23ku-building-mvt-2020 by indigo-lab</a> (<a href='https://www.mlit.go.jp/plateau/'>国土交通省 Project PLATEAU</a> のデータを加工して作成)",
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
        {
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
        },
      ],
    }

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: style,
      center: [139.745461, 35.65856],
      zoom: 14,
      pitch: 45,
      maxPitch: 85,
    })

    map.addControl(new maplibregl.NavigationControl())

    const popup = new maplibregl.Popup({
      offset: 25,
      closeButton: false,
    }).setText('渋谷ヒカリエ')

    new maplibregl.Marker().setLngLat([139.70356, 35.65901]).setPopup(popup).addTo(map)

    map.on('load', async () => {
      const response = await fetch('./img/icon.png')
      const blob = await response.blob()
      const iconImage = await createImageBitmap(blob)
      map.addImage('facility_icon', iconImage as ImageBitmap)
      map.addSource('facility_point', {
        type: 'geojson',
        data: './tokyo_ks.geojson',
      })
      map.addLayer({
        id: 'facility_point',
        type: 'symbol',
        source: 'facility_point',
        layout: {
          'icon-image': 'facility_icon',
          'icon-size': 0.1,
        },
      })
    })

    map.on('click', 'facility_point', (e) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0]
        const coordinates: [number, number] =
          feature.geometry.type === 'Point'
            ? ((feature.geometry as GeoJSON.Point).coordinates.slice(0, 2) as [number, number])
            : [0, 0]

        const name = feature.properties?.P12_001 || 'No name'

        new maplibregl.Popup().setLngLat(coordinates).setHTML(`<h3>${name}</h3>`).addTo(map)
      }
    })

    map.on('mouseenter', 'facility_point', () => {
      map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mouseleave', 'facility_point', () => {
      map.getCanvas().style.cursor = ''
    })

    return () => map.remove()
  }, [])

  return (
    <div ref={mapContainer} style={{ position: 'absolute', top: 0, bottom: 0, width: '100%' }} />
  )
}

export default Map3D