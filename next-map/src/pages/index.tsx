import { GetServerSideProps } from 'next'
import React, { useEffect, useState } from 'react'
import { sql } from '@vercel/postgres'
import { LayoutWithFooter } from '@/components/layouts/Layout'
import Article from '@/components/blocks/Article'
import { cultural_property as culturalPropertyService } from '@/domains/services'
import { CulturalProperties } from '@/domains/models/cultural_property'
import NavigationTab from '@/components/blocks/NavigationTab'

const Home = () => {
  const [properties, setProperties] = useState<CulturalProperties>([])

  const actions = {
    onload: async () => {
      const properties = await culturalPropertyService.getProperties()
      setProperties(properties)
    },
  }

  useEffect(() => {
    actions.onload()
  }, [])

  const imageUrls = ['/img/cp_01.jpg', '/img/cp_01.jpg', '/img/cp_01.jpg', '/img/cp_01.jpg']
  return (
    <LayoutWithFooter>
      <>
        <NavigationTab />
        {properties.map((property) => (
          <Article
            key={property.id}
            imageUrls={imageUrls}
            title={property.name}
            description={property.note ?? ''}
            linkHref={`/luma/${property.movies[0].id}`}
            linkText="3Dモデルを見る"
          />
        ))}
      </>
    </LayoutWithFooter>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const { rows } = await sql`SELECT * FROM open3d.datasets`

    return {
      props: {
        datasets: rows,
      },
    }
  } catch (error) {
    console.error('データベースクエリエラー:', error)
    return {
      props: {
        datasets: [],
      },
    }
  }
}
