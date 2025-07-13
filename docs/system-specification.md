# システム仕様書

## 1. システム概要

### 1.1 アーキテクチャ概要
```
[Frontend] Next.js App Router ←→ [Backend] Supabase
    ↓
[Database] PostgreSQL (Supabase)
    ↓
[Deploy] Vercel
```

### 1.2 技術スタック
- **フロントエンド**: Next.js 15 + TypeScript + Tailwind CSS
- **バックエンド**: Supabase（自動生成API）
- **データベース**: PostgreSQL（Supabase提供）
- **認証**: Supabase Auth（将来実装）
- **デプロイ**: Vercel
- **状態管理**: React useState/useEffect + Supabase Real-time（必要に応じて）

## 2. システム構成

### 2.1 フロントエンド構成
```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # ホームページ
│   ├── products/          # 商品管理ページ
│   │   ├── page.tsx       # 商品一覧
│   │   ├── [id]/          # 商品詳細
│   │   └── create/        # 商品作成
│   ├── import/            # JSONインポートページ
│   └── learn/             # 学習コンテンツページ
├── components/            # 再利用可能コンポーネント
│   ├── ui/               # 基本UIコンポーネント
│   ├── ProductList.tsx   # 商品リスト
│   ├── ProductForm.tsx   # 商品フォーム
│   ├── ImportTool.tsx    # インポートツール
│   └── Tutorial.tsx      # チュートリアル
├── lib/                  # ユーティリティ
│   ├── supabase.ts      # Supabase クライアント
│   ├── types.ts         # 型定義
│   └── utils.ts         # ヘルパー関数
└── hooks/               # カスタムフック
    ├── useProducts.ts   # 商品データ操作
    └── useImport.ts     # インポート機能
```

### 2.2 Supabase構成
```
Supabase Project
├── Database
│   ├── products (商品テーブル)
│   ├── product_details (商品詳細テーブル)
│   └── categories (カテゴリテーブル)
├── API (自動生成)
│   ├── REST API
│   └── GraphQL (オプション)
├── Auth (将来実装)
└── Storage (将来実装)
```

## 3. 画面構成

### 3.1 ページ一覧
| ページ | パス | 説明 |
|--------|------|------|
| ホーム | `/` | プロジェクト概要とナビゲーション |
| 商品一覧 | `/products` | 商品データの表示・CRUD操作 |
| 商品詳細 | `/products/[id]` | 個別商品の詳細表示・編集 |
| 商品作成 | `/products/create` | 新規商品作成 |
| データインポート | `/import` | JSONファイルからのデータ移行 |
| 学習ガイド | `/learn` | Supabase操作の手順書 |

### 3.2 コンポーネント設計

#### 3.2.1 ProductList コンポーネント
```typescript
interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  sortConfig: SortConfig;
  onSort: (field: string) => void;
  filterConfig: FilterConfig;
  onFilter: (filters: FilterConfig) => void;
}
```

#### 3.2.2 ProductForm コンポーネント
```typescript
interface ProductFormProps {
  product?: Product;
  onSubmit: (product: Product) => void;
  onCancel: () => void;
  isLoading: boolean;
}
```

#### 3.2.3 ImportTool コンポーネント
```typescript
interface ImportToolProps {
  onImport: (data: ProductData[]) => void;
  isLoading: boolean;
  importProgress: ImportProgress;
}
```

## 4. 機能仕様

### 4.1 データ操作機能

#### 4.1.1 商品データ CRUD
- **作成（Create）**: フォームによる新規商品登録
- **読取（Read）**: 一覧表示、詳細表示、検索・フィルタリング
- **更新（Update）**: フォームによるデータ編集
- **削除（Delete）**: 確認ダイアログ付き削除

#### 4.1.2 ソート機能
- 各カラムクリックでソート切り替え
- 昇順・降順・初期状態の3状態切り替え
- ソート状態の視覚的表示

#### 4.1.3 フィルター機能
- テキスト検索（商品名、説明文）
- カテゴリ選択フィルター
- 価格範囲フィルター（最小値〜最大値）
- 複数フィルターの組み合わせ

### 4.2 データインポート機能

#### 4.2.1 JSONファイル処理
```typescript
// サポート形式
interface ImportData {
  products: Product[];
  productDetails: ProductDetail[];
}

// バリデーション
const validateImportData = (data: unknown): ImportData => {
  // JSONスキーマ検証
  // 必須フィールド確認
  // データ型確認
};
```

#### 4.2.2 インポート処理フロー
1. ファイル選択・読み込み
2. JSON解析・バリデーション
3. プレビュー表示
4. 重複チェック
5. 一括インサート実行
6. 結果表示

### 4.3 学習サポート機能

#### 4.3.1 チュートリアルコンテンツ
- Supabaseプロジェクト作成手順
- テーブル設計の解説
- API使用方法の説明
- エラー対処法

#### 4.3.2 インタラクティブガイド
- 操作手順のステップ表示
- 現在の進行状況表示
- 次に行うべきアクションの提示

## 5. データフロー

### 5.1 データ取得フロー
```
1. Component → useProducts hook
2. useProducts → Supabase Client
3. Supabase Client → Supabase API
4. Supabase API → PostgreSQL
5. PostgreSQL → API → Client → Hook → Component
```

### 5.2 データ更新フロー
```
1. User Action → Form Submit
2. Form → Validation
3. Component → useProducts hook
4. useProducts → Supabase Client (insert/update/delete)
5. Success → UI Update + Toast Notification
6. Error → Error Display
```

## 6. エラーハンドリング

### 6.1 エラー種別
- **ネットワークエラー**: 接続失敗、タイムアウト
- **認証エラー**: API キー無効、権限不足
- **バリデーションエラー**: 入力値不正、必須項目未入力
- **データベースエラー**: 制約違反、重複エラー

### 6.2 エラー表示戦略
- **Toast通知**: 操作結果の即座表示
- **フィールドエラー**: フォーム項目別エラー表示
- **エラーページ**: 致命的エラー時の専用ページ
- **デバッグ情報**: 開発環境での詳細エラー情報

## 7. パフォーマンス考慮事項

### 7.1 フロントエンド最適化
- **遅延読み込み**: React.lazy によるコンポーネント分割
- **メモ化**: React.memo, useMemo によるレンダリング最適化
- **仮想化**: 大量データ表示時の react-window 使用検討

### 7.2 データベース最適化
- **インデックス**: 検索・ソートで使用するカラム
- **ページネーション**: 大量データの分割取得
- **キャッシュ**: よく使用されるデータのブラウザキャッシュ

## 8. セキュリティ

### 8.1 データ保護
- **RLS (Row Level Security)**: Supabase テーブル レベル セキュリティ
- **入力サニタイゼーション**: XSS 攻撃対策
- **CSRFトークン**: フォーム送信時の保護

### 8.2 API セキュリティ
- **APIキー管理**: 環境変数での秘匿情報管理
- **レート制限**: API 呼び出し頻度制限
- **HTTPS通信**: 全ての通信の暗号化

## 9. 開発・デプロイメント

### 9.1 開発環境構築
```bash
# 環境構築手順
1. npm install
2. Supabase プロジェクト作成
3. .env.local に API キー設定
4. npm run dev
```

### 9.2 Vercel デプロイ設定
```javascript
// next.config.ts
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }
};
```

### 9.3 CI/CD パイプライン
- **自動デプロイ**: Git push 時の Vercel 自動デプロイ
- **プレビュー**: プルリクエスト時のプレビュー環境
- **環境変数**: 本番・開発環境の設定分離

## 10. 監視・ログ

### 10.1 ログ収集
- **Supabase ログ**: データベース操作ログ
- **Next.js ログ**: アプリケーションログ
- **Vercel Analytics**: パフォーマンス監視

### 10.2 メトリクス
- **レスポンス時間**: API 呼び出し時間
- **エラー率**: 失敗した操作の割合
- **使用量**: データベース容量、API コール数