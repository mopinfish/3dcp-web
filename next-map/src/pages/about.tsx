import React from 'react'
import styled from 'styled-components'
import { LayoutWithFooter } from '@/components/layouts/Layout'
import Features from '@/components/blocks/Features'

const Container = styled.div`
  font-family: Arial, sans-serif;
  line-height: 1.6;
  margin: 20px;
`

const Title = styled.h1`
  color: #2c3e50;
`

const Subtitle = styled.h2`
  color: #2980b9;
`

const About: React.FC = () => {
  return (
    <LayoutWithFooter>
      <Container>
        <Title>私たちの使命</Title>
        <p>
          私たちのウェブサイトは、地域の文化財を広く紹介し、次世代にその価値を伝えることを目的としています。文化財は私たちの歴史や文化を反映する重要な資源であり、その魅力を多くの人々に知ってもらうために、革新的な技術を活用しています。
        </p>

        <Features />

        <Subtitle>未来への展望</Subtitle>
        <p>
          私たちは、このウェブサイトを通じて地域の文化財への関心を高め、多くの人々がその魅力を体験できる場を提供していきます。今後も技術革新を続けながら、より多くの文化財情報を収集・発信し、地域コミュニティとの連携を深めていく所存です。
        </p>

        <Subtitle>参加しよう</Subtitle>
        <p>
          私たちのプロジェクトは、皆様の参加によって成り立っています。ぜひ、あなた自身の文化財やその思い出を共有し、一緒にこの素晴らしい資源を育てていきましょう。あなたの声が、新しい発見につながるかもしれません。
        </p>
      </Container>
    </LayoutWithFooter>
  )
}

export default About
