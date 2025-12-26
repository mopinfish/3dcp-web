# 3DCP-Web Design Guideline

3D文化財共有サイト（3DCP）フロントエンドの設計ガイドラインです。

## 目次

1. [技術スタック](#技術スタック)
2. [ディレクトリ構成](#ディレクトリ構成)
3. [アーキテクチャ](#アーキテクチャ)
4. [レイヤー詳細](#レイヤー詳細)
5. [コンポーネント設計](#コンポーネント設計)
6. [命名規則](#命名規則)
7. [データフロー](#データフロー)

---

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js (Pages Router) |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS |
| 3D描画 | React Three Fiber, Three.js, Luma.ai LumaSplats |
| 地図 | MapLibre GL JS |
| 状態管理 | React Context API |
| API通信 | Fetch API（カスタムHttpクライアント） |

---

## ディレクトリ構成

```
src/
├── app/                          # App Router用（一部機能のみ）
├── components/                   # UIコンポーネント
│   ├── blocks/                   # 汎用ブロックコンポーネント
│   ├── common/                   # 共通コンポーネント（フォーム部品など）
│   ├── cultural-property/        # 文化財関連コンポーネント
│   ├── helpers/                  # ヘルパーコンポーネント
│   ├── import/                   # インポート機能コンポーネント
│   ├── layouts/                  # レイアウトコンポーネント
│   └── movie/                    # ムービー関連コンポーネント
├── contexts/                     # React Context
├── domains/                      # ドメイン層
│   ├── models/                   # データモデル（型定義）
│   ├── repositories/             # リポジトリインターフェース
│   └── services/                 # サービス層（ユースケース）
├── infrastructures/              # インフラ層
│   ├── lib/                      # ユーティリティ（HTTP, エラー処理）
│   └── repositories/             # リポジトリ実装
├── pages/                        # ページコンポーネント（Pages Router）
│   ├── api/                      # API Routes
│   ├── auth/                     # 認証関連ページ
│   ├── cultural-properties/      # 文化財関連ページ
│   ├── movies/                   # ムービー関連ページ
│   └── ...
├── styles/                       # グローバルスタイル
└── public/                       # 静的ファイル
    └── data/                     # JSONデータファイル
```

---

## アーキテクチャ

本プロジェクトは**クリーンアーキテクチャ**の考え方を取り入れています。

```
┌─────────────────────────────────────────────────────────────┐
│                      Pages / Components                      │
│                     （プレゼンテーション層）                    │
├─────────────────────────────────────────────────────────────┤
│                         Services                             │
│                      （ドメイン層）                            │
│              具体的なユースケースを実装                         │
├─────────────────────────────────────────────────────────────┤
│                       Repositories                           │
│                     （インフラ層）                             │
│              APIとの通信を抽象化                               │
├─────────────────────────────────────────────────────────────┤
│                     External APIs                            │
│                   （バックエンドAPI）                          │
└─────────────────────────────────────────────────────────────┘
```

### 依存関係の方向

```
Pages/Components
      ↓
   Services (domains/services)
      ↓
Repository Interface (domains/repositories)
      ↑
Repository Implementation (infrastructures/repositories)
      ↓
   HTTP Client (infrastructures/lib)
      ↓
  Backend API
```

---

## レイヤー詳細

### 1. Models（domains/models/）

データ構造の型定義を行います。

```typescript
// domains/models/cultural_property.ts
export type CulturalProperty = {
  id: number
  name: string
  address: string
  latitude: number
  longitude: number
  movies?: Movie[]
  // ...
}

export type CulturalProperties = CulturalProperty[]
```

**役割:**
- APIレスポンスの型定義
- フォームデータの型定義
- 共通で使用するデータ構造の定義

### 2. Repository Interface（domains/repositories/）

リポジトリのインターフェース（契約）を定義します。

```typescript
// domains/repositories/cultural_property.ts
import { CulturalProperties } from '../models/cultural_property'

export type getProps = Record<string, string>

export interface CulturalPropertyRepository {
  get: (props: getProps) => Promise<CulturalProperties>
  find?: (id: number) => Promise<CulturalProperty>
  findAll?: (params?: QueryParams) => Promise<CulturalProperties>
}
```

**役割:**
- リポジトリの抽象化
- 実装の詳細を隠蔽
- テスト時のモック作成を容易に

### 3. Repository Implementation（infrastructures/repositories/）

リポジトリインターフェースの実装を行います。

```typescript
// infrastructures/repositories/cultural_property.ts
import { Http } from '@/infrastructures/lib'
import { CulturalProperties } from '@/domains/models/cultural_property'

const HOST = process.env.NEXT_PUBLIC_BACKEND_API_HOST

export async function get(props: Record<string, string>): Promise<CulturalProperties> {
  const queries = new URLSearchParams(props).toString()
  const url = `${HOST}/api/v1/cultural-properties?${queries}`
  const res = await Http.get<CulturalPropertiesResponse>(url)
  return res.results
}

export async function find(id: number): Promise<CulturalProperty> {
  const url = `${HOST}/api/v1/cultural-properties/${id}`
  return await Http.get<CulturalProperty>(url)
}
```

**役割:**
- 実際のAPI呼び出し
- 汎用的なクエリパラメータ処理
- レスポンスの変換

### 4. Services（domains/services/）

具体的なユースケースを実装します。

```typescript
// domains/services/cultural_property.ts
import { CulturalPropertyRepository } from '../repositories'

export default class CulturalPropertyService {
  constructor(
    readonly repositories: { cultural_property: CulturalPropertyRepository | null }
  ) {}

  /**
   * 最新の文化財を取得（ホーム画面用）
   */
  async getLatestProperties(limit: number = 5): Promise<CulturalProperties> {
    const props = {
      ordering: '-updated_at',
      limit: limit.toString(),
    }
    try {
      const properties = await this.repositories.cultural_property?.get(props)
      return properties || []
    } catch (e) {
      console.error(e)
      return []
    }
  }

  /**
   * ムービー付きの文化財を取得（一覧画面用）
   */
  async getPropertiesWithMovies(): Promise<CulturalProperties> {
    const props = { has_movies: 'true' }
    // ...
  }
}
```

**役割:**
- ビジネスロジックの実装
- 具体的なパラメータの指定
- エラーハンドリング
- 複数リポジトリの組み合わせ

### 5. Service Export（domains/services/index.ts）

サービスのインスタンスを生成してエクスポートします。

```typescript
// domains/services/index.ts
import { CulturalPropertyRepository } from '@/infrastructures/repositories'
import CulturalPropertyService from './cultural_property'

export const cultural_property = new CulturalPropertyService({
  cultural_property: CulturalPropertyRepository,
})

export const movie = new MovieService({
  movie: MovieRepository,
})
```

---

## コンポーネント設計

### コンポーネントの分類

| ディレクトリ | 役割 | 例 |
|-------------|------|-----|
| `blocks/` | 汎用的な機能ブロック | `NavigationTab`, `LatestCulturalProperties`, `ActiveUserRanking` |
| `common/` | 再利用可能なUI部品 | `FormField`, `LocationPicker` |
| `layouts/` | ページレイアウト | `Layout`, `LayoutWithFooter` |
| `{feature}/` | 機能固有のコンポーネント | `CulturalPropertyCard`, `MovieCard` |
| `helpers/` | ヘルパー関数を持つコンポーネント | `html_renderer`, `typing_effect` |

### blocksコンポーネントの設計原則

1. **汎用性**: 特定のページに依存しない
2. **カスタマイズ性**: propsで挙動を変更可能
3. **独立性**: 他のコンポーネントへの依存を最小限に

```typescript
// 良い例: 汎用的なpropsを持つ
type Props = {
  limit?: number
  title?: string
  icon?: React.ReactNode
  moreLink?: string
  moreLinkText?: string
}

const LatestCulturalProperties: React.FC<Props> = ({
  limit = 5,
  title = '最新の文化財',
  icon = '🏛️',
  moreLink = '/cultural-properties',
  moreLinkText = 'もっと見る',
}) => {
  // ...
}
```

### コンポーネントからサービスの呼び出し

コンポーネントは直接Repositoryを呼び出さず、Service層を経由します。

```typescript
// ✅ 良い例: Service層を使用
import { cultural_property as culturalPropertyService } from '@/domains/services'

const MyComponent = () => {
  useEffect(() => {
    const fetchData = async () => {
      const data = await culturalPropertyService.getLatestProperties(5)
      setProperties(data)
    }
    fetchData()
  }, [])
}

// ❌ 悪い例: Repositoryを直接使用
import { CulturalPropertyRepository } from '@/infrastructures/repositories'

const MyComponent = () => {
  useEffect(() => {
    const fetchData = async () => {
      const data = await CulturalPropertyRepository.get({ limit: '5' })
      // ...
    }
  }, [])
}
```

---

## 命名規則

### ファイル名

| 種類 | 規則 | 例 |
|------|------|-----|
| コンポーネント | PascalCase | `LatestCulturalProperties.tsx` |
| ページ | kebab-case | `cultural-properties/[id]/edit.tsx` |
| モデル/サービス | snake_case | `cultural_property.ts` |
| ユーティリティ | camelCase | `http.ts` |

### 変数・関数名

| 種類 | 規則 | 例 |
|------|------|-----|
| コンポーネント | PascalCase | `NavigationTab` |
| 関数 | camelCase | `getLatestProperties` |
| 定数 | UPPER_SNAKE_CASE | `MAX_LIMIT` |
| 型 | PascalCase | `CulturalProperty` |

### サービスメソッド名

| プレフィックス | 用途 | 例 |
|---------------|------|-----|
| `get` | 一覧取得 | `getProperties()`, `getLatestMovies()` |
| `find` | 単一取得 | `findMovie(id)` |
| `search` | 検索 | `searchProperties(query)` |
| `create` | 作成 | `createProperty(data)` |
| `update` | 更新 | `updateProperty(id, data)` |
| `remove` | 削除 | `removeProperty(id)` |

---

## データフロー

### 読み取り（Read）

```
User Action (ページ表示)
    ↓
Page/Component
    ↓ useEffect()
Service.getXxx()
    ↓
Repository.get() / find()
    ↓
HTTP GET /api/v1/xxx
    ↓
Response → State → Render
```

### 書き込み（Write）

```
User Action (フォーム送信)
    ↓
Page/Component
    ↓ handleSubmit()
Service.createXxx() / updateXxx()
    ↓
Repository.create() / update()
    ↓
HTTP POST/PATCH /api/v1/xxx
    ↓
Response → State Update → Redirect/Render
```

### 認証付きリクエスト

```typescript
// infrastructures/lib/http.ts
export async function get<T>(url: string): Promise<T> {
  const token = localStorage.getItem('auth_token')
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Token ${token}`
  }
  const response = await fetch(url, { headers })
  return response.json()
}
```

---

## 追加時のチェックリスト

### 新しいモデルを追加する場合

1. [ ] `domains/models/` に型定義を追加
2. [ ] `domains/models/index.ts` にエクスポートを追加

### 新しいAPIエンドポイントを追加する場合

1. [ ] `domains/repositories/` にインターフェースを追加/更新
2. [ ] `infrastructures/repositories/` に実装を追加/更新
3. [ ] `domains/services/` にユースケースを追加
4. [ ] `domains/services/index.ts` でサービスを初期化

### 新しいコンポーネントを追加する場合

1. [ ] 汎用的なら `components/blocks/` に配置
2. [ ] 機能固有なら `components/{feature}/` に配置
3. [ ] propsでカスタマイズ可能にする
4. [ ] Service層を経由してデータを取得

---

## 参考資料

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber)
