"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { FilterConfig, SortConfig } from "@/lib/types";

export default function ProductsPage() {
  const { products, loading, error, fetchProducts } = useProducts();
  const { categories } = useCategories();
  const [filters, setFilters] = useState<FilterConfig>({});
  const [sort, setSort] = useState<SortConfig>({ field: "created_at", direction: "desc" });

  // 検索フィルター更新
  const handleSearchChange = (search: string) => {
    const newFilters = { ...filters, search };
    setFilters(newFilters);
    fetchProducts(newFilters, sort);
  };

  // カテゴリフィルター更新
  const handleCategoryChange = (categoryId: string) => {
    const newFilters = { ...filters, category_id: categoryId || undefined };
    setFilters(newFilters);
    fetchProducts(newFilters, sort);
  };

  // ソート変更
  const handleSort = (field: string) => {
    const direction = sort.field === field && sort.direction === "asc" ? "desc" : "asc";
    const newSort = { field, direction };
    setSort(newSort);
    fetchProducts(filters, newSort);
  };

  // 価格フォーマット
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
    }).format(price);
  };

  if (loading) {
    return (
      <div className=\"flex items-center justify-center min-h-screen\">
        <div className=\"text-lg\">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className=\"flex items-center justify-center min-h-screen\">
        <div className=\"text-red-500\">エラー: {error}</div>
      </div>
    );
  }

  return (
    <div className=\"container mx-auto px-4 py-8\">
      <div className=\"mb-8\">
        <h1 className=\"text-3xl font-bold text-gray-900 mb-4\">商品一覧</h1>
        <p className=\"text-gray-600\">
          Supabaseから取得した商品データを表示しています。検索やフィルター機能を試してみてください。
        </p>
      </div>

      {/* フィルター・検索エリア */}
      <div className=\"bg-white p-6 rounded-lg shadow-md mb-6\">
        <div className=\"grid grid-cols-1 md:grid-cols-3 gap-4\">
          {/* 検索ボックス */}
          <div>
            <label htmlFor=\"search\" className=\"block text-sm font-medium text-gray-700 mb-2\">
              商品名検索
            </label>
            <input
              type=\"text\"
              id=\"search\"
              placeholder=\"商品名を入力...\"
              className=\"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500\"
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          {/* カテゴリフィルター */}
          <div>
            <label htmlFor=\"category\" className=\"block text-sm font-medium text-gray-700 mb-2\">
              カテゴリ
            </label>
            <select
              id=\"category\"
              className=\"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500\"
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value=\"\">すべてのカテゴリ</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* アクションボタン */}
          <div className=\"flex items-end\">
            <button
              onClick={() => {
                setFilters({});
                setSort({ field: \"created_at\", direction: \"desc\" });
                fetchProducts();
              }}
              className=\"px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors\"
            >
              リセット
            </button>
          </div>
        </div>
      </div>

      {/* 商品テーブル */}
      <div className=\"bg-white rounded-lg shadow-md overflow-hidden\">
        <div className=\"overflow-x-auto\">
          <table className=\"min-w-full divide-y divide-gray-200\">
            <thead className=\"bg-gray-50\">
              <tr>
                <th
                  className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100\"
                  onClick={() => handleSort(\"name\")}
                >
                  商品名
                  {sort.field === \"name\" && (
                    <span className=\"ml-1\">
                      {sort.direction === \"asc\" ? \"↑\" : \"↓\"}
                    </span>
                  )}
                </th>
                <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider\">
                  カテゴリ
                </th>
                <th
                  className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100\"
                  onClick={() => handleSort(\"price\")}
                >
                  価格
                  {sort.field === \"price\" && (
                    <span className=\"ml-1\">
                      {sort.direction === \"asc\" ? \"↑\" : \"↓\"}
                    </span>
                  )}
                </th>
                <th
                  className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100\"
                  onClick={() => handleSort(\"stock_quantity\")}
                >
                  在庫
                  {sort.field === \"stock_quantity\" && (
                    <span className=\"ml-1\">
                      {sort.direction === \"asc\" ? \"↑\" : \"↓\"}
                    </span>
                  )}
                </th>
                <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider\">
                  状態
                </th>
                <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider\">
                  詳細
                </th>
              </tr>
            </thead>
            <tbody className=\"bg-white divide-y divide-gray-200\">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className=\"px-6 py-4 text-center text-gray-500\">
                    商品が見つかりませんでした
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className=\"hover:bg-gray-50\">
                    <td className=\"px-6 py-4 whitespace-nowrap\">
                      <div className=\"flex items-center\">
                        {product.image_url && (
                          <img
                            className=\"h-10 w-10 rounded-full mr-3\"
                            src={product.image_url}
                            alt={product.name}
                          />
                        )}
                        <div>
                          <div className=\"text-sm font-medium text-gray-900\">
                            {product.name}
                          </div>
                          {product.description && (
                            <div className=\"text-sm text-gray-500 truncate max-w-xs\">
                              {product.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className=\"px-6 py-4 whitespace-nowrap text-sm text-gray-900\">
                      {product.category_name || \"未分類\"}
                    </td>
                    <td className=\"px-6 py-4 whitespace-nowrap text-sm text-gray-900\">
                      {formatPrice(product.price)}
                    </td>
                    <td className=\"px-6 py-4 whitespace-nowrap text-sm text-gray-900\">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${\n                          product.stock_quantity > 10\n                            ? \"bg-green-100 text-green-800\"\n                            : product.stock_quantity > 0\n                            ? \"bg-yellow-100 text-yellow-800\"\n                            : \"bg-red-100 text-red-800\"\n                        }`}
                      >
                        {product.stock_quantity}個
                      </span>
                    </td>
                    <td className=\"px-6 py-4 whitespace-nowrap\">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${\n                          product.is_active\n                            ? \"bg-green-100 text-green-800\"\n                            : \"bg-gray-100 text-gray-800\"\n                        }`}
                      >
                        {product.is_active ? \"有効\" : \"無効\"}
                      </span>
                    </td>
                    <td className=\"px-6 py-4 whitespace-nowrap text-sm text-gray-500\">
                      {product.weight && `${product.weight}kg`}
                      {product.dimensions && ` | ${product.dimensions}`}
                      {product.material && ` | ${product.material}`}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 統計情報 */}
      <div className=\"mt-6 bg-blue-50 p-4 rounded-lg\">
        <h3 className=\"text-lg font-semibold text-blue-900 mb-2\">統計情報</h3>
        <div className=\"grid grid-cols-1 md:grid-cols-4 gap-4 text-sm\">
          <div>
            <span className=\"text-blue-600 font-medium\">総商品数:</span>{\" \"}
            <span className=\"text-blue-900\">{products.length}件</span>
          </div>
          <div>
            <span className=\"text-blue-600 font-medium\">有効商品:</span>{\" \"}
            <span className=\"text-blue-900\">
              {products.filter((p) => p.is_active).length}件
            </span>
          </div>
          <div>
            <span className=\"text-blue-600 font-medium\">在庫切れ:</span>{\" \"}
            <span className=\"text-blue-900\">
              {products.filter((p) => p.stock_quantity === 0).length}件
            </span>
          </div>
          <div>
            <span className=\"text-blue-600 font-medium\">平均価格:</span>{\" \"}
            <span className=\"text-blue-900\">
              {products.length > 0
                ? formatPrice(
                    products.reduce((sum, p) => sum + p.price, 0) / products.length
                  )
                : \"¥0\"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}"