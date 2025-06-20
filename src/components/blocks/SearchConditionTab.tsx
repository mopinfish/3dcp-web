import React, { useEffect, useState } from 'react'
import { cultural_property as culturalPropertyService, tag as tagService } from '@/domains/services'
import { CulturalProperties, Tag } from '@/domains/models'

const SearchConditionTab = ({
  onUpdateProperties,
}: {
  onUpdateProperties: (properties: CulturalProperties) => void
}) => {
  const [tags, setTags] = useState<Tag[]>([])

  useEffect(() => {
    const fetchTags = async () => {
      const fetchedTags = await tagService.getTags()
      setTags(fetchedTags)
    }
    fetchTags()
  }, [])

  const handleSearchByLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          const properties = await culturalPropertyService.getPropertiesByLocation(
            latitude,
            longitude,
            3000,
          )
          onUpdateProperties(properties)
        },
        (error) => {
          console.error('位置情報の取得に失敗しました:', error)
        },
      )
    } else {
      console.error('このブラウザはGPSをサポートしていません')
    }
  }

  const handleSearchByTag = async (tagId: number) => {
    const properties = await culturalPropertyService.getPropertiesByTag(tagId)
    onUpdateProperties(properties)
  }

  return (
    <div className="flex flex-col items-center py-4 border-b border-gray-300 mb-5">
      <button
        onClick={handleSearchByLocation}
        className="px-5 py-3 text-base bg-blue-600 text-white rounded-md hover:bg-blue-800 transition"
      >
        現在地から探す
      </button>

      <h3 className="text-lg font-bold text-gray-800 mt-4 mb-2">タグから探す</h3>

      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => handleSearchByTag(tag.id)}
            className="px-4 py-2 text-sm border border-blue-600 text-blue-600 bg-white rounded-full hover:bg-blue-600 hover:text-white transition"
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SearchConditionTab
