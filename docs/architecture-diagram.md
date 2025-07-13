# アーキテクチャ図

## 1. システム全体アーキテクチャ

### 1.1 高レベルアーキテクチャ
```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface                          │
│                      (Web Browser)                             │
└─────────────────────┬───────────────────────────────────────────┘
                      │ HTTPS
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Vercel Edge Network                        │
│                    (CDN + Static Hosting)                      │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js Application                         │
│                     (Frontend + SSR)                           │
├─────────────────────────────────────────────────────────────────┤
│  App Router Pages:                                              │
│  • / (Home)                                                     │
│  • /products (Product List)                                     │
│  • /products/[id] (Product Detail)                             │
│  • /import (Data Import)                                        │
│  • /learn (Tutorial)                                            │
└─────────────────────┬───────────────────────────────────────────┘
                      │ REST API / WebSocket
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Supabase Platform                         │
├─────────────────────────────────────────────────────────────────┤
│  API Gateway (Kong)                                             │
│  • REST API (PostgREST)                                         │
│  • Real-time API (Phoenix)                                      │
│  • Auth API (GoTrue)                                           │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                         │
│                     (Managed Instance)                         │
├─────────────────────────────────────────────────────────────────┤
│  Tables:                                                        │
│  • categories                                                   │
│  • products                                                     │
│  • product_details                                              │
│                                                                 │
│  Views:                                                         │
│  • products_with_details                                        │
│  • category_product_counts                                      │
└─────────────────────────────────────────────────────────────────┘
```

## 2. フロントエンド アーキテクチャ

### 2.1 Next.js App Router 構造
```
src/app/
├── layout.tsx                 # Root Layout
├── page.tsx                   # Home Page
├── globals.css               # Global Styles
│
├── products/                 # Product Management
│   ├── layout.tsx           # Products Layout
│   ├── page.tsx             # Product List Page
│   ├── [id]/
│   │   └── page.tsx         # Product Detail Page
│   ├── create/
│   │   └── page.tsx         # Product Creation Page
│   └── loading.tsx          # Loading UI
│
├── import/                  # Data Import
│   ├── page.tsx             # Import Page
│   └── components/
│       ├── FileUpload.tsx   # File Upload Component
│       ├── DataPreview.tsx  # Data Preview Component
│       └── ImportProgress.tsx # Progress Indicator
│
└── learn/                   # Learning Resources
    ├── page.tsx             # Tutorial Index
    ├── supabase/
    │   └── page.tsx         # Supabase Tutorial
    └── database/
        └── page.tsx         # Database Tutorial

src/components/
├── ui/                      # Reusable UI Components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Table.tsx
│   └── Toast.tsx
│
├── ProductList.tsx          # Product List Component
├── ProductForm.tsx          # Product Form Component
├── ProductCard.tsx          # Product Card Component
├── CategorySelect.tsx       # Category Selector
├── SearchBar.tsx           # Search Component
├── FilterPanel.tsx         # Filter Component
└── Pagination.tsx          # Pagination Component

src/lib/
├── supabase.ts             # Supabase Client
├── types.ts                # TypeScript Definitions
├── utils.ts                # Utility Functions
├── validations.ts          # Form Validations
└── constants.ts            # App Constants

src/hooks/
├── useProducts.ts          # Product Data Hook
├── useCategories.ts        # Category Data Hook
├── useImport.ts           # Import Functionality Hook
└── useDebounce.ts         # Debounce Hook
```

### 2.2 コンポーネント関係図
```
App Layout
│
├── Header
│   ├── Navigation
│   └── Search Bar
│
├── Main Content
│   ├── Product List Page
│   │   ├── Filter Panel
│   │   │   ├── Category Select
│   │   │   ├── Price Range
│   │   │   └── Search Input
│   │   │
│   │   ├── Product Table
│   │   │   ├── Table Header (Sortable)
│   │   │   ├── Product Rows
│   │   │   │   ├── Product Card
│   │   │   │   └── Action Buttons
│   │   │   └── Pagination
│   │   │
│   │   └── Action Bar
│   │       ├── Add Product Button
│   │       └── Import Button
│   │
│   ├── Product Detail Page
│   │   ├── Product Info
│   │   ├── Product Form
│   │   └── Action Buttons
│   │
│   └── Import Page
│       ├── File Upload
│       ├── Data Preview
│       └── Import Progress
│
└── Footer
```

## 3. データフロー図

### 3.1 基本的なデータフロー
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Browser   │───▶│  Next.js    │───▶│  Supabase   │───▶│ PostgreSQL  │
│             │    │ Application │    │    API      │    │  Database   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       ▲                   ▲                   ▲                   │
       │                   │                   │                   │
       │                   │                   │                   ▼
       │                   │                   │           ┌─────────────┐
       │                   │                   │           │   Tables    │
       │                   │                   │           │ • categories│
       │                   │                   │           │ • products  │
       │                   │                   │           │ • details   │
       │                   │                   │           └─────────────┘
       │                   │                   │
       │            ┌─────────────┐    ┌─────────────┐
       │            │   Custom    │    │   Supabase  │
       │            │    Hooks    │    │   Client    │
       │            └─────────────┘    └─────────────┘
       │                   ▲                   ▲
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                    ┌─────────────┐
                    │ React State │
                    │ Management  │
                    └─────────────┘
```

### 3.2 CRUD操作のデータフロー

#### 3.2.1 CREATE (作成) フロー
```
1. User Input
   ↓
2. Form Validation (Frontend)
   ↓
3. useProducts.createProduct()
   ↓
4. Supabase Client
   ↓
5. POST /products API
   ↓
6. PostgreSQL INSERT
   ↓
7. Response → Update UI State
   ↓
8. Toast Notification
```

#### 3.2.2 READ (読取) フロー
```
1. Component Mount / User Action
   ↓
2. useProducts.fetchProducts()
   ↓
3. Supabase Client
   ↓
4. GET /products API (with filters/sort)
   ↓
5. PostgreSQL SELECT with JOINs
   ↓
6. Response → Set State
   ↓
7. Component Re-render
```

#### 3.2.3 UPDATE (更新) フロー
```
1. User Edit Action
   ↓
2. Form Submit with Validation
   ↓
3. useProducts.updateProduct()
   ↓
4. Supabase Client
   ↓
5. PATCH /products API
   ↓
6. PostgreSQL UPDATE
   ↓
7. Response → Update UI State
   ↓
8. Optimistic UI Update
```

#### 3.2.4 DELETE (削除) フロー
```
1. User Delete Action
   ↓
2. Confirmation Dialog
   ↓
3. useProducts.deleteProduct()
   ↓
4. Supabase Client
   ↓
5. DELETE /products API
   ↓
6. PostgreSQL DELETE (CASCADE)
   ↓
7. Response → Remove from State
   ↓
8. UI Update + Notification
```

## 4. JSONインポート機能のアーキテクチャ

### 4.1 インポート処理フロー
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│File Upload  │───▶│Validation   │───▶│Data Preview │
│Component    │    │& Parsing    │    │Component    │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│File Reader  │    │JSON Schema  │    │Table View   │
│API          │    │Validator    │    │with Status  │
└─────────────┘    └─────────────┘    └─────────────┘
                                             │
                                             ▼
                                    ┌─────────────┐
                                    │Batch Insert │
                                    │Processing   │
                                    └─────────────┘
                                             │
                                             ▼
                                    ┌─────────────┐
                                    │Progress     │
                                    │Tracking     │
                                    └─────────────┘
```

### 4.2 インポートデータ処理
```javascript
JSON File
    ↓
┌─────────────────────────────────────┐
│ {                                   │
│   "categories": [...],              │
│   "products": [...],                │
│   "product_details": [...]          │
│ }                                   │
└─────────────────────────────────────┘
    ↓
Validation & Transformation
    ↓
┌─────────────────────────────────────┐
│ Batch Processing:                   │
│ 1. Insert Categories               │
│ 2. Insert Products                 │
│ 3. Insert Product Details          │
│ 4. Update Relations                │
└─────────────────────────────────────┘
    ↓
Database Transaction
    ↓
Result & UI Update
```

## 5. セキュリティアーキテクチャ

### 5.1 認証・認可フロー（将来実装）
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Browser   │───▶│  Next.js    │───▶│  Supabase   │
│             │    │ Middleware  │    │    Auth     │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       │                   ▼                   ▼
       │            ┌─────────────┐    ┌─────────────┐
       │            │Session      │    │JWT Token    │
       │            │Management   │    │Validation   │
       │            └─────────────┘    └─────────────┘
       │                   │                   │
       │                   ▼                   ▼
       │            ┌─────────────┐    ┌─────────────┐
       │            │Protected    │    │Row Level    │
       │            │Routes       │    │Security     │
       │            └─────────────┘    └─────────────┘
       │                              
       └─────────────────────────────────────────────▶
                     Direct API Access
```

### 5.2 Row Level Security (RLS) 構造
```
PostgreSQL Database
├── Public Access (Anonymous)
│   ├── SELECT on all tables
│   └── Read-only operations
│
├── Authenticated Users
│   ├── CRUD on products
│   ├── CRUD on categories
│   └── CRUD on product_details
│
└── Admin Users (Future)
    ├── User management
    ├── System configuration
    └── Data export/import
```

## 6. パフォーマンス最適化アーキテクチャ

### 6.1 キャッシュ戦略
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Browser    │    │   Vercel    │    │  Supabase   │
│   Cache     │    │    CDN      │    │    Edge     │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│Static Assets│    │API Response │    │Connection   │
│• Images     │    │Cache        │    │Pooling      │
│• CSS/JS     │    │• 5-60 sec   │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
```

### 6.2 データ最適化
```
Database Level
├── Indexes
│   ├── B-tree indexes (ID, Foreign Keys)
│   ├── GIN indexes (Full-text search)
│   └── Composite indexes (Multi-column)
│
├── Query Optimization
│   ├── Efficient JOINs
│   ├── Pagination (LIMIT/OFFSET)
│   └── Column selection (SELECT specific)
│
└── Connection Management
    ├── Connection pooling
    ├── Prepared statements
    └── Transaction optimization
```

## 7. デプロイメントアーキテクチャ

### 7.1 CI/CD パイプライン
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   GitHub    │───▶│   Vercel    │───▶│   Build     │───▶│    Deploy   │
│  Repository │    │   Webhook   │    │  Process    │    │  to Edge    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│Git Push/PR  │    │Auto Deploy  │    │Next.js Build│    │Global CDN   │
│Trigger      │    │Detection    │    │Type Check   │    │Distribution │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### 7.2 環境分離
```
┌─────────────────────────────────────────────────────────────────┐
│                      Development                               │
├─────────────────────────────────────────────────────────────────┤
│ • Local Next.js (npm run dev)                                  │
│ • Supabase Local Development                                   │
│ • Environment Variables (.env.local)                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Staging                                  │
├─────────────────────────────────────────────────────────────────┤
│ • Vercel Preview Deployments                                   │
│ • Supabase Staging Project                                     │
│ • Branch-based Environment Variables                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Production                                │
├─────────────────────────────────────────────────────────────────┤
│ • Vercel Production Deployment                                 │
│ • Supabase Production Project                                  │
│ • Production Environment Variables                             │
│ • Custom Domain + SSL                                          │
└─────────────────────────────────────────────────────────────────┘
```

## 8. 監視・ログアーキテクチャ

### 8.1 監視スタック
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Vercel    │    │  Supabase   │    │   Browser   │
│ Analytics   │    │    Logs     │    │  Dev Tools  │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│Performance  │    │Database     │    │Error        │
│Metrics      │    │Metrics      │    │Tracking     │
│• Page Load  │    │• Query Time │    │• JS Errors  │
│• Core Vitals│    │• Connection │    │• API Errors │
└─────────────┘    └─────────────┘    └─────────────┘
```

### 8.2 ログフロー
```
Application Logs
       │
       ▼
┌─────────────┐
│   Console   │
│   Logging   │
└─────────────┘
       │
       ▼
┌─────────────┐
│   Vercel    │
│  Function   │
│    Logs     │
└─────────────┘

Database Logs
       │
       ▼
┌─────────────┐
│  Supabase   │
│   Logger    │
└─────────────┘
       │
       ▼
┌─────────────┐
│ PostgreSQL  │
│    Logs     │
└─────────────┘
```

このアーキテクチャ図は、システムの全体像を把握し、各コンポーネント間の関係性を理解するための参考資料として活用してください。