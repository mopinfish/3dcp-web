const style = {
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
      tiles: ['https://indigo-lab.github.io/plateau-tokyo23ku-building-mvt-2020/{z}/{x}/{y}.pbf'],
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
  container: 'map',
  style: style,
  center: [139.745461, 35.65856],
  zoom: 14,
  pitch: 45,
  maxPitch: 85,
})

map.addControl(new maplibregl.NavigationControl())

var popup = new maplibregl.Popup({
  offset: 25, // ポップアップの位置
  closeButton: false, // 閉じるボタンの表示
}).setText('渋谷ヒカリエ')

var marker = new maplibregl.Marker().setLngLat([139.70356, 35.65901]).setPopup(popup).addTo(map)

// ポイントデータを表示する
map.on('load', async () => {
  const iconImage = await map.loadImage('./img/icon.png')
  console.log('--------------------------------')
  console.log(iconImage)
  console.log('--------------------------------')
  map.addImage('facility_icon', iconImage.data)
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
