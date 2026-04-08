// components/survey/LikertScale.tsx
'use client';

import { cn } from '@/lib/utils/cn';

interface LikertScaleProps {
  label: string;
  value: number | null;  // Changed from number to number | null
  onChange: (value: number) => void;
  labels?: string[];
  emojis?: string[];
  description?: string;
  required?: boolean;
}

export default function LikertScale({
  label,
  value,
  onChange,
  labels = ['Sangat Tidak Setuju', 'Tidak Setuju', 'Netral', 'Setuju', 'Sangat Setuju'],
  emojis = ['😠', '😐', '🙂', '😃', '😍'],
  description,
  required = false,
}: LikertScaleProps) {
  return (
    <div className="space-y-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
      <div className="flex items-start justify-between">
        <label className="text-base font-medium text-gray-800 flex-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {value !== null && (
          <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
            {value}/5
          </span>
        )}
      </div>
      
      {description && (
        <p className="text-sm text-gray-500 italic">{description}</p>
      )}

      {/* Emoji Buttons */}
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onChange(num)}
            className={cn(
              'flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all',
              'hover:border-emerald-300 hover:bg-white active:scale-95',
              value === num
                ? 'border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-200'
                : 'border-gray-200 bg-white'
            )}
            aria-label={`${labels[num-1]} (${num})`}
          >
            <span className="text-2xl mb-1">{emojis[num - 1]}</span>
            <span className="text-xs font-medium text-gray-600 text-center leading-tight">
              {labels[num - 1]}
            </span>
          </button>
        ))}
      </div>

      {/* Visual Scale Bar */}
      <div className="flex items-center gap-1 mt-2 px-1">
        <span className="text-xs text-red-400">Buruk</span>
        <div className="flex-1 h-1.5 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-full"></div>
        <span className="text-xs text-green-600">Baik</span>
      </div>
    </div>
  );
}