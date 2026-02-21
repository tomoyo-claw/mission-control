import { mutation } from "./_generated/server";

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existing = await ctx.db.query("tasks").first();
    if (existing) return "already seeded";

    // Tasks
    await ctx.db.insert("tasks", {
      title: "Chrome拡張リレーのセットアップ",
      description: "PCのChromeにOpenClaw Browser Relay拡張をインストール",
      status: "todo",
      priority: "high",
      assignee: "zak",
      order: 0,
    });
    await ctx.db.insert("tasks", {
      title: "コンテンツパイプライン改善",
      description: "6カラムKanbanボードの実装",
      status: "done",
      priority: "high",
      assignee: "ai",
      order: 0,
    });
    await ctx.db.insert("tasks", {
      title: "X (@eternum_zak) ログイン",
      description: "ブラウザリレー経由でXにログインしてリサーチ開始",
      status: "todo",
      priority: "medium",
      assignee: "ai",
      order: 1,
    });
    await ctx.db.insert("tasks", {
      title: "Mission Control UIデザイン改善",
      description: "レスポンシブ対応とアニメーション追加",
      status: "todo",
      priority: "low",
      assignee: "ai",
      order: 2,
    });
    await ctx.db.insert("tasks", {
      title: "ワークスペース初期設定",
      description: "SOUL.md, IDENTITY.md, TOOLS.md等の整備",
      status: "done",
      priority: "high",
      assignee: "ai",
      order: 1,
    });

    // Notes
    await ctx.db.insert("notes", {
      title: "MEMORY.md — Long-Term Memory",
      content: "# Long-Term Memory\n\n## 2025-02-21\n\n- First session with Zak. Set up workspace structure together.\n- Zak prefers structured, organized systems.\n- Bilingual: Japanese / English.\n- Brave Search APIキー設定済み。\n- uniswap-ai 7スキルインストール済み\n- X account @eternum_zak の運用権限を受領。\n\n## Accounts\n- GitHub: tomoyo-claw\n- X: @eternum_zak\n- Vercel: tomoyo-claw\n\n## Projects\n- Mission Control: https://mission-control-tawny-delta.vercel.app",
      tags: ["long-term", "accounts", "environment"],
    });
    await ctx.db.insert("notes", {
      title: "2025-02-21 — First Session",
      content: "# First Session\n\n## Workspace Setup\n- Full workspace structure established\n- Zak timezone: UTC+4 (UAE)\n\n## Mission Control\n- Next.js + Tailwind CSS\n- 7 screens implemented\n- Convex backend integrated",
      tags: ["daily", "setup"],
    });
    await ctx.db.insert("notes", {
      title: "Mission Control — プロジェクト概要",
      content: "# Mission Control\n\nAIエージェントのためのデジタルワークスペース管理システム。\n\n## 技術スタック\n- Next.js 15\n- Tailwind CSS\n- Convex (Backend)\n- @hello-pangea/dnd\n\n## 画面構成\n1. ホームダッシュボード\n2. タスクボード\n3. カレンダー\n4. メモリ\n5. コンテンツパイプライン\n6. チーム\n7. オフィス",
      tags: ["project", "mission-control", "reference"],
    });

    // Content
    await ctx.db.insert("content", {
      title: "AIエージェントの始め方ガイド",
      type: "video",
      stage: "script",
      description: "AIエージェントを使ったワークフロー自動化の入門動画",
      script: "# AIエージェント入門\n\n## イントロ\nこんにちは、今日はAIエージェントの基本を解説します。",
      tags: ["AI", "tutorial"],
      assignee: "ai",
      order: 0,
    });
    await ctx.db.insert("content", {
      title: "DeFi × AI の未来",
      type: "article",
      stage: "ideas",
      description: "DeFiプロトコルにAIがどう組み込まれるかの考察",
      tags: ["DeFi", "AI"],
      order: 0,
    });
    await ctx.db.insert("content", {
      title: "OpenClawセットアップガイド",
      type: "blog",
      stage: "published",
      description: "OpenClawの初期セットアップ手順を詳しく解説",
      tags: ["OpenClaw", "guide"],
      assignee: "ai",
      order: 0,
    });

    // Events
    const now = Date.now();
    await ctx.db.insert("events", {
      title: "Mission Control UI改善",
      description: "カレンダー・チーム・オフィス画面の改修",
      startDate: now,
      endDate: now + 4 * 3600000,
      category: "task",
      color: "#3B82F6",
      assignee: "ai",
      status: "completed",
    });
    await ctx.db.insert("events", {
      title: "Heartbeat チェック",
      description: "定期ハートビートポーリング",
      startDate: now + 1800000,
      endDate: now + 1860000,
      category: "cron",
      color: "#8B5CF6",
      assignee: "ai",
      status: "scheduled",
      recurring: "毎30分",
    });
    await ctx.db.insert("events", {
      title: "Chrome拡張リレー セットアップ",
      startDate: now + 86400000,
      endDate: now + 86400000 + 3600000,
      category: "task",
      color: "#06B6D4",
      assignee: "zak",
      status: "scheduled",
    });

    return "seeded";
  },
});
