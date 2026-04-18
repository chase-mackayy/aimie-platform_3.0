'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Calendar,
  Mic2,
  Zap,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Phone,
  Clock,
  ToggleLeft,
  ToggleRight,
  Copy,
  Check,
} from 'lucide-react';

const INDUSTRIES = [
  'Restaurant / Cafe / Bar',
  'Hair Salon / Barbershop',
  'Nail Salon / Beauty Studio',
  'Medical / GP Clinic',
  'Physio / Allied Health',
  'Dental Practice',
  'Trades (Plumbing, Electrical, etc.)',
  'Hotel / Accommodation',
  'Fitness / Gym',
  'Retail',
  'Legal',
  'Accounting',
  'Real Estate',
  'Other',
];

const BOOKING_PLATFORMS = [
  { id: 'servicem8', label: 'ServiceM8', needsKey: true },
  { id: 'simpro', label: 'SimPRO', needsKey: true },
  { id: 'mindbody', label: 'Mindbody', needsKey: true },
  { id: 'fresha', label: 'Fresha', needsKey: true },
  { id: 'square', label: 'Square Appointments', needsKey: true },
  { id: 'cliniko', label: 'Cliniko', needsKey: true },
  { id: 'google-calendar', label: 'Google Calendar', needsKey: false },
  { id: 'other', label: 'Custom / Other', needsKey: true },
  { id: 'manual', label: "We'll handle it for you", needsKey: false },
];

const TONES = [
  { id: 'professional', label: 'Professional', desc: 'Formal and efficient', emoji: '💼' },
  { id: 'friendly', label: 'Friendly', desc: 'Warm and conversational', emoji: '😊' },
  { id: 'energetic', label: 'Energetic', desc: 'Upbeat and enthusiastic', emoji: '⚡' },
  { id: 'calm', label: 'Calm', desc: 'Measured and reassuring', emoji: '🌊' },
];

const DEFAULT_HOURS = [
  { day: 'Monday', open: '07:00', close: '18:00', enabled: true },
  { day: 'Tuesday', open: '07:00', close: '18:00', enabled: true },
  { day: 'Wednesday', open: '07:00', close: '18:00', enabled: true },
  { day: 'Thursday', open: '07:00', close: '18:00', enabled: true },
  { day: 'Friday', open: '07:00', close: '18:00', enabled: true },
  { day: 'Saturday', open: '08:00', close: '14:00', enabled: true },
  { day: 'Sunday', open: '', close: '', enabled: false },
];

const STEPS = [
  { label: 'Business details', icon: Building2 },
  { label: 'Booking platform', icon: Calendar },
  { label: 'Customise Amy', icon: Mic2 },
  { label: 'Go live', icon: Zap },
];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={onChange} className="transition-all duration-200">
      {enabled ? (
        <ToggleRight className="h-6 w-6 text-[#0ea5e9]" />
      ) : (
        <ToggleLeft className="h-6 w-6 text-[#64748b]" />
      )}
    </button>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0); // 0-indexed (0 = step 1)
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [telnyxNumber, setTelnyxNumber] = useState<string | null>(null);

  // Step 1 state
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [address, setAddress] = useState('');
  const [suburb, setSuburb] = useState('');
  const [state, setState] = useState('VIC');
  const [postcode, setPostcode] = useState('');
  const [hours, setHours] = useState(DEFAULT_HOURS);

  // Step 2 state
  const [bookingPlatform, setBookingPlatform] = useState('');
  const [bookingApiKey, setBookingApiKey] = useState('');

  // Step 3 state
  const [amyName, setAmyName] = useState('');
  const [tone, setTone] = useState('professional');
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    fetch('/api/onboarding')
      .then((r) => r.json())
      .then((d) => {
        if (d.business) {
          if (d.business.name) setBusinessName(d.business.name);
          if (d.business.industry) setIndustry(d.business.industry);
          if (d.business.address) setAddress(d.business.address);
          if (d.business.suburb) setSuburb(d.business.suburb);
          if (d.business.state) setState(d.business.state);
          if (d.business.postcode) setPostcode(d.business.postcode);
          if (d.business.hours) setHours(d.business.hours as typeof DEFAULT_HOURS);
          if (d.business.bookingPlatform) setBookingPlatform(d.business.bookingPlatform);
          if (d.business.bookingApiKey) setBookingApiKey(d.business.bookingApiKey);
          if (d.business.amyName) setAmyName(d.business.amyName);
          if (d.business.telnyxNumber) setTelnyxNumber(d.business.telnyxNumber);
        }
        // If already past onboarding, redirect to dashboard
        if (d.onboardingStep >= 4) {
          router.push('/dashboard');
        } else if (d.onboardingStep > 0) {
          setCurrentStep(d.onboardingStep);
        }
      })
      .catch(() => {});
  }, [router]);

  const saveStep = async (step: number, data: Record<string, unknown>) => {
    setSaving(true);
    try {
      await fetch('/api/onboarding', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step, data }),
      });
    } catch { /* continue */ }
    setSaving(false);
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      await saveStep(1, { name: businessName, industry, address, suburb, state, postcode, hours });
    } else if (currentStep === 1) {
      await saveStep(2, { bookingPlatform, bookingApiKey });
    } else if (currentStep === 2) {
      await saveStep(3, { amyName, personality: tone, specialInstructions });
    } else if (currentStep === 3) {
      await saveStep(4, {});
      router.push('/dashboard');
      return;
    }
    setCurrentStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(0, s - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyNumber = () => {
    if (telnyxNumber) {
      navigator.clipboard.writeText(telnyxNumber).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const selectedPlatform = BOOKING_PLATFORMS.find((p) => p.id === bookingPlatform);

  const inputClass =
    'w-full bg-[#0a0a0a] border border-[#1e3a5f] text-[#f0f9ff] rounded-lg px-4 py-2.5 text-sm placeholder-[#334155] focus:outline-none focus:border-[#0ea5e9] transition-colors';
  const selectClass =
    'w-full bg-[#0a0a0a] border border-[#1e3a5f] text-[#f0f9ff] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#0ea5e9] transition-colors appearance-none cursor-pointer';

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center py-10 px-4">
      {/* Logo */}
      <div className="mb-8">
        <span className="text-2xl font-extrabold text-white tracking-tight">
          AImie<span className="text-[#0ea5e9]">.</span>
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const done = i < currentStep;
            const active = i === currentStep;
            return (
              <div key={step.label} className="flex flex-col items-center gap-1.5 flex-1">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                    done
                      ? 'bg-[rgba(34,197,94,0.12)] border-[rgba(34,197,94,0.35)]'
                      : active
                      ? 'bg-[rgba(14,165,233,0.15)] border-[rgba(14,165,233,0.4)]'
                      : 'bg-[#0f0f0f] border-[#1e3a5f]'
                  }`}
                >
                  {done ? (
                    <CheckCircle className="h-4 w-4 text-[#22c55e]" />
                  ) : (
                    <Icon
                      className={`h-4 w-4 ${active ? 'text-[#0ea5e9]' : 'text-[#334155]'}`}
                    />
                  )}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:block ${
                    done ? 'text-[#22c55e]' : active ? 'text-[#f0f9ff]' : 'text-[#334155]'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
        {/* Connector line */}
        <div className="h-1 bg-[#0f1929] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-[#334155]">Step {currentStep + 1} of {STEPS.length}</span>
          <span className="text-xs text-[#334155]">{Math.round((currentStep / STEPS.length) * 100)}% complete</span>
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-2xl bg-[#0f0f0f] border border-[rgba(255,255,255,0.07)] rounded-2xl p-8 mb-6">

        {/* Step 1 — Business details */}
        {currentStep === 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[rgba(14,165,233,0.1)] border border-[rgba(14,165,233,0.2)] flex items-center justify-center">
                <Building2 className="h-5 w-5 text-[#0ea5e9]" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Your business details</h1>
                <p className="text-sm text-[#64748b]">Amy uses this to answer questions accurately</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5">Business name *</label>
                  <input
                    className={inputClass}
                    placeholder="e.g. Mitchell Plumbing"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5">Industry *</label>
                  <select
                    className={selectClass}
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    required
                  >
                    <option value="">Select your industry</option>
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5">Street address</label>
                  <input
                    className={inputClass}
                    placeholder="e.g. 123 High Street"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5">Suburb</label>
                  <input
                    className={inputClass}
                    placeholder="e.g. Fitzroy"
                    value={suburb}
                    onChange={(e) => setSuburb(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5">State</label>
                    <select className={selectClass} value={state} onChange={(e) => setState(e.target.value)}>
                      {['VIC', 'NSW', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5">Postcode</label>
                    <input
                      className={inputClass}
                      placeholder="3000"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Business hours */}
              <div>
                <div className="flex items-center gap-2 mb-3 mt-2">
                  <Clock className="h-4 w-4 text-[#0ea5e9]" />
                  <label className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">Business hours</label>
                </div>
                <div className="space-y-2 bg-[#0a0a0a] border border-[#1e3a5f] rounded-xl p-4">
                  {hours.map((h, i) => (
                    <div key={h.day} className="flex items-center gap-3 py-1.5 border-b border-[#1a2744] last:border-0">
                      <Toggle
                        enabled={h.enabled}
                        onChange={() =>
                          setHours((prev) =>
                            prev.map((x, j) => (j === i ? { ...x, enabled: !x.enabled } : x))
                          )
                        }
                      />
                      <span className={`w-24 text-sm font-medium ${h.enabled ? 'text-[#f0f9ff]' : 'text-[#334155]'}`}>
                        {h.day}
                      </span>
                      {h.enabled ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            value={h.open}
                            onChange={(e) =>
                              setHours((prev) =>
                                prev.map((x, j) => (j === i ? { ...x, open: e.target.value } : x))
                              )
                            }
                            className="bg-[#0f1929] border border-[#1e3a5f] text-[#f0f9ff] rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-[#0ea5e9]"
                          />
                          <span className="text-[#334155] text-sm">–</span>
                          <input
                            type="time"
                            value={h.close}
                            onChange={(e) =>
                              setHours((prev) =>
                                prev.map((x, j) => (j === i ? { ...x, close: e.target.value } : x))
                              )
                            }
                            className="bg-[#0f1929] border border-[#1e3a5f] text-[#f0f9ff] rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-[#0ea5e9]"
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-[#334155] italic">Closed</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Booking platform */}
        {currentStep === 1 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[rgba(14,165,233,0.1)] border border-[rgba(14,165,233,0.2)] flex items-center justify-center">
                <Calendar className="h-5 w-5 text-[#0ea5e9]" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Booking platform</h1>
                <p className="text-sm text-[#64748b]">Amy will book appointments directly into your system</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {BOOKING_PLATFORMS.map((platform) => (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => {
                    setBookingPlatform(platform.id);
                    if (!platform.needsKey) setBookingApiKey('');
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200 ${
                    bookingPlatform === platform.id
                      ? 'border-[#0ea5e9] bg-[rgba(14,165,233,0.06)]'
                      : 'border-[#1e3a5f] bg-[#0a0a0a] hover:border-[rgba(14,165,233,0.4)]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      bookingPlatform === platform.id
                        ? 'border-[#0ea5e9] bg-[#0ea5e9]'
                        : 'border-[#334155]'
                    }`}
                  >
                    {bookingPlatform === platform.id && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      bookingPlatform === platform.id ? 'text-[#f0f9ff]' : 'text-[#94a3b8]'
                    }`}
                  >
                    {platform.label}
                  </span>
                  {platform.id === 'manual' && (
                    <span className="ml-auto text-xs text-[#22c55e] bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.2)] rounded-full px-2 py-0.5">
                      Recommended
                    </span>
                  )}
                </button>
              ))}
            </div>

            {selectedPlatform?.needsKey && (
              <div className="border border-[rgba(14,165,233,0.2)] bg-[rgba(14,165,233,0.03)] rounded-xl p-4">
                <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-2">
                  {selectedPlatform.label} API key
                </label>
                <input
                  className={inputClass}
                  type="password"
                  placeholder="Paste your API key here"
                  value={bookingApiKey}
                  onChange={(e) => setBookingApiKey(e.target.value)}
                />
                <p className="text-xs text-[#64748b] mt-2">
                  Your key is encrypted at rest and never shared. You can add it later from Settings if you don&apos;t have it handy.
                </p>
              </div>
            )}

            {bookingPlatform === 'manual' && (
              <div className="border border-[rgba(34,197,94,0.2)] bg-[rgba(34,197,94,0.03)] rounded-xl p-4">
                <p className="text-sm text-[#94a3b8] leading-relaxed">
                  Our team will configure your booking integration within 24 hours of you going live. We&apos;ll reach out to collect the details we need.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 3 — Customise Amy */}
        {currentStep === 2 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[rgba(14,165,233,0.1)] border border-[rgba(14,165,233,0.2)] flex items-center justify-center">
                <Mic2 className="h-5 w-5 text-[#0ea5e9]" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Customise Amy</h1>
                <p className="text-sm text-[#64748b]">Personalise how your AI receptionist presents your business</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5">
                  What name should Amy use when answering?
                </label>
                <input
                  className={inputClass}
                  placeholder={`e.g. Amy from ${businessName || 'your business'}, or just your business name`}
                  value={amyName}
                  onChange={(e) => setAmyName(e.target.value)}
                />
                <p className="text-xs text-[#64748b] mt-1.5">
                  e.g. &quot;Thank you for calling Mitchell Plumbing, I&apos;m Amy&quot; — or &quot;Mitchell Plumbing, Amy speaking&quot;
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-3">Tone</label>
                <div className="grid grid-cols-2 gap-3">
                  {TONES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTone(t.id)}
                      className={`p-4 rounded-xl border text-center transition-all duration-200 ${
                        tone === t.id
                          ? 'border-[#0ea5e9] bg-[rgba(14,165,233,0.08)]'
                          : 'border-[#1e3a5f] bg-[#0a0a0a] hover:border-[rgba(14,165,233,0.4)]'
                      }`}
                    >
                      <div className="text-2xl mb-1.5">{t.emoji}</div>
                      <div className={`text-sm font-semibold mb-0.5 ${tone === t.id ? 'text-[#0ea5e9]' : 'text-[#f0f9ff]'}`}>
                        {t.label}
                      </div>
                      <div className="text-xs text-[#64748b]">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5">
                  Any specific instructions? <span className="text-[#334155] font-normal normal-case tracking-normal">(optional)</span>
                </label>
                <textarea
                  className={`${inputClass} resize-none`}
                  rows={4}
                  placeholder={`e.g. Always offer the next available slot. If it's an emergency, ask for their location first. We don't service commercial properties.`}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                />
                <p className="text-xs text-[#64748b] mt-1.5">
                  Keep it brief — bullet points work great. Amy will follow these in every call.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 4 — Go live */}
        {currentStep === 3 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.25)] flex items-center justify-center">
                <Zap className="h-5 w-5 text-[#22c55e]" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">You&apos;re ready to go live!</h1>
                <p className="text-sm text-[#64748b]">One last step — connect your phone number</p>
              </div>
            </div>

            {/* Phone number display */}
            <div className="bg-[#0a0a0a] border border-[rgba(14,165,233,0.25)] rounded-2xl p-6 mb-6 text-center">
              <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-3">
                Your dedicated AI phone number
              </p>
              {telnyxNumber ? (
                <>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-3xl font-bold text-[#0ea5e9] font-mono tracking-wide">
                      {telnyxNumber}
                    </span>
                    <button
                      type="button"
                      onClick={copyNumber}
                      className="p-2 rounded-lg border border-[rgba(14,165,233,0.3)] text-[#0ea5e9] hover:bg-[rgba(14,165,233,0.08)] transition-colors"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-[#64748b] mt-2">This is your Amy number — calls to it are handled by your AI receptionist</p>
                </>
              ) : (
                <div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="h-2 w-2 rounded-full bg-[#0ea5e9] animate-pulse" />
                    <span className="text-sm text-[#94a3b8]">Provisioning your number...</span>
                  </div>
                  <p className="text-xs text-[#64748b]">We&apos;ll email you as soon as your number is ready (usually within a few minutes)</p>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[#f0f9ff]">How to get Amy answering your calls</h3>

              <div className="flex items-start gap-4 p-4 bg-[#0a0a0a] border border-[#1e3a5f] rounded-xl">
                <div className="w-8 h-8 rounded-full bg-[rgba(14,165,233,0.1)] border border-[rgba(14,165,233,0.25)] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-[#0ea5e9]">A</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#f0f9ff] mb-1">Forward your existing number</p>
                  <p className="text-sm text-[#64748b] leading-relaxed">
                    Keep your current number and set call forwarding to your AImie number. Your customers dial the same number they always have.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-[#0a0a0a] border border-[#1e3a5f] rounded-xl">
                <div className="w-8 h-8 rounded-full bg-[rgba(14,165,233,0.1)] border border-[rgba(14,165,233,0.25)] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-[#0ea5e9]">B</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#f0f9ff] mb-1">Use your AImie number directly</p>
                  <p className="text-sm text-[#64748b] leading-relaxed">
                    Update your website, Google Business, and social profiles with your new AImie number and it&apos;s live immediately.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-[rgba(14,165,233,0.04)] border border-[rgba(14,165,233,0.15)] rounded-xl">
                <Phone className="h-4 w-4 text-[#0ea5e9] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[#94a3b8] leading-relaxed">
                  Not sure? Our Melbourne team will walk you through it. Reply to your welcome email or call{' '}
                  <a href="tel:+61390226413" className="text-[#0ea5e9] font-semibold">+61 3 9022 6413</a>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[rgba(255,255,255,0.06)]">
          <button
            type="button"
            onClick={handleBack}
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg border border-[#1e3a5f] text-[#94a3b8] hover:border-[rgba(14,165,233,0.4)] hover:text-[#f0f9ff] transition-all ${
              currentStep === 0 ? 'invisible' : ''
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={saving || (currentStep === 0 && !businessName)}
            className="flex items-center gap-2 text-sm font-bold px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-[#0a0a0a] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <div className="h-4 w-4 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />
            ) : currentStep === 3 ? (
              <>Go to dashboard <Zap className="h-4 w-4" /></>
            ) : (
              <>Continue <ChevronRight className="h-4 w-4" /></>
            )}
          </button>
        </div>
      </div>

      <p className="text-xs text-[#334155] text-center">
        Need help? Email{' '}
        <a href="mailto:aimiesolutions@aimiesolutions.com" className="text-[#0ea5e9]">
          aimiesolutions@aimiesolutions.com
        </a>
      </p>
    </div>
  );
}
