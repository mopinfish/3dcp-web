import React from 'react'
import styled from 'styled-components'

const Subtitle = styled.h2`
  color: #2980b9;
`

const FeatureSection = styled.div`
  margin-bottom: 40px;
`

const FeatureTitle = styled.h3`
  color: #2980b9;
`

const FeatureImage = styled.img`
  max-width: 100%;
  height: auto;
`

const Features: React.FC = () => {
  return (
    <>
      <Subtitle>OPEN3Dマップの特徴</Subtitle>

      <FeatureSection>
        <FeatureTitle>1. オープンデータのマッピング</FeatureTitle>
        <p>
          私たちのサイトでは、地域の文化財情報をオープンデータとして自動的に地図上に表示します。これにより、ユーザーは地理的な位置関係や周辺情報を簡単に把握でき、訪問計画が立てやすくなります。
        </p>
        <FeatureImage src="/img/about_01.png" alt="オープンデータのマッピング" />
      </FeatureSection>

      <FeatureSection>
        <FeatureTitle>2. 自動収集された画像とAIによる説明文</FeatureTitle>
        <p>
          文化財の画像はインターネット上から自動的に収集され、AIによって生成された説明文が添えられています。これにより、各文化財についての詳細な情報を手軽に得ることができ、視覚的にも楽しむことができます。
        </p>
        <FeatureImage src="/img/about_02.png" alt="自動収集された画像とAIによる説明文" />
      </FeatureSection>

      <FeatureSection>
        <FeatureTitle>3. ユーザー参加型の3Dモデル</FeatureTitle>
        <p>
          ユーザーが作成した文化財の3Dモデルをウェブサイト内で閲覧することができます。この機能により、文化財の外観を360度確認できるだけでなく、ユーザー自身が文化財への理解を深めたり、新たな視点で楽しんだりすることができます。
        </p>
        <FeatureImage src="/img/about_03.png" alt="ユーザー参加型の3Dモデル" />
      </FeatureSection>
    </>
  )
}

export default Features
