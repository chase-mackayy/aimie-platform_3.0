'use client';

import React from 'react';
import { Bell, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession } from '@/lib/auth-client';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { data: session } = useSession();
  const userName = session?.user?.name || '';
  const userEmail = session?.user?.email || '';
  const userImage = session?.user?.image || undefined;

  const initials = userName
    ? userName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : (userEmail?.[0] ?? 'A').toUpperCase();

  return (
    <header className="h-16 border-b border-[#1e3a5f] bg-[#0a0a0a]/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <h1 className="text-lg font-bold text-[#f0f9ff]">{title}</h1>
        {subtitle && <p className="text-xs text-[#64748b]">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0d1117] border border-[#1e3a5f] text-sm text-[#64748b] w-48 hover:border-[#0ea5e9] transition-colors cursor-pointer">
          <Search className="h-4 w-4" />
          <span>Search...</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg border border-[#1e3a5f] bg-[#0d1117] text-[#64748b] hover:text-[#0ea5e9] hover:border-[#0ea5e9] transition-all">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#0ea5e9] animate-pulse" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2">
          <Avatar className="h-9 w-9 ring-2 ring-[#1e3a5f] hover:ring-[#0ea5e9] transition-all cursor-pointer">
            <AvatarImage src={userImage} alt={userName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <div className="text-sm font-medium text-[#f0f9ff]">{userName || 'User'}</div>
            <div className="text-xs text-[#64748b]">{userEmail || ''}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
