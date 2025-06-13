import React, { FC, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useInView } from 'react-intersection-observer'
import { ThreeCanvas } from '@/components/blocks/ThreeCanvas'
import { v4 as uuidv4 } from 'uuid'

const HtmlRenderer = dynamic(() => import('@/components/helpers/html_renderer'), { ssr: false })

interface ArticleProps {
  imageUrls: string[]
  title: string
  description: string
  linkHref: string
  linkText: string
  movieId: number
}

const Article: FC<ArticleProps> = ({
  imageUrls,
  title,
  description,
  linkHref,
  linkText,
  movieId,
}) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const [canvasKey] = useState(() => uuidv4())

  return (
    <div className="flex flex-col max-w-3xl mx-auto mb-4 p-4 shadow-md rounded-lg bg-white last:mb-0">
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <div className="w-full mb-4">
          <div ref={ref}>{inView && <ThreeCanvas key={canvasKey} id={movieId} />}</div>
          <Link
            href={linkHref}
            target="_blank"
            className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded text-base hover:bg-blue-800 transition"
          >
            {linkText}
          </Link>
        </div>
        <div className="flex flex-wrap gap-4 mb-4">
          {imageUrls.slice(0, 4).map((url, index) => (
            <div
              key={index}
              className="relative w-[calc(50%-0.5rem)] h-[150px] md:w-[calc(25%-0.75rem)] md:h-[200px]"
            >
              <img
                src={url ?? '/img/noimage.png'}
                alt={`${title} - image ${index + 1}`}
                className="w-full h-full object-cover rounded"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
        <div className="text-base mb-4">
          <HtmlRenderer htmlContent={description} />
        </div>
      </div>
    </div>
  )
}

export default Article
