import React, { useEffect, useRef, useState, FC } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import Link from 'next/link'

interface IntersectionObserverOptions {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
}

function useIntersectionObserver(options: IntersectionObserverOptions = {}) {
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false)
  const targetRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]: IntersectionObserverEntry[]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    if (targetRef.current) {
      observer.observe(targetRef.current)
    }

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current)
      }
    }
  }, [options])

  return [targetRef, isIntersecting] as const
}

interface TypingEffectProps {
  text: string
  speed?: number
}

const TypingEffect: FC<TypingEffectProps> = ({ text, speed = 50 }) => {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1, // 10%が表示されたらイベントを発火
  })
  const [displayedText, setDisplayedText] = useState<string>('')
  const [index, setIndex] = useState<number>(0)

  useEffect(() => {
    if (isVisible) {
      console.log('コンポーネントが表示領域に入りました')

      if (index < text.length) {
        const timer = setTimeout(() => {
          setDisplayedText((prevText: string) => prevText + text[index])
          setIndex((prevIndex: number) => prevIndex + 1)
        }, speed)

        return () => clearTimeout(timer)
      }
    }
  }, [isVisible, index, text, speed])

  return <span ref={ref}>{displayedText}</span>
}

const ArticleContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto 1rem;
  margin-bottom:last-child: 0;
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
        <Description>
          <TypingEffect text={description} />
        </Description>
        <StyledLink href={linkHref}>{linkText}</StyledLink>
      </ContentWrapper>
    </ArticleContainer>
  )
}

export default Article
