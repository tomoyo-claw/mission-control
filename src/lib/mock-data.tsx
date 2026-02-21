"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// Mock data types
export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'backlog' | 'inprogress' | 'review' | 'done';
  priority: 'high' | 'medium' | 'low';
  assigneeId?: string;
  assignee?: User | null;
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
  stage: 'idea' | 'draft' | 'review' | 'published';
  description?: string;
  assigneeId?: string;
  assignee?: User | null;
  dueDate?: number;
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
    title: 'Implement user authentication',
    description: 'Add secure login and registration system',
    status: 'inprogress',
    priority: 'high',
    assigneeId: '1',
    order: 1,
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 60 * 60 * 1000,
  },
  {
    _id: '2',
    title: 'Design new homepage',
    description: 'Create modern, responsive homepage design',
    status: 'review',
    priority: 'medium',
    assigneeId: '4',
    order: 1,
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 30 * 60 * 1000,
  },
  {
    _id: '3',
    title: 'Optimize database queries',
    description: 'Improve performance of frequently used queries',
    status: 'backlog',
    priority: 'low',
    assigneeId: '3',
    order: 1,
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    _id: '4',
    title: 'Write API documentation',
    description: 'Complete documentation for all API endpoints',
    status: 'done',
    priority: 'medium',
    assigneeId: '2',
    order: 1,
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
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
    title: '会議メモ - プロジェクト計画',
    content: '# プロジェクト計画会議\n\n## 主な決定事項\n- スプリント期間: 2週間\n- チーム構成: 4名\n- デプロイ戦略: Blue-Green deployment\n\n## アクションアイテム\n- [ ] 要件定義書の作成\n- [ ] UI/UXデザインの初稿\n- [ ] 開発環境の構築',
    tags: ['会議', 'プロジェクト', '計画'],
    createdBy: '1',
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    _id: '2',
    title: 'Technical Research - React 18 Features',
    content: '# React 18 New Features\n\n## Concurrent Features\n- **Automatic Batching**: Updates are batched automatically\n- **Transitions**: Mark updates as non-urgent\n- **Suspense**: Better loading states\n\n## Performance Improvements\n- Faster hydration\n- Better memory usage\n- Improved dev tools',
    tags: ['research', 'react', 'technical'],
    createdBy: '1',
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },
];

const mockContent: ContentItem[] = [
  {
    _id: '1',
    title: 'Introduction to AI Workflows',
    type: 'blog',
    stage: 'draft',
    description: 'Comprehensive guide to implementing AI in daily workflows',
    assigneeId: '2',
    dueDate: Date.now() + 7 * 24 * 60 * 60 * 1000,
    order: 1,
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 60 * 60 * 1000,
  },
  {
    _id: '2',
    title: 'New feature announcement',
    type: 'tweet',
    stage: 'idea',
    description: 'Announce the new mission control dashboard',
    assigneeId: '2',
    order: 2,
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    _id: '3',
    title: 'Product Demo Video',
    type: 'video',
    stage: 'review',
    description: 'Video walkthrough of key features',
    assigneeId: '4',
    dueDate: Date.now() + 3 * 24 * 60 * 60 * 1000,
    order: 1,
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 60 * 60 * 1000,
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

  // Initialize tasks with assignee data
  useEffect(() => {
    const tasksWithAssignees = mockTasks.map(task => ({
      ...task,
      assignee: task.assigneeId ? users.find(u => u._id === task.assigneeId) || null : null,
    }));
    setTasks(tasksWithAssignees);
  }, [users]);

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
        ? { 
            ...task, 
            ...updates, 
            updatedAt: Date.now(),
            assignee: updates.assigneeId ? users.find(u => u._id === updates.assigneeId) || null : task.assignee 
          } 
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
      assignee: taskData.assigneeId ? users.find(u => u._id === taskData.assigneeId) || null : null,
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