const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const sharp = require('sharp');

// コマンドライン引数の処理
const args = process.argv.slice(2);
const FORCE_REGENERATE = args.includes('--force');

// サムネイルディレクトリの作成
const THUMBNAIL_DIR = path.join(process.cwd(), 'public', 'thumbnails');
if (!fs.existsSync(THUMBNAIL_DIR)) {
  fs.mkdirSync(THUMBNAIL_DIR, { recursive: true });
}

/**
 * LumaのWebサイトから直接3Dモデルのサムネイルを取得する
 */
async function captureLumaThumbnail(modelId, lumaUrl) {
  console.log(`Lumaサイトからサムネイルを取得中: ${lumaUrl}`);
  
  // モデルIDからLuma URLを抽出
  let captureId = lumaUrl.split('/').pop();
  if (!captureId) {
    console.warn('URLから正しいキャプチャIDを抽出できませんでした');
    return null;
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
    
    // メインのビューポートが読み込まれるのを待つ
    console.log('ページの読み込みを待機中...');
    await page.waitForSelector('.capture-view', { timeout: 30000 })
      .catch(() => console.log('キャプチャビューセレクタが見つかりませんでした、続行します'));
    
    // 少し待機してコンテンツが完全に読み込まれるのを待つ
    console.log('コンテンツの読み込みを待機中...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // スクリーンショットを取得
    console.log('スクリーンショットを取得中...');
    const screenshotBuffer = await page.screenshot({ type: 'png' });
    
    // サムネイルファイルパスを設定
    const thumbnailPath = path.join(THUMBNAIL_DIR, `movie-${modelId}.jpg`);
    
    // 画像を最適化して保存
    await sharp(screenshotBuffer)
      .resize(400, 300)
      .jpeg({ quality: 90 })
      .toFile(thumbnailPath);
    
    console.log(`サムネイル生成成功: ${thumbnailPath}`);
    
    // サムネイルデータを返す
    return {
      id: Date.now(),
      movieId: modelId,
      imageUrl: `/thumbnails/movie-${modelId}.jpg`,
      width: 400,
      height: 300,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
  } catch (error) {
    console.error(`Movie ID: ${modelId} のサムネイル生成中にエラーが発生しました:`, error);
    return null;
  } finally {
    await browser.close();
  }
}

// メイン処理
async function main() {
  console.log('Lumaモデルからサムネイル生成プロセスを開始します...');
  
  if (FORCE_REGENERATE) {
    console.log('強制再生成モードが有効です。既存のサムネイルも再生成します。');
  }
  
  // 生成した映画データを読み込む
  let lumaMovies = [];
  const moviesJsonPath = path.join(process.cwd(), 'public', 'data', 'luma-movies.json');
  
  if (fs.existsSync(moviesJsonPath)) {
    try {
      lumaMovies = JSON.parse(fs.readFileSync(moviesJsonPath, 'utf8'));
      console.log(`映画データを読み込みました: ${lumaMovies.length}件`);
    } catch (error) {
      console.error('映画データの読み込みに失敗しました:', error);
      return;
    }
  } else {
    console.error('映画データが見つかりません。先に npm run generate-luma-list を実行してください。');
    return;
  }
  
  // 既存のサムネイルデータを読み込む
  const dataPath = path.join(THUMBNAIL_DIR, 'thumbnails.json');
  let thumbnailData = [];
  
  if (fs.existsSync(dataPath)) {
    try {
      thumbnailData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      console.log(`既存のサムネイルデータを読み込みました: ${thumbnailData.length}件`);
    } catch (error) {
      console.error('サムネイルデータの読み込みに失敗しました:', error);
    }
  }
  
  // サムネイル画像の存在をチェックするための関数
  const thumbnailExists = (movieId) => {
    // 強制再生成モードの場合は常にfalseを返す
    if (FORCE_REGENERATE) return false;
    
    // サムネイル画像ファイルパスを確認
    const imagePath = path.join(THUMBNAIL_DIR, `movie-${movieId}.jpg`);
    if (fs.existsSync(imagePath)) {
      // サムネイルJSONデータにも存在するか確認
      const existingIndex = thumbnailData.findIndex(t => t.movieId === movieId);
      return existingIndex >= 0;
    }
    return false;
  };

  let processedCount = 0;
  let skippedCount = 0;
  
  // 各モデルに対してサムネイルを生成
  for (const movie of lumaMovies) {
    // Lumaのサイト以外のURLは無視
    if (!movie.url.includes('lumalabs.ai/capture/')) {
      console.log(`Movie ID: ${movie.id} のURLはLumaのURLではないためスキップします: ${movie.url}`);
      continue;
    }
    
    // すでにサムネイルが存在する場合はスキップ
    if (thumbnailExists(movie.id)) {
      console.log(`Movie ID: ${movie.id} (${movie.title}) のサムネイルは既に存在するためスキップします。`);
      skippedCount++;
      continue;
    }
    
    console.log(`サムネイル生成: ${movie.title} (ID: ${movie.id})`);
    const thumbnailInfo = await captureLumaThumbnail(movie.id, movie.url);
    if (thumbnailInfo) {
      thumbnailData.push(thumbnailInfo);
      processedCount++;
    }
  }
  
  // サムネイルデータをJSONファイルに保存
  fs.writeFileSync(dataPath, JSON.stringify(thumbnailData, null, 2));
  console.log(`処理完了: ${processedCount}件のサムネイルを生成、${skippedCount}件をスキップしました。`);
  console.log(`合計: ${thumbnailData.length}件のサムネイルデータ`);
}

// スクリプト実行
main().catch(console.error); 