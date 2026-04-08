// components/dashboard/KPICard.tsx
import { cn } from '@/lib/utils/cn';
import { Card, CardContent } from '@/components/ui/Card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ReactNode } from 'react';

interface KPICardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  trend?: number; // percentage change
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

export default function KPICard({ title, value, subtitle, icon, trend, color = 'blue' }: KPICardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    red: 'bg-red-50 text-red-600 border-red-200',
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <Card padding="md" className={cn('border-2 hover:shadow-md transition-shadow', colorClasses[color])}>
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
              {trend !== undefined && (
                <span className={cn(
                  'inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded',
                  trend > 0 ? 'bg-green-100 text-green-700' : trend < 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                )}>
                  {getTrendIcon()}
                  {Math.abs(trend)}%
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          </div>
          
          <div className={cn('p-3 rounded-xl', colorClasses[color].split(' ')[0], colorClasses[color].split(' ')[1])}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}