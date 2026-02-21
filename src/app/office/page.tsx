"use client";

import { useState, useEffect } from 'react';
import { User, Activity, Clock, X } from 'lucide-react';
import { useMockData } from '@/lib/mock-data';

export default function OfficePage() {
  const { users, agentPositions, tasks, updateAgentPosition } = useMockData();
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [time, setTime] = useState(new Date());

  // Update time every second for realistic clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate agent activity updates
  useEffect(() => {
    const interval = setInterval(() => {
      agentPositions.forEach(pos => {
        if (pos.user?.status === 'online' || pos.user?.status === 'busy') {
          const activities = ['typing', 'thinking', 'idle'];
          const randomActivity = activities[Math.floor(Math.random() * activities.length)];
          updateAgentPosition(pos._id, { currentActivity: randomActivity });
        }
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [agentPositions, updateAgentPosition]);

  const getAgentCurrentTask = (userId: string) => {
    return tasks.find(task => task.assigneeId === userId && task.status === 'inprogress');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getActivityAnimation = (activity?: string) => {
    switch (activity) {
      case 'typing':
        return 'animate-bounce';
      case 'thinking':
        return 'animate-pulse';
      default:
        return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#10B981'; // green-500
      case 'busy': return '#EF4444'; // red-500
      case 'away': return '#F59E0B'; // yellow-500
      default: return '#6B7280'; // gray-500
    }
  };

  return (
    <div className="p-6 h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">オフィス画面</h1>
        <p className="text-gray-400">バーチャルオフィス空間 - AIエージェントの作業状況</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {/* Main Office View */}
        <div className="xl:col-span-3 bg-gray-900 rounded-lg border border-gray-700 relative overflow-hidden">
          {/* Office Background */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #1F2937 25%, transparent 25%), 
                linear-gradient(-45deg, #1F2937 25%, transparent 25%), 
                linear-gradient(45deg, transparent 75%, #1F2937 75%), 
                linear-gradient(-45deg, transparent 75%, #1F2937 75%)
              `,
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
              opacity: 0.1
            }}
          />

          {/* Office Floor Grid */}
          <svg 
            className="absolute inset-0 w-full h-full" 
            viewBox="0 0 800 600"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Floor tiles */}
            <defs>
              <pattern id="floor" patternUnits="userSpaceOnUse" width="40" height="40">
                <rect width="40" height="40" fill="#374151" />
                <rect width="38" height="38" x="1" y="1" fill="#4B5563" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#floor)" />

            {/* Office Furniture - Desks */}
            {agentPositions.map((pos, index) => (
              <g key={pos._id}>
                {/* Desk */}
                <rect
                  x={pos.x - 40}
                  y={pos.y - 20}
                  width="80"
                  height="40"
                  fill="#8B4513"
                  stroke="#654321"
                  strokeWidth="2"
                  rx="4"
                />
                
                {/* Computer Monitor */}
                <rect
                  x={pos.x - 15}
                  y={pos.y - 15}
                  width="30"
                  height="20"
                  fill="#1F2937"
                  stroke="#374151"
                  strokeWidth="1"
                  rx="2"
                />
                
                {/* Monitor Screen */}
                <rect
                  x={pos.x - 13}
                  y={pos.y - 13}
                  width="26"
                  height="16"
                  fill="#059669"
                  className={pos.user?.status === 'online' || pos.user?.status === 'busy' ? '' : 'opacity-30'}
                />
                
                {/* Monitor Stand */}
                <rect
                  x={pos.x - 3}
                  y={pos.y + 5}
                  width="6"
                  height="8"
                  fill="#374151"
                />
                
                {/* Desk Number */}
                <text
                  x={pos.x - 35}
                  y={pos.y - 25}
                  fill="#9CA3AF"
                  fontSize="12"
                  fontFamily="monospace"
                >
                  DESK {pos.deskNumber}
                </text>
              </g>
            ))}

            {/* Agents */}
            {agentPositions.map((pos) => {
              if (!pos.user) return null;
              
              const isAway = pos.user.status === 'away' || pos.user.status === 'offline';
              const agentX = isAway ? pos.x + 60 : pos.x; // Away from desk if not active
              const agentY = isAway ? pos.y + 40 : pos.y + 25; // Position agents at desk or away

              return (
                <g key={`agent-${pos._id}`}>
                  {/* Agent Avatar Circle */}
                  <circle
                    cx={agentX}
                    cy={agentY}
                    r="20"
                    fill={getStatusColor(pos.user.status)}
                    stroke="#1F2937"
                    strokeWidth="3"
                    className={`cursor-pointer transition-all duration-300 hover:stroke-white ${getActivityAnimation(pos.currentActivity)}`}
                    onClick={() => setSelectedAgent(selectedAgent === pos.userId ? null : pos.userId)}
                  />
                  
                  {/* Agent Emoji/Avatar */}
                  <text
                    x={agentX}
                    y={agentY + 5}
                    textAnchor="middle"
                    fontSize="16"
                    className="pointer-events-none select-none"
                  >
                    {pos.user.avatar}
                  </text>
                  
                  {/* Status Indicator */}
                  <circle
                    cx={agentX + 15}
                    cy={agentY - 15}
                    r="4"
                    fill={getStatusColor(pos.user.status)}
                    stroke="#1F2937"
                    strokeWidth="2"
                  />
                  
                  {/* Activity Animation */}
                  {pos.currentActivity === 'typing' && !isAway && (
                    <g className="animate-pulse">
                      <rect x={agentX - 10} y={agentY - 40} width="4" height="2" fill="#10B981" />
                      <rect x={agentX - 4} y={agentY - 40} width="4" height="2" fill="#10B981" />
                      <rect x={agentX + 2} y={agentY - 40} width="4" height="2" fill="#10B981" />
                      <rect x={agentX + 8} y={agentY - 40} width="4" height="2" fill="#10B981" />
                    </g>
                  )}
                  
                  {pos.currentActivity === 'thinking' && !isAway && (
                    <g className="animate-bounce">
                      <circle cx={agentX - 5} cy={agentY - 35} r="2" fill="#60A5FA" />
                      <circle cx={agentX + 5} cy={agentY - 35} r="2" fill="#60A5FA" />
                      <circle cx={agentX} cy={agentY - 40} r="3" fill="#60A5FA" />
                    </g>
                  )}
                  
                  {/* Agent Name */}
                  <text
                    x={agentX}
                    y={agentY + 35}
                    textAnchor="middle"
                    fill="#D1D5DB"
                    fontSize="10"
                    fontFamily="sans-serif"
                    className="pointer-events-none"
                  >
                    {pos.user.name.split(' ')[2]} {/* Show just "Alpha", "Beta", etc. */}
                  </text>
                </g>
              );
            })}

            {/* Office Elements */}
            {/* Water Cooler */}
            <g>
              <rect x="50" y="500" width="20" height="40" fill="#4A90E2" rx="4" />
              <circle cx="60" cy="490" r="8" fill="#87CEEB" />
              <text x="80" y="520" fill="#9CA3AF" fontSize="8">Water</text>
            </g>
            
            {/* Meeting Room */}
            <g>
              <rect x="650" y="50" width="120" height="80" fill="#2D3748" stroke="#4A5568" strokeWidth="2" rx="4" />
              <rect x="680" y="70" width="60" height="40" fill="#8B4513" rx="20" />
              <text x="710" y="95" textAnchor="middle" fill="#9CA3AF" fontSize="10">Meeting</text>
              <text x="710" y="105" textAnchor="middle" fill="#9CA3AF" fontSize="10">Room</text>
            </g>
            
            {/* Coffee Machine */}
            <g>
              <rect x="720" y="480" width="25" height="35" fill="#654321" rx="4" />
              <rect x="722" y="470" width="21" height="8" fill="#8B4513" rx="2" />
              <circle cx="732" cy="465" r="3" fill="#FF6B6B" />
              <text x="750" y="500" fill="#9CA3AF" fontSize="8">Coffee</text>
            </g>
          </svg>

          {/* Office Time Display */}
          <div className="absolute top-4 right-4 bg-gray-800 bg-opacity-90 px-4 py-2 rounded-lg border border-gray-600">
            <div className="flex items-center text-green-400">
              <Clock className="w-4 h-4 mr-2" />
              <span className="font-mono text-sm">{formatTime(time)}</span>
            </div>
          </div>
        </div>

        {/* Agent Details Sidebar */}
        <div className="space-y-6">
          {/* Selected Agent Details */}
          {selectedAgent ? (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">エージェント詳細</h3>
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {(() => {
                const user = users.find(u => u._id === selectedAgent);
                const position = agentPositions.find(p => p.userId === selectedAgent);
                const currentTask = getAgentCurrentTask(selectedAgent);
                
                if (!user || !position) return null;
                
                return (
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="text-3xl mr-3">{user.avatar}</div>
                      <div>
                        <h4 className="font-semibold text-white">{user.name}</h4>
                        <p className="text-sm text-gray-400">{user.role}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">ステータス:</span>
                        <span 
                          className="px-2 py-1 text-xs rounded"
                          style={{ 
                            backgroundColor: getStatusColor(user.status) + '20', 
                            color: getStatusColor(user.status) 
                          }}
                        >
                          {user.status}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-400">デスク:</span>
                        <span className="text-white">#{position.deskNumber}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-400">現在の活動:</span>
                        <span className="text-white">{position.currentActivity || 'idle'}</span>
                      </div>
                    </div>
                    
                    {currentTask && (
                      <div className="border-t border-gray-700 pt-4">
                        <h5 className="font-medium text-white mb-2">現在のタスク</h5>
                        <div className="bg-gray-700 p-3 rounded">
                          <p className="text-sm font-medium text-white mb-1">{currentTask.title}</p>
                          {currentTask.description && (
                            <p className="text-xs text-gray-400">{currentTask.description}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 text-center text-gray-400">
              <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>エージェントをクリックして詳細を表示</p>
            </div>
          )}

          {/* Office Stats */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              オフィス統計
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">在席中:</span>
                <span className="text-green-400">
                  {users.filter(u => u.status === 'online' || u.status === 'busy').length}/{users.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">アクティブタスク:</span>
                <span className="text-blue-400">{tasks.filter(t => t.status === 'inprogress').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">完了タスク:</span>
                <span className="text-green-400">{tasks.filter(t => t.status === 'done').length}</span>
              </div>
            </div>
          </div>

          {/* Agent Status List */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
            <h3 className="text-lg font-semibold mb-3">エージェント一覧</h3>
            <div className="space-y-3">
              {users.map(user => {
                const position = agentPositions.find(p => p.userId === user._id);
                const isSelected = selectedAgent === user._id;
                return (
                  <div
                    key={user._id}
                    onClick={() => setSelectedAgent(isSelected ? null : user._id)}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-600' : 'hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-lg mr-2">{user.avatar}</div>
                      <div>
                        <p className="text-sm font-medium">{user.name.split(' ')[2]}</p>
                        <p className="text-xs text-gray-400">{position?.currentActivity || 'idle'}</p>
                      </div>
                    </div>
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getStatusColor(user.status) }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}