"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Category, CreateCategoryInput, UpdateCategoryInput } from "@/lib/types";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // カテゴリ一覧取得
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "カテゴリの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // カテゴリ作成
  const createCategory = async (categoryData: CreateCategoryInput): Promise<Category | null> => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .insert([categoryData])
        .select()
        .single();

      if (error) throw error;
      
      // 一覧を再取得
      await fetchCategories();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "カテゴリの作成に失敗しました");
      return null;
    }
  };

  // カテゴリ更新
  const updateCategory = async (id: string, updates: UpdateCategoryInput): Promise<Category | null> => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      
      // 一覧を再取得
      await fetchCategories();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "カテゴリの更新に失敗しました");
      return null;
    }
  };

  // カテゴリ削除
  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      // 一覧を再取得
      await fetchCategories();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "カテゴリの削除に失敗しました");
      return false;
    }
  };

  // 初回読み込み
  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}