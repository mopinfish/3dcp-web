# 3dcp-web

This is a repository for [3D Cultural Properties Project](https://3dcp.geofirm.info/).

## Links

- [Project Page（Notion）](https://code4japan-community.notion.site/3D-1d8a6c65652e800fb3ded17109a5369a)

## Setup

```bash
# clone repository
git clone git@github.com:mopinfish/3dcp-web.git
cd 3dcp-web
npm install

# copy env file for development
cp .env.development.local.example .env.development.local
# The back-end host should be rewritten as follows if you need.
echo 'NEXT_PUBLIC_BACKEND_API_HOST="https://my-django.fly.dev"' > .env.development.local

# start dev server. Go here: http://localhost:3000
npm run dev
```

## Luma.ai Model Management

The project includes scripts for managing Luma.ai 3D models and generating thumbnails:

```bash
# Fetch movie data from the backend API
npm run generate-luma-list

# Generate thumbnails for 3D models (skips existing ones)
npm run thumbnails

# Force regenerate all thumbnails
npm run thumbnails:force

# Update both movie data and thumbnails
npm run update-luma
```

### Automated Updates

This project uses GitHub Actions to automatically update movie data and thumbnails:

- Updates run daily at UTC 2:00 (JST 11:00)
- Can be manually triggered in GitHub's Actions tab
- See `.github/workflows/update-luma-data.yml` for configuration

For detailed documentation, see [Luma.ai Model Management Guide](./docs/LUMA_MODEL_MANAGEMENT.md).
## Architecture & Design

本プロジェクトはクリーンアーキテクチャの考え方を取り入れた設計を採用しています。

### ディレクトリ構成

```
src/
├── components/                   # UIコンポーネント
│   ├── blocks/                   # 汎用ブロックコンポーネント
│   ├── common/                   # 共通コンポーネント（フォーム部品など）
│   ├── layouts/                  # レイアウトコンポーネント
│   └── {feature}/                # 機能固有コンポーネント
├── contexts/                     # React Context
├── domains/                      # ドメイン層
│   ├── models/                   # データモデル（型定義）
│   ├── repositories/             # リポジトリインターフェース
│   └── services/                 # サービス層（ユースケース）
├── infrastructures/              # インフラ層
│   ├── lib/                      # ユーティリティ（HTTP, エラー処理）
│   └── repositories/             # リポジトリ実装
├── pages/                        # ページコンポーネント（Pages Router）
└── styles/                       # グローバルスタイル
```

### レイヤー構成

```
┌─────────────────────────────────────────────────────────────┐
│                      Pages / Components                      │
│                     （プレゼンテーション層）                    │
├─────────────────────────────────────────────────────────────┤
│                     domains/services                         │
│                      （サービス層）                            │
│              具体的なユースケースを実装                         │
├─────────────────────────────────────────────────────────────┤
│    domains/repositories    ←    infrastructures/repositories │
│     （インターフェース）              （実装）                  │
│                       APIとの通信を抽象化                      │
├─────────────────────────────────────────────────────────────┤
│                     infrastructures/lib                      │
│                   （HTTPクライアント等）                       │
└─────────────────────────────────────────────────────────────┘
```

### 各レイヤーの役割

| レイヤー | ディレクトリ | 役割 |
|---------|-------------|------|
| Models | `domains/models/` | データ構造の型定義 |
| Repository Interface | `domains/repositories/` | リポジトリの抽象化（インターフェース） |
| Repository Implementation | `infrastructures/repositories/` | 実際のAPI呼び出し実装 |
| Services | `domains/services/` | ビジネスロジック、ユースケースの実装 |
| Components | `components/` | UIコンポーネント |

### コンポーネントからのデータ取得

コンポーネントは直接Repositoryを呼び出さず、Service層を経由してデータを取得します。

```typescript
// ✅ 推奨: Service層を使用
import { cultural_property as culturalPropertyService } from '@/domains/services'

const MyComponent = () => {
  useEffect(() => {
    const fetchData = async () => {
      // Service層のメソッドを呼び出し
      const data = await culturalPropertyService.getLatestProperties(5)
      setProperties(data)
    }
    fetchData()
  }, [])
}
```

### コンポーネントの配置

| ディレクトリ | 用途 | 例 |
|-------------|------|-----|
| `blocks/` | 汎用的な機能ブロック | `NavigationTab`, `LatestCulturalProperties` |
| `common/` | 再利用可能なUI部品 | `FormField`, `LocationPicker` |
| `layouts/` | ページレイアウト | `Layout`, `LayoutWithFooter` |
| `{feature}/` | 機能固有のコンポーネント | `CulturalPropertyCard`, `MovieCard` |

詳細なガイドラインは [docs/DESIGN_GUIDELINE.md](./docs/DESIGN_GUIDELINE.md) を参照してください。
