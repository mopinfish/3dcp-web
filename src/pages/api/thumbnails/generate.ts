import { NextApiRequest, NextApiResponse } from 'next'
import * as fs from 'fs'
import * as path from 'path'
import puppeteer from 'puppeteer'
import sharp from 'sharp'

// サムネイルディレクトリのパス
const THUMBNAIL_DIR = path.join(process.cwd(), 'public', 'thumbnails');

// サムネイルディレクトリの存在確認・作成
if (!fs.existsSync(THUMBNAIL_DIR)) {
  fs.mkdirSync(THUMBNAIL_DIR, { recursive: true });
}

/**
 * 3DモデルのサムネイルをLumaのWebサイトから直接キャプチャする
 */
async function captureLumaThumbnail(modelId: number, lumaUrl: string): Promise<string | null> {
  // URLからキャプチャIDを抽出
  const captureId = lumaUrl.split('/').pop();
  if (!captureId) {
    throw new Error('URLから正しいキャプチャIDを抽出できませんでした');
  }
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // ビューポートサイズを設定
    await page.setViewport({ width: 1200, height: 800 });
    
    // Lumaの公式サイトにアクセス
    await page.goto(`https://lumalabs.ai/capture/${captureId}`, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    
    // コンテンツが完全に読み込まれるのを待つ
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // スクリーンショットを取得
    const screenshotBuffer = await page.screenshot({ type: 'png' });
    
    // サムネイルファイルパスを設定
    const thumbnailFilename = `movie-${modelId}.jpg`;
    const thumbnailPath = path.join(THUMBNAIL_DIR, thumbnailFilename);
    
    // 画像を最適化して保存
    await sharp(screenshotBuffer)
      .resize(400, 300)
      .jpeg({ quality: 90 })
      .toFile(thumbnailPath);
    
    return `/thumbnails/${thumbnailFilename}`;
    
  } catch (error) {
    console.error(`サムネイル生成中にエラーが発生しました: ${error}`);
    return null;
  } finally {
    await browser.close();
  }
}

/**
 * サムネイル生成APIハンドラ
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // POSTリクエストのみ許可
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { modelId, lumaUrl } = req.body;

    // パラメータのバリデーション
    if (!modelId || !lumaUrl) {
      return res.status(400).json({ error: 'modelId and lumaUrl are required' });
    }

    if (typeof modelId !== 'number' || !lumaUrl.startsWith('https://lumalabs.ai/capture/')) {
      return res.status(400).json({ error: 'Invalid parameters' });
    }

    // サムネイル生成
    const thumbnailPath = await captureLumaThumbnail(modelId, lumaUrl);

    if (!thumbnailPath) {
      return res.status(500).json({ error: 'Failed to generate thumbnail' });
    }

    // サムネイルデータ
    const thumbnailData = {
      id: Date.now(),
      movieId: modelId,
      imageUrl: thumbnailPath,
      width: 400,
      height: 300,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 既存のサムネイルデータを読み込む
    const dataPath = path.join(THUMBNAIL_DIR, 'thumbnails.json');
    let thumbnails = [];
    
    if (fs.existsSync(dataPath)) {
      try {
        thumbnails = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        // 同じmodelIdのエントリーを削除
        thumbnails = thumbnails.filter((t: any) => t.movieId !== modelId);
      } catch (error) {
        console.error('サムネイルデータの読み込みに失敗しました:', error);
      }
    }
    
    // 新しいサムネイルデータを追加
    thumbnails.push(thumbnailData);
    
    // データを保存
    fs.writeFileSync(dataPath, JSON.stringify(thumbnails, null, 2));

    // 成功レスポンス
    return res.status(200).json(thumbnailData);
  } catch (error) {
    console.error('サムネイル生成APIエラー:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 