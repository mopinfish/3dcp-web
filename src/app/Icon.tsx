// src/app/Icon.tsx
export default function Icon() {
  return (
    <>
      <title>OPEN3Dマップ</title>

      {/* ブラウザ用favicon */}
      <link rel="icon" href="/favicon.ico" />

      {/* モダンブラウザ用SVGファビコン（優先） */}
      <link rel="icon" type="image/svg+xml" href="/icon.svg" />

      {/* iOSホーム画面追加用 */}
      <link rel="apple-touch-icon" href="/apple-icon.png" sizes="180x180" />
    </>
  )
}
