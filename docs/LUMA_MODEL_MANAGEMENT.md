# Luma.aiモデル管理ガイド

このドキュメントでは、Luma.aiの3Dモデルデータの取得とサムネイル生成の手順について説明します。

## 概要

プロジェクトには以下の機能が実装されています：

1. Luma.aiの映画（3Dモデル）データをバックエンドAPIから取得
2. 各3Dモデルのサムネイル画像を自動キャプチャ
3. 映画リストとサムネイルをWebアプリで表示

## スクリプト

以下のnpmスクリプトが利用可能です：

| コマンド | 説明 |
| ------- | ---- |
| `npm run generate-luma-list` | バックエンドAPIから映画データを取得してJSONファイルに保存 |
| `npm run thumbnails` | 既存の映画データから3Dモデルのサムネイルを生成（既存のものはスキップ） |
| `npm run thumbnails:force` | 全てのサムネイルを強制的に再生成 |
| `npm run update-luma` | 映画データの取得とサムネイル生成を順番に実行 |

## データフロー

1. `generate-luma-list.js`：バックエンドAPIから映画データを取得し`public/data/luma-movies.json`に保存
2. `capture-thumbnails-batch.js`：各3Dモデルページをヘッドレスブラウザで開き、スクリーンショットを取得、サムネイル画像として保存
3. サムネイル情報は`public/thumbnails/thumbnails.json`に保存され、画像ファイルは`public/thumbnails/movie-{id}.jpg`として保存

## 使用方法

### 初回設定

1. 最初にバックエンドAPI接続を設定
   ```
   # .env.development.local
   NEXT_PUBLIC_BACKEND_API_HOST=https://your-backend-api.com
   ```

2. 映画データを取得
   ```bash
   npm run generate-luma-list
   ```

3. サムネイルを生成
   ```bash
   npm run thumbnails
   ```

### 定期的な更新

新しい映画データとサムネイルを更新するには：

```bash
npm run update-luma
```

### 高度な使用方法

#### サムネイルの強制再生成

すべてのサムネイルを再生成する（既存のものも含む）：

```bash
npm run thumbnails:force
```

## 新しい場所の追加

システムは新しい場所の追加に対して柔軟に対応できるように設計されています。以下が新しい場所を追加する一般的なワークフローです：

### 1. バックエンドでのデータ追加

バックエンドAPI側で新しい場所のデータを追加します：

- 新しい文化財/場所をバックエンドデータベースに登録
- Luma.aiで撮影した3DモデルのキャプチャページのURLを設定
- 関連メタデータ（タイトル、説明など）を設定

### 2. フロントエンドでのデータ更新

フロントエンド側でデータを更新します：

```bash
# データとサムネイルを一括更新
npm run update-luma

# または個別に実行
npm run generate-luma-list  # 映画データのみ更新
npm run thumbnails          # サムネイルのみ更新（新規エントリのみ）
```

### 3. 動作確認

- 開発サーバーで確認：`npm run dev`
- ブラウザで `http://localhost:3000/luma-list` にアクセス
- 新しい場所のエントリとサムネイルが表示されることを確認

### 自動処理の仕組み

スクリプトは以下の特性を持っているため、新しい場所の追加に対して効率的に動作します：

- `generate-luma-list.js` はAPI経由で常に最新データを取得
- `capture-thumbnails-batch.js` は既存サムネイルをスキップし、新規エントリのみ処理
- エラーハンドリングにより一部の失敗が全体に影響しない設計

### 大量データの追加時の注意点

大量のデータを一度に追加する場合の注意点：

- サムネイル生成には時間がかかる場合があります（1エントリあたり約10-15秒）
- メモリ使用量が増加する可能性があるため、システムリソースに注意
- 処理の中断/再開が可能なため、必要に応じて分割して実行可能

## 継続的メンテナンス

3Dモデルとサムネイルの継続的なメンテナンスのためのベストプラクティスを紹介します。

### 定期的なデータ同期

以下のタイミングでデータを同期することをお勧めします：

- バックエンドでの大きな更新後
- 新しい場所が追加された後
- 定期的なメンテナンス作業の一環として（例：月1回）
- デプロイメント前

```bash
# デプロイメント前のデータ更新例
npm run update-luma
npm run build
```

### バージョン管理

サムネイルと映画データは以下のように管理することをお勧めします：

- サムネイル画像とJSONファイルはgitリポジトリに含める
- これにより、チーム内での共有やデプロイメントが簡単になる
- 大きな変更の前にはバックアップを取る

```bash
# 現在のデータをバックアップ
cp -r public/thumbnails public/thumbnails_backup_$(date +%Y%m%d)
cp public/data/luma-movies.json public/data/luma-movies_backup_$(date +%Y%m%d).json
```

### Luma.aiサイト構造の変更対応

Luma.aiのWebサイト構造が変更された場合：

1. `capture-thumbnails-batch.js`のセレクタを更新
2. 主に以下の部分に注目：
   - CSSセレクタ（`.capture-view`）
   - 待機時間（現在は10秒）
   - スクリーンショットの取得方法

```javascript
// セレクタ更新例
await page.waitForSelector('.new-capture-view-class', { timeout: 30000 })
```

## ファイル構成

- `/scripts/generate-luma-list.js` - 映画データ取得スクリプト
- `/scripts/capture-thumbnails-batch.js` - サムネイル生成スクリプト
- `/public/data/luma-movies.json` - 生成された映画データ
- `/public/thumbnails/` - サムネイル画像とメタデータ
- `/src/pages/luma-list.tsx` - 映画リスト表示ページ

## トラブルシューティング

### APIからデータが取得できない場合

- `.env.development.local`ファイルが正しく設定されているか確認
- バックエンドAPIが正常に動作しているか確認
- ネットワーク接続を確認

### サムネイル生成に失敗する場合

- Puppeteerが正常にインストールされているか確認
- メモリ不足の場合は、一度に処理するモデル数を減らす
- Luma.aiのWebサイト構造が変更された場合は、セレクタを更新

### サムネイルが表示されない場合

- 開発サーバーを再起動
- ブラウザキャッシュをクリア
- `/public/thumbnails/thumbnails.json`が正しく生成されているか確認

---

**作成日**: 2025/04/19  
**最終更新日**: 2025/04/19
**作成者**: ukyonagata0105 