# データベース設計書

## 1. データベース概要

### 1.1 データベース管理システム
- **DBMS**: PostgreSQL (Supabase提供)
- **バージョン**: PostgreSQL 15以上
- **キャラクターセット**: UTF-8
- **タイムゾーン**: UTC

### 1.2 設計方針
- **正規化**: 第3正規形を基本とする
- **リレーション**: 外部キー制約による整合性保証
- **パフォーマンス**: 適切なインデックス設計
- **拡張性**: 将来の機能追加を考慮した設計

## 2. テーブル設計

### 2.1 ER図
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   categories    │     │    products     │     │ product_details │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │────▶│ id (PK)         │◀────│ id (PK)         │
│ name            │     │ name            │     │ product_id (FK) │
│ description     │     │ category_id (FK)│     │ description     │
│ created_at      │     │ price           │     │ specifications  │
│ updated_at      │     │ stock_quantity  │     │ weight          │
└─────────────────┘     │ image_url       │     │ dimensions      │
                        │ is_active       │     │ material        │
                        │ created_at      │     │ warranty_period │
                        │ updated_at      │     │ created_at      │
                        └─────────────────┘     │ updated_at      │
                                                └─────────────────┘
```

### 2.2 テーブル詳細仕様

#### 2.2.1 categories テーブル（カテゴリ）
| カラム名 | データ型 | 制約 | デフォルト値 | 説明 |
|----------|----------|------|--------------|------|
| id | UUID | PRIMARY KEY | gen_random_uuid() | カテゴリID |
| name | VARCHAR(100) | NOT NULL UNIQUE | - | カテゴリ名 |
| description | TEXT | - | - | カテゴリ説明 |
| created_at | TIMESTAMPTZ | NOT NULL | now() | 作成日時 |
| updated_at | TIMESTAMPTZ | NOT NULL | now() | 更新日時 |

```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 更新日時自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### 2.2.2 products テーブル（商品）
| カラム名 | データ型 | 制約 | デフォルト値 | 説明 |
|----------|----------|------|--------------|------|
| id | UUID | PRIMARY KEY | gen_random_uuid() | 商品ID |
| name | VARCHAR(200) | NOT NULL | - | 商品名 |
| category_id | UUID | FOREIGN KEY | - | カテゴリID |
| price | DECIMAL(10,2) | NOT NULL CHECK (price >= 0) | - | 価格 |
| stock_quantity | INTEGER | NOT NULL CHECK (stock_quantity >= 0) | 0 | 在庫数 |
| image_url | VARCHAR(500) | - | - | 画像URL |
| is_active | BOOLEAN | NOT NULL | true | 有効フラグ |
| created_at | TIMESTAMPTZ | NOT NULL | now() | 作成日時 |
| updated_at | TIMESTAMPTZ | NOT NULL | now() | 更新日時 |

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    image_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 更新日時自動更新トリガー
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- インデックス
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_is_active ON products(is_active);
```

#### 2.2.3 product_details テーブル（商品詳細）
| カラム名 | データ型 | 制約 | デフォルト値 | 説明 |
|----------|----------|------|--------------|------|
| id | UUID | PRIMARY KEY | gen_random_uuid() | 詳細ID |
| product_id | UUID | FOREIGN KEY UNIQUE | - | 商品ID |
| description | TEXT | - | - | 詳細説明 |
| specifications | JSONB | - | - | 仕様書（JSON形式） |
| weight | DECIMAL(8,3) | CHECK (weight > 0) | - | 重量（kg） |
| dimensions | VARCHAR(100) | - | - | 寸法（例：W×D×H） |
| material | VARCHAR(100) | - | - | 素材 |
| warranty_period | INTEGER | CHECK (warranty_period >= 0) | - | 保証期間（月） |
| created_at | TIMESTAMPTZ | NOT NULL | now() | 作成日時 |
| updated_at | TIMESTAMPTZ | NOT NULL | now() | 更新日時 |

```sql
CREATE TABLE product_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID UNIQUE REFERENCES products(id) ON DELETE CASCADE,
    description TEXT,
    specifications JSONB,
    weight DECIMAL(8,3) CHECK (weight > 0),
    dimensions VARCHAR(100),
    material VARCHAR(100),
    warranty_period INTEGER CHECK (warranty_period >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 更新日時自動更新トリガー
CREATE TRIGGER update_product_details_updated_at 
    BEFORE UPDATE ON product_details 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- インデックス
CREATE INDEX idx_product_details_product_id ON product_details(product_id);
CREATE INDEX idx_product_details_specifications ON product_details USING GIN(specifications);
```

## 3. サンプルデータ

### 3.1 categoriesテーブルのサンプルデータ
```sql
INSERT INTO categories (name, description) VALUES
('Electronics', '電子機器・家電製品'),
('Books', '書籍・出版物'),
('Clothing', '衣類・ファッション'),
('Sports', 'スポーツ・アウトドア用品'),
('Home & Garden', '家庭・ガーデン用品');
```

### 3.2 productsテーブルのサンプルデータ
```sql
-- Electronics カテゴリの商品
INSERT INTO products (name, category_id, price, stock_quantity, image_url) VALUES
('iPhone 15 Pro', (SELECT id FROM categories WHERE name = 'Electronics'), 159800.00, 50, 'https://example.com/iphone15pro.jpg'),
('MacBook Air M2', (SELECT id FROM categories WHERE name = 'Electronics'), 134800.00, 25, 'https://example.com/macbookair.jpg'),
('Sony WH-1000XM5', (SELECT id FROM categories WHERE name = 'Electronics'), 39800.00, 100, 'https://example.com/sony-headphones.jpg');

-- Books カテゴリの商品
INSERT INTO products (name, category_id, price, stock_quantity, image_url) VALUES
('Clean Code', (SELECT id FROM categories WHERE name = 'Books'), 3980.00, 200, 'https://example.com/clean-code.jpg'),
('JavaScript: The Good Parts', (SELECT id FROM categories WHERE name = 'Books'), 2980.00, 150, 'https://example.com/js-good-parts.jpg');
```

### 3.3 product_detailsテーブルのサンプルデータ
```sql
INSERT INTO product_details (product_id, description, specifications, weight, dimensions, material, warranty_period) VALUES
(
    (SELECT id FROM products WHERE name = 'iPhone 15 Pro'),
    'Apple iPhone 15 Pro は、プロ向けの最新スマートフォンです。',
    '{"display": "6.1インチ Super Retina XDR", "storage": "128GB", "camera": "48MP メインカメラ", "battery": "最大23時間のビデオ再生"}',
    0.187,
    '146.6×70.6×8.25mm',
    'チタニウム',
    12
);
```

## 4. ビューの定義

### 4.1 商品一覧ビュー（products_with_details）
```sql
CREATE VIEW products_with_details AS
SELECT 
    p.id,
    p.name,
    p.price,
    p.stock_quantity,
    p.image_url,
    p.is_active,
    c.name as category_name,
    pd.description,
    pd.weight,
    pd.dimensions,
    pd.material,
    pd.warranty_period,
    p.created_at,
    p.updated_at
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN product_details pd ON p.id = pd.product_id
WHERE p.is_active = true;
```

### 4.2 カテゴリ別商品数ビュー（category_product_counts）
```sql
CREATE VIEW category_product_counts AS
SELECT 
    c.id,
    c.name,
    c.description,
    COUNT(p.id) as product_count,
    COUNT(CASE WHEN p.is_active = true THEN 1 END) as active_product_count
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name, c.description;
```

## 5. セキュリティ設定（RLS）

### 5.1 Row Level Security（RLS）設定
```sql
-- RLS有効化
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_details ENABLE ROW LEVEL SECURITY;

-- 全ユーザーが読み取り可能
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Product details are viewable by everyone" ON product_details FOR SELECT USING (true);

-- 認証ユーザーのみ編集可能（将来の認証機能実装時用）
CREATE POLICY "Authenticated users can manage categories" ON categories FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage products" ON products FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage product details" ON product_details FOR ALL TO authenticated USING (true);
```

## 6. パフォーマンス最適化

### 6.1 インデックス戦略
```sql
-- 検索性能向上のためのインデックス
CREATE INDEX idx_products_name_trgm ON products USING gin (name gin_trgm_ops);
CREATE INDEX idx_products_price_range ON products (price, is_active);
CREATE INDEX idx_products_created_at ON products (created_at DESC);

-- 全文検索用インデックス
CREATE INDEX idx_product_details_description_fts ON product_details USING gin (to_tsvector('japanese', description));
```

### 6.2 統計情報更新
```sql
-- 統計情報の自動更新設定
ALTER TABLE products SET (autovacuum_analyze_scale_factor = 0.02);
ALTER TABLE product_details SET (autovacuum_analyze_scale_factor = 0.02);
```

## 7. バックアップ・復旧

### 7.1 バックアップ戦略
- **自動バックアップ**: Supabaseの自動バックアップ機能（7日間保持）
- **手動バックアップ**: 重要な変更前の手動スナップショット
- **エクスポート**: 定期的なデータエクスポート（JSON形式）

### 7.2 復旧手順
1. Supabaseダッシュボードからバックアップポイント選択
2. データベースの復元実行
3. アプリケーション接続テスト
4. データ整合性確認

## 8. 監視・メンテナンス

### 8.1 監視項目
- **接続数**: 同時接続数の監視
- **クエリ性能**: 遅いクエリの検出
- **ストレージ使用量**: データベースサイズの監視
- **エラー率**: データベースエラーの監視

### 8.2 定期メンテナンス
- **統計情報更新**: ANALYZE の定期実行
- **インデックス再構築**: 必要に応じた REINDEX
- **不要データ削除**: 古いログデータの削除

## 9. 将来の拡張計画

### 9.1 追加予定テーブル
- **users**: ユーザー情報（認証機能実装時）
- **orders**: 注文情報
- **reviews**: 商品レビュー
- **inventory_logs**: 在庫変動履歴

### 9.2 機能拡張
- **全文検索**: PostgreSQL の全文検索機能活用
- **データ分析**: 売上・在庫分析用の集計テーブル
- **ファイル管理**: Supabase Storage との連携