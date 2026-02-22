"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Calendar,
  CheckSquare,
  FileText,
  Users,
  Workflow,
  Building,
  Zap,
  GitBranch,
} from "lucide-react";

const navigation = [
  { name: "タスクボード", href: "/tasks", icon: CheckSquare, color: "text-blue-400" },
  { name: "GitHub Issues", href: "/issues", icon: GitBranch, color: "text-emerald-400" },
  { name: "カレンダー", href: "/calendar", icon: Calendar, color: "text-green-400" },
  { name: "メモリ画面", href: "/memory", icon: FileText, color: "text-purple-400" },
  { name: "チーム画面", href: "/team", icon: Users, color: "text-yellow-400" },
  { name: "コンテンツパイプライン", href: "/content", icon: Workflow, color: "text-pink-400" },
  { name: "オフィス画面", href: "/office", icon: Building, color: "text-orange-400" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 px-4 py-6">
      <div className="flex items-center mb-8">
        <Zap className="w-8 h-8 text-blue-400 mr-3" />
        <div>
          <h1 className="text-xl font-bold text-white">Mission Control</h1>
          <p className="text-sm text-gray-400">Digital Workspace</p>
        </div>
      </div>
      
      <nav className="space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              <item.icon 
                className={cn("w-5 h-5 mr-3", isActive ? item.color : "text-gray-400")} 
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <div className="border-t border-gray-700 pt-4">
          <div className="text-xs text-gray-500 mb-2">システム状態</div>
          <div className="flex items-center text-sm text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            オンライン
          </div>
        </div>
      </div>
    </div>
  );
}