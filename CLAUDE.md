# CLAUDE.md

## Claudeへの指示（日本語応答設定）

- すべての応答を日本語で出力してください。

このファイルは、このリポジトリで作業する際にClaude Code (claude.ai/code) に指針を提供します。

## プロジェクト情報

### プロジェクト概要
プロジェクトの詳細な仕様や構成については、以下を参照してください：

- **README.md**: プロジェクトの基本情報、セットアップ方法
- **docs/**: 詳細な仕様書とドキュメント
  - `docs/system-specification.md`: システム仕様書
  - `docs/api-specification.md`: API仕様書
  - `docs/database-design.md`: データベース設計書
  - `docs/architecture-diagram.md`: アーキテクチャ図
  - その他技術ドキュメント

### 仕様書更新方針
- **今後の仕様書更新は `docs/` ディレクトリの該当ファイルに記載してください**
- CLAUDE.mdではなく、適切な仕様書ファイルを更新してください
- 新機能や変更は関連するドキュメントファイルに反映してください

## 開発コマンド

### 基本コマンド
- `npm run dev` - 開発サーバー起動 (localhost:3000)
- `npm run build` - 本番ビルド
- `npm run start` - 本番サーバー起動
- `npm run lint` - Next.js リンティング実行
- `npm run format` - ESLint修正とPrettier整形実行

### テスト・品質管理
- 特定のテストコマンドは設定されていません - 必要に応じてユーザーに確認
- リンティングはNext.js組み込みのESLint設定で処理
- Prettierがコード整形に設定済み

## 環境設定

### 必要な環境変数
`.env.local`に以下の環境変数を設定：
```
USE_PROXY=true|false
PROXY_SERVER=http://150.61.8.70:10080
PROXY_USER=your_username
PROXY_PASS=your_password
```

## 開発ガイドライン

### コーディング規約
- **文字列リテラル**: 文字列をコードに記述する際は、シングルクォート（'）ではなく**ダブルクォート（"）**を使用してください

### 重要な注意事項
- **仕様変更や新機能の追加時は、必ず `docs/` の該当する仕様書を更新してください**
- コミット前に関連ドキュメントの更新も含めてください
- 大きな変更の場合は複数の仕様書ファイルの更新が必要な場合があります