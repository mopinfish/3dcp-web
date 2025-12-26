/**
 * howto.tsx
 * 
 * サイトの使い方を解説するHowtoページ
 * 機能ごとにタブで分けて詳細に解説
 * 
 * 機能:
 * - 文化財一覧とその検索
 * - 地図画面と検索
 * - 文化財登録・編集
 * - 3D画像（ムービー）登録・編集
 * - タグ登録・編集
 */

import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { LayoutWithFooter } from '@/components/layouts/Layout'

type TabId = 'search' | 'map' | 'register' | 'movie' | 'tag'

interface TabInfo {
  id: TabId
  label: string
  icon: React.ReactNode
}

const tabs: TabInfo[] = [
  {
    id: 'search',
    label: '文化財を探す',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    id: 'map',
    label: '地図で見る',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
  },
  {
    id: 'register',
    label: '文化財を登録',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    id: 'movie',
    label: '3Dモデルを登録',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'tag',
    label: 'タグを管理',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
]

/**
 * 画像プレースホルダーコンポーネント
 * 後で実際のスクリーンショットに差し替える
 */
const ImagePlaceholder: React.FC<{ alt: string; description: string }> = ({ alt, description }) => (
  <div className="relative bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
    <div className="aspect-video flex flex-col items-center justify-center p-8 text-center">
      <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p className="text-gray-500 font-medium mb-2">{alt}</p>
      {/* 差し替え指示コメント */}
      <p className="text-xs text-gray-400">
        【差し替え指示】{description}
      </p>
    </div>
  </div>
)

/**
 * 文化財を探す タブコンテンツ
 */
const SearchContent: React.FC = () => (
  <div className="space-y-8">
    <section>
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
        文化財一覧ページへアクセス
      </h3>
      <p className="text-gray-600 mb-4 leading-relaxed">
        ホーム画面のヘッダーにある「Map」をクリックするか、ホーム画面の「最新の文化財」セクションから一覧を見ることができます。
        文化財一覧では、登録されているすべての文化財を閲覧できます。
      </p>
      {/* TODO: ホーム画面のスクリーンショットに差し替え */}
      <ImagePlaceholder 
        alt="ホーム画面" 
        description="ホーム画面のスクリーンショット。ヘッダーの「Map」リンクと「最新の文化財」セクションが見える状態" 
      />
    </section>

    <section>
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
        キーワードで検索
      </h3>
      <p className="text-gray-600 mb-4 leading-relaxed">
        一覧ページ上部の検索ボックスにキーワードを入力すると、文化財の名称や住所で絞り込みができます。
        例えば「寺」「神社」「○○市」などで検索してみましょう。
      </p>
      {/* TODO: 検索ボックスのスクリーンショットに差し替え */}
      <ImagePlaceholder 
        alt="検索ボックス" 
        description="文化財一覧ページの検索ボックス部分のスクリーンショット。検索キーワードを入力している状態" 
      />
    </section>

    <section>
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
        タグで絞り込み
      </h3>
      <p className="text-gray-600 mb-4 leading-relaxed">
        タグフィルターを使うと、特定のカテゴリや特徴を持つ文化財を素早く見つけることができます。
        複数のタグを選択して絞り込むことも可能です。
      </p>
      {/* TODO: タグフィルターのスクリーンショットに差し替え */}
      <ImagePlaceholder 
        alt="タグフィルター" 
        description="タグフィルターを使って絞り込みをしている状態のスクリーンショット" 
      />
    </section>

    <section>
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
        文化財の詳細を見る
      </h3>
      <p className="text-gray-600 mb-4 leading-relaxed">
        気になる文化財をクリックすると、詳細ページに移動します。
        詳細ページでは、文化財の説明、所在地、3Dモデル（登録されている場合）などを確認できます。
      </p>
      {/* TODO: 文化財詳細ページのスクリーンショットに差し替え */}
      <ImagePlaceholder 
        alt="文化財詳細ページ" 
        description="文化財詳細ページのスクリーンショット。3Dモデルビューアーが表示されている状態" 
      />
    </section>
  </div>
)

/**
 * 地図で見る タブコンテンツ
 */
const MapContent: React.FC = () => (
  <div className="space-y-8">
    <section>
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
        2D地図と3D地図
      </h3>
      <p className="text-gray-600 mb-4 leading-relaxed">
        本サイトでは2種類の地図表示モードを提供しています。ヘッダーの「Map」から2D地図、「3D Map」から3D地図にアクセスできます。
        2D地図は文化財の位置を俯瞰的に把握するのに便利で、3D地図は地形を立体的に表示して臨場感のある閲覧ができます。
      </p>
      {/* TODO: 2D地図と3D地図の比較スクリーンショットに差し替え */}
      <ImagePlaceholder 
        alt="地図表示モード" 
        description="2D地図と3D地図の両方が見える比較画像。または2つ並べた画像" 
      />
    </section>

    <section>
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
        地図上のマーカー
      </h3>
      <p className="text-gray-600 mb-4 leading-relaxed">
        地図上には文化財の位置がマーカーで表示されます。3Dモデルが登録されている文化財には特別なバッジが付いています。
        マーカーをクリックすると、その文化財のポップアップが表示され、詳細ページへのリンクも確認できます。
      </p>
      {/* TODO: 地図マーカーのスクリーンショットに差し替え */}
      <ImagePlaceholder 
        alt="地図マーカー" 
        description="地図上のマーカーとポップアップが表示されている状態のスクリーンショット" 
      />
    </section>

    <section>
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
        地図の操作方法
      </h3>
      <div className="text-gray-600 mb-4">
        <p className="mb-3 leading-relaxed">地図は以下の方法で操作できます：</p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li><strong>ズーム：</strong>マウスホイールまたはピンチ操作</li>
          <li><strong>移動：</strong>ドラッグ操作</li>
          <li><strong>回転（3D地図）：</strong>右クリック+ドラッグまたは2本指回転</li>
          <li><strong>傾き（3D地図）：</strong>Ctrl+ドラッグ</li>
        </ul>
      </div>
      {/* TODO: 地図操作のGIFまたは複数状態のスクリーンショットに差し替え */}
      <ImagePlaceholder 
        alt="地図操作" 
        description="地図を操作している様子（ズームや移動）のスクリーンショットまたはGIF画像" 
      />
    </section>

    <section>
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
        地図上での検索
      </h3>
      <p className="text-gray-600 mb-4 leading-relaxed">
        地図ページでも検索機能を使用できます。画面上部の検索条件タブを使って、
        エリアやキーワードで表示する文化財を絞り込むことができます。
      </p>
      {/* TODO: 地図ページの検索機能スクリーンショットに差し替え */}
      <ImagePlaceholder 
        alt="地図上での検索" 
        description="地図ページの検索条件タブを展開した状態のスクリーンショット" 
      />
    </section>
  </div>
)

/**
 * 文化財を登録 タブコンテンツ
 */
const RegisterContent: React.FC = () => (
  <div className="space-y-8">
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <p className="text-yellow-800 font-medium">ログインが必要です</p>
          <p className="text-yellow-700 text-sm mt-1">文化財の登録・編集にはアカウント登録とログインが必要です。</p>
        </div>
      </div>
    </div>

    <section>
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
        新規登録ページへアクセス
      </h3>
      <p className="text-gray-600 mb-4 leading-relaxed">
        ログイン後、マイページから「文化財を登録」ボタンをクリックするか、
        URLに直接 <code className="bg-gray-100 px-2 py-1 rounded text-sm">/cultural-properties/new</code> と入力してアクセスできます。
      </p>
      {/* TODO: 新規登録ボタンのスクリーンショットに差し替え */}
      <ImagePlaceholder 
        alt="新規登録ボタン" 
        description="マイページまたはナビゲーションの「文化財を登録」ボタンが見える状態のスクリーンショット" 
      />
    </section>

    <section>
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
        基本情報の入力
      </h3>
      <p className="text-gray-600 mb-4 leading-relaxed">
        文化財の名称、種類（カテゴリ）、説明文などの基本情報を入力します。
        <span className="text-red-500">*</span>マークのある項目は必須入力です。
      </p>
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-medium text-gray-800 mb-2">入力項目</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
          <li><strong>名称（必須）：</strong>文化財の正式名称</li>
          <li><strong>カテゴリ：</strong>建造物、彫刻、絵画など</li>
          <li><strong>種類：</strong>国宝、重要文化財など</li>
          <li><strong>説明：</strong>文化財についての説明文</li>
          <li><strong>タグ：</strong>検索用のタグ（複数設定可）</li>
        </ul>
      </div>
      {/* TODO: 基本情報入力フォームのスクリーンショットに差し替え */}
      <ImagePlaceholder 
        alt="基本情報入力" 
        description="文化財登録フォームの基本情報入力部分のスクリーンショット" 
      />
    </section>

    <section>
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
        位置情報の設定
      </h3>
      <p className="text-gray-600 mb-4 leading-relaxed">
        地図上で文化財の位置を指定します。地図をクリックするか、住所を入力して検索することで位置を設定できます。
        正確な位置を設定することで、地図上での表示精度が向上します。
      </p>
      {/* TODO: 位置情報設定UIのスクリーンショットに差し替え */}
      <ImagePlaceholder 
        alt="位置情報設定" 
        description="LocationPickerコンポーネントで位置を指定している状態のスクリーンショット" 
      />
    </section>

    <section>
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
        確認と登録
      </h3>
      <p className="text-gray-600 mb-4 leading-relaxed">
        入力内容を確認画面でチェックし、問題なければ「登録」ボタンをクリックして登録を完了します。
        登録後は文化財詳細ページに移動し、登録内容を確認できます。
      </p>
      {/* TODO: 確認画面のスクリーンショットに差し替え */}
      <ImagePlaceholder 
        alt="確認画面" 
        description="文化財登録の確認画面のスクリーンショット" 
      />
    </section>

    <section>
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">5</span>
        編集・削除
      </h3>
      <p className="text-gray-600 mb-4 leading-relaxed">
        登録した文化財は、マイページまたは文化財詳細ページから編集・削除できます。
        自分が登録した文化財のみ編集・削除が可能です。
      </p>
      {/* TODO: 編集ボタンのスクリーンショットに差し替え */}
      <ImagePlaceholder 
        alt="編集・削除" 
        description="文化財カードまたは詳細ページの編集・削除ボタンが見える状態のスクリーンショット" 
      />
    </section>
  </div>
)

/**
 * 3Dモデルを登録 タブコンテンツ
 */
const MovieContent: React.FC = () => (
  <div className="space-y-8">
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="text-blue-800 font-medium">Luma AIについて</p>
          <p className="text-blue-700 text-sm mt-1">
            3DモデルはLuma AIで撮影したGaussian Splatモデルに対応しています。
            Luma AIアプリで撮影した3Dモデルを登録できます。
          </p>
        </div>
      </div>
    </div>

    <section>
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
        3Dモデルの撮影
      </h3>
      <p className="text-gray-600 mb-4 leading-relaxed">
        まず、Luma AIアプリを使って文化財の3Dモデルを撮影します。
        スマートフォンで対象物の周りをゆっくり動きながら撮影すると、きれいな3Dモデルが作成されます。
      </p>
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-medium text-gray-800 mb-2">撮影のコツ</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
          <li>対象物の周りを360度ゆっくり回りながら撮影</li>
          <li>様々な高さから撮影すると立体感が向上</li>
          <li>明るい場所で撮影するときれいに仕上がる</li>
          <li>反射の強い素材は撮影が難しい場合があります</li>
        </ul>
      </div>
      {/* TODO: Luma AIアプリの撮影画面スクリーンショットに差し替え（または説明画像） */}
      <ImagePlaceholder 
        alt="3Dモデル撮影" 
        description="Luma AIアプリでの撮影イメージ画像、または撮影方法の説明図" 
      />
    </section>

    <section>
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
        Luma AI URLの取得
      </h3>
      <p className="text-gray-600 mb-4 leading-relaxed">
        Luma AIで処理が完了したら、モデルの共有URLを取得します。
        「Share」ボタンからリンクをコピーできます。URLは以下のような形式です：
      </p>
      <div className="bg-gray-100 rounded-lg p-3 font-mono text-sm text-gray-700 mb-4 overflow-x-auto">
        https://lumalabs.ai/capture/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
      </div>
      {/* TODO: Luma AI共有画面のスクリーンショットに差し替え */}
      <ImagePlaceholder 
        alt="URL取得" 
        description="Luma AIの共有ボタンとURLコピー画面のスクリーンショット" 
      />
    </section>

    <section>
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
        3Dモデルの登録
      </h3>
      <p className="text-gray-600 mb-4 leading-relaxed">
        ログイン後、マイページから「3Dモデルを登録」をクリックするか、
        文化財の編集画面から3Dモデルを追加できます。
        取得したLuma AI URLを入力フィールドに貼り付けます。
      </p>
      {/* TODO: 3Dモデル登録フォームのスクリーンショットに差し替え */}
      <ImagePlaceholder 
        alt="3Dモデル登録" 
        description="3Dモデル登録フォームにURLを入力している状態のスクリーンショット" 
      />
    </section>

    <section>
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
        文化財への紐付け
      </h3>
      <p className="text-gray-600 mb-4 leading-relaxed">
        3Dモデルを登録する際に、対応する文化財を選択して紐付けることができます。
        紐付けることで、文化財の詳細ページから3Dモデルを直接閲覧できるようになります。
      </p>
      {/* TODO: 文化財選択UIのスクリーンショットに差し替え */}
      <ImagePlaceholder 
        alt="文化財への紐付け" 
        description="3Dモデル登録時に文化財を選択するドロップダウンのスクリーンショット" 
      />
    </section>

    <section>
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">5</span>
        3Dモデルの閲覧
      </h3>
      <p className="text-gray-600 mb-4 leading-relaxed">
        登録した3Dモデルは、文化財詳細ページまたは3Dモデル一覧から閲覧できます。
        マウスドラッグで視点を回転、スクロールでズームイン・アウトができます。
      </p>
      {/* TODO: 3Dビューアーのスクリーンショットに差し替え */}
      <ImagePlaceholder 
        alt="3Dモデル閲覧" 
        description="3DモデルビューアーでモデルをGaussian Splat表示している状態のスクリーンショット" 
      />
    </section>
  </div>
)

/**
 * タグを管理 タブコンテンツ
 */
const TagContent: React.FC = () => (
  <div className="space-y-8">
    <section>
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
        タグとは
      </h3>
      <p className="text-gray-600 mb-4 leading-relaxed">
        タグは文化財を分類・検索するためのラベルです。
        適切なタグを設定することで、他のユーザーが関連する文化財を見つけやすくなります。
        例：「神社」「仏閣」「城」「近代建築」「国宝」など
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">神社</span>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">仏閣</span>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">城郭</span>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">近代建築</span>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">国宝</span>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">世界遺産</span>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
        既存タグの選択
      </h3>
      <p className="text-gray-600 mb-4 leading-relaxed">
        文化財の登録・編集時に、タグ入力欄に文字を入力すると、既存のタグが候補として表示されます。
        候補をクリックすることで、簡単にタグを追加できます。
      </p>
      {/* TODO: タグ入力UIのサジェスト表示スクリーンショットに差し替え */}
      <ImagePlaceholder 
        alt="タグ候補表示" 
        description="タグ入力時にサジェストが表示されている状態のスクリーンショット" 
      />
    </section>

    <section>
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
        新しいタグの作成
      </h3>
      <p className="text-gray-600 mb-4 leading-relaxed">
        適切なタグが見つからない場合は、新しいタグを作成できます。
        タグ入力欄に新しいタグ名を入力し、Enterキーを押すか「新しいタグとして作成」をクリックします。
      </p>
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-medium text-gray-800 mb-2">タグ作成のガイドライン</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
          <li>簡潔で分かりやすい名前を付ける</li>
          <li>既存の類似タグがないか確認する</li>
          <li>一般的に使われる用語を使用する</li>
          <li>個人名や固有名詞は避ける</li>
        </ul>
      </div>
      {/* TODO: 新規タグ作成UIのスクリーンショットに差し替え */}
      <ImagePlaceholder 
        alt="新規タグ作成" 
        description="「新しいタグとして作成」オプションが表示されている状態のスクリーンショット" 
      />
    </section>

    <section>
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
        タグの削除
      </h3>
      <p className="text-gray-600 mb-4 leading-relaxed">
        文化財に追加したタグは、タグの横にある×ボタンをクリックすることで削除できます。
        タグを削除しても、他の文化財に設定された同じタグには影響しません。
      </p>
      {/* TODO: タグ削除ボタンのスクリーンショットに差し替え */}
      <ImagePlaceholder 
        alt="タグ削除" 
        description="選択済みタグの×ボタンをクリックする様子のスクリーンショット" 
      />
    </section>

    <section>
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">5</span>
        タグでの検索
      </h3>
      <p className="text-gray-600 mb-4 leading-relaxed">
        文化財一覧ページでは、タグをクリックしてフィルタリングできます。
        複数のタグを選択すると、すべてのタグに一致する文化財が表示されます。
      </p>
      {/* TODO: タグフィルターのスクリーンショットに差し替え */}
      <ImagePlaceholder 
        alt="タグ検索" 
        description="タグフィルターで複数タグを選択している状態のスクリーンショット" 
      />
    </section>
  </div>
)

/**
 * Howtoページメインコンポーネント
 */
const HowtoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('search')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'search':
        return <SearchContent />
      case 'map':
        return <MapContent />
      case 'register':
        return <RegisterContent />
      case 'movie':
        return <MovieContent />
      case 'tag':
        return <TagContent />
      default:
        return <SearchContent />
    }
  }

  return (
    <LayoutWithFooter>
      <Head>
        <title>使い方ガイド - 3D文化財共有サイト</title>
        <meta name="description" content="3D文化財共有サイトの使い方を解説します。文化財の検索、地図表示、登録方法、3Dモデルの追加方法などを詳しく説明しています。" />
      </Head>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* ページヘッダー */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            使い方ガイド
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            3D文化財共有サイトの使い方をご紹介します。
            文化財の検索から登録、3Dモデルの追加まで、基本的な操作方法を解説しています。
          </p>
        </div>

        {/* タブナビゲーション */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap -mb-px" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer
                    ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  <span className="mr-2">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* タブコンテンツ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
          {renderTabContent()}
        </div>

        {/* ヘルプセクション */}
        <div className="mt-10 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            お困りの場合は
          </h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            使い方に関してご不明な点がございましたら、お気軽にお問い合わせください。
            また、バグの報告や機能のご要望も受け付けております。
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:support@example.com"
              className="inline-flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              お問い合わせ
            </a>
          </div>
        </div>
      </div>
    </LayoutWithFooter>
  )
}

export default HowtoPage
