-- Supabase学習アプリ用テーブル作成
-- このSQLをSupabase Studio > SQL Editorで実行してください

-- 更新日時自動更新用の関数を作成
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 1. カテゴリテーブル作成
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- カテゴリテーブルの更新トリガー
CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2. 商品テーブル作成
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

-- 商品テーブルの更新トリガー
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 商品テーブルのインデックス
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- 3. 商品詳細テーブル作成
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

-- 商品詳細テーブルの更新トリガー
CREATE TRIGGER update_product_details_updated_at 
    BEFORE UPDATE ON product_details 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 商品詳細テーブルのインデックス
CREATE INDEX idx_product_details_product_id ON product_details(product_id);
CREATE INDEX idx_product_details_specifications ON product_details USING GIN(specifications);

-- 4. ビューの作成
-- 商品一覧ビュー（カテゴリ名と詳細情報付き）
CREATE VIEW products_with_details AS
SELECT 
    p.id,
    p.name,
    p.price,
    p.stock_quantity,
    p.image_url,
    p.is_active,
    p.category_id,
    c.name as category_name,
    pd.description,
    pd.specifications,
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

-- カテゴリ別商品数ビュー
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

-- 5. Row Level Security (RLS) 設定
-- RLS有効化
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_details ENABLE ROW LEVEL SECURITY;

-- 全ユーザーが読み取り可能
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Product details are viewable by everyone" ON product_details FOR SELECT USING (true);

-- 匿名ユーザーでも編集可能（学習用のため）
CREATE POLICY "Allow anonymous insert on categories" ON categories FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anonymous update on categories" ON categories FOR UPDATE TO anon USING (true);
CREATE POLICY "Allow anonymous delete on categories" ON categories FOR DELETE TO anon USING (true);

CREATE POLICY "Allow anonymous insert on products" ON products FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anonymous update on products" ON products FOR UPDATE TO anon USING (true);
CREATE POLICY "Allow anonymous delete on products" ON products FOR DELETE TO anon USING (true);

CREATE POLICY "Allow anonymous insert on product_details" ON product_details FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anonymous update on product_details" ON product_details FOR UPDATE TO anon USING (true);
CREATE POLICY "Allow anonymous delete on product_details" ON product_details FOR DELETE TO anon USING (true);

-- 認証ユーザーは全ての操作が可能（将来の認証機能実装時用）
CREATE POLICY "Authenticated users can manage categories" ON categories FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage products" ON products FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage product_details" ON product_details FOR ALL TO authenticated USING (true);