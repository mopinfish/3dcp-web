import { GetServerSideProps } from 'next'
import React from 'react'
import { sql } from '@vercel/postgres'

import Map from '../components/Map'
import { LayoutWithFooter } from '@/components/layouts/Layout'

interface Dataset {
  id: number
  name: string
  description: string
  file_name: string
}

interface MapScreenProps {
  datasets: Dataset[]
}

const MapScreen = ({ datasets }: MapScreenProps) => {
  return (
    <LayoutWithFooter>
      <>
        {datasets.map((dataset) => (
          <div key={dataset.id}>
            <h2>{dataset.name}</h2>
            <p>{dataset.description}</p>
          </div>
        ))}
        <Map />
      </>
    </LayoutWithFooter>
  )
}

export default MapScreen

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
