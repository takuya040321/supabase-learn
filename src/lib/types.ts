// データベーステーブルの型定義

export type UUID = string;

// カテゴリテーブル
export interface Category {
  id: UUID;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

// 商品テーブル
export interface Product {
  id: UUID;
  name: string;
  category_id: UUID | null;
  price: number;
  stock_quantity: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// 商品詳細テーブル
export interface ProductDetail {
  id: UUID;
  product_id: UUID;
  description: string | null;
  specifications: Record<string, any> | null;
  weight: number | null;
  dimensions: string | null;
  material: string | null;
  warranty_period: number | null;
  created_at: string;
  updated_at: string;
}

// ビュー：商品詳細付き
export interface ProductWithDetails {
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
  created_at: string;
  updated_at: string;
}

// フォーム用の型（IDと日時フィールドを除外）
export type CreateProductInput = Omit<Product, "id" | "created_at" | "updated_at">;
export type UpdateProductInput = Partial<CreateProductInput>;

export type CreateCategoryInput = Omit<Category, "id" | "created_at" | "updated_at">;
export type UpdateCategoryInput = Partial<CreateCategoryInput>;

export type CreateProductDetailInput = Omit<ProductDetail, "id" | "created_at" | "updated_at">;
export type UpdateProductDetailInput = Partial<CreateProductDetailInput>;

// APIレスポンス用の型
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

// ソート設定
export interface SortConfig {
  field: string;
  direction: "asc" | "desc" | null;
}

// フィルター設定
export interface FilterConfig {
  search?: string;
  category_id?: string;
  price_min?: number;
  price_max?: number;
  is_active?: boolean;
}

// インポート用の型
export interface ImportData {
  categories: CreateCategoryInput[];
  products: CreateProductInput[];
  productDetails: CreateProductDetailInput[];
}

// インポート進行状況
export interface ImportProgress {
  total: number;
  completed: number;
  current: string;
  errors: string[];
}