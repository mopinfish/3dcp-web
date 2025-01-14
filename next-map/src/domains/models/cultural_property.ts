/**
{
"id": 131083000000,
"name": "貝漁及び鰻漁関連資料 9点",
"name_kana": "カイリョウオヨビウナギリョウカンレンシリョウ9テン",
"name_gener": null,
"name_en": null,
"category": "江東区登録文化財",
"type": "美術工芸",
"place_name": "江東区",
"address": "東京都江東区東陽4-11-28",
"latitude": 35.672793,
"longitude": 139.817322,
"url": "https://www.city.koto.lg.jp/103020/bunkasports/bunka/bunkazaisiseki/yuukeiminzoku/kairyou.html",
"note": null,
"geom": "SRID=6668;POINT (139.817322 35.672793)"
},
 */

export type CulturalProperty = {
  id: number
  name: string
  name_kana: string
  name_gener: string | null
  name_en: string | null
  category: string
  type: string
  place_name: string
  address: string
  latitude: number
  longitude: number
  url: string
  note: string | null
  geom: string
}

export type CulturalProperties = CulturalProperty[]
