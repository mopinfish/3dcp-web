# GitHub Actionsによる自動更新機能のセットアップ

このドキュメントでは、3DCPプロジェクトのGitHub Actionsを使用して、Luma.aiのモデルデータとサムネイルを自動で更新する方法について説明します。

## 概要

GitHub Actionsワークフローは以下の処理を自動で実行します：

1. バックエンドAPIから最新の映画データを取得
2. 新しいモデルのサムネイルを自動生成
3. 変更があった場合、自動的にコミットしてプッシュ

これにより、定期的なメンテナンス作業が自動化され、常に最新のデータとサムネイルが提供されます。

## 前提条件

- GitHubリポジトリへの管理者権限
- バックエンドAPIのホストURL（例：`https://my-django.fly.dev`）

## 設定手順

### 1. GitHub Secretsの設定

GitHub ActionsがバックエンドAPIにアクセスするために必要なシークレット情報を設定します。

1. GitHubのリポジトリページに移動する
2. リポジトリ上部の「**Settings**」タブをクリックする
3. 左側のサイドバーで「**Secrets and variables**」→「**Actions**」を選択する
4. 「**New repository secret**」ボタンをクリックする
5. 以下の情報を入力する：
   - **Name**: `BACKEND_API_HOST`
   - **Value**: バックエンドAPIのURL（例：`https://my-django.fly.dev`）
     - この値は`.env.development.local`ファイルの`NEXT_PUBLIC_BACKEND_API_HOST`と同じ値を使用します
6. 「**Add secret**」ボタンをクリックして保存する

![GitHubのSecretsの設定方法](https://i.ibb.co/Bq2VwQT/github-secrets.png)

### 2. ワークフローの動作確認

ワークフローが正しく設定されたことを確認するために、手動で実行してみます。

1. GitHubのリポジトリページで「**Actions**」タブをクリックする
2. 左側のサイドバーから「**Update Luma.ai Model Data**」ワークフローを選択する
3. 「**Run workflow**」ボタンをクリックする
4. 「**Run workflow**」ボタンを再度クリックして実行する
5. ワークフローの実行状況を確認する

正常に実行されると、新しいモデルデータとサムネイルが自動的に生成され、リポジトリにコミットされます。

## 自動実行スケジュール

ワークフローは以下のタイミングで自動的に実行されます：

- **定期実行**: 毎日UTC 2:00（日本時間11:00）に自動実行
- **手動実行**: GitHubのActionsタブから手動でトリガー可能

## トラブルシューティング

### APIから映画データが取得できない場合

- GitHub Secretsの`BACKEND_API_HOST`が正しく設定されているか確認する
- バックエンドAPIが正常に動作しているか確認する
- ネットワーク接続やファイアウォールの設定を確認する

### サムネイル生成に失敗する場合

- Luma.aiのWebサイト構造が変更された可能性がある
- `capture-thumbnails-batch.js`のセレクタ（`.capture-view`）を更新する必要があるかもしれない
- ログを確認してエラーメッセージを特定する

## 関連ドキュメント

- [Luma.aiモデル管理ガイド](./LUMA_MODEL_MANAGEMENT.md)
- [GitHub Actionsの公式ドキュメント](https://docs.github.com/en/actions)

---

**作成日**: 2024/04/25
**最終更新日**: 2024/04/25
**作成者**: Team 3DCP 