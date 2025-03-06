import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { cultural_property as culturalPropertyService, tag as tagService } from '@/domains/services'
import { CulturalProperties, Tag } from '@/domains/models'

const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 20px;
`

const SearchButton = styled.button`
  padding: 12px 20px;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`

const TagList = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 10px;
`

const TagButton = styled.button`
  padding: 8px 15px;
  font-size: 0.9rem;
  border: 1px solid #007bff;
  background-color: white;
  color: #007bff;
  border-radius: 20px;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;

  &:hover {
    background-color: #007bff;
    color: white;
  }
`

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  margin: 15px 0 10px;
  color: #333;
`

const SearchConditionTab = ({
  onUpdateProperties,
}: {
  onUpdateProperties: (properties: CulturalProperties) => void
}) => {
  const [tags, setTags] = useState<Tag[]>([])

  useEffect(() => {
    // タグ一覧を取得
    const fetchTags = async () => {
      const fetchedTags = await tagService.getTags()
      setTags(fetchedTags)
    }
    fetchTags()
  }, [])

  // GPS から現在地を取得し、文化財を検索
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

  // タグで文化財を検索
  const handleSearchByTag = async (tagId: number) => {
    const properties = await culturalPropertyService.getPropertiesByTag(tagId)
    onUpdateProperties(properties)
  }

  return (
    <TabContainer>
      {/* 現在地から探す */}
      <SearchButton onClick={handleSearchByLocation}>現在地から探す</SearchButton>

      {/* タグから探す */}
      <SectionTitle>タグから探す</SectionTitle>
      <TagList>
        {tags.map((tag) => (
          <TagButton key={tag.id} onClick={() => handleSearchByTag(tag.id)}>
            {tag.name}
          </TagButton>
        ))}
      </TagList>
    </TabContainer>
  )
}

export default SearchConditionTab
