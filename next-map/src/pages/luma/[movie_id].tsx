import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import { LayoutWithFooter } from '@/components/layouts/Layout'
import { ThreeCanvas } from '@/components/blocks/ThreeCanvas'

const Loading: React.FC = () => {
  return <div>Loading...</div>
}

const Luma: NextPage = () => {
  const router = useRouter()
  const { movie_id } = router.query
  const id = Number(movie_id)
  console.log('movie_id', movie_id)

  return (
    <LayoutWithFooter>
      {!id ? <Loading /> : <ThreeCanvas id={id} />}
    </LayoutWithFooter>
  )
}

export default Luma
