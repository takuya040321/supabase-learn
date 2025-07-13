# API仕様書

## 1. API概要

### 1.1 基本情報
- **API基盤**: Supabase 自動生成 REST API
- **認証方式**: API Key認証（将来的にJWT認証追加予定）
- **レスポンス形式**: JSON
- **文字エンコーディング**: UTF-8
- **通信プロトコル**: HTTPS

### 1.2 ベースURL
```
https://[PROJECT_ID].supabase.co/rest/v1/
```

### 1.3 共通ヘッダー
```http
Content-Type: application/json
apikey: [SUPABASE_ANON_KEY]
Authorization: Bearer [SUPABASE_ANON_KEY]
```

## 2. データ型定義

### 2.1 TypeScript型定義
```typescript
// 基本型
type UUID = string;
type Timestamp = string; // ISO 8601 format

// カテゴリ
interface Category {
  id: UUID;
  name: string;
  description: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

// 商品
interface Product {
  id: UUID;
  name: string;
  category_id: UUID | null;
  price: number;
  stock_quantity: number;
  image_url: string | null;
  is_active: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}

// 商品詳細
interface ProductDetail {
  id: UUID;
  product_id: UUID;
  description: string | null;
  specifications: Record<string, any> | null;
  weight: number | null;
  dimensions: string | null;
  material: string | null;
  warranty_period: number | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

// 商品とカテゴリ、詳細を結合したビュー
interface ProductWithDetails {
  id: UUID;
  name: string;
  price: number;
  stock_quantity: number;
  image_url: string | null;
  is_active: boolean;
  category_name: string | null;
  description: string | null;
  weight: number | null;
  dimensions: string | null;
  material: string | null;
  warranty_period: number | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

### 2.2 エラーレスポンス型
```typescript
interface ApiError {
  code: string;
  message: string;
  details?: string;
  hint?: string;
}
```

## 3. カテゴリAPI

### 3.1 カテゴリ一覧取得
```http
GET /categories
```

**クエリパラメータ**
| パラメータ | 型 | 必須 | 説明 |
|------------|----|----- |------|
| select | string | No | 取得カラム指定 |
| order | string | No | ソート順（例：name.asc） |
| limit | number | No | 取得件数制限 |
| offset | number | No | 取得開始位置 |

**レスポンス例**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Electronics",
    "description": "電子機器・家電製品",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### 3.2 カテゴリ作成
```http
POST /categories
```

**リクエストボディ**
```json
{
  "name": "New Category",
  "description": "カテゴリの説明"
}
```

**レスポンス例**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174001",
  "name": "New Category",
  "description": "カテゴリの説明",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### 3.3 カテゴリ更新
```http
PATCH /categories?id=eq.{category_id}
```

**リクエストボディ**
```json
{
  "name": "Updated Category",
  "description": "更新された説明"
}
```

### 3.4 カテゴリ削除
```http
DELETE /categories?id=eq.{category_id}
```

## 4. 商品API

### 4.1 商品一覧取得
```http
GET /products
```

**クエリパラメータ**
| パラメータ | 型 | 必須 | 説明 |
|------------|----|----- |------|
| select | string | No | 取得カラム指定 |
| category_id | string | No | カテゴリでフィルター |
| is_active | boolean | No | 有効状態でフィルター |
| price | string | No | 価格範囲（例：gte.1000,lte.5000） |
| name | string | No | 商品名検索（例：ilike.*iPhone*） |
| order | string | No | ソート順 |
| limit | number | No | 取得件数制限 |
| offset | number | No | 取得開始位置 |

**使用例**
```http
GET /products?select=*,categories(name)&is_active=eq.true&order=created_at.desc&limit=20
```

**レスポンス例**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174002",
    "name": "iPhone 15 Pro",
    "category_id": "123e4567-e89b-12d3-a456-426614174000",
    "price": 159800,
    "stock_quantity": 50,
    "image_url": "https://example.com/iphone15pro.jpg",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "categories": {
      "name": "Electronics"
    }
  }
]
```

### 4.2 商品詳細取得
```http
GET /products?id=eq.{product_id}&select=*,categories(name),product_details(*)
```

**レスポンス例**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174002",
    "name": "iPhone 15 Pro",
    "category_id": "123e4567-e89b-12d3-a456-426614174000",
    "price": 159800,
    "stock_quantity": 50,
    "image_url": "https://example.com/iphone15pro.jpg",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "categories": {
      "name": "Electronics"
    },
    "product_details": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174003",
        "product_id": "123e4567-e89b-12d3-a456-426614174002",
        "description": "Apple iPhone 15 Pro は、プロ向けの最新スマートフォンです。",
        "specifications": {
          "display": "6.1インチ Super Retina XDR",
          "storage": "128GB",
          "camera": "48MP メインカメラ"
        },
        "weight": 0.187,
        "dimensions": "146.6×70.6×8.25mm",
        "material": "チタニウム",
        "warranty_period": 12,
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
]
```

### 4.3 商品作成
```http
POST /products
```

**リクエストボディ**
```json
{
  "name": "New Product",
  "category_id": "123e4567-e89b-12d3-a456-426614174000",
  "price": 9800,
  "stock_quantity": 100,
  "image_url": "https://example.com/newproduct.jpg",
  "is_active": true
}
```

### 4.4 商品更新
```http
PATCH /products?id=eq.{product_id}
```

**リクエストボディ**
```json
{
  "name": "Updated Product",
  "price": 8800,
  "stock_quantity": 90
}
```

### 4.5 商品削除
```http
DELETE /products?id=eq.{product_id}
```

## 5. 商品詳細API

### 5.1 商品詳細作成
```http
POST /product_details
```

**リクエストボディ**
```json
{
  "product_id": "123e4567-e89b-12d3-a456-426614174002",
  "description": "詳細な商品説明",
  "specifications": {
    "color": "Black",
    "size": "Large"
  },
  "weight": 0.5,
  "dimensions": "10×10×5cm",
  "material": "Plastic",
  "warranty_period": 12
}
```

### 5.2 商品詳細更新
```http
PATCH /product_details?product_id=eq.{product_id}
```

### 5.3 商品詳細削除
```http
DELETE /product_details?product_id=eq.{product_id}
```

## 6. ビューAPI

### 6.1 商品詳細付き一覧取得
```http
GET /products_with_details
```

**クエリパラメータ**
| パラメータ | 型 | 必須 | 説明 |
|------------|----|----- |------|
| category_name | string | No | カテゴリ名でフィルター |
| price | string | No | 価格範囲フィルター |
| material | string | No | 素材でフィルター |
| order | string | No | ソート順 |

**使用例**
```http
GET /products_with_details?category_name=eq.Electronics&price=gte.10000&order=price.asc
```

## 7. 一括操作API

### 7.1 商品一括作成
```http
POST /products
```

**リクエストボディ（配列）**
```json
[
  {
    "name": "Product 1",
    "category_id": "123e4567-e89b-12d3-a456-426614174000",
    "price": 1000,
    "stock_quantity": 10
  },
  {
    "name": "Product 2",
    "category_id": "123e4567-e89b-12d3-a456-426614174000",
    "price": 2000,
    "stock_quantity": 20
  }
]
```

### 7.2 商品一括更新
```http
PATCH /products
```

**ヘッダー**
```http
Prefer: resolution=merge-duplicates
```

## 8. 検索・フィルタリング

### 8.1 全文検索
```http
GET /products?name=ilike.*{search_term}*
GET /product_details?description=ilike.*{search_term}*
```

### 8.2 複合フィルター
```http
GET /products?and=(price.gte.1000,price.lte.5000,is_active.eq.true)
```

### 8.3 ソート
```http
GET /products?order=price.asc,created_at.desc
```

## 9. Supabase JavaScript クライアント

### 9.1 クライアント初期化
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### 9.2 基本的な操作例

#### 9.2.1 データ取得
```typescript
// 商品一覧取得
const { data: products, error } = await supabase
  .from('products')
  .select(`
    *,
    categories(name),
    product_details(*)
  `)
  .eq('is_active', true)
  .order('created_at', { ascending: false });

// 商品詳細取得
const { data: product, error } = await supabase
  .from('products')
  .select(`
    *,
    categories(name),
    product_details(*)
  `)
  .eq('id', productId)
  .single();
```

#### 9.2.2 データ作成
```typescript
const { data, error } = await supabase
  .from('products')
  .insert([
    {
      name: 'New Product',
      category_id: categoryId,
      price: 1000,
      stock_quantity: 10
    }
  ])
  .select();
```

#### 9.2.3 データ更新
```typescript
const { data, error } = await supabase
  .from('products')
  .update({ 
    name: 'Updated Product',
    price: 1200 
  })
  .eq('id', productId)
  .select();
```

#### 9.2.4 データ削除
```typescript
const { error } = await supabase
  .from('products')
  .delete()
  .eq('id', productId);
```

### 9.3 カスタムフック例

#### 9.3.1 商品データ操作フック
```typescript
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(name),
          product_details(*)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

      if (error) throw error;
      await fetchProducts(); // リスト更新
      return data;
    } catch (err) {
      throw err;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchProducts(); // リスト更新
      return data;
    } catch (err) {
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchProducts(); // リスト更新
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  };
}
```

## 10. エラーハンドリング

### 10.1 エラー種別
| HTTPステータス | 説明 | 対処法 |
|----------------|------|--------|
| 400 | Bad Request | リクエストパラメータを確認 |
| 401 | Unauthorized | APIキーを確認 |
| 403 | Forbidden | RLSポリシーを確認 |
| 404 | Not Found | リソースの存在を確認 |
| 409 | Conflict | 一意制約違反を確認 |
| 422 | Unprocessable Entity | バリデーションエラーを確認 |
| 500 | Internal Server Error | サーバーエラー、再試行 |

### 10.2 エラーハンドリング例
```typescript
const handleApiCall = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      // Supabaseエラーハンドリング
      switch (error.code) {
        case 'PGRST116':
          throw new Error('指定されたリソースが見つかりません');
        case '23505':
          throw new Error('重複するデータが存在します');
        default:
          throw new Error(`データベースエラー: ${error.message}`);
      }
    }

    return data;
  } catch (err) {
    console.error('API call failed:', err);
    throw err;
  }
};
```

## 11. パフォーマンス最適化

### 11.1 効率的なクエリ
```typescript
// 必要なカラムのみ取得
.select('id, name, price')

// 適切なフィルタリング
.eq('is_active', true)
.range(0, 19) // ページネーション

// インデックスを活用したソート
.order('created_at', { ascending: false })
```

### 11.2 リアルタイム更新（必要に応じて）
```typescript
// リアルタイム変更の購読
const subscription = supabase
  .channel('products_channel')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'products' },
    (payload) => {
      console.log('Change received!', payload);
      // 状態更新処理
    }
  )
  .subscribe();

// 購読解除
subscription.unsubscribe();
```