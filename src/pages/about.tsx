import React from 'react'
import { LayoutWithFooter } from '@/components/layouts/Layout'
import Features from '@/components/blocks/Features'

const About: React.FC = () => {
  return (
    <LayoutWithFooter>
      <div className="font-sans leading-relaxed m-5">
        <h1 className="text-gray-800 text-2xl font-bold mb-4">私たちの使命</h1>
        <p className="mb-6">
          私たちのウェブサイトは、地域の文化財を広く紹介し、次世代にその価値を伝えることを目的としています。文化財は私たちの歴史や文化を反映する重要な資源であり、その魅力を多くの人々に知ってもらうために、革新的な技術を活用しています。
        </p>

        <Features />

        <h2 className="text-blue-600 text-xl font-semibold mt-8 mb-2">未来への展望</h2>
        <p className="mb-6">
          私たちは、このウェブサイトを通じて地域の文化財への関心を高め、多くの人々がその魅力を体験できる場を提供していきます。今後も技術革新を続けながら、より多くの文化財情報を収集・発信し、地域コミュニティとの連携を深めていく所存です。
        </p>

        <h2 className="text-blue-600 text-xl font-semibold mt-8 mb-2">参加しよう</h2>
        <p>
          私たちのプロジェクトは、皆様の参加によって成り立っています。ぜひ、あなた自身の文化財やその思い出を共有し、一緒にこの素晴らしい資源を育てていきましょう。あなたの声が、新しい発見につながるかもしれません。
        </p>
      </div>
    </LayoutWithFooter>
  )
}

export default About
