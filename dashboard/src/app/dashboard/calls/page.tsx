'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

const mockCalls = [
  {
    id: '1',
    callerNumber: '0412 345 678',
    duration: 187,
    outcome: 'booked',
    sentiment: 'positive',
    createdAt: '2026-03-28T09:23:00',
    summary: 'Caller requested appointment for teeth cleaning. Booked for Monday 10am.',
    transcript: `AI: Thank you for calling Mitchell Plumbing, I'm AImie your AI receptionist. How can I help you today?\n\nCaller: Hi, yes I'd like to book an appointment for a blocked drain.\n\nAI: Of course! I'd be happy to help you schedule that. When would work best for you?\n\nCaller: Sometime next week would be great, maybe Monday morning?\n\nAI: Let me check availability... I can offer you Monday at 9am or 11am. Which works better?\n\nCaller: 11am would be perfect.\n\nAI: Wonderful! I've booked you in for Monday at 11am. Can I get your name and best contact number?\n\nCaller: Sure, it's David Chen, and 0412 345 678.\n\nAI: Perfect, David. We'll see you Monday at 11am. You'll receive a confirmation SMS shortly. Is there anything else I can help with?\n\nCaller: No that's great, thanks!\n\nAI: Have a wonderful day!`,
  },
  {
    id: '2',
    callerNumber: '0398 765 432',
    duration: 94,
    outcome: 'info',
    sentiment: 'neutral',
    createdAt: '2026-03-28T08:47:00',
    summary: 'Caller asked about business hours and parking. Provided information.',
    transcript: `AI: Thank you for calling Mitchell Plumbing, I'm AImie your AI receptionist. How can I help you today?\n\nCaller: Hi, I just wanted to know what your hours are.\n\nAI: We're open Monday through Friday 7am to 6pm, and Saturday 8am to 2pm. We're closed Sundays and public holidays.\n\nCaller: Great, and is there parking nearby?\n\nAI: Yes, there's free parking available on Smith Street right out front, and a council car park on the next block.\n\nCaller: Perfect, thank you.\n\nAI: You're welcome! Is there anything else I can help with?\n\nCaller: No, that's all.\n\nAI: Have a great day!`,
  },
  {
    id: '3',
    callerNumber: '0423 111 222',
    duration: 12,
    outcome: 'missed',
    sentiment: 'negative',
    createdAt: '2026-03-28T08:15:00',
    summary: 'Caller disconnected during greeting.',
    transcript: `AI: Thank you for calling Mitchell Plumbing, I'm AImie your AI receptionist. How can I—\n\n[Call ended]`,
  },
  {
    id: '4',
    callerNumber: '0456 789 012',
    duration: 243,
    outcome: 'booked',
    sentiment: 'positive',
    createdAt: '2026-03-28T07:55:00',
    summary: 'Booked emergency hot water service for this afternoon.',
    transcript: `AI: Thank you for calling Mitchell Plumbing, I'm AImie your AI receptionist. How can I help you today?\n\nCaller: Hi, our hot water system isn't working and we have guests arriving tonight.\n\nAI: I understand that's urgent. Let me help you get that sorted straight away. We do offer same-day emergency services. What's your address?\n\nCaller: 42 Smith Street, Fitzroy.\n\nAI: Got it. I can get a plumber to you this afternoon between 2-4pm. Would that work?\n\nCaller: Yes, that's perfect! How much will it cost?\n\nAI: For a same-day service call the rate is $180 plus parts. The plumber will assess the system on arrival and give you a full quote.\n\nCaller: Okay, let's go ahead.\n\nAI: Booked! Can I get your name and a contact number?\n\nCaller: Sarah Williams, 0456 789 012.\n\nAI: Perfect Sarah, you're all booked for this afternoon 2-4pm. You'll get a text when the plumber is on the way. Anything else?\n\nCaller: No, thank you so much!\n\nAI: We'll get that sorted for you!`,
  },
  {
    id: '5',
    callerNumber: '0387 654 321',
    duration: 156,
    outcome: 'callback',
    sentiment: 'neutral',
    createdAt: '2026-03-27T16:42:00',
    summary: 'Caller requested pricing info, asked for human callback.',
    transcript: `AI: Thank you for calling Mitchell Plumbing, I'm AImie your AI receptionist. How can I help you today?\n\nCaller: Yes, I want to get a quote for a bathroom renovation. Can I speak to someone?\n\nAI: Of course! For a detailed renovation quote, one of our senior plumbers would love to speak with you. I can arrange a callback. What's the best number to reach you on?\n\nCaller: 0387 654 321, anytime after 2pm.\n\nAI: Got it. I'll arrange for someone to call you after 2pm today. Can I get your name?\n\nCaller: Mark Johnson.\n\nAI: Perfect Mark, someone will call you this afternoon. Is there anything specific about the renovation you'd like them to know beforehand?\n\nCaller: It's a full bathroom, about 8 square metres.\n\nAI: I'll note that down. Full bathroom renovation, approximately 8sqm. Speak soon!`,
  },
  {
    id: '6',
    callerNumber: '0499 876 543',
    duration: 78,
    outcome: 'info',
    sentiment: 'positive',
    createdAt: '2026-03-27T15:20:00',
    summary: 'Asked about emergency callout availability on weekends.',
    transcript: `AI: Thank you for calling Mitchell Plumbing, I'm AImie your AI receptionist. How can I help you today?\n\nCaller: Do you do emergency callouts on weekends?\n\nAI: Yes, we do! We offer emergency services 7 days a week. Weekend emergency rates apply after 6pm on weekdays and all day Saturday and Sunday.\n\nCaller: What's the rate?\n\nAI: Emergency after-hours call outs start at $280 plus parts. Standard business hours rates apply Monday to Friday before 6pm.\n\nCaller: Good to know, thanks.\n\nAI: Anytime! Don't hesitate to call if you need us.`,
  },
];

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString('en-AU', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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
    booked: 'badge-active',
    missed: 'badge-error',
    info: 'badge-info',
    callback: 'badge-warning',
  };
  const labels: Record<string, string> = {
    booked: 'Booked',
    missed: 'Missed',
    info: 'Info',
    callback: 'Callback',
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
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${s.className}`}>
      {s.label}
    </span>
  );
}

export default function CallsPage() {
  const [search, setSearch] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = mockCalls.filter((call) => {
    const matchesSearch = call.callerNumber.includes(search) || call.summary.toLowerCase().includes(search.toLowerCase());
    const matchesOutcome = outcomeFilter === 'all' || call.outcome === outcomeFilter;
    return matchesSearch && matchesOutcome;
  });

  return (
    <div>
      <Header
        title="Call History"
        subtitle="All calls handled by your AI receptionist"
        userName="Jane Smith"
        userEmail="jane@mitchellplumbing.com.au"
      />

      <div className="p-6 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Calls', value: '123', color: '#0ea5e9', icon: Phone },
            { label: 'Bookings', value: '45', color: '#22c55e', icon: CheckCircle },
            { label: 'Info Requests', value: '51', color: '#38bdf8', icon: MessageSquare },
            { label: 'Missed', value: '27', color: '#ef4444', icon: PhoneMissed },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="electric-card rounded-lg p-4 bg-[#0d1117] flex items-center gap-3">
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

          {filtered.length === 0 ? (
            <div className="p-12 text-center text-[#64748b]">
              <Phone className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No calls found matching your filters</p>
            </div>
          ) : (
            <div className="divide-y divide-[#1e3a5f]">
              {filtered.map((call) => {
                const isExpanded = expandedId === call.id;
                return (
                  <div key={call.id}>
                    <div
                      className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-[rgba(14,165,233,0.02)] transition-colors cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : call.id)}
                    >
                      <div className="col-span-1">
                        <OutcomeIcon outcome={call.outcome} />
                      </div>
                      <div className="col-span-3">
                        <div className="text-sm font-medium text-[#f0f9ff]">{call.callerNumber}</div>
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
                          {formatDuration(call.duration)}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <OutcomeBadge outcome={call.outcome} />
                      </div>
                      <div className="col-span-1 hidden md:block">
                        <SentimentBadge sentiment={call.sentiment} />
                      </div>
                      <div className="col-span-1 flex justify-end">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-[#0ea5e9]" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-[#64748b]" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-4 bg-[rgba(14,165,233,0.02)] border-t border-[#1e3a5f]">
                        {/* Summary */}
                        <div className="pt-4">
                          <h4 className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-2">
                            AI Summary
                          </h4>
                          <p className="text-sm text-[#f0f9ff] bg-[#0a0a0a] rounded-lg p-3 border border-[#1e3a5f]">
                            {call.summary}
                          </p>
                        </div>

                        {/* Transcript */}
                        <div>
                          <h4 className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-2">
                            Full Transcript
                          </h4>
                          <div className="bg-[#0a0a0a] rounded-lg p-4 border border-[#1e3a5f] max-h-64 overflow-y-auto">
                            {call.transcript.split('\n\n').map((line, i) => {
                              const isAI = line.startsWith('AI:');
                              const isCaller = line.startsWith('Caller:');
                              return (
                                <div key={i} className={`mb-3 ${line.startsWith('[') ? 'text-center text-[#64748b] text-xs italic' : ''}`}>
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
