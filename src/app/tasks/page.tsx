"use client";

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus, User, Calendar, AlertCircle } from 'lucide-react';
import { useMockData, Task } from '@/lib/mock-data';

const statusColumns = [
  { id: 'backlog', title: 'バックログ', color: 'border-gray-600' },
  { id: 'inprogress', title: '進行中', color: 'border-blue-500' },
  { id: 'review', title: 'レビュー', color: 'border-yellow-500' },
  { id: 'done', title: '完了', color: 'border-green-500' },
] as const;

const priorityColors = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
};

const priorityLabels = {
  high: '高',
  medium: '中',
  low: '低',
};

export default function TasksPage() {
  const { tasks, updateTask, createTask, users } = useMockData();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showNewTaskForm, setShowNewTaskForm] = useState<string | null>(null);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    updateTask(draggableId, {
      status: destination.droppableId as Task['status'],
      order: destination.index,
    });
  };

  const handleCreateTask = (status: Task['status']) => {
    if (!newTaskTitle.trim()) return;

    createTask({
      title: newTaskTitle,
      status,
      priority: 'medium',
      order: tasks.filter(t => t.status === status).length,
    });

    setNewTaskTitle('');
    setShowNewTaskForm(null);
  };

  const getTasksByStatus = (status: string) => {
    return tasks
      .filter(task => task.status === status)
      .sort((a, b) => a.order - b.order);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">タスクボード</h1>
        <p className="text-gray-400">チームタスクの進捗を管理</p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {statusColumns.map((column) => (
            <div key={column.id} className={`bg-gray-800 rounded-lg border-2 ${column.color}`}>
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">{column.title}</h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">
                      {getTasksByStatus(column.id).length}
                    </span>
                    <button
                      onClick={() => setShowNewTaskForm(column.id)}
                      className="text-gray-400 hover:text-white transition-colors"
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
                    {showNewTaskForm === column.id && (
                      <div className="bg-gray-700 p-3 rounded-lg border border-gray-600">
                        <input
                          type="text"
                          placeholder="新しいタスク..."
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleCreateTask(column.id as Task['status']);
                            }
                          }}
                          className="w-full bg-transparent border-none outline-none text-white placeholder-gray-400"
                          autoFocus
                        />
                        <div className="flex justify-end space-x-2 mt-2">
                          <button
                            onClick={() => setShowNewTaskForm(null)}
                            className="text-xs px-2 py-1 text-gray-400 hover:text-white"
                          >
                            キャンセル
                          </button>
                          <button
                            onClick={() => handleCreateTask(column.id as Task['status'])}
                            className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white"
                          >
                            追加
                          </button>
                        </div>
                      </div>
                    )}

                    {getTasksByStatus(column.id).map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-gray-700 p-3 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors ${
                              snapshot.isDragging ? 'rotate-2 shadow-lg' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-sm font-medium text-white flex-1">
                                {task.title}
                              </h3>
                              <div className={`w-2 h-2 rounded-full ml-2 ${priorityColors[task.priority]}`} />
                            </div>

                            {task.description && (
                              <p className="text-xs text-gray-400 mb-3">{task.description}</p>
                            )}

                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center space-x-2">
                                {task.assignee && (
                                  <div className="flex items-center text-gray-400">
                                    <User className="w-3 h-3 mr-1" />
                                    <span className="truncate max-w-[80px]">{task.assignee.name}</span>
                                  </div>
                                )}
                                <div className="flex items-center text-gray-500">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  <span>{priorityLabels[task.priority]}</span>
                                </div>
                              </div>
                              <div className="flex items-center text-gray-500">
                                <Calendar className="w-3 h-3 mr-1" />
                                <span>
                                  {new Date(task.updatedAt).toLocaleDateString('ja-JP')}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Task Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400 mb-1">総タスク数</h3>
          <p className="text-2xl font-bold text-white">{tasks.length}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400 mb-1">進行中</h3>
          <p className="text-2xl font-bold text-blue-400">{getTasksByStatus('inprogress').length}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400 mb-1">レビュー待ち</h3>
          <p className="text-2xl font-bold text-yellow-400">{getTasksByStatus('review').length}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400 mb-1">完了</h3>
          <p className="text-2xl font-bold text-green-400">{getTasksByStatus('done').length}</p>
        </div>
      </div>
    </div>
  );
}