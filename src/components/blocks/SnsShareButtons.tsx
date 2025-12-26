/**
 * SnsShareButtons.tsx
 *
 * SNSシェアボタンコンポーネント
 * X（Twitter）、Facebook、LINEへのシェア機能を提供
 *
 * パス: src/components/blocks/SnsShareButtons.tsx
 */

import React, { useState, useMemo } from 'react'

interface SnsShareButtonsProps {
  /** シェアするページのURL */
  url: string
  /** シェア時のタイトル/テキスト */
  title: string
  /** 詳細説明（備考など、シェア文章に使用） */
  description?: string
  /** 追加のハッシュタグ（X用、#なしで指定） */
  hashtags?: string[]
  /** コンパクト表示モード */
  compact?: boolean
  /** シェアタイプ（文章生成に使用） */
  shareType?: 'cultural_property' | '3d_model' | 'registration_complete' | 'default'
}

/**
 * シェア用の文章を生成する（120文字以内）
 */
function generateShareText(
  title: string,
  description?: string,
  shareType?: string
): string {
  const siteIntro = '【3D文化財】'
  const suffix = '\n\n地域の文化財を3Dで記録・共有できるサイトです。'
  
  // 利用可能な文字数を計算（ハッシュタグとURLは別カウント）
  const maxLength = 120 - siteIntro.length - suffix.length
  
  let mainText = title
  
  // 備考がある場合は追加（文字数制限内で）
  if (description) {
    const trimmedDesc = description.replace(/\n/g, ' ').trim()
    const combined = `${title}｜${trimmedDesc}`
    if (combined.length <= maxLength) {
      mainText = combined
    } else {
      // 文字数オーバーの場合は切り詰め
      const availableForDesc = maxLength - title.length - 1 - 3 // 「｜」と「...」の分
      if (availableForDesc > 10) {
        mainText = `${title}｜${trimmedDesc.slice(0, availableForDesc)}...`
      }
    }
  }
  
  // 最終的な文字数チェック
  if (mainText.length > maxLength) {
    mainText = mainText.slice(0, maxLength - 3) + '...'
  }
  
  return `${siteIntro}${mainText}${suffix}`
}

/**
 * SNSシェアボタンコンポーネント
 */
export default function SnsShareButtons({
  url,
  title,
  description,
  hashtags = ['3D文化財'],
  compact = false,
  shareType = 'default',
}: SnsShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  // シェア用テキストを生成
  const shareText = useMemo(() => {
    return generateShareText(title, description, shareType)
  }, [title, description, shareType])

  // エンコード済みのURL・テキスト
  const encodedUrl = encodeURIComponent(url)
  const encodedText = encodeURIComponent(shareText)
  const encodedHashtags = hashtags.join(',')

  // 各SNSのシェアURL
  const shareUrls = {
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}&hashtags=${encodedHashtags}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    line: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}&text=${encodedText}`,
  }

  // URLをクリップボードにコピー
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  // シェアウィンドウを開く
  const openShareWindow = (shareUrl: string, name: string) => {
    window.open(
      shareUrl,
      name,
      'width=600,height=400,menubar=no,toolbar=no,resizable=yes,scrollbars=yes'
    )
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {/* X (Twitter) */}
        <button
          onClick={() => openShareWindow(shareUrls.x, 'twitter-share')}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-black hover:bg-gray-800 transition-colors"
          aria-label="Xでシェア"
          title="Xでシェア"
        >
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </button>

        {/* Facebook */}
        <button
          onClick={() => openShareWindow(shareUrls.facebook, 'facebook-share')}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1877F2] hover:bg-[#166FE5] transition-colors"
          aria-label="Facebookでシェア"
          title="Facebookでシェア"
        >
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </button>

        {/* LINE */}
        <button
          onClick={() => openShareWindow(shareUrls.line, 'line-share')}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-[#00B900] hover:bg-[#00A000] transition-colors"
          aria-label="LINEでシェア"
          title="LINEでシェア"
        >
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.349 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
          </svg>
        </button>

        {/* コピーボタン */}
        <button
          onClick={copyToClipboard}
          className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
            copied
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-gray-500 hover:bg-gray-600'
          }`}
          aria-label="URLをコピー"
          title={copied ? 'コピーしました！' : 'URLをコピー'}
        >
          {copied ? (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          )}
        </button>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        この文化財をシェア
      </h3>
      <div className="flex flex-wrap gap-2">
        {/* X (Twitter) */}
        <button
          onClick={() => openShareWindow(shareUrls.x, 'twitter-share')}
          className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
        >
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          X
        </button>

        {/* Facebook */}
        <button
          onClick={() => openShareWindow(shareUrls.facebook, 'facebook-share')}
          className="inline-flex items-center px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5] transition-colors text-sm font-medium"
        >
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Facebook
        </button>

        {/* LINE */}
        <button
          onClick={() => openShareWindow(shareUrls.line, 'line-share')}
          className="inline-flex items-center px-4 py-2 bg-[#00B900] text-white rounded-lg hover:bg-[#00A000] transition-colors text-sm font-medium"
        >
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.349 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
          </svg>
          LINE
        </button>

        {/* URLコピー */}
        <button
          onClick={copyToClipboard}
          className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
            copied
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {copied ? (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              コピーしました！
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              URLをコピー
            </>
          )}
        </button>
      </div>
    </div>
  )
}
