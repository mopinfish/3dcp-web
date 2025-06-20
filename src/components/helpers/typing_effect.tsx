import React, { useEffect, useRef, useState, FC } from 'react'

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

    const node = targetRef.current
    if (node) {
      observer.observe(node)
    }

    return () => {
      if (node) {
        observer.unobserve(node)
      }
    }
  }, [options])

  return [targetRef, isIntersecting] as const
}

interface TypingEffectProps {
  text: string
  speed?: number
}

export const TypingEffect: FC<TypingEffectProps> = ({ text, speed = 50 }) => {
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
