"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Product, 
  CreateProductInput, 
  UpdateProductInput, 
  FilterConfig, 
  SortConfig,
  ProductWithDetails 
} from "@/lib/types";

export function useProducts() {
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 商品一覧取得
  const fetchProducts = async (filters?: FilterConfig, sort?: SortConfig) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("products_with_details")
        .select("*");

      // フィルター適用
      if (filters) {
        if (filters.search) {
          query = query.ilike("name", `%${filters.search}%`);
        }
        if (filters.category_id) {
          query = query.eq("category_id", filters.category_id);
        }
        if (filters.price_min !== undefined) {
          query = query.gte("price", filters.price_min);
        }
        if (filters.price_max !== undefined) {
          query = query.lte("price", filters.price_max);
        }
        if (filters.is_active !== undefined) {
          query = query.eq("is_active", filters.is_active);
        }
      }

      // ソート適用
      if (sort && sort.direction) {
        query = query.order(sort.field, { ascending: sort.direction === "asc" });
      } else {
        // デフォルトソート
        query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "商品の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // 商品詳細取得（ID指定）
  const fetchProduct = async (id: string): Promise<ProductWithDetails | null> => {
    try {
      const { data, error } = await supabase
        .from("products_with_details")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "商品の取得に失敗しました");
      return null;
    }
  };

  // 商品作成
  const createProduct = async (productData: CreateProductInput): Promise<Product | null> => {
    try {
      const { data, error } = await supabase
        .from("products")
        .insert([productData])
        .select()
        .single();

      if (error) throw error;
      
      // 一覧を再取得
      await fetchProducts();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "商品の作成に失敗しました");
      return null;
    }
  };

  // 商品更新
  const updateProduct = async (id: string, updates: UpdateProductInput): Promise<Product | null> => {
    try {
      const { data, error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      
      // 一覧を再取得
      await fetchProducts();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "商品の更新に失敗しました");
      return null;
    }
  };

  // 商品削除
  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      // 一覧を再取得
      await fetchProducts();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "商品の削除に失敗しました");
      return false;
    }
  };

  // 在庫更新
  const updateStock = async (id: string, newStock: number): Promise<boolean> => {
    return await updateProduct(id, { stock_quantity: newStock }) !== null;
  };

  // 商品の有効/無効切り替え
  const toggleProductStatus = async (id: string, isActive: boolean): Promise<boolean> => {
    return await updateProduct(id, { is_active: isActive }) !== null;
  };

  // 初回読み込み
  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    toggleProductStatus,
  };
}