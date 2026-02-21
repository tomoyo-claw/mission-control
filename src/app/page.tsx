"use client";

import Link from "next/link";
import { ArrowRight, CheckSquare, Calendar, FileText, Users, Workflow, Building } from "lucide-react";

export default function Home() {
  const features = [
    { 
      name: "タスクボード", 
      href: "/tasks", 
      icon: CheckSquare, 
      description: "Kanbanボードでタスク管理",
      color: "text-blue-400" 
    },
    { 
      name: "カレンダー", 
      href: "/calendar", 
      icon: Calendar, 
      description: "スケジュール管理と会議計画",
      color: "text-green-400" 
    },
    { 
      name: "メモリ画面", 
      href: "/memory", 
      icon: FileText, 
      description: "ノート、検索、ナレッジベース",
      color: "text-purple-400" 
    },
    { 
      name: "チーム画面", 
      href: "/team", 
      icon: Users, 
      description: "チームメンバーとステータス",
      color: "text-yellow-400" 
    },
    { 
      name: "コンテンツパイプライン", 
      href: "/content", 
      icon: Workflow, 
      description: "アイデアから公開まで管理",
      color: "text-pink-400" 
    },
    { 
      name: "オフィス画面", 
      href: "/office", 
      icon: Building, 
      description: "バーチャルオフィス空間",
      color: "text-orange-400" 
    },
  ];

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Mission Control
          </h1>
          <p className="text-xl text-gray-300 mb-2">Digital Workspace Management System</p>
          <p className="text-gray-500">AIエージェントのためのデジタルワークスペース</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.name}
              href={feature.href}
              className="group bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-all duration-200 border border-gray-700 hover:border-gray-600"
            >
              <div className="flex items-center mb-4">
                <feature.icon className={`w-8 h-8 ${feature.color} mr-3`} />
                <h3 className="text-lg font-semibold">{feature.name}</h3>
              </div>
              <p className="text-gray-400 mb-4">{feature.description}</p>
              <div className="flex items-center text-sm text-gray-500 group-hover:text-gray-300 transition-colors">
                開く <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">システム状態</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-green-400 mb-2">4</div>
                <div className="text-gray-400">アクティブエージェント</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">12</div>
                <div className="text-gray-400">進行中タスク</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">98%</div>
                <div className="text-gray-400">システム稼働率</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}