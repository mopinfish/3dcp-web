import React, { useEffect, useState } from 'react'
import { LayoutWithFooter } from '@/components/layouts/Layout'
import Article from '@/components/blocks/Article'
import { cultural_property as culturalPropertyService } from '@/domains/services'
import { CulturalProperties } from '@/domains/models/cultural_property'
import NavigationTab from '@/components/blocks/NavigationTab'
import TranslationButton from '@/components/blocks/TranslationButton'
import SearchConditionTab from '@/components/blocks/SearchConditionTab'

const Home = () => {
  const [properties, setProperties] = useState<CulturalProperties>([])

  useEffect(() => {
    const fetchData = async () => {
      const properties = await culturalPropertyService.getProperties()
      setProperties(properties)
    }
    fetchData()
  }, [])

  return (
    <LayoutWithFooter>
      <NavigationTab />
      {/* 検索条件タブを追加 */}
      <SearchConditionTab onUpdateProperties={setProperties} />

      {properties.map((property) => (
        <Article
          key={property.id}
          imageUrls={property.images.map((image) => image.image)}
          title={property.name}
          description={property.note ?? ''}
          linkHref={`/luma/${property.movies[0]?.id}`}
          linkText="大きな画面で3Dモデルを見る"
          movieId={property.movies[0]?.id}
        />
      ))}

      {/* 右下固定の翻訳ボタン */}
      <TranslationButton />
    </LayoutWithFooter>
  )
}

export default Home
