import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface AnimatedStatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  delay?: number;
}

export function AnimatedStatsCard({ title, value, icon: Icon, color, delay = 0 }: AnimatedStatsCardProps) {
  return (
    <Card 
      className="overflow-hidden group hover:shadow-lg transition-all duration-300 dark:bg-gray-800 dark:border-gray-700"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${color} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white animate-pulse-slow" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}