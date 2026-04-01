'use client';

import React, { useState } from 'react';
import { Header } from '@/components/dashboard/header';
import {
  Building2,
  Mic,
  Brain,
  Link2,
  Save,
  CheckCircle,
  Phone,
  MapPin,
  Clock,
  Globe,
  ChevronDown,
  Zap,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

const TABS = [
  { id: 'business', label: 'Business Info', icon: Building2 },
  { id: 'voice', label: 'Voice', icon: Mic },
  { id: 'prompt', label: 'AI Personality', icon: Brain },
  { id: 'integrations', label: 'Integrations', icon: Link2 },
];

const VOICES = [
  { id: 'rachel', name: 'Rachel', accent: 'Australian', gender: 'Female', description: 'Warm, professional, clear' },
  { id: 'sarah', name: 'Sarah', accent: 'Australian', gender: 'Female', description: 'Friendly, energetic, approachable' },
  { id: 'james', name: 'James', accent: 'Australian', gender: 'Male', description: 'Calm, authoritative, trustworthy' },
  { id: 'emily', name: 'Emily', accent: 'Australian', gender: 'Female', description: 'Soft, empathetic, professional' },
  { id: 'michael', name: 'Michael', accent: 'Australian', gender: 'Male', description: 'Confident, crisp, efficient' },
  { id: 'olivia', name: 'Olivia', accent: 'British', gender: 'Female', description: 'Polished, eloquent, sophisticated' },
];

const PERSONALITIES = [
  { id: 'professional', label: 'Professional', description: 'Formal and efficient', emoji: '💼' },
  { id: 'friendly', label: 'Friendly', description: 'Warm and conversational', emoji: '😊' },
  { id: 'energetic', label: 'Energetic', description: 'Upbeat and enthusiastic', emoji: '⚡' },
  { id: 'calm', label: 'Calm', description: 'Measured and reassuring', emoji: '🌊' },
];

const BUSINESS_HOURS = [
  { day: 'Monday', open: '07:00', close: '18:00', enabled: true },
  { day: 'Tuesday', open: '07:00', close: '18:00', enabled: true },
  { day: 'Wednesday', open: '07:00', close: '18:00', enabled: true },
  { day: 'Thursday', open: '07:00', close: '18:00', enabled: true },
  { day: 'Friday', open: '07:00', close: '18:00', enabled: true },
  { day: 'Saturday', open: '08:00', close: '14:00', enabled: true },
  { day: 'Sunday', open: '', close: '', enabled: false },
];

const INTEGRATIONS = [
  {
    id: 'deputy',
    name: 'Deputy',
    description: 'Sync staff rosters and availability with your AI receptionist',
    icon: '👥',
    connected: false,
    color: '#0ea5e9',
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Automatically add bookings to your Google Calendar in real-time',
    icon: '📅',
    connected: true,
    color: '#22c55e',
  },
  {
    id: 'xero',
    name: 'Xero',
    description: 'Sync customer data and invoices directly from calls',
    icon: '💰',
    connected: false,
    color: '#38bdf8',
  },
  {
    id: 'servicem8',
    name: 'ServiceM8',
    description: 'Create jobs and dispatch technicians from call data',
    icon: '🔧',
    connected: false,
    color: '#eab308',
  },
];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="transition-all duration-200"
    >
      {enabled ? (
        <ToggleRight className="h-6 w-6 text-[#0ea5e9]" />
      ) : (
        <ToggleLeft className="h-6 w-6 text-[#64748b]" />
      )}
    </button>
  );
}

function SaveButton({ saving, saved }: { saving: boolean; saved: boolean }) {
  return (
    <button
      type="submit"
      className="electric-button flex items-center gap-2 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-[#0a0a0a] font-bold px-6 py-2.5 rounded-lg text-sm"
    >
      {saving ? (
        <div className="h-4 w-4 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />
      ) : saved ? (
        <CheckCircle className="h-4 w-4" />
      ) : (
        <Save className="h-4 w-4" />
      )}
      {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes'}
    </button>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('business');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Business info state
  const [businessName, setBusinessName] = useState('Mitchell Plumbing');
  const [phone, setPhone] = useState('(03) 9123 4567');
  const [address, setAddress] = useState('42 Smith Street');
  const [suburb, setSuburb] = useState('Fitzroy');
  const [state, setState] = useState('VIC');
  const [postcode, setPostcode] = useState('3065');
  const [website, setWebsite] = useState('www.mitchellplumbing.com.au');
  const [services, setServices] = useState('Blocked drains, hot water systems, general plumbing, emergency callouts, bathroom renovations, gas fitting');
  const [hours, setHours] = useState(BUSINESS_HOURS);

  // Voice state
  const [selectedVoice, setSelectedVoice] = useState('rachel');
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);

  // Prompt state
  const [personality, setPersonality] = useState('professional');
  const [greeting, setGreeting] = useState("Thank you for calling Mitchell Plumbing, I'm AImie your AI receptionist. How can I help you today?");
  const [systemPrompt, setSystemPrompt] = useState(`You are AImie, the AI receptionist for Mitchell Plumbing in Fitzroy, Melbourne.

Your role:
- Answer calls professionally and helpfully
- Book appointments for plumbing services
- Provide information about services, hours, and pricing
- Handle emergency callout requests urgently
- Collect caller name and contact number for bookings

Services offered: Blocked drains, hot water systems, general plumbing, emergency callouts, bathroom renovations, gas fitting.

Business hours: Monday-Friday 7am-6pm, Saturday 8am-2pm. Closed Sundays.
Emergency callouts available 24/7 (higher rate applies after hours).

Always be warm but efficient. If the caller needs urgent help, prioritise getting them assistance quickly.`);

  // Integration state
  const [integrations, setIntegrations] = useState(INTEGRATIONS);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleHours = (index: number) => {
    setHours((prev) => prev.map((h, i) => i === index ? { ...h, enabled: !h.enabled } : h));
  };

  const toggleIntegration = (id: string) => {
    setIntegrations((prev) => prev.map((i) => i.id === id ? { ...i, connected: !i.connected } : i));
  };

  const simulateVoicePreview = (voiceId: string) => {
    setPlayingVoice(voiceId);
    setTimeout(() => setPlayingVoice(null), 2500);
  };

  return (
    <div>
      <Header
        title="Agent Settings"
        subtitle="Customise your AI receptionist"
        userName="Jane Smith"
        userEmail="jane@mitchellplumbing.com.au"
      />

      <div className="p-6">
        {/* Tab navigation */}
        <div className="flex gap-1 mb-6 bg-[#0d1117] border border-[#1e3a5f] rounded-xl p-1 w-fit">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-[rgba(14,165,233,0.15)] text-[#0ea5e9] border border-[rgba(14,165,233,0.3)]'
                    : 'text-[#64748b] hover:text-[#f0f9ff]'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:block">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSave}>
          {/* Business Info Tab */}
          {activeTab === 'business' && (
            <div className="space-y-6">
              <div className="electric-card rounded-xl p-6 bg-[#0d1117]">
                <h3 className="text-base font-semibold text-[#f0f9ff] mb-5 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#0ea5e9]" />
                  Business Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-[#64748b] uppercase tracking-wider mb-1.5">Business Name</label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="electric-input w-full px-4 py-2.5 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#64748b] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Phone className="h-3 w-3" /> Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="electric-input w-full px-4 py-2.5 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#64748b] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Globe className="h-3 w-3" /> Website
                    </label>
                    <input
                      type="text"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="electric-input w-full px-4 py-2.5 rounded-lg text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-[#64748b] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Street Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="electric-input w-full px-4 py-2.5 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#64748b] uppercase tracking-wider mb-1.5">Suburb</label>
                    <input
                      type="text"
                      value={suburb}
                      onChange={(e) => setSuburb(e.target.value)}
                      className="electric-input w-full px-4 py-2.5 rounded-lg text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-[#64748b] uppercase tracking-wider mb-1.5">State</label>
                      <div className="relative">
                        <select
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="electric-input w-full px-4 py-2.5 rounded-lg text-sm appearance-none"
                        >
                          {['VIC', 'NSW', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748b] pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#64748b] uppercase tracking-wider mb-1.5">Postcode</label>
                      <input
                        type="text"
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value)}
                        className="electric-input w-full px-4 py-2.5 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-[#64748b] uppercase tracking-wider mb-1.5">Services Offered</label>
                    <textarea
                      value={services}
                      onChange={(e) => setServices(e.target.value)}
                      rows={3}
                      placeholder="List your services, separated by commas..."
                      className="electric-input w-full px-4 py-2.5 rounded-lg text-sm resize-none"
                    />
                    <p className="text-xs text-[#64748b] mt-1">Your AI receptionist uses this to answer service enquiries accurately.</p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="electric-card rounded-xl p-6 bg-[#0d1117]">
                <h3 className="text-base font-semibold text-[#f0f9ff] mb-5 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#0ea5e9]" />
                  Business Hours
                </h3>
                <div className="space-y-2">
                  {hours.map((h, i) => (
                    <div key={h.day} className="flex items-center gap-4 py-2 border-b border-[#1e3a5f] last:border-0">
                      <Toggle enabled={h.enabled} onChange={() => toggleHours(i)} />
                      <span className={`w-24 text-sm font-medium ${h.enabled ? 'text-[#f0f9ff]' : 'text-[#64748b]'}`}>{h.day}</span>
                      {h.enabled ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="time"
                            value={h.open}
                            onChange={(e) => setHours((prev) => prev.map((x, j) => j === i ? { ...x, open: e.target.value } : x))}
                            className="electric-input px-3 py-1.5 rounded-lg text-sm w-28"
                          />
                          <span className="text-[#64748b] text-sm">to</span>
                          <input
                            type="time"
                            value={h.close}
                            onChange={(e) => setHours((prev) => prev.map((x, j) => j === i ? { ...x, close: e.target.value } : x))}
                            className="electric-input px-3 py-1.5 rounded-lg text-sm w-28"
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-[#64748b] italic">Closed</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <SaveButton saving={saving} saved={saved} />
              </div>
            </div>
          )}

          {/* Voice Tab */}
          {activeTab === 'voice' && (
            <div className="space-y-6">
              <div className="electric-card rounded-xl p-6 bg-[#0d1117]">
                <h3 className="text-base font-semibold text-[#f0f9ff] mb-2 flex items-center gap-2">
                  <Mic className="h-4 w-4 text-[#0ea5e9]" />
                  Choose Your AI Voice
                </h3>
                <p className="text-sm text-[#64748b] mb-6">Select the voice your AI receptionist will use. All voices are Australian accented by default.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {VOICES.map((voice) => (
                    <button
                      key={voice.id}
                      type="button"
                      onClick={() => setSelectedVoice(voice.id)}
                      className={`relative p-4 rounded-xl border text-left transition-all duration-200 ${
                        selectedVoice === voice.id
                          ? 'border-[#0ea5e9] bg-[rgba(14,165,233,0.08)]'
                          : 'border-[#1e3a5f] bg-[#0a0a0a] hover:border-[#0ea5e9]/50'
                      }`}
                    >
                      {selectedVoice === voice.id && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle className="h-4 w-4 text-[#0ea5e9]" />
                        </div>
                      )}
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                          selectedVoice === voice.id ? 'bg-[rgba(14,165,233,0.2)] text-[#0ea5e9]' : 'bg-[#1a1a2e] text-[#64748b]'
                        }`}>
                          {voice.name[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-[#f0f9ff] text-sm">{voice.name}</div>
                          <div className="text-xs text-[#64748b]">{voice.gender} · {voice.accent}</div>
                        </div>
                      </div>
                      <p className="text-xs text-[#64748b]">{voice.description}</p>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); simulateVoicePreview(voice.id); }}
                        className="mt-3 flex items-center gap-1.5 text-xs text-[#0ea5e9] hover:text-[#38bdf8] transition-colors"
                      >
                        {playingVoice === voice.id ? (
                          <>
                            <div className="flex gap-0.5">
                              {[1,2,3].map((i) => (
                                <div key={i} className="w-0.5 bg-[#0ea5e9] rounded-full animate-bounce" style={{ height: `${8 + i * 4}px`, animationDelay: `${i * 0.1}s` }} />
                              ))}
                            </div>
                            Playing preview...
                          </>
                        ) : (
                          <>▶ Preview voice</>
                        )}
                      </button>
                    </button>
                  ))}
                </div>
              </div>

              <div className="electric-card rounded-xl p-6 bg-[#0d1117]">
                <h3 className="text-base font-semibold text-[#f0f9ff] mb-4">Voice Settings</h3>
                <div className="space-y-5">
                  <div>
                    <label className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#f0f9ff]">Speaking Speed</span>
                      <span className="text-sm text-[#0ea5e9]">1.0x</span>
                    </label>
                    <input type="range" min="0.7" max="1.5" step="0.1" defaultValue="1.0" className="w-full accent-[#0ea5e9]" />
                    <div className="flex justify-between text-xs text-[#64748b] mt-1">
                      <span>Slower</span><span>Faster</span>
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#f0f9ff]">Voice Stability</span>
                      <span className="text-sm text-[#0ea5e9]">75%</span>
                    </label>
                    <input type="range" min="0" max="100" step="5" defaultValue="75" className="w-full accent-[#0ea5e9]" />
                  </div>
                  <div>
                    <label className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#f0f9ff]">Clarity Enhancement</span>
                      <span className="text-sm text-[#0ea5e9]">80%</span>
                    </label>
                    <input type="range" min="0" max="100" step="5" defaultValue="80" className="w-full accent-[#0ea5e9]" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <SaveButton saving={saving} saved={saved} />
              </div>
            </div>
          )}

          {/* Prompt/Personality Tab */}
          {activeTab === 'prompt' && (
            <div className="space-y-6">
              <div className="electric-card rounded-xl p-6 bg-[#0d1117]">
                <h3 className="text-base font-semibold text-[#f0f9ff] mb-2 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-[#0ea5e9]" />
                  Personality Style
                </h3>
                <p className="text-sm text-[#64748b] mb-5">Set the overall tone of your AI receptionist.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {PERSONALITIES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPersonality(p.id)}
                      className={`p-4 rounded-xl border text-center transition-all duration-200 ${
                        personality === p.id
                          ? 'border-[#0ea5e9] bg-[rgba(14,165,233,0.08)]'
                          : 'border-[#1e3a5f] bg-[#0a0a0a] hover:border-[#0ea5e9]/50'
                      }`}
                    >
                      <div className="text-2xl mb-2">{p.emoji}</div>
                      <div className={`text-sm font-semibold mb-0.5 ${personality === p.id ? 'text-[#0ea5e9]' : 'text-[#f0f9ff]'}`}>{p.label}</div>
                      <div className="text-xs text-[#64748b]">{p.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="electric-card rounded-xl p-6 bg-[#0d1117]">
                <h3 className="text-base font-semibold text-[#f0f9ff] mb-1">Greeting Message</h3>
                <p className="text-sm text-[#64748b] mb-4">The first thing your AI says when answering a call.</p>
                <textarea
                  value={greeting}
                  onChange={(e) => setGreeting(e.target.value)}
                  rows={3}
                  className="electric-input w-full px-4 py-3 rounded-lg text-sm resize-none"
                />
                <div className="flex items-center gap-2 mt-2 p-3 rounded-lg bg-[rgba(14,165,233,0.05)] border border-[rgba(14,165,233,0.1)]">
                  <Zap className="h-3 w-3 text-[#0ea5e9] flex-shrink-0" />
                  <p className="text-xs text-[#64748b]">Keep it under 20 words for the best caller experience.</p>
                </div>
              </div>

              <div className="electric-card rounded-xl p-6 bg-[#0d1117]">
                <h3 className="text-base font-semibold text-[#f0f9ff] mb-1">System Instructions</h3>
                <p className="text-sm text-[#64748b] mb-4">Advanced: Customise exactly how your AI behaves. Changes take effect immediately.</p>
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  rows={14}
                  className="electric-input w-full px-4 py-3 rounded-lg text-sm font-mono resize-none"
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-[#64748b]">{systemPrompt.length} characters</p>
                  <button
                    type="button"
                    onClick={() => setSystemPrompt(`You are AImie, the AI receptionist for ${businessName} in ${suburb}, Melbourne.\n\nYour role:\n- Answer calls professionally and helpfully\n- Book appointments for services\n- Provide information about services, hours, and pricing\n- Collect caller name and contact number for bookings\n\nServices offered: ${services}\n\nBusiness hours: Monday-Friday 7am-6pm, Saturday 8am-2pm.\n\nAlways be warm but efficient.`)}
                    className="text-xs text-[#0ea5e9] hover:text-[#38bdf8] transition-colors"
                  >
                    Reset to default
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <SaveButton saving={saving} saved={saved} />
              </div>
            </div>
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[rgba(14,165,233,0.05)] border border-[rgba(14,165,233,0.15)] flex items-start gap-3">
                <Zap className="h-4 w-4 text-[#0ea5e9] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-[#f0f9ff]">Connect your business tools</p>
                  <p className="text-xs text-[#64748b] mt-0.5">Integrations allow your AI receptionist to access real-time data from your existing systems.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations.map((integration) => (
                  <div key={integration.id} className={`electric-card rounded-xl p-5 bg-[#0d1117] transition-all duration-200 ${integration.connected ? 'border-[rgba(34,197,94,0.3)]' : ''}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#0a0a0a] border border-[#1e3a5f] flex items-center justify-center text-xl">
                          {integration.icon}
                        </div>
                        <div>
                          <div className="font-semibold text-[#f0f9ff] text-sm">{integration.name}</div>
                          {integration.connected && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                              <span className="text-xs text-[#22c55e]">Connected</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Toggle enabled={integration.connected} onChange={() => toggleIntegration(integration.id)} />
                    </div>
                    <p className="text-xs text-[#64748b] leading-relaxed mb-4">{integration.description}</p>
                    {integration.connected ? (
                      <div className="flex gap-2">
                        <button type="button" className="flex-1 text-xs py-1.5 rounded-lg border border-[rgba(34,197,94,0.3)] text-[#22c55e] hover:bg-[rgba(34,197,94,0.05)] transition-colors">
                          Configure
                        </button>
                        <button type="button" className="flex-1 text-xs py-1.5 rounded-lg border border-[#1e3a5f] text-[#64748b] hover:border-[#ef4444] hover:text-[#ef4444] transition-colors">
                          Disconnect
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleIntegration(integration.id)}
                        className="w-full text-xs py-1.5 rounded-lg border border-[rgba(14,165,233,0.3)] text-[#0ea5e9] hover:bg-[rgba(14,165,233,0.08)] transition-colors"
                      >
                        Connect {integration.name}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
