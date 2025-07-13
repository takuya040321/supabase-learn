import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* ヘッダー */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Supabase学習アプリ
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Supabaseの基本的な使い方を実践的に学習できるWebアプリケーションです。
            データベース操作、API連携、リアルタイム機能を体験してみましょう。
          </p>
        </div>

        {/* 学習カテゴリ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* カテゴリ1 */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🗄️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              カテゴリ1: データ表示と更新
            </h3>
            <p className="text-gray-600 mb-6">
              Supabaseデータテーブルの表示と更新機能を学習します。
              CRUD操作の基本を習得できます。
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              商品一覧を見る →
            </Link>
          </div>

          {/* カテゴリ2 */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📤</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              カテゴリ2: JSONデータ移行
            </h3>
            <p className="text-gray-600 mb-6">
              JSONファイルからSupabaseへのデータ移行方法を学習します。
              一括インポート機能を体験できます。
            </p>
            <Link
              href="/import"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              インポート機能 →
            </Link>
          </div>

          {/* カテゴリ3 */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              カテゴリ3: 便利機能
            </h3>
            <p className="text-gray-600 mb-6">
              ソートやフィルターなどの便利機能の使い方を学習します。
              検索機能の実装方法を習得できます。
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              機能を試す →
            </Link>
          </div>
        </div>

        {/* Supabase機能説明 */}
        <div className="bg-white p-8 rounded-xl shadow-lg mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            学習できるSupabase機能
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🗃️</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Database</h4>
              <p className="text-sm text-gray-600">
                PostgreSQLデータベースの操作
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🔌</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">API</h4>
              <p className="text-sm text-gray-600">
                自動生成REST APIの活用
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🔐</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Auth</h4>
              <p className="text-sm text-gray-600">
                認証・認可システム（将来実装）
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Realtime</h4>
              <p className="text-sm text-gray-600">
                リアルタイム更新機能
              </p>
            </div>
          </div>
        </div>

        {/* 学習手順 */}
        <div className="bg-gray-50 p-8 rounded-xl">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            学習の進め方
          </h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Supabaseプロジェクト作成</h4>
                <p className="text-gray-600">
                  まずはSupabaseアカウントを作成し、新しいプロジェクトを立ち上げましょう。
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">データベーステーブル作成</h4>
                <p className="text-gray-600">
                  商品データ用のテーブルを作成し、基本的なスキーマ設計を学習します。
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">WebアプリでのCRUD操作</h4>
                <p className="text-gray-600">
                  このアプリを使って、データの作成・読取・更新・削除を実践します。
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                4
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">高度な機能の活用</h4>
                <p className="text-gray-600">
                  検索、フィルター、ソート機能を通じて、より実践的な使い方を学習します。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
