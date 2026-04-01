import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
}

export function StatsCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconColor = '#0ea5e9',
  className,
}: StatsCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div
      className={cn(
        'electric-card rounded-lg bg-[#0d1117] p-6 relative overflow-hidden group cursor-default',
        className
      )}
    >
      {/* Subtle corner glow */}
      <div
        className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle, ${iconColor}20 0%, transparent 70%)`,
        }}
      />

      <div className="flex items-start justify-between mb-4">
        <div
          className="p-2 rounded-lg"
          style={{ background: `${iconColor}15`, border: `1px solid ${iconColor}30` }}
        >
          <Icon className="h-5 w-5" style={{ color: iconColor }} />
        </div>
        {change !== undefined && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
              isPositive
                ? 'bg-[rgba(34,197,94,0.1)] text-[#22c55e]'
                : 'bg-[rgba(239,68,68,0.1)] text-[#ef4444]'
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(change)}%
          </div>
        )}
      </div>

      <div className="text-3xl font-bold text-[#f0f9ff] mb-1">{value}</div>
      <div className="text-sm text-[#64748b]">{title}</div>
      {changeLabel && (
        <div className="text-xs text-[#64748b] mt-1">{changeLabel}</div>
      )}
    </div>
  );
}
