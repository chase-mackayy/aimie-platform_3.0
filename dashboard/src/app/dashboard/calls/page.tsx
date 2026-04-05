'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/dashboard/header';
import {
  Phone,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  PhoneIncoming,
  PhoneMissed,
  CheckCircle,
  Clock,
  Calendar,
  MessageSquare,
  Loader2,
} from 'lucide-react';

interface Call {
  id: string;
  callerNumber: string | null;
  duration: number | null;
  outcome: string | null;
  sentiment: string | null;
  createdAt: string;
  summary: string | null;
  transcript: string | null;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString('en-AU', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function OutcomeIcon({ outcome }: { outcome: string }) {
  if (outcome === 'booked') return <CheckCircle className="h-4 w-4 text-[#22c55e]" />;
  if (outcome === 'missed') return <PhoneMissed className="h-4 w-4 text-[#ef4444]" />;
  if (outcome === 'info') return <PhoneIncoming className="h-4 w-4 text-[#0ea5e9]" />;
  return <Phone className="h-4 w-4 text-[#eab308]" />;
}

function OutcomeBadge({ outcome }: { outcome: string }) {
  const styles: Record<string, string> = {
    booked: 'badge-active', missed: 'badge-error', info: 'badge-info', callback: 'badge-warning',
  };
  const labels: Record<string, string> = {
    booked: 'Booked', missed: 'Missed', info: 'Info', callback: 'Callback',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[outcome] || 'badge-info'}`}>
      {labels[outcome] || outcome}
    </span>
  );
}

function SentimentBadge({ sentiment }: { sentiment: string }) {
  const map: Record<string, { className: string; label: string }> = {
    positive: { className: 'text-[#22c55e] bg-[rgba(34,197,94,0.1)]', label: '😊 Positive' },
    neutral: { className: 'text-[#64748b] bg-[rgba(100,116,139,0.1)]', label: '😐 Neutral' },
    negative: { className: 'text-[#ef4444] bg-[rgba(239,68,68,0.1)]', label: '😞 Negative' },
  };
  const s = map[sentiment] || map['neutral'];
  return <span className={`text-xs px-2 py-0.5 rounded-full ${s.className}`}>{s.label}</span>;
}

export default function CallsPage() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (outcomeFilter !== 'all') params.set('outcome', outcomeFilter);

    setLoading(true);
    fetch(`/api/calls?${params}`)
      .then((r) => r.json())
      .then((data) => setCalls(data.calls ?? []))
      .catch(() => setCalls([]))
      .finally(() => setLoading(false));
  }, [search, outcomeFilter]);

  const booked = calls.filter((c) => c.outcome === 'booked').length;
  const info = calls.filter((c) => c.outcome === 'info').length;
  const missed = calls.filter((c) => c.outcome === 'missed').length;

  return (
    <div>
      <Header
        title="Call History"
        subtitle="All calls handled by your AI receptionist"
      />

      <div className="p-6 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Calls', value: String(calls.length), color: '#0ea5e9', icon: Phone },
            { label: 'Bookings', value: String(booked), color: '#22c55e', icon: CheckCircle },
            { label: 'Info Requests', value: String(info), color: '#38bdf8', icon: MessageSquare },
            { label: 'Missed', value: String(missed), color: '#ef4444', icon: PhoneMissed },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="electric-card rounded-lg p-4 bg-[#0d1117] flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ background: `${stat.color}15` }}>
                  <Icon className="h-5 w-5" style={{ color: stat.color }} />
                </div>
                <div>
                  <div className="text-xl font-bold text-[#f0f9ff]">{stat.value}</div>
                  <div className="text-xs text-[#64748b]">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748b]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by phone number or summary..."
              className="electric-input w-full pl-10 pr-4 py-2.5 rounded-lg text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#64748b]" />
            <div className="flex gap-1">
              {['all', 'booked', 'info', 'callback', 'missed'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setOutcomeFilter(filter)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${
                    outcomeFilter === filter
                      ? 'bg-[rgba(14,165,233,0.15)] text-[#0ea5e9] border border-[rgba(14,165,233,0.3)]'
                      : 'text-[#64748b] border border-[#1e3a5f] hover:border-[#0ea5e9] hover:text-[#f0f9ff]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calls Table */}
        <div className="electric-card rounded-xl bg-[#0d1117] overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#1e3a5f] text-xs font-semibold text-[#64748b] uppercase tracking-wider">
            <div className="col-span-1" />
            <div className="col-span-3">Caller</div>
            <div className="col-span-2 hidden md:block">Date & Time</div>
            <div className="col-span-2 hidden md:block">Duration</div>
            <div className="col-span-2">Outcome</div>
            <div className="col-span-2 hidden md:block">Sentiment</div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-[#64748b] flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-[#0ea5e9]" />
              <p className="text-sm">Loading calls...</p>
            </div>
          ) : calls.length === 0 ? (
            <div className="p-12 text-center text-[#64748b]">
              <Phone className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="font-medium text-[#f0f9ff] mb-1">No calls yet</p>
              <p className="text-sm">Calls will appear here once your AI receptionist starts answering.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#1e3a5f]">
              {calls.map((call) => {
                const isExpanded = expandedId === call.id;
                return (
                  <div key={call.id}>
                    <div
                      className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-[rgba(14,165,233,0.02)] transition-colors cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : call.id)}
                    >
                      <div className="col-span-1">
                        <OutcomeIcon outcome={call.outcome ?? 'info'} />
                      </div>
                      <div className="col-span-3">
                        <div className="text-sm font-medium text-[#f0f9ff]">{call.callerNumber ?? 'Unknown'}</div>
                        <div className="text-xs text-[#64748b] truncate mt-0.5 md:hidden">
                          {formatDateTime(call.createdAt)}
                        </div>
                      </div>
                      <div className="col-span-2 hidden md:block">
                        <div className="flex items-center gap-1.5 text-sm text-[#f0f9ff]">
                          <Calendar className="h-3.5 w-3.5 text-[#64748b]" />
                          {formatDateTime(call.createdAt)}
                        </div>
                      </div>
                      <div className="col-span-2 hidden md:block">
                        <div className="flex items-center gap-1.5 text-sm text-[#f0f9ff]">
                          <Clock className="h-3.5 w-3.5 text-[#64748b]" />
                          {call.duration ? formatDuration(call.duration) : '—'}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <OutcomeBadge outcome={call.outcome ?? 'info'} />
                      </div>
                      <div className="col-span-1 hidden md:block">
                        <SentimentBadge sentiment={call.sentiment ?? 'neutral'} />
                      </div>
                      <div className="col-span-1 flex justify-end">
                        {isExpanded
                          ? <ChevronUp className="h-4 w-4 text-[#0ea5e9]" />
                          : <ChevronDown className="h-4 w-4 text-[#64748b]" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-4 bg-[rgba(14,165,233,0.02)] border-t border-[#1e3a5f]">
                        {call.summary && (
                          <div className="pt-4">
                            <h4 className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-2">AI Summary</h4>
                            <p className="text-sm text-[#f0f9ff] bg-[#0a0a0a] rounded-lg p-3 border border-[#1e3a5f]">{call.summary}</p>
                          </div>
                        )}
                        {call.transcript && (
                          <div>
                            <h4 className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-2">Full Transcript</h4>
                            <div className="bg-[#0a0a0a] rounded-lg p-4 border border-[#1e3a5f] max-h-64 overflow-y-auto">
                              {call.transcript.split('\n\n').map((line, i) => {
                                const isAI = line.startsWith('AI:');
                                const isCaller = line.startsWith('Caller:');
                                return (
                                  <div key={i} className="mb-3">
                                    {isAI && (
                                      <div className="flex gap-2">
                                        <span className="text-xs font-semibold text-[#0ea5e9] shrink-0">🦉 AI</span>
                                        <span className="text-sm text-[#f0f9ff]">{line.replace('AI: ', '')}</span>
                                      </div>
                                    )}
                                    {isCaller && (
                                      <div className="flex gap-2">
                                        <span className="text-xs font-semibold text-[#64748b] shrink-0">👤 Caller</span>
                                        <span className="text-sm text-[#64748b]">{line.replace('Caller: ', '')}</span>
                                      </div>
                                    )}
                                    {!isAI && !isCaller && (
                                      <span className="text-xs text-[#64748b] italic">{line}</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        {!call.summary && !call.transcript && (
                          <p className="text-sm text-[#64748b] pt-4">No transcript available for this call.</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
