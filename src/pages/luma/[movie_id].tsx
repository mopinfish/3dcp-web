import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { LayoutWithFooter } from '@/components/layouts/Layout'
import { ThreeCanvas } from '@/components/blocks/ThreeCanvas'

const Loading: React.FC = () => {
  return <div>Loading...</div>
}

const Luma: NextPage = () => {
  const router = useRouter()
  const [movieId, setMovieId] = useState<number | null>(null)
  
  useEffect(() => {
    if (router.isReady && router.query.movie_id) {
      const id = Number(router.query.movie_id)
      console.log('movie_id set to:', id)
      setMovieId(id)
    }
  }, [router.isReady, router.query.movie_id])

  if (!movieId) {
    return <LayoutWithFooter><Loading /></LayoutWithFooter>
  }
  
  return (
    <LayoutWithFooter>
      <ThreeCanvas id={movieId} fullPage={true} />
    </LayoutWithFooter>
  )
}

export default Luma
