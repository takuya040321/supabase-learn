-- サンプルデータ挿入
-- テーブル作成後に実行してください

-- 1. カテゴリデータの挿入
INSERT INTO categories (name, description) VALUES
('Electronics', '電子機器・家電製品・IT関連商品'),
('Books', '書籍・出版物・電子書籍'),
('Clothing', '衣類・ファッション・アクセサリー'),
('Sports', 'スポーツ・アウトドア用品・フィットネス'),
('Home & Garden', '家庭用品・インテリア・ガーデニング'),
('Health & Beauty', '健康・美容・化粧品'),
('Toys & Games', 'おもちゃ・ゲーム・ホビー'),
('Food & Beverage', '食品・飲料・グルメ');

-- 2. 商品データの挿入
INSERT INTO products (name, category_id, price, stock_quantity, image_url, is_active) VALUES
-- Electronics カテゴリ
('iPhone 15 Pro', (SELECT id FROM categories WHERE name = 'Electronics'), 159800.00, 50, 'https://via.placeholder.com/300x300/007acc/ffffff?text=iPhone15Pro', true),
('MacBook Air M2', (SELECT id FROM categories WHERE name = 'Electronics'), 134800.00, 25, 'https://via.placeholder.com/300x300/007acc/ffffff?text=MacBookAir', true),
('Sony WH-1000XM5', (SELECT id FROM categories WHERE name = 'Electronics'), 39800.00, 100, 'https://via.placeholder.com/300x300/007acc/ffffff?text=SonyHeadphones', true),
('iPad Pro 12.9インチ', (SELECT id FROM categories WHERE name = 'Electronics'), 159800.00, 30, 'https://via.placeholder.com/300x300/007acc/ffffff?text=iPadPro', true),
('Nintendo Switch', (SELECT id FROM categories WHERE name = 'Electronics'), 32978.00, 75, 'https://via.placeholder.com/300x300/007acc/ffffff?text=Switch', true),

-- Books カテゴリ
('Clean Code', (SELECT id FROM categories WHERE name = 'Books'), 3980.00, 200, 'https://via.placeholder.com/300x300/28a745/ffffff?text=CleanCode', true),
('JavaScript: The Good Parts', (SELECT id FROM categories WHERE name = 'Books'), 2980.00, 150, 'https://via.placeholder.com/300x300/28a745/ffffff?text=JavaScript', true),
('デザインパターン', (SELECT id FROM categories WHERE name = 'Books'), 4500.00, 80, 'https://via.placeholder.com/300x300/28a745/ffffff?text=DesignPattern', true),
('アルゴリズム図鑑', (SELECT id FROM categories WHERE name = 'Books'), 2800.00, 120, 'https://via.placeholder.com/300x300/28a745/ffffff?text=Algorithm', true),
('リーダブルコード', (SELECT id FROM categories WHERE name = 'Books'), 2600.00, 90, 'https://via.placeholder.com/300x300/28a745/ffffff?text=ReadableCode', true),

-- Clothing カテゴリ
('ユニクロ ヒートテック', (SELECT id FROM categories WHERE name = 'Clothing'), 1290.00, 500, 'https://via.placeholder.com/300x300/dc3545/ffffff?text=Heattech', true),
('ナイキ エアマックス', (SELECT id FROM categories WHERE name = 'Clothing'), 12000.00, 40, 'https://via.placeholder.com/300x300/dc3545/ffffff?text=AirMax', true),
('レザージャケット', (SELECT id FROM categories WHERE name = 'Clothing'), 25000.00, 15, 'https://via.placeholder.com/300x300/dc3545/ffffff?text=LeatherJacket', true),
('カシミヤセーター', (SELECT id FROM categories WHERE name = 'Clothing'), 18000.00, 20, 'https://via.placeholder.com/300x300/dc3545/ffffff?text=Cashmere', true),
('デニムジーンズ', (SELECT id FROM categories WHERE name = 'Clothing'), 8500.00, 60, 'https://via.placeholder.com/300x300/dc3545/ffffff?text=Denim', true),

-- Sports カテゴリ
('ヨガマット', (SELECT id FROM categories WHERE name = 'Sports'), 3500.00, 80, 'https://via.placeholder.com/300x300/ffc107/000000?text=YogaMat', true),
('ダンベル 10kg', (SELECT id FROM categories WHERE name = 'Sports'), 4500.00, 45, 'https://via.placeholder.com/300x300/ffc107/000000?text=Dumbbell', true),
('ランニングシューズ', (SELECT id FROM categories WHERE name = 'Sports'), 15000.00, 35, 'https://via.placeholder.com/300x300/ffc107/000000?text=RunningShoes', true),
('テニスラケット', (SELECT id FROM categories WHERE name = 'Sports'), 22000.00, 20, 'https://via.placeholder.com/300x300/ffc107/000000?text=TennisRacket', true),
('サッカーボール', (SELECT id FROM categories WHERE name = 'Sports'), 3800.00, 55, 'https://via.placeholder.com/300x300/ffc107/000000?text=SoccerBall', true),

-- Home & Garden カテゴリ
('コーヒーメーカー', (SELECT id FROM categories WHERE name = 'Home & Garden'), 12000.00, 30, 'https://via.placeholder.com/300x300/6f42c1/ffffff?text=CoffeeMaker', true),
('観葉植物（モンステラ）', (SELECT id FROM categories WHERE name = 'Home & Garden'), 2500.00, 25, 'https://via.placeholder.com/300x300/6f42c1/ffffff?text=Monstera', true),
('キャンドル セット', (SELECT id FROM categories WHERE name = 'Home & Garden'), 1800.00, 100, 'https://via.placeholder.com/300x300/6f42c1/ffffff?text=CandleSet', true),
('クッション カバー', (SELECT id FROM categories WHERE name = 'Home & Garden'), 2200.00, 70, 'https://via.placeholder.com/300x300/6f42c1/ffffff?text=CushionCover', true),
('アロマディフューザー', (SELECT id FROM categories WHERE name = 'Home & Garden'), 6800.00, 40, 'https://via.placeholder.com/300x300/6f42c1/ffffff?text=Diffuser', true);

-- 3. 商品詳細データの挿入
INSERT INTO product_details (product_id, description, specifications, weight, dimensions, material, warranty_period) VALUES
(
    (SELECT id FROM products WHERE name = 'iPhone 15 Pro'),
    'Apple iPhone 15 Pro は、プロ向けの最新スマートフォンです。新しいA17 Proチップを搭載し、革新的なカメラシステムとチタニウムデザインを備えています。',
    '{"display": "6.1インチ Super Retina XDR", "storage": "128GB", "camera": "48MP メインカメラ", "battery": "最大23時間のビデオ再生", "chip": "A17 Pro", "os": "iOS 17"}',
    0.187,
    '146.6×70.6×8.25mm',
    'チタニウム',
    12
),
(
    (SELECT id FROM products WHERE name = 'MacBook Air M2'),
    'MacBook Air M2は、パワフルなM2チップを搭載した軽量ノートブック。優れたパフォーマンスと長時間のバッテリー駆動を実現します。',
    '{"display": "13.6インチ Liquid Retina", "storage": "256GB SSD", "memory": "8GB", "chip": "Apple M2", "battery": "最大18時間", "ports": "2x Thunderbolt"}',
    1.24,
    '304×215×11.3mm',
    'アルミニウム',
    12
),
(
    (SELECT id FROM products WHERE name = 'Sony WH-1000XM5'),
    'Sony WH-1000XM5は、業界最高クラスのノイズキャンセリング性能を誇るワイヤレスヘッドホンです。',
    '{"driver": "30mm", "frequency": "4Hz-40kHz", "battery": "最大30時間", "noise_cancelling": "デュアルノイズセンサー", "connectivity": "Bluetooth 5.2"}',
    0.25,
    '254×192×102mm',
    'プラスチック・レザー',
    12
),
(
    (SELECT id FROM products WHERE name = 'Clean Code'),
    'ロバート・C・マーチンによる、読みやすく保守しやすいコードの書き方を学べる名著です。プログラマー必読の一冊。',
    '{"pages": 464, "language": "日本語", "publisher": "KADOKAWA", "isbn": "978-4048930591", "format": "単行本"}',
    0.52,
    '188×257×25mm',
    '紙',
    null
),
(
    (SELECT id FROM products WHERE name = 'ユニクロ ヒートテック'),
    'ユニクロの定番インナー。吸湿発熱、保温、抗菌防臭機能を備えた高機能インナーウェアです。',
    '{"material": "レーヨン68%、ポリエステル27%、ポリウレタン5%", "sizes": ["S", "M", "L", "XL"], "colors": ["ブラック", "ホワイト", "グレー"], "care": "洗濯機可"}',
    0.12,
    'Mサイズ基準',
    'レーヨン混合',
    null
),
(
    (SELECT id FROM products WHERE name = 'ヨガマット'),
    '滑り止め加工が施された高品質ヨガマット。ヨガ、ピラティス、筋トレなど様々な用途に使用できます。',
    '{"thickness": "6mm", "material": "TPE", "size": "183cm×61cm", "weight": "1.2kg", "colors": ["パープル", "ピンク", "ブルー", "グリーン"]}',
    1.2,
    '183×61×0.6cm',
    'TPE（熱可塑性エラストマー）',
    6
),
(
    (SELECT id FROM products WHERE name = 'コーヒーメーカー'),
    '全自動コーヒーメーカー。豆から挽きたてのコーヒーを楽しめます。タイマー機能付きで朝の忙しい時間にも便利。',
    '{"capacity": "10カップ", "features": ["豆挽き機能", "タイマー", "保温機能"], "power": "900W", "water_tank": "1.4L"}',
    3.8,
    '280×220×360mm',
    'ステンレス・プラスチック',
    24
);

-- 4. 追加の商品データ（在庫なし商品も含む）
INSERT INTO products (name, category_id, price, stock_quantity, image_url, is_active) VALUES
('PlayStation 5', (SELECT id FROM categories WHERE name = 'Electronics'), 49980.00, 0, 'https://via.placeholder.com/300x300/007acc/ffffff?text=PS5', true),
('限定版 アートブック', (SELECT id FROM categories WHERE name = 'Books'), 15000.00, 0, 'https://via.placeholder.com/300x300/28a745/ffffff?text=ArtBook', false),
('プレミアム スニーカー', (SELECT id FROM categories WHERE name = 'Clothing'), 35000.00, 5, 'https://via.placeholder.com/300x300/dc3545/ffffff?text=PremiumSneakers', true);

-- データ確認用クエリ（コメントアウト状態）
/*
-- カテゴリ別商品数を確認
SELECT 
    c.name as category_name,
    COUNT(p.id) as product_count,
    COUNT(CASE WHEN p.is_active THEN 1 END) as active_products,
    COUNT(CASE WHEN p.stock_quantity = 0 THEN 1 END) as out_of_stock
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name
ORDER BY c.name;

-- 商品詳細付きビューの確認
SELECT * FROM products_with_details LIMIT 10;

-- 在庫状況の確認
SELECT 
    name,
    stock_quantity,
    is_active,
    CASE 
        WHEN stock_quantity = 0 THEN '在庫切れ'
        WHEN stock_quantity <= 10 THEN '在庫少'
        ELSE '在庫あり'
    END as stock_status
FROM products
ORDER BY stock_quantity;
*/