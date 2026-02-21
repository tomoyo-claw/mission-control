# Mission Control - Digital Workspace

AIエージェントのためのデジタルワークスペース管理システム

## Features

### 1. タスクボード (`/tasks`)
- **Kanbanボード**: Backlog → In Progress → Review → Done
- **ドラッグ&ドロップ**: @hello-pangea/dnd を使用したタスク移動
- **担当者管理**: エージェント割り当てと優先度設定
- **リアルタイム統計**: 進捗可視化

### 2. カレンダー (`/calendar`) 
- **月次ビュー**: 日本語対応のカレンダー表示
- **イベント管理**: 会議・タスクのスケジューリング
- **今日/今後の予定**: サイドバーでの予定確認
- **カテゴリ別色分け**: 視認性の高いイベント表示

### 3. メモリ画面 (`/memory`)
- **Markdownサポート**: react-markdown を使用した記事作成
- **タグシステム**: カテゴリ別整理
- **検索機能**: タイトル・内容での全文検索
- **リアルタイム編集**: インライン編集機能

### 4. チーム画面 (`/team`)
- **メンバーカード**: ステータス表示とパフォーマンス指標
- **アクティビティ追跡**: 最終アクティブ時刻とタスク進捗
- **チーム統計**: 完了率やコンテンツ作成状況
- **リアルタイムステータス**: オンライン/ビジー/離席中/オフライン

### 5. コンテンツパイプライン (`/content`)
- **4段階ワークフロー**: Idea → Draft → Review → Published
- **コンテンツタイプ**: ブログ・記事・ツイート・動画・ポッドキャスト
- **期限管理**: 期限切れアラートと進捗追跡
- **ドラッグ&ドロップ**: ステージ間移動

### 6. 🎯 オフィス画面 (`/office`) - **HERO FEATURE**
- **ピクセルアートオフィス**: CSS アニメーション付きアイソメトリック表示
- **エージェントデスク**: 4つのデスクとコンピューター
- **リアルタイムステータス**:
  - 在席 = デスクに座る (オンライン/ビジー)
  - 離席 = デスクから離れる (離席中/オフライン)  
- **活動アニメーション**:
  - タイピング中 = バウンスアニメーション
  - 考え中 = パルスアニメーション + 思考バブル
- **クリック可能**: エージェント詳細と現在のタスク表示
- **オフィス備品**: 給水器・会議室・コーヒーマシンなど

## Tech Stack

- **Framework**: Next.js 15 + TypeScript
- **UI**: Tailwind CSS + Lucide React アイコン
- **ドラッグ&ドロップ**: @hello-pangea/dnd
- **Markdown**: react-markdown
- **状態管理**: React Context (Mock Data Provider)

## データ構造

### Mock Data Layer
Convex への依存なしに動作する完全なモックデータシステム:

- `users`: AI エージェント情報 (ステータス・役割・バイオ)
- `tasks`: Kanban タスク (4段階ワークフロー)
- `events`: カレンダーイベント (会議・デッドライン)
- `notes`: Markdown ノート (タグ・検索対応)
- `content`: コンテンツパイプライン (5タイプ・4ステージ)
- `agentPositions`: オフィス内エージェント位置・活動状況

## 日本語対応

- **UI**: 完全日本語インターフェース
- **日付**: 日本語フォーマット (2024年1月15日 形式)
- **ステータス**: 日本語ラベル (オンライン・ビジー・離席中・オフライン)

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production  
npm run build
```

## Features Highlights

### ✨ Visual Excellence
- ダークテーマによる統一感
- ピクセルアート風オフィス空間
- レスポンシブデザイン

### 🚀 User Experience
- ドラッグ&ドロップ操作
- リアルタイムアニメーション
- 直感的なナビゲーション

### 💡 Productivity Tools
- 統合ワークフロー管理
- パフォーマンス可視化
- コラボレーション機能

---

**Mission Control** - Where AI agents collaborate and thrive! 🤖✨