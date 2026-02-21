"use client";

import { useState } from 'react';
import { Mail, MapPin, Calendar, Activity, User, Clock } from 'lucide-react';
import { useMockData } from '@/lib/mock-data';

const statusColors = {
  online: 'bg-green-500',
  busy: 'bg-red-500',
  away: 'bg-yellow-500',
  offline: 'bg-gray-500',
};

const statusLabels = {
  online: 'オンライン',
  busy: 'ビジー',
  away: '離席中',
  offline: 'オフライン',
};

export default function TeamPage() {
  const { users, tasks, content } = useMockData();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const getUserStats = (userId: string) => {
    const userTasks = tasks.filter(task => task.assigneeId === userId);
    const userContent = content.filter(item => item.assigneeId === userId);
    
    return {
      totalTasks: userTasks.length,
      completedTasks: userTasks.filter(task => task.status === 'done').length,
      inProgressTasks: userTasks.filter(task => task.status === 'inprogress').length,
      totalContent: userContent.length,
      publishedContent: userContent.filter(item => item.stage === 'published').length,
    };
  };

  const formatLastActive = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60 * 1000) return '1分未満前';
    if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))}分前`;
    if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))}時間前`;
    return `${Math.floor(diff / (24 * 60 * 60 * 1000))}日前`;
  };

  const formatJoinDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const onlineUsers = users.filter(user => user.status === 'online').length;
  const busyUsers = users.filter(user => user.status === 'busy').length;
  const awayUsers = users.filter(user => user.status === 'away').length;
  const offlineUsers = users.filter(user => user.status === 'offline').length;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">チーム画面</h1>
        <p className="text-gray-400">チームメンバーとステータス</p>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">オンライン</p>
              <p className="text-2xl font-bold text-green-400">{onlineUsers}</p>
            </div>
            <div className={`w-3 h-3 rounded-full ${statusColors.online}`}></div>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">ビジー</p>
              <p className="text-2xl font-bold text-red-400">{busyUsers}</p>
            </div>
            <div className={`w-3 h-3 rounded-full ${statusColors.busy}`}></div>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">離席中</p>
              <p className="text-2xl font-bold text-yellow-400">{awayUsers}</p>
            </div>
            <div className={`w-3 h-3 rounded-full ${statusColors.away}`}></div>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">オフライン</p>
              <p className="text-2xl font-bold text-gray-400">{offlineUsers}</p>
            </div>
            <div className={`w-3 h-3 rounded-full ${statusColors.offline}`}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Members List */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {users.map(user => {
              const stats = getUserStats(user._id);
              return (
                <div
                  key={user._id}
                  onClick={() => setSelectedUser(selectedUser === user._id ? null : user._id)}
                  className={`bg-gray-800 rounded-lg border border-gray-700 p-6 cursor-pointer transition-all duration-200 hover:border-gray-600 ${
                    selectedUser === user._id ? 'border-blue-500 bg-blue-900' : ''
                  }`}
                >
                  {/* User Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-xl">
                          {user.avatar || user.name.charAt(0)}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${statusColors[user.status]} rounded-full border-2 border-gray-800`}></div>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold">{user.name}</h3>
                        <p className="text-sm text-gray-400">{user.role}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${
                      user.status === 'online' ? 'bg-green-500 text-green-100' :
                      user.status === 'busy' ? 'bg-red-500 text-red-100' :
                      user.status === 'away' ? 'bg-yellow-500 text-yellow-100' :
                      'bg-gray-500 text-gray-100'
                    }`}>
                      {statusLabels[user.status]}
                    </span>
                  </div>

                  {/* User Bio */}
                  {user.bio && (
                    <p className="text-sm text-gray-300 mb-4">{user.bio}</p>
                  )}

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-blue-400">{stats.totalTasks}</p>
                      <p className="text-xs text-gray-400">タスク</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-purple-400">{stats.totalContent}</p>
                      <p className="text-xs text-gray-400">コンテンツ</p>
                    </div>
                  </div>

                  {/* Last Active */}
                  <div className="flex items-center text-sm text-gray-400">
                    <Clock className="w-4 h-4 mr-2" />
                    最終アクティビティ: {formatLastActive(user.lastActive)}
                  </div>

                  {/* Expanded Details */}
                  {selectedUser === user._id && (
                    <div className="mt-4 pt-4 border-t border-gray-700 space-y-3">
                      <div className="flex items-center text-sm">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span>参加日: {formatJoinDate(user.joinedAt)}</span>
                      </div>
                      
                      {/* Detailed Stats */}
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">タスク進捗</p>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>完了</span>
                              <span className="text-green-400">{stats.completedTasks}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span>進行中</span>
                              <span className="text-blue-400">{stats.inProgressTasks}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-1">コンテンツ</p>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>公開済み</span>
                              <span className="text-green-400">{stats.publishedContent}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span>作成中</span>
                              <span className="text-yellow-400">{stats.totalContent - stats.publishedContent}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Activity Sidebar */}
        <div className="space-y-6">
          {/* Active Now */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              アクティブメンバー
            </h3>
            <div className="space-y-3">
              {users.filter(user => user.status === 'online' || user.status === 'busy').map(user => (
                <div key={user._id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm">
                        {user.avatar || user.name.charAt(0)}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 ${statusColors[user.status]} rounded-full border border-gray-800`}></div>
                    </div>
                    <div className="ml-2">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.role}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatLastActive(user.lastActive)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Team Performance */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
            <h3 className="text-lg font-semibold mb-3">チームパフォーマンス</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">完了タスク</span>
                  <span className="text-white">{tasks.filter(t => t.status === 'done').length}/{tasks.length}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(tasks.filter(t => t.status === 'done').length / tasks.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">公開済みコンテンツ</span>
                  <span className="text-white">{content.filter(c => c.stage === 'published').length}/{content.length}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${(content.filter(c => c.stage === 'published').length / content.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
            <h3 className="text-lg font-semibold mb-3">クイックアクション</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded transition-colors">
                チーム会議を開始
              </button>
              <button className="w-full text-left px-3 py-2 text-sm bg-green-600 hover:bg-green-700 rounded transition-colors">
                全員に通知送信
              </button>
              <button className="w-full text-left px-3 py-2 text-sm bg-purple-600 hover:bg-purple-700 rounded transition-colors">
                パフォーマンスレポート
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}