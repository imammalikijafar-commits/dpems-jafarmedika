// components/survey/PainScale.tsx
'use client';

import { cn } from '@/lib/utils/cn';
import { useState } from 'react';

interface PainScaleProps {
  label: string;
  value: number | null;
  onChange: (value: number) => void;
  type: 'before' | 'after';
}

export default function PainScale({ label, value, onChange, type }: PainScaleProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const displayValue = hoverValue ?? value;

  const getColor = (val: number) => {
    if (val <= 3) return 'text-green-600 bg-green-50 border-green-200';
    if (val <= 6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getLabel = (val: number) => {
    if (val === 0) return 'Tidak Nyeri';
    if (val <= 3) return 'Nyeri Ringan';
    if (val <= 6) return 'Nyeri Sedang';
    if (val <= 8) return 'Nyeri Berat';
    return 'Nyeri Sangat Berat (Tidak Tahan)';
  };

  return (
    <div className="space-y-3 bg-white rounded-xl p-5 border-2 border-gray-200 shadow-sm">
      <label className="text-base font-semibold text-gray-800">
        {label}
        <span className="text-sm font-normal text-gray-500 ml-2">
          (Skala Visual Analog 0-10)
        </span>
      </label>

      {/* Current Selection Display */}
      {displayValue !== null && (
        <div className={cn('inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-bold', getColor(displayValue))}>
          <span className="text-xl">{displayValue}</span>
          <span>{getLabel(displayValue)}</span>
        </div>
      )}

      {/* Interactive Faces */}
      <div className="grid grid-cols-11 gap-1 mt-4">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <button
            key={num}
            type="button"
            onMouseEnter={() => setHoverValue(num)}
            onMouseLeave={() => setHoverValue(null)}
            onClick={() => onChange(num)}
            className={cn(
              'flex flex-col items-center justify-center py-2 rounded-lg border-2 transition-all text-sm font-bold',
              'hover:scale-110 hover:shadow-md active:scale-95',
              value === num ? 'ring-2 ring-offset-2 ring-emerald-500' : '',
              num <= 3 ? 'hover:bg-green-50 hover:border-green-300' :
              num <= 6 ? 'hover:bg-yellow-50 hover:border-yellow-300' :
              'hover:bg-red-50 hover:border-red-300',
              displayValue === num ? getColor(num) : 'bg-gray-50 border-gray-200 text-gray-600'
            )}
          >
            <span className="text-lg leading-none">{num}</span>
          </button>
        ))}
      </div>

      {/* Gradient Bar */}
      <div className="relative h-3 rounded-full overflow-hidden bg-gradient-to-r from-green-400 via-yellow-400 via-orange-400 to-red-600 mt-2">
        {value !== null && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-black"
            style={{ left: `${(value / 10) * 100}%` }}
          />
        )}
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 px-1">
        <span>Tidak Nyeri</span>
        <span>Nyeri Maksimal</span>
      </div>
    </div>
  );
}