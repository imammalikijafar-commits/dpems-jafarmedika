// components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { 
  LayoutDashboard, 
  Activity, 
  MessageSquare, 
  BarChart3, 
  Download,
  Settings,
  Stethoscope,
  Heart,
  LogOut
} from 'lucide-react';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, current: true },
  { name: 'Clinical Tracker', href: '/dashboard/clinical', icon: Activity },
  { name: 'Patient Voice', href: '/dashboard/feedback', icon: MessageSquare },
  { name: 'Unit Performance', href: '/dashboard/units', icon: BarChart3 },
  { name: 'Export Data', href: '/dashboard/export', icon: Download },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      {/* Logo & Branding */}
      <div className="flex flex-col flex-grow pt-5 bg-emerald-800 overflow-y-auto border-r border-emerald-700">
        <div className="flex items-center flex-shrink-0 px-4 pb-4 border-b border-emerald-700">
          <Stethoscope className="h-8 w-8 text-white" />
          <div className="ml-3">
            <p className="text-lg font-bold text-white leading-tight">DPEMS</p>
            <p className="text-xs text-emerald-200">Ja'far Medika</p>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
                           (item.href !== '/dashboard' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  isActive
                    ? 'bg-emerald-900 text-white'
                    : 'text-emerald-100 hover:bg-emerald-700 hover:text-white',
                  'group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive ? 'text-emerald-300' : 'text-emerald-400 group-hover:text-emerald-300'
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div className="mt-auto p-4 border-t border-emerald-700">
          <div className="flex items-center gap-2 text-xs text-emerald-200 mb-2">
            <Heart className="w-3 h-3 text-red-400" />
            <span>Integrative Care Monitoring</span>
          </div>
          <div className="text-[10px] text-emerald-300 opacity-75">
            v1.0.0 • Last sync: Just now
          </div>
        </div>
      </div>
    </div>
  );
}