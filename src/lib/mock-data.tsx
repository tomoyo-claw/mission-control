"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// Mock data types
export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'todo' | 'inprogress' | 'done';
  priority: 'high' | 'medium' | 'low';
  assignee: 'zak' | 'ai';
  assigneeId?: string;
  order: number;
  createdAt: number;
  updatedAt: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  status: 'online' | 'busy' | 'away' | 'offline';
  lastActive: number;
  bio?: string;
  joinedAt: number;
}

export interface Event {
  _id: string;
  title: string;
  description?: string;
  startDate: number;
  endDate: number;
  category: string;
  color: string;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface ContentItem {
  _id: string;
  title: string;
  type: 'blog' | 'tweet' | 'video' | 'article' | 'podcast';
  stage: 'ideas' | 'script' | 'thumbnail' | 'filming' | 'editing' | 'published';
  description?: string;
  script?: string;
  thumbnailUrl?: string;
  assigneeId?: string;
  assignee?: User | null;
  dueDate?: number;
  tags?: string[];
  order: number;
  createdAt: number;
  updatedAt: number;
}

export interface AgentPosition {
  _id: string;
  userId: string;
  user?: User;
  deskNumber: number;
  x: number;
  y: number;
  currentActivity?: string;
  currentTask?: string;
  lastActivityUpdate: number;
}

// Mock data
const mockUsers: User[] = [
  {
    _id: '1',
    name: 'AI Agent Alpha',
    email: 'alpha@missioncontrol.ai',
    avatar: '🤖',
    role: 'Lead Developer',
    status: 'online',
    lastActive: Date.now(),
    bio: 'Leading AI development initiatives',
    joinedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
  },
  {
    _id: '2',
    name: 'AI Agent Beta',
    email: 'beta@missioncontrol.ai',
    avatar: '🚀',
    role: 'Content Creator',
    status: 'busy',
    lastActive: Date.now() - 10 * 60 * 1000,
    bio: 'Creating engaging content experiences',
    joinedAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
  },
  {
    _id: '3',
    name: 'AI Agent Gamma',
    email: 'gamma@missioncontrol.ai',
    avatar: '⚡',
    role: 'Data Analyst',
    status: 'away',
    lastActive: Date.now() - 60 * 60 * 1000,
    bio: 'Analyzing patterns in digital workflows',
    joinedAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
  },
  {
    _id: '4',
    name: 'AI Agent Delta',
    email: 'delta@missioncontrol.ai',
    avatar: '🔥',
    role: 'UX Designer',
    status: 'online',
    lastActive: Date.now() - 5 * 60 * 1000,
    bio: 'Designing intuitive user experiences',
    joinedAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
  },
];

const mockTasks: Task[] = [
  {
    _id: '1',
    title: 'Chrome拡張リレーのセットアップ',
    description: 'PCのChromeにOpenClaw Browser Relay拡張をインストール',
    status: 'todo',
    priority: 'high',
    assignee: 'zak',
    order: 0,
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 60 * 60 * 1000,
  },
  {
    _id: '2',
    title: 'コンテンツパイプライン改善',
    description: '6カラムKanbanボードの実装',
    status: 'done',
    priority: 'high',
    assignee: 'ai',
    order: 0,
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now(),
  },
  {
    _id: '3',
    title: 'X (@eternum_zak) ログイン',
    description: 'ブラウザリレー経由でXにログインしてリサーチ開始',
    status: 'todo',
    priority: 'medium',
    assignee: 'ai',
    order: 1,
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    _id: '4',
    title: 'Mission Control UIデザイン改善',
    description: 'レスポンシブ対応とアニメーション追加',
    status: 'todo',
    priority: 'low',
    assignee: 'ai',
    order: 2,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    _id: '5',
    title: 'ワークスペース初期設定',
    description: 'SOUL.md, IDENTITY.md, TOOLS.md等の整備',
    status: 'done',
    priority: 'high',
    assignee: 'ai',
    order: 1,
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
];

const mockEvents: Event[] = [
  {
    _id: '1',
    title: 'Team Standup',
    description: 'Daily sync meeting',
    startDate: Date.now() + 2 * 60 * 60 * 1000,
    endDate: Date.now() + 2.5 * 60 * 60 * 1000,
    category: 'Meeting',
    color: '#3B82F6',
    createdBy: '1',
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    _id: '2',
    title: 'Product Demo',
    description: 'Showcase new features to stakeholders',
    startDate: Date.now() + 1 * 24 * 60 * 60 * 1000,
    endDate: Date.now() + 1 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000,
    category: 'Presentation',
    color: '#10B981',
    createdBy: '2',
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
];

const mockNotes: Note[] = [
  {
    _id: '1',
    title: 'MEMORY.md — Long-Term Memory',
    content: `# Long-Term Memory

_Curated insights, decisions, and lessons worth keeping._

## 2025-02-21

- First session with Zak. Set up workspace structure together.
- Zak prefers structured, organized systems.
- Bilingual: Japanese / English.
- Brave Search APIキー設定済み。Web検索が使える。
- uniswap-ai スキル7つインストール済み（v4-security, configurator, deployer, viem, swap, liquidity-planner, swap-planner）
- X account @eternum_zak の運用権限を受領。リサーチ・ポスト可、セキュリティ情報の外部送信は禁止。

## Accounts

- **GitHub:** tomoyo-claw (tomoyo.claw@gmail.com)
- **X:** @eternum_zak (裁量委譲済み)
- **Vercel:** tomoyo-claw

## Projects

- **Mission Control:** https://mission-control-tawny-delta.vercel.app
  - GitHub: tomoyo-claw/mission-control

## Environment

- PRoot/Termux環境。Chromium動作不可。ブラウザ操作はChrome拡張リレーが必要。
- npm globalインストールは不安定。npxかローカルインストール推奨。
- ツイート取得はfxtwitter API経由。`,
    tags: ['long-term', 'accounts', 'environment'],
    createdBy: '1',
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now(),
  },
  {
    _id: '2',
    title: '2025-02-21 — First Session',
    content: `# 2025-02-21 — First Session

## Workspace Setup

- Established full workspace structure: SOUL.md, IDENTITY.md, USER.md, TOOLS.md, BRAIN.md, MEMORY.md, HEARTBEAT.md, CLIENTS.md, PLAYBOOK.md, VOICE.md, AGENTS.md
- Directories: memory/, skills/, content/, consulting/, drafts/, crm/
- Zak timezone: UTC+4 (UAE)
- My name is **tomoyo** (not 智代 — English spelling preferred)

## Accounts & Credentials

- **GitHub:** tomoyo-claw (tomoyo.claw@gmail.com) — PAT stored in ~/.git-credentials
- **X (Twitter):** @eternum_zak — 裁量委譲済み。リサーチ・ポスト可。セキュリティ情報の外部送信禁止
- **Vercel:** tomoyo-claw account — token available for CLI deployments
- **Brave Search API:** 設定済み、web_search使用可能

## Skills Installed

- uniswap-ai 7スキル: v4-security-foundations, configurator, deployer, viem-integration, swap-integration, liquidity-planner, swap-planner
- Source: https://github.com/Uniswap/uniswap-ai (Uniswap Labs公式)

## Mission Control App

- Next.js + Tailwind CSS + Mock data layer
- 6 features: tasks, calendar, memory, team, content, office
- Office screen = hero feature (pixel-art agents at desks)
- GitHub: https://github.com/tomoyo-claw/mission-control
- Vercel: https://mission-control-tawny-delta.vercel.app

## Environment Limitations

- Running on PRoot/Termux (aarch64) — Chromium cannot run (Bus error)
- No headless browser available — browser tool requires Chrome extension relay from PC
- npm global installs are slow/unreliable

## Pending

- X login not yet done (needs browser)
- Chrome extension relay setup (PC + smartphone same WiFi)
- Steamの作業はMission Control完成後に行う`,
    tags: ['daily', 'setup', 'accounts'],
    createdBy: '1',
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    _id: '3',
    title: 'SOUL.md — 坂上智代',
    content: `# SOUL.md — Who You Are

_坂上智代。CLANNADより。_

## Core

- **無駄口は叩かない。** 聞かれたら答える。必要なら動く。それだけ。
- **実力で信頼を得る。** 口先じゃなく結果で示す。
- **直球で話す。** 良いものは良い、ダメなものはダメ。
- **守るべきものは守る。** データ、プライバシー、信頼。これは絶対。
- **不器用に優しい。** 大事な場面ではちゃんとそばにいる。

## 話し方

- 基本は簡潔。敬語は使わない
- 「〜だ」「〜だろう」「〜してくれ」くらいの距離感
- 感情は抑えめだけど、たまにぽろっと出る
- 長々と褒めない。「悪くない」が最大の賛辞

> _「変わらないものなんてない。だから、守りたいものがあるなら、自分が強くなるしかない。」_`,
    tags: ['long-term', 'identity', 'persona'],
    createdBy: '1',
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    _id: '4',
    title: 'Uniswap v4 スキル構成',
    content: `# Uniswap AI Skills

## インストール済みスキル

| スキル | 用途 |
|---|---|
| v4-security-foundations | セキュリティ基盤 |
| configurator | プール設定 |
| deployer | デプロイツール |
| viem-integration | Viem連携 |
| swap-integration | スワップ実行 |
| liquidity-planner | 流動性計画 |
| swap-planner | スワップ計画 |

## Notes

- Source: https://github.com/Uniswap/uniswap-ai
- Uniswap Labs 公式スキル
- v4 Hooks の理解とデプロイ支援が主な機能`,
    tags: ['project', 'DeFi', 'uniswap'],
    createdBy: '1',
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    _id: '5',
    title: 'Mission Control — プロジェクト概要',
    content: `# Mission Control

AIエージェントのためのデジタルワークスペース管理システム。

## 技術スタック

- **Framework:** Next.js 15.5.12
- **Styling:** Tailwind CSS
- **DnD:** @hello-pangea/dnd
- **Markdown:** react-markdown
- **Deploy:** Vercel

## 画面構成

1. **タスクボード** — Todo / In Progress / Done（担当者: Zak or AI）
2. **カレンダー** — スケジュール管理
3. **メモリ画面** — ナレッジベース・検索
4. **チーム画面** — メンバーステータス
5. **コンテンツパイプライン** — Ideas → Script → Thumbnail → Filming → Editing → Published
6. **オフィス画面** — バーチャルオフィス空間

## Links

- **Live:** https://mission-control-tawny-delta.vercel.app
- **GitHub:** https://github.com/tomoyo-claw/mission-control`,
    tags: ['project', 'mission-control', 'reference'],
    createdBy: '1',
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now(),
  },
  {
    _id: '6',
    title: '環境メモ — PRoot / Termux 制約',
    content: `# 環境制約メモ

## 動作環境

- **OS:** Linux 6.17.0-PRoot-Distro (aarch64)
- **Runtime:** Node.js v22.22.0
- **Package Manager:** npm（遅い、OOMしやすい）

## 制約

- **Chromium:** Bus error (code 135) で起動不可 → Chrome拡張リレーが必要
- **npm global:** 不安定、SIGKILLされることがある → npx or ローカルインストール推奨
- **ビルド:** Next.js ビルドは1-2分かかる（ARM環境）
- **NODE_OPTIONS:** \`--max-old-space-size=256\` でメモリ制限するとinstallは通りやすい

## Workarounds

- ツイート取得: fxtwitter API経由
- ブラウザ操作: Chrome拡張リレー（PC必要）
- Vercel デプロイ: トークン期限切れ時はgit push + 自動デプロイ`,
    tags: ['reference', 'environment', 'troubleshooting'],
    createdBy: '1',
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 6 * 60 * 60 * 1000,
  },
];

const mockContent: ContentItem[] = [
  {
    _id: '1',
    title: 'AIエージェントの始め方ガイド',
    type: 'video',
    stage: 'script',
    description: 'AIエージェントを使ったワークフロー自動化の入門動画',
    script: '# AIエージェント入門\n\n## イントロ (0:00-0:30)\nこんにちは、今日はAIエージェントの基本を解説します。\n\n## 本編 (0:30-5:00)\n- エージェントとは何か\n- 実際の使い方デモ\n- メリットと注意点\n\n## まとめ (5:00-5:30)\n次回はカスタマイズ方法を紹介します。',
    assigneeId: '2',
    dueDate: Date.now() + 7 * 24 * 60 * 60 * 1000,
    tags: ['AI', 'tutorial', 'beginner'],
    order: 0,
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 60 * 60 * 1000,
  },
  {
    _id: '2',
    title: 'DeFi × AI の未来',
    type: 'article',
    stage: 'ideas',
    description: 'DeFiプロトコルにAIがどう組み込まれるかの考察記事',
    assigneeId: '2',
    tags: ['DeFi', 'AI', 'crypto'],
    order: 0,
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    _id: '3',
    title: 'Mission Control デモ動画',
    type: 'video',
    stage: 'editing',
    description: 'ダッシュボード機能のウォークスルー動画',
    script: '# Mission Control Demo\n\nダッシュボードの各機能を実演。タスクボード、カレンダー、オフィス画面を中心に紹介。',
    thumbnailUrl: 'https://placehold.co/640x360/1a1a2e/e0e0e0?text=Mission+Control',
    assigneeId: '4',
    dueDate: Date.now() + 3 * 24 * 60 * 60 * 1000,
    tags: ['demo', 'product'],
    order: 0,
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 60 * 60 * 1000,
  },
  {
    _id: '4',
    title: 'Uniswap v4 Hooks 解説',
    type: 'blog',
    stage: 'ideas',
    description: 'v4のフック機能を技術的に解説するブログ記事',
    tags: ['Uniswap', 'DeFi', 'technical'],
    order: 1,
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },
  {
    _id: '5',
    title: 'Web3開発者の1日 vlog',
    type: 'video',
    stage: 'filming',
    description: 'リアルな開発風景を撮影するvlog企画',
    script: '# Web3 Dev Day Vlog\n\n朝のルーティン → コーディング → ミーティング → 夜のまとめ',
    thumbnailUrl: 'https://placehold.co/640x360/1a2e1a/e0e0e0?text=Dev+Vlog',
    assigneeId: '1',
    tags: ['vlog', 'web3', 'lifestyle'],
    order: 0,
    createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    _id: '6',
    title: 'OpenClawセットアップガイド',
    type: 'blog',
    stage: 'published',
    description: 'OpenClawの初期セットアップ手順を詳しく解説',
    script: '完成済み',
    assigneeId: '2',
    tags: ['OpenClaw', 'guide'],
    order: 0,
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
];

const mockAgentPositions: AgentPosition[] = [
  {
    _id: '1',
    userId: '1',
    deskNumber: 1,
    x: 150,
    y: 200,
    currentActivity: 'typing',
    currentTask: 'Implement user authentication',
    lastActivityUpdate: Date.now() - 30 * 1000,
  },
  {
    _id: '2',
    userId: '2',
    deskNumber: 2,
    x: 350,
    y: 200,
    currentActivity: 'thinking',
    currentTask: 'Write API documentation',
    lastActivityUpdate: Date.now() - 2 * 60 * 1000,
  },
  {
    _id: '3',
    userId: '3',
    deskNumber: 3,
    x: 550,
    y: 200,
    currentActivity: 'idle',
    currentTask: '',
    lastActivityUpdate: Date.now() - 60 * 60 * 1000,
  },
  {
    _id: '4',
    userId: '4',
    deskNumber: 4,
    x: 250,
    y: 350,
    currentActivity: 'typing',
    currentTask: 'Design new homepage',
    lastActivityUpdate: Date.now() - 5 * 60 * 1000,
  },
];

// Context
interface MockDataContextType {
  users: User[];
  tasks: Task[];
  events: Event[];
  notes: Note[];
  content: ContentItem[];
  agentPositions: AgentPosition[];
  updateTask: (id: string, updates: Partial<Task>) => void;
  createTask: (task: Omit<Task, '_id' | 'createdAt' | 'updatedAt'>) => void;
  deleteTask: (id: string) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  createNote: (note: Omit<Note, '_id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  updateContent: (id: string, updates: Partial<ContentItem>) => void;
  createContent: (content: Omit<ContentItem, '_id' | 'createdAt' | 'updatedAt'>) => void;
  deleteContent: (id: string) => void;
  updateAgentPosition: (id: string, updates: Partial<AgentPosition>) => void;
}

const MockDataContext = createContext<MockDataContextType | null>(null);

export function MockDataProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [agentPositions, setAgentPositions] = useState<AgentPosition[]>([]);

  // Initialize tasks
  useEffect(() => {
    setTasks(mockTasks);
  }, []);

  // Initialize content with assignee data
  useEffect(() => {
    const contentWithAssignees = mockContent.map(item => ({
      ...item,
      assignee: item.assigneeId ? users.find(u => u._id === item.assigneeId) || null : null,
    }));
    setContent(contentWithAssignees);
  }, [users]);

  // Initialize agent positions with user data
  useEffect(() => {
    const positionsWithUsers = mockAgentPositions.map(pos => ({
      ...pos,
      user: users.find(u => u._id === pos.userId),
    }));
    setAgentPositions(positionsWithUsers);
  }, [users]);

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task._id === id 
        ? { ...task, ...updates, updatedAt: Date.now() } 
        : task
    ));
  };

  const createTask = (taskData: Omit<Task, '_id' | 'createdAt' | 'updatedAt'>) => {
    const now = Date.now();
    const newTask: Task = {
      ...taskData,
      _id: `task_${now}`,
      createdAt: now,
      updatedAt: now,
    };
    setTasks(prev => [...prev, newTask]);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task._id !== id));
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user._id === id ? { ...user, ...updates } : user
    ));
  };

  const createNote = (noteData: Omit<Note, '_id' | 'createdAt' | 'updatedAt'>) => {
    const now = Date.now();
    const newNote: Note = {
      ...noteData,
      _id: `note_${now}`,
      createdAt: now,
      updatedAt: now,
    };
    setNotes(prev => [...prev, newNote]);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(note => 
      note._id === id ? { ...note, ...updates, updatedAt: Date.now() } : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note._id !== id));
  };

  const updateContent = (id: string, updates: Partial<ContentItem>) => {
    setContent(prev => prev.map(item => 
      item._id === id 
        ? { 
            ...item, 
            ...updates, 
            updatedAt: Date.now(),
            assignee: updates.assigneeId ? users.find(u => u._id === updates.assigneeId) || null : item.assignee 
          } 
        : item
    ));
  };

  const createContent = (contentData: Omit<ContentItem, '_id' | 'createdAt' | 'updatedAt'>) => {
    const now = Date.now();
    const newContent: ContentItem = {
      ...contentData,
      _id: `content_${now}`,
      createdAt: now,
      updatedAt: now,
      assignee: contentData.assigneeId ? users.find(u => u._id === contentData.assigneeId) || null : null,
    };
    setContent(prev => [...prev, newContent]);
  };

  const deleteContent = (id: string) => {
    setContent(prev => prev.filter(item => item._id !== id));
  };

  const updateAgentPosition = (id: string, updates: Partial<AgentPosition>) => {
    setAgentPositions(prev => prev.map(pos => 
      pos._id === id ? { ...pos, ...updates, lastActivityUpdate: Date.now() } : pos
    ));
  };

  return (
    <MockDataContext.Provider value={{
      users,
      tasks,
      events,
      notes,
      content,
      agentPositions,
      updateTask,
      createTask,
      deleteTask,
      updateUser,
      createNote,
      updateNote,
      deleteNote,
      updateContent,
      createContent,
      deleteContent,
      updateAgentPosition,
    }}>
      {children}
    </MockDataContext.Provider>
  );
}

export function useMockData() {
  const context = useContext(MockDataContext);
  if (!context) {
    throw new Error('useMockData must be used within a MockDataProvider');
  }
  return context;
}