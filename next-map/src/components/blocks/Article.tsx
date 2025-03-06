import React, { FC, useState, useEffect } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useInView } from 'react-intersection-observer'
import { ThreeCanvas } from '@/components/blocks/ThreeCanvas'
import { v4 as uuidv4 } from 'uuid'

const HtmlRenderer = dynamic(() => import('@/components/helpers/html_renderer'), { ssr: false })

const ArticleContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto 1rem;
  padding: 1rem;
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  background-color: #ffffff;

  &:last-child {
    margin-bottom: 0;
  }

  @media (min-width: 768px) {
    flex-direction: column;
  }
`

const ContentWrapper = styled.div`
  flex: 1;
`

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`

const ImagesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
`

const ImageWrapper = styled.div`
  position: relative;
  width: calc(50% - 0.5rem);
  height: 150px;

  @media (min-width: 768px) {
    width: calc(25% - 0.75rem);
    height: 200px;
  }
`

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
`

const Description = styled.div`
  font-size: 1rem;
  margin-bottom: 1rem;
`

const StyledLink = styled(Link)`
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #0070f3;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 1rem;
`

interface ArticleProps {
  imageUrls: string[]
  title: string
  description: string
  linkHref: string
  linkText: string
  movieId: number
}

const Article: FC<ArticleProps> = ({ imageUrls, title, description, linkHref, linkText, movieId }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const [canvasKey] = useState(() => uuidv4())

  return (
    <ArticleContainer>
      <ContentWrapper>
        <Title>{title}</Title>
        <ImagesWrapper>
          {imageUrls.slice(0, 4).map((url, index) => (
            <ImageWrapper key={index}>
              <Image
                src={url ?? '/img/noimage.png'}
                alt={`${title} - image ${index + 1}`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </ImageWrapper>
          ))}
        </ImagesWrapper>
        <Description>
          <HtmlRenderer htmlContent={description} />
        </Description>
        <div ref={ref}>
          {inView && <ThreeCanvas key={canvasKey} id={movieId} />}
        </div>
        <StyledLink href={linkHref} target="_blank">
          {linkText}
        </StyledLink>
      </ContentWrapper>
    </ArticleContainer>
  )
}

export default Article
