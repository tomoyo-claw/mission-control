"use client";

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus, FileText, Video, Mic, Twitter, Calendar, User } from 'lucide-react';
import { useMockData, ContentItem } from '@/lib/mock-data';

const stageColumns = [
  { id: 'idea', title: 'アイデア', color: 'border-purple-500', bgColor: 'bg-purple-900' },
  { id: 'draft', title: 'ドラフト', color: 'border-yellow-500', bgColor: 'bg-yellow-900' },
  { id: 'review', title: 'レビュー', color: 'border-blue-500', bgColor: 'bg-blue-900' },
  { id: 'published', title: '公開済み', color: 'border-green-500', bgColor: 'bg-green-900' },
] as const;

const contentTypeIcons = {
  blog: FileText,
  tweet: Twitter,
  video: Video,
  article: FileText,
  podcast: Mic,
};

const contentTypeColors = {
  blog: 'text-blue-400',
  tweet: 'text-cyan-400',
  video: 'text-red-400',
  article: 'text-green-400',
  podcast: 'text-purple-400',
};

const contentTypeLabels = {
  blog: 'ブログ',
  tweet: 'ツイート',
  video: '動画',
  article: '記事',
  podcast: 'ポッドキャスト',
};

export default function ContentPage() {
  const { content, updateContent, createContent, users } = useMockData();
  const [newContentTitle, setNewContentTitle] = useState('');
  const [newContentType, setNewContentType] = useState<ContentItem['type']>('blog');
  const [showNewContentForm, setShowNewContentForm] = useState<string | null>(null);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    updateContent(draggableId, {
      stage: destination.droppableId as ContentItem['stage'],
      order: destination.index,
    });
  };

  const handleCreateContent = (stage: ContentItem['stage']) => {
    if (!newContentTitle.trim()) return;

    createContent({
      title: newContentTitle,
      type: newContentType,
      stage,
      order: content.filter(c => c.stage === stage).length,
      assigneeId: users[0]._id, // Default assignee for demo
    });

    setNewContentTitle('');
    setNewContentType('blog');
    setShowNewContentForm(null);
  };

  const getContentByStage = (stage: string) => {
    return content
      .filter(item => item.stage === stage)
      .sort((a, b) => a.order - b.order);
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return null;
    return new Date(timestamp).toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = (dueDate?: number) => {
    return dueDate && dueDate < Date.now();
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">コンテンツパイプライン</h1>
        <p className="text-gray-400">アイデアから公開まで管理</p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {stageColumns.map((column) => (
            <div key={column.id} className={`bg-gray-800 rounded-lg border-2 ${column.color}`}>
              <div className={`p-4 ${column.bgColor} rounded-t-lg border-b border-gray-700`}>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">{column.title}</h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-200">
                      {getContentByStage(column.id).length}
                    </span>
                    <button
                      onClick={() => setShowNewContentForm(column.id)}
                      className="text-gray-200 hover:text-white transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[200px] p-4 space-y-3 ${
                      snapshot.isDraggingOver ? 'bg-gray-700' : ''
                    }`}
                  >
                    {showNewContentForm === column.id && (
                      <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                        <input
                          type="text"
                          placeholder="新しいコンテンツタイトル..."
                          value={newContentTitle}
                          onChange={(e) => setNewContentTitle(e.target.value)}
                          className="w-full bg-transparent border-none outline-none text-white placeholder-gray-400 mb-3"
                          autoFocus
                        />
                        <select
                          value={newContentType}
                          onChange={(e) => setNewContentType(e.target.value as ContentItem['type'])}
                          className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white mb-3 text-sm"
                        >
                          <option value="blog">ブログ</option>
                          <option value="article">記事</option>
                          <option value="tweet">ツイート</option>
                          <option value="video">動画</option>
                          <option value="podcast">ポッドキャスト</option>
                        </select>
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setShowNewContentForm(null)}
                            className="text-xs px-3 py-1 text-gray-400 hover:text-white"
                          >
                            キャンセル
                          </button>
                          <button
                            onClick={() => handleCreateContent(column.id as ContentItem['stage'])}
                            className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white"
                          >
                            追加
                          </button>
                        </div>
                      </div>
                    )}

                    {getContentByStage(column.id).map((item, index) => {
                      const Icon = contentTypeIcons[item.type];
                      return (
                        <Draggable key={item._id} draggableId={item._id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-gray-700 p-4 rounded-lg border border-gray-600 hover:border-gray-500 transition-all ${
                                snapshot.isDragging ? 'rotate-1 shadow-lg' : ''
                              }`}
                            >
                              {/* Content Header */}
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center flex-1">
                                  <Icon className={`w-4 h-4 mr-2 ${contentTypeColors[item.type]}`} />
                                  <h3 className="text-sm font-medium text-white flex-1 line-clamp-2">
                                    {item.title}
                                  </h3>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-xs ${contentTypeColors[item.type]} bg-opacity-20`} style={{backgroundColor: contentTypeColors[item.type] + '20'}}>
                                  {contentTypeLabels[item.type]}
                                </span>
                              </div>

                              {/* Description */}
                              {item.description && (
                                <p className="text-xs text-gray-400 mb-3 line-clamp-2">{item.description}</p>
                              )}

                              {/* Content Footer */}
                              <div className="space-y-2">
                                {/* Assignee and Due Date */}
                                <div className="flex items-center justify-between text-xs">
                                  {item.assignee && (
                                    <div className="flex items-center text-gray-400">
                                      <User className="w-3 h-3 mr-1" />
                                      <span className="truncate max-w-[100px]">{item.assignee.name}</span>
                                    </div>
                                  )}
                                  {item.dueDate && (
                                    <div className={`flex items-center ${isOverdue(item.dueDate) ? 'text-red-400' : 'text-gray-400'}`}>
                                      <Calendar className="w-3 h-3 mr-1" />
                                      <span>{formatDate(item.dueDate)}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Progress Indicator */}
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span>更新: {formatDate(item.updatedAt)}</span>
                                  {isOverdue(item.dueDate) && (
                                    <span className="text-red-400 font-medium">期限切れ</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Content Analytics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400 mb-1">総コンテンツ数</h3>
          <p className="text-2xl font-bold text-white">{content.length}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400 mb-1">制作中</h3>
          <p className="text-2xl font-bold text-yellow-400">{getContentByStage('draft').length}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400 mb-1">レビュー待ち</h3>
          <p className="text-2xl font-bold text-blue-400">{getContentByStage('review').length}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400 mb-1">公開済み</h3>
          <p className="text-2xl font-bold text-green-400">{getContentByStage('published').length}</p>
        </div>
      </div>

      {/* Content by Type Stats */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">コンテンツタイプ別統計</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(contentTypeLabels).map(([type, label]) => {
            const typeContent = content.filter(item => item.type === type);
            const Icon = contentTypeIcons[type as ContentItem['type']];
            return (
              <div key={type} className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
                <Icon className={`w-8 h-8 mx-auto mb-2 ${contentTypeColors[type as ContentItem['type']]}`} />
                <p className="text-lg font-bold text-white">{typeContent.length}</p>
                <p className="text-sm text-gray-400">{label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}