import React from 'react'
import Image from 'next/image'

const Features: React.FC = () => {
  return (
    <>
      <h2 className="text-blue-600 text-xl font-semibold mb-4">OPEN3Dマップの特徴</h2>

      <div className="flex flex-col mb-10">
        <h3 className="text-blue-600 text-lg font-semibold mb-2">1. オープンデータのマッピング</h3>
        <p className="mb-4">
          私たちのサイトでは、地域の文化財情報をオープンデータとして自動的に地図上に表示します。これにより、ユーザーは地理的な位置関係や周辺情報を簡単に把握でき、訪問計画が立てやすくなります。
        </p>
        <Image
          src="/img/about_01.png"
          alt="オープンデータのマッピング"
          className="max-w-[60%] h-auto rounded border border-gray-300 mx-auto"
          width={600}
          height={400}
        />
      </div>

      <div className="flex flex-col mb-10">
        <h3 className="text-blue-600 text-lg font-semibold mb-2">
          2. 自動収集された画像とAIによる説明文
        </h3>
        <p className="mb-4">
          文化財の画像はインターネット上から自動的に収集され、AIによって生成された説明文が添えられています。これにより、各文化財についての詳細な情報を手軽に得ることができ、視覚的にも楽しむことができます。
        </p>
        <Image
          src="/img/about_02.png"
          alt="自動収集された画像とAIによる説明文"
          className="max-w-[60%] h-auto rounded border border-gray-300 mx-auto"
          width={600}
          height={400}
        />
      </div>

      <div className="flex flex-col mb-10">
        <h3 className="text-blue-600 text-lg font-semibold mb-2">3. ユーザー参加型の3Dモデル</h3>
        <p className="mb-4">
          ユーザーが作成した文化財の3Dモデルをウェブサイト内で閲覧することができます。この機能により、文化財の外観を360度確認できるだけでなく、ユーザー自身が文化財への理解を深めたり、新たな視点で楽しんだりすることができます。
        </p>
        <Image
          src="/img/about_03.png"
          alt="ユーザー参加型の3Dモデル"
          className="max-w-[60%] h-auto rounded border border-gray-300 mx-auto"
          width={600}
          height={400}
        />
      </div>
    </>
  )
}

export default Features
