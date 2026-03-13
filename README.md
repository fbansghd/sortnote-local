# SortNote

ドラッグ&ドロップでタスクを整理できるシンプルなタスク管理アプリ

## 主な機能

### カテゴリ管理
- カテゴリの作成・削除
- カテゴリの折りたたみ/展開
- ドラッグ&ドロップでカテゴリの並べ替え
- サイドバーでカテゴリ一覧を表示

### タスク管理
- タスクの追加・削除
- タスクの完了/未完了切り替え
- ドラッグ&ドロップでタスクの並べ替え
- カテゴリ間でのタスク移動

### UI/UX
- **テーマ切り替え** - 2種類のカラーテーマ（ライト/ダーク風）
- **モバイル対応** - レスポンシブデザイン、スワイプでカテゴリ切り替え
- **スムーズなアニメーション** - dnd-kitのtransitionによる滑らかな並び替えアニメーション
- **自動保存** - LocalStorageで即座にデータを永続化

## 技術スタック

| 技術 | バージョン | 用途 |
|------|-----------|------|
| React | 19.1.1 | UIフレームワーク |
| SCSS Modules | - | スタイリング（CSS Modules方式） |
| @dnd-kit/core | 6.3.1 | ドラッグ&ドロップ機能 |
| @dnd-kit/sortable | 10.0.0 | ソート可能なリスト・並び替えアニメーション |
| uuid | - | 一意なID生成 |

## アーキテクチャ

### コンポーネント設計
- **関数コンポーネント** - Hooksを使用したモダンなReact開発
- **Props分割代入** - 可読性の高いコード
- **SCSS Modules** - スコープ化されたスタイル、グローバル汚染を防止

### ロジック分離
ビジネスロジックは全てカスタムフックに分離し、コンポーネントはUIのみに専念：

```
App.jsx (UIのみ)
    ↓
カスタムフック（ロジック）
    ├── useCategoryManagement - カテゴリ管理ロジック
    ├── useTaskManagement - タスク管理ロジック
    ├── useDragAndDrop - ドラッグ&ドロップ制御
    ├── useTheme - テーマ管理
    ├── useMobileView - モバイル表示制御
    └── useLocalStorage - データ永続化
```

### 状態管理
- **useState** - コンポーネント単位の状態管理
- **カスタムフック** - ロジックの再利用とテスト容易性
- **LocalStorage** - ページリロード後もデータを保持

## データ設計

### Category（カテゴリ）
```javascript
{
  id: string,          // UUID v4で生成
  category: string,    // カテゴリ名
  tasks: Task[],       // タスクの配列
  collapsed: boolean   // 折りたたみ状態
}
```

### Task（タスク）
```javascript
{
  id: string,     // UUID v4で生成
  text: string,   // タスク内容
  done: boolean   // 完了フラグ
}
```

### LocalStorage
- **キー**: `"memos"`
- **値**: `Category[]`（JSON形式）
- **保存タイミング**: 状態変更時に自動保存

## プロジェクト構成

```
sortnote-local/
├── public/              # 静的ファイル
├── src/
│   ├── components/      # UIコンポーネント
│   │   ├── category/    # カテゴリ関連
│   │   │   ├── CategoryList.jsx
│   │   │   └── SortableCategory.jsx
│   │   ├── task/        # タスク関連
│   │   │   ├── TaskInput.jsx
│   │   │   └── SortableTask.jsx
│   │   └── layout/      # レイアウト
│   │       ├── Header.jsx
│   │       ├── Sidebar.jsx
│   │       └── MobileNavigation.jsx
│   ├── hooks/           # カスタムフック
│   │   ├── category/    # カテゴリロジック
│   │   │   └── useCategoryManagement.jsx
│   │   ├── task/        # タスクロジック
│   │   │   └── useTaskManagement.jsx
│   │   ├── dnd/         # D&Dロジック
│   │   │   └── useDragAndDrop.jsx
│   │   └── common/      # 共通ロジック
│   │       ├── useLocalStorage.jsx
│   │       ├── useTheme.jsx
│   │       └── useMobileView.jsx
│   ├── constants/       # 定数定義
│   ├── App.jsx          # ルートコンポーネント
│   ├── App.module.scss  # グローバルスタイル
│   └── index.jsx        # エントリーポイント
└── package.json
```

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm start
```

http://localhost:3000 でアプリが開きます。

## ビルド

```bash
npm run build
```

`build/` フォルダに本番用ファイルが生成されます。

