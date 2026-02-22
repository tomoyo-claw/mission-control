"use client";

import React, { createContext, useContext } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

// ── Types (matching Convex schema + _id/_creationTime) ──

export interface Task {
  _id: string;
  _creationTime: number;
  title: string;
  description?: string;
  status: "todo" | "inprogress" | "done";
  priority: "high" | "medium" | "low";
  assignee: "zak" | "ai";
  order: number;
  dueDate?: number;
  prompt?: string;
  aiStatus?: "idle" | "pending" | "running" | "completed" | "failed";
  aiResult?: string;
  // Compat fields
  createdAt: number;
  updatedAt: number;
}

export interface Event {
  _id: string;
  _creationTime: number;
  title: string;
  description?: string;
  startDate: number;
  endDate: number;
  category: "task" | "cron" | "meeting" | "reminder" | "milestone";
  color: string;
  assignee?: "zak" | "ai";
  status?: "scheduled" | "running" | "completed" | "failed";
  recurring?: string;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface Note {
  _id: string;
  _creationTime: number;
  title: string;
  content: string;
  tags: string[];
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface ContentItem {
  _id: string;
  _creationTime: number;
  title: string;
  type: "blog" | "tweet" | "video" | "article" | "podcast";
  stage: "ideas" | "script" | "thumbnail" | "filming" | "editing" | "published";
  description?: string;
  script?: string;
  thumbnailUrl?: string;
  tags?: string[];
  assignee?: "zak" | "ai";
  order: number;
  createdAt: number;
  updatedAt: number;
}

// Keep for compat (team/office use their own data)
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  status: "online" | "busy" | "away" | "offline";
  lastActive: number;
  bio?: string;
  joinedAt: number;
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

// ── Helper: map Convex doc to our types ──

function mapTask(doc: any): Task {
  return {
    ...doc,
    _id: doc._id,
    createdAt: doc._creationTime,
    updatedAt: doc._creationTime,
  };
}

function mapEvent(doc: any): Event {
  return {
    ...doc,
    _id: doc._id,
    createdBy: "1",
    createdAt: doc._creationTime,
    updatedAt: doc._creationTime,
  };
}

function mapNote(doc: any): Note {
  return {
    ...doc,
    _id: doc._id,
    createdBy: "1",
    createdAt: doc._creationTime,
    updatedAt: doc._creationTime,
  };
}

function mapContent(doc: any): ContentItem {
  return {
    ...doc,
    _id: doc._id,
    createdAt: doc._creationTime,
    updatedAt: doc._creationTime,
  };
}

// ── Context ──

interface MockDataContextType {
  users: User[];
  tasks: Task[];
  events: Event[];
  notes: Note[];
  content: ContentItem[];
  agentPositions: AgentPosition[];
  updateTask: (id: string, updates: Partial<Task>) => void;
  createTask: (task: { title: string; description?: string; status: Task["status"]; priority?: Task["priority"]; assignee?: Task["assignee"]; order?: number; dueDate?: number }) => void;
  deleteTask: (id: string) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  createNote: (note: { title: string; content: string; tags: string[]; createdBy?: string }) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  updateContent: (id: string, updates: Partial<ContentItem>) => void;
  createContent: (content: { title: string; type?: ContentItem["type"]; stage?: ContentItem["stage"]; description?: string; script?: string; thumbnailUrl?: string; tags?: string[]; assignee?: "zak" | "ai"; order?: number }) => void;
  deleteContent: (id: string) => void;
  updateAgentPosition: (id: string, updates: Partial<AgentPosition>) => void;
}

const MockDataContext = createContext<MockDataContextType | null>(null);

// ── Provider ──

export function MockDataProvider({ children }: { children: React.ReactNode }) {
  // Convex queries
  const rawTasks = useQuery(api.tasks.list) ?? [];
  const rawEvents = useQuery(api.events.list) ?? [];
  const rawNotes = useQuery(api.notes.list) ?? [];
  const rawContent = useQuery(api.content.list) ?? [];

  // Convex mutations
  const createTaskMut = useMutation(api.tasks.create);
  const updateTaskMut = useMutation(api.tasks.update);
  const deleteTaskMut = useMutation(api.tasks.remove);

  const createNoteMut = useMutation(api.notes.create);
  const updateNoteMut = useMutation(api.notes.update);
  const deleteNoteMut = useMutation(api.notes.remove);

  const createContentMut = useMutation(api.content.create);
  const updateContentMut = useMutation(api.content.update);
  const deleteContentMut = useMutation(api.content.remove);

  const createEventMut = useMutation(api.events.create);
  const updateEventMut = useMutation(api.events.update);
  const deleteEventMut = useMutation(api.events.remove);

  // Map to our types
  const tasks = rawTasks.map(mapTask);
  const events = rawEvents.map(mapEvent);
  const notes = rawNotes.map(mapNote);
  const content = rawContent.map(mapContent);

  // Tasks
  const createTask = (data: any) => {
    createTaskMut({
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority || "medium",
      assignee: data.assignee || "ai",
      order: data.order || 0,
      dueDate: data.dueDate,
    });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const args: any = { id: id as Id<"tasks"> };
    if (updates.title !== undefined) args.title = updates.title;
    if (updates.description !== undefined) args.description = updates.description;
    if (updates.status !== undefined) args.status = updates.status;
    if (updates.priority !== undefined) args.priority = updates.priority;
    if (updates.assignee !== undefined) args.assignee = updates.assignee;
    if (updates.order !== undefined) args.order = updates.order;
    if (updates.dueDate !== undefined) args.dueDate = updates.dueDate;
    if (updates.prompt !== undefined) args.prompt = updates.prompt;
    if (updates.aiStatus !== undefined) args.aiStatus = updates.aiStatus;
    if (updates.aiResult !== undefined) args.aiResult = updates.aiResult;
    updateTaskMut(args);
  };

  const deleteTask = (id: string) => {
    deleteTaskMut({ id: id as Id<"tasks"> });
  };

  // Notes
  const createNote = (data: any) => {
    createNoteMut({
      title: data.title,
      content: data.content,
      tags: data.tags || [],
    });
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    const args: any = { id: id as Id<"notes"> };
    if (updates.title !== undefined) args.title = updates.title;
    if (updates.content !== undefined) args.content = updates.content;
    if (updates.tags !== undefined) args.tags = updates.tags;
    updateNoteMut(args);
  };

  const deleteNote = (id: string) => {
    deleteNoteMut({ id: id as Id<"notes"> });
  };

  // Content
  const createContent = (data: any) => {
    createContentMut({
      title: data.title,
      type: data.type || "blog",
      stage: data.stage || "ideas",
      description: data.description,
      script: data.script,
      thumbnailUrl: data.thumbnailUrl,
      tags: data.tags,
      assignee: data.assignee,
      order: data.order || 0,
    });
  };

  const updateContent = (id: string, updates: Partial<ContentItem>) => {
    const args: any = { id: id as Id<"content"> };
    if (updates.title !== undefined) args.title = updates.title;
    if (updates.type !== undefined) args.type = updates.type;
    if (updates.stage !== undefined) args.stage = updates.stage;
    if (updates.description !== undefined) args.description = updates.description;
    if (updates.script !== undefined) args.script = updates.script;
    if (updates.thumbnailUrl !== undefined) args.thumbnailUrl = updates.thumbnailUrl;
    if (updates.tags !== undefined) args.tags = updates.tags;
    if (updates.assignee !== undefined) args.assignee = updates.assignee;
    if (updates.order !== undefined) args.order = updates.order;
    updateContentMut(args);
  };

  const deleteContent = (id: string) => {
    deleteContentMut({ id: id as Id<"content"> });
  };

  // Stubs for unused features (team/office use local data)
  const users: User[] = [];
  const agentPositions: AgentPosition[] = [];
  const updateUser = () => {};
  const updateAgentPosition = () => {};

  return (
    <MockDataContext.Provider
      value={{
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
      }}
    >
      {children}
    </MockDataContext.Provider>
  );
}

export function useMockData() {
  const context = useContext(MockDataContext);
  if (!context) {
    throw new Error("useMockData must be used within a MockDataProvider");
  }
  return context;
}
