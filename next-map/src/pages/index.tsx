import { GetServerSideProps } from 'next'
import React from 'react'
import { sql } from '@vercel/postgres'
import { LayoutWithFooter } from '@/components/layouts/Layout'
import Article from '@/components/blocks/Article'

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
  console.log(datasets)
  return (
    <LayoutWithFooter>
      <>
        <h1>OPEN3D Map</h1>
        <p>江東区の文化財一覧です。</p>
        <Article
          imageUrl="/img/cp_01.jpg"
          title="記事タイトル1"
          description="記事の説明1記事の説明1記事の説明1記事の説明1記事の説明1記事の説明1記事の説明1記事の説明1記事の説明1記事の説明1記事の説明1記事の説明1記事の説明1記事の説明1記事の説明1記事の説明1"
          linkHref="/article/1"
          linkText="記事を読む"
        />
        <Article
          imageUrl="/img/cp_01.jpg"
          title="記事タイトル2"
          description="記事の説明2記事の説明2記事の説明2記事の説明2記事の説明2記事の説明2記事の説明2記事の説明2記事の説明2記事の説明2記事の説明2記事の説明2記事の説明2記事の説明2記事の説明2記事の説明2"
          linkHref="/article/1"
          linkText="記事を読む"
        />
        <Article
          imageUrl="/img/cp_01.jpg"
          title="記事タイトル3"
          description="記事の説明3記事の説明3記事の説明3記事の説明3記事の説明3記事の説明3記事の説明3記事の説明3記事の説明3記事の説明3記事の説明3記事の説明3記事の説明3記事の説明3記事の説明3記事の説明3"
          linkHref="/article/1"
          linkText="記事を読む"
        />
        <Article
          imageUrl="/img/cp_01.jpg"
          title="記事タイトル4"
          description="記事の説明4記事の説明4記事の説明4記事の説明4記事の説明4記事の説明4記事の説明4記事の説明4記事の説明4記事の説明4記事の説明4記事の説明4記事の説明4記事の説明4記事の説明4記事の説明4"
          linkHref="/article/1"
          linkText="記事を読む"
        />
        <Article
          imageUrl="/img/cp_01.jpg"
          title="記事タイトル5"
          description="記事の説明5記事の説明5記事の説明5記事の説明5記事の説明5記事の説明5記事の説明5記事の説明5記事の説明5記事の説明5記事の説明5記事の説明5記事の説明5記事の説明5記事の説明5記事の説明5"
          linkHref="/article/1"
          linkText="記事を読む"
        />
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
