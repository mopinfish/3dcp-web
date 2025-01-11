import React, { FC } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import Link from 'next/link'

const ArticleContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  background-color: #ffffff;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`


const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    width: 200px;
    height: 200px;
    margin-bottom: 0;
    margin-right: 2rem;
  }
`

const ContentWrapper = styled.div`
  flex: 1;
`

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`

const Description = styled.p`
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
  imageUrl: string
  title: string
  description: string
  linkHref: string
  linkText: string
}

const Article: FC<ArticleProps> = ({ imageUrl, title, description, linkHref, linkText }) => {
  return (
    <ArticleContainer>
      <ImageWrapper>
        <Image src={imageUrl} alt={title} fill objectFit="contain" />
      </ImageWrapper>
      <ContentWrapper>
        <Title>{title}</Title>
        <Description>{description}</Description>
        <StyledLink href={linkHref}>{linkText}</StyledLink>
      </ContentWrapper>
    </ArticleContainer>
  )
}

export default Article
