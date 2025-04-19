import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { LayoutWithFooter } from '@/components/layouts/Layout'
import { Movie } from '@/domains/models'

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #333;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`

const Card = styled.div`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  background-color: #fff;

  &:hover {
    transform: translateY(-5px);
  }
`

const CardContent = styled.div`
  padding: 1rem;
`

const CardTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
`

const CardNote = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`

const ViewButton = styled.a`
  display: inline-block;
  background-color: #0070f3;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0051a8;
  }
`

const ThumbnailContainer = styled.div`
  width: 100%;
  height: 200px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &::after {
    content: '3D';
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
  }
`

const ExternalLink = styled.a`
  display: inline-block;
  background-color: #6b7280;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s ease;
  margin-left: 0.5rem;

  &:hover {
    background-color: #4b5563;
  }
`

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`

const LumaList: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [thumbnails, setThumbnails] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        // 映画データを読み込む
        const movieResponse = await fetch('/data/luma-movies.json')
        if (!movieResponse.ok) {
          throw new Error('Failed to fetch movies')
        }
        const movieData = await movieResponse.json()
        setMovies(movieData)
        
        // サムネイルデータを読み込む
        try {
          const thumbnailResponse = await fetch('/thumbnails/thumbnails.json')
          if (thumbnailResponse.ok) {
            const thumbnailData = await thumbnailResponse.json()
            
            // movieIdをキーとしたサムネイル画像URLのマップを作成
            const thumbnailMap: Record<number, string> = {}
            thumbnailData.forEach((thumbnail: any) => {
              thumbnailMap[thumbnail.movieId] = thumbnail.imageUrl
            })
            
            setThumbnails(thumbnailMap)
          }
        } catch (thumbnailError) {
          console.error('Error loading thumbnails:', thumbnailError)
          // サムネイル読み込みに失敗してもアプリは継続する
        }
      } catch (error) {
        console.error('Error loading movies:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <LayoutWithFooter>
        <Container>
          <Title>Loading...</Title>
        </Container>
      </LayoutWithFooter>
    )
  }

  return (
    <LayoutWithFooter>
      <Container>
        <Title>Luma.ai 3Dモデルリスト</Title>
        <Grid>
          {movies.map((movie) => (
            <Card key={movie.id}>
              <ThumbnailContainer>
                {thumbnails[movie.id] ? (
                  <img src={thumbnails[movie.id]} alt={movie.title} />
                ) : (
                  <span>{movie.title}</span>
                )}
              </ThumbnailContainer>
              <CardContent>
                <CardTitle>{movie.title}</CardTitle>
                <CardNote>{movie.note}</CardNote>
                <ButtonContainer>
                  <Link href={`/luma/${movie.id}`} passHref>
                    <ViewButton>3Dモデルを見る</ViewButton>
                  </Link>
                  <ExternalLink href={movie.url} target="_blank" rel="noopener noreferrer">
                    Luma.aiで見る
                  </ExternalLink>
                </ButtonContainer>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Container>
    </LayoutWithFooter>
  )
}

export default LumaList 