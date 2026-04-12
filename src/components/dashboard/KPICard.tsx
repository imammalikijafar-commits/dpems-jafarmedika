'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface KPICardProps {
  icon: React.ElementType
  title: string
  value: string
  subtitle: string
  trend: 'up' | 'down'
  color: 'emerald' | 'blue' | 'amber' | 'rose' | 'purple'
  delay?: number
}

const colorMap: Record<string, { bg: string; text: string; icon: string; border: string }> = {
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: 'bg-emerald-500', border: 'border-emerald-100' },
  blue:    { bg: 'bg-blue-50',    text: 'text-blue-600',    icon: 'bg-blue-500',    border: 'border-blue-100' },
  amber:   { bg: 'bg-amber-50',   text: 'text-amber-600',   icon: 'bg-amber-500',   border: 'border-amber-100' },
  rose:    { bg: 'bg-rose-50',    text: 'text-rose-600',    icon: 'bg-rose-500',    border: 'border-rose-100' },
  purple:  { bg: 'bg-purple-50',  text: 'text-purple-600',  icon: 'bg-purple-500',  border: 'border-purple-100' },
}

export function KPICard({ icon: Icon, title, value, subtitle, trend, color, delay = 0 }: KPICardProps) {
  const c = colorMap[color] || colorMap.emerald

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.3 }}
    >
      <Card className={cn('overflow-hidden border hover:shadow-lg transition-shadow duration-300')}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center shadow-sm', c.icon)}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            {trend === 'up' ? (
              <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">↑</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-red-500 bg-red-50 px-2 py-1 rounded-full">
                <ArrowDownRight className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">↓</span>
              </div>
            )}
          </div>
          <div className="mt-4">
            <p className="text-2xl lg:text-3xl font-extrabold text-gray-800 tracking-tight">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">{title}</p>
            <p className={cn('text-xs font-semibold mt-1.5', c.text)}>{subtitle}</p>
          </div>
          {/* Color accent bar */}
          <div className={cn('mt-3 h-1 rounded-full', c.icon)} style={{ width: '40%' }} />
        </CardContent>
      </Card>
    </motion.div>
  )
}