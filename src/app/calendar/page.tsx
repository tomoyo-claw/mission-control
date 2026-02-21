"use client";

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, User } from 'lucide-react';
import { useMockData } from '@/lib/mock-data';

export default function CalendarPage() {
  const { events, users } = useMockData();
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];

  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getEventsForDay = (day: number) => {
    const dayStart = new Date(year, month, day, 0, 0, 0).getTime();
    const dayEnd = new Date(year, month, day, 23, 59, 59).getTime();
    
    return events.filter(event => {
      return (event.startDate >= dayStart && event.startDate <= dayEnd) ||
             (event.endDate >= dayStart && event.endDate <= dayEnd) ||
             (event.startDate <= dayStart && event.endDate >= dayEnd);
    });
  };

  const isToday = (day: number) => {
    return today.getDate() === day && 
           today.getMonth() === month && 
           today.getFullYear() === year;
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const upcomingEvents = events
    .filter(event => event.startDate > Date.now())
    .sort((a, b) => a.startDate - b.startDate)
    .slice(0, 5);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">カレンダー</h1>
        <p className="text-gray-400">スケジュール管理と会議計画</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Calendar */}
        <div className="xl:col-span-3">
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            {/* Calendar Header */}
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {year}年{monthNames[month]}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 hover:bg-gray-700 rounded transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                >
                  今日
                </button>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 hover:bg-gray-700 rounded transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-4">
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekdays.map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-400 p-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  if (!day) {
                    return <div key={index} className="h-24"></div>;
                  }

                  const dayEvents = getEventsForDay(day);
                  const isCurrentDay = isToday(day);

                  return (
                    <div
                      key={day}
                      className={`h-24 p-1 border border-gray-700 rounded hover:bg-gray-700 transition-colors ${
                        isCurrentDay ? 'bg-blue-900 border-blue-600' : 'bg-gray-800'
                      }`}
                    >
                      <div className={`text-sm font-medium mb-1 ${
                        isCurrentDay ? 'text-blue-300' : 'text-white'
                      }`}>
                        {day}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map(event => (
                          <div
                            key={event._id}
                            className="text-xs p-1 rounded truncate"
                            style={{ backgroundColor: event.color + '40', color: event.color }}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-400">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Add Event Button */}
          <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            新しいイベント
          </button>

          {/* Today's Events */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
            <h3 className="text-lg font-semibold mb-3">今日の予定</h3>
            {getEventsForDay(today.getDate()).length > 0 ? (
              <div className="space-y-3">
                {getEventsForDay(today.getDate()).map(event => {
                  const creator = users.find(u => u._id === event.createdBy);
                  return (
                    <div key={event._id} className="border-l-2 pl-3" style={{ borderLeftColor: event.color }}>
                      <div className="font-medium text-sm">{event.title}</div>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTime(event.startDate)} - {formatTime(event.endDate)}
                      </div>
                      {creator && (
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <User className="w-3 h-3 mr-1" />
                          {creator.name}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">今日の予定はありません</p>
            )}
          </div>

          {/* Upcoming Events */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
            <h3 className="text-lg font-semibold mb-3">今後の予定</h3>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map(event => {
                  const creator = users.find(u => u._id === event.createdBy);
                  return (
                    <div key={event._id} className="border-l-2 pl-3" style={{ borderLeftColor: event.color }}>
                      <div className="font-medium text-sm">{event.title}</div>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(event.startDate).toLocaleDateString('ja-JP')} {formatTime(event.startDate)}
                      </div>
                      {creator && (
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <User className="w-3 h-3 mr-1" />
                          {creator.name}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">予定されたイベントはありません</p>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
            <h3 className="text-lg font-semibold mb-3">統計</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">今月のイベント</span>
                <span className="text-white">{events.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">今日の会議</span>
                <span className="text-white">{getEventsForDay(today.getDate()).length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">今後7日間</span>
                <span className="text-white">
                  {events.filter(e => e.startDate > Date.now() && e.startDate < Date.now() + 7 * 24 * 60 * 60 * 1000).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}