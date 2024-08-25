import { Global, css } from '@emotion/react'
import { GetServerSideProps, NextPage } from 'next'
import React from 'react'
import { sql } from '@vercel/postgres'

import Map from '../components/Map'

interface Dataset {
  id: number
  name: string
  description: string
  file_name: string
}

interface HomeProps {
  datasets: Dataset[]
}

const Home = ({ datasets }: HomeProps) => {
  return (
    <>
      <Global
        styles={css`
          html,
          body,
          #__next {
            width: 100%;
            height: 100%;
            margin: 0;
          }
        `}
      />
      <h1>OPEN3D Map</h1>
      {datasets.map((dataset) => (
        <div key={dataset.id}>
          <h2>{dataset.name}</h2>
          <p>{dataset.description}</p>
        </div>
      ))}
      <Map />
    </>
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
