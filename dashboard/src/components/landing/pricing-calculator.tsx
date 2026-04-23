'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Zap, ChevronRight } from 'lucide-react';

const INDUSTRIES = [
  {
    id: 'healthcare',
    label: 'Healthcare',
    icon: '🏥',
    multiplier: 3.2,
    role: 'Patient Coordinator',
    tagline: 'Your patients deserve to always get through.',
    color: '#0ea5e9',
    stats: ['Books patient appointments', 'Handles recall reminders', 'Manages cancellations', 'Privacy Act compliant'],
    pain: 'A GP clinic missing 5 calls a day loses over $200,000 in lifetime patient value every year.',
    sample: '"Good morning, this is Amy at Melbourne City Medical. Are you an existing patient or calling to make a new appointment?"',
  },
  {
    id: 'legal',
    label: 'Legal',
    icon: '⚖️',
    multiplier: 2.8,
    role: 'Client Services',
    tagline: 'Every missed call is a client that went elsewhere.',
    color: '#a78bfa',
    stats: ['Captures new client enquiries', 'Qualifies matter type', 'Books consultations', 'Escalates urgent matters'],
    pain: 'A single missed client enquiry can cost a legal firm tens of thousands in billable hours.',
    sample: '"Good afternoon, thank you for calling Harper & Associates. I\'m Amy — are you calling about an existing matter or a new enquiry?"',
  },
  {
    id: 'allied',
    label: 'Allied Health',
    icon: '🩺',
    multiplier: 2.5,
    role: 'Appointment Coordinator',
    tagline: 'Keep your schedule full without lifting a finger.',
    color: '#34d399',
    stats: ['Books & confirms appointments', 'Handles cancellations', 'Sends reminders', 'Manages waitlists'],
    pain: 'A physio clinic missing 3 calls a day loses $150,000 in patient revenue annually.',
    sample: '"Hi, you\'ve reached Bayside Physiotherapy. This is Amy — I can help you book an appointment or answer any questions about our services."',
  },
  {
    id: 'realestate',
    label: 'Real Estate',
    icon: '🏠',
    multiplier: 2.2,
    role: 'Enquiry Manager',
    tagline: 'Capture every lead. Miss none.',
    color: '#f59e0b',
    stats: ['Qualifies buyer & seller enquiries', 'Books appraisals & inspections', 'Answers property questions', 'Routes to the right agent'],
    pain: 'In real estate, a missed enquiry call can mean a lost listing worth $15,000+ in commission.',
    sample: '"Thanks for calling Prestige Property Group. I\'m Amy — are you looking to buy, sell, or enquire about one of our listings?"',
  },
  {
    id: 'trades',
    label: 'Trades',
    icon: '🔧',
    multiplier: 1.8,
    role: 'Job Dispatcher',
    tagline: 'You\'re on the tools. Amy\'s on the phone.',
    color: '#fb923c',
    stats: ['Captures every job lead', 'Books call-backs & quotes', 'Handles after-hours calls', 'Qualifies job type & urgency'],
    pain: 'A tradie missing 10 calls a week loses $140,000 a year in jobs that go to the next number on Google.',
    sample: '"G\'day, thanks for calling Mackay Plumbing. I\'m Amy — are you after a quote or is this an urgent job?"',
  },
  {
    id: 'restaurants',
    label: 'Hospitality',
    icon: '🍽️',
    multiplier: 1.6,
    role: 'Reservations Manager',
    tagline: 'Full tables, every night.',
    color: '#f43f5e',
    stats: ['Takes & confirms reservations', 'Handles special requests', 'Manages cancellations', 'Answers menu & hours questions'],
    pain: 'A restaurant missing 15 reservation calls a week loses over $45,000 a year in covers.',
    sample: '"Good evening, thank you for calling Botanica. This is Amy — I\'d love to help you make a reservation. How many guests are you expecting?"',
  },
  {
    id: 'beauty',
    label: 'Hair & Beauty',
    icon: '💇',
    multiplier: 1.5,
    role: 'Bookings Manager',
    tagline: 'Every chair filled. Every client kept.',
    color: '#e879f9',
    stats: ['Books all appointments', 'Handles reschedules', 'Upsells treatments', 'Sends confirmations'],
    pain: 'A salon missing 8 booking calls a day loses $2,400 a week — while the stylist is mid-colour.',
    sample: '"Hi, thanks for calling Luxe Hair Studio! I\'m Amy — I can get you booked in today. What service are you after?"',
  },
  {
    id: 'veterinary',
    label: 'Veterinary',
    icon: '🐾',
    multiplier: 1.9,
    role: 'Client Coordinator',
    tagline: 'Pet owners don\'t leave voicemails. They call the next vet.',
    color: '#22d3ee',
    stats: ['Books all appointments', 'Triages urgent cases', 'Handles prescription refills', 'Answers care questions'],
    pain: 'Worried pet owners call the next clinic immediately if they don\'t get through. Every missed call is a lost patient.',
    sample: '"Good morning, Paws & Claws Veterinary Clinic. This is Amy — is this a routine appointment or does your pet need to be seen urgently?"',
  },
  {
    id: 'fitness',
    label: 'Fitness',
    icon: '🏋️',
    multiplier: 1.4,
    role: 'Member Services',
    tagline: 'Turn every enquiry into a membership.',
    color: '#86efac',
    stats: ['Converts gym enquiries', 'Books trial sessions', 'Handles membership questions', 'Books classes & PTs'],
    pain: 'A fitness studio missing 10 membership enquiry calls a month loses $6,000+ in recurring revenue.',
    sample: '"Hey! Thanks for calling FlexFit Studio. I\'m Amy — are you interested in a membership, or would you like to book a free trial session?"',
  },
];

function getVolumeFactor(calls: number) {
  if (calls < 100) return 1.0;
  if (calls < 300) return 1.35;
  if (calls < 600) return 1.75;
  return 2.2;
}

function calcPrice(multiplier: number, calls: number) {
  const raw = 109 * multiplier * getVolumeFactor(calls);
  return Math.max(149, Math.round(raw / 10) * 10);
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const start = prev.current;
    const end = value;
    const dur = 700;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 4);
      setDisplay(Math.round(start + (end - start) * e));
      if (p < 1) requestAnimationFrame(tick);
      else prev.current = end;
    };
    requestAnimationFrame(tick);
  }, [value]);
  return <>{display}</>;
}

interface Props { onSignUp: (price: number, industry: string, calls: number) => void; }

export function PricingCalculator({ onSignUp }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [calls, setCalls] = useState(200);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [revealed, setRevealed] = useState(false);

  const industry = INDUSTRIES.find((i) => i.id === selected);
  const isHealthcare = selected === 'healthcare';
  const price = isHealthcare ? 997 : (industry ? calcPrice(industry.multiplier, calls) : 149);
  const humanCost = 5417;
  const saving = humanCost - price;
  const roiX = Math.round(humanCost / price);
  const perDay = (price / 30).toFixed(2);

  const handleIndustrySelect = (id: string) => {
    setSelected(id);
    if (id === 'healthcare') {
      setTimeout(() => { setStep(3); setTimeout(() => setRevealed(true), 200); }, 120);
    } else {
      setTimeout(() => setStep(2), 120);
    }
  };

  const handleReveal = () => {
    setStep(3);
    setTimeout(() => setRevealed(true), 100);
  };

  return (
    <section id="pricing" style={{
      background: '#0a0a0a',
      padding: 'clamp(80px,10vw,130px) clamp(24px,5vw,80px)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Animated background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {industry && (
          <div style={{
            position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
            width: 800, height: 600, borderRadius: '50%',
            background: `radial-gradient(ellipse, ${industry.color}08 0%, transparent 70%)`,
            filter: 'blur(80px)',
            transition: 'all 1.2s ease',
            animation: 'aurora-drift 20s ease-in-out infinite',
          }} />
        )}
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 500, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(167,139,250,0.05) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'aurora-drift-b 18s ease-in-out infinite' }} />
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 72 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 100, padding: '5px 14px', marginBottom: 20 }}>
            <Zap size={12} color="#0ea5e9" />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#0ea5e9', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Custom Pricing</span>
          </div>
          <h2 style={{ fontSize: 'clamp(32px,5vw,62px)', fontWeight: 800, letterSpacing: '-0.04em', color: 'white', marginBottom: 20, lineHeight: 1.05 }}>
            Your price. Built around<br />
            <span style={{ background: 'linear-gradient(135deg, #0ea5e9, #38bdf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              your business.
            </span>
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.35)', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
            No tiers. No guesswork. Tell us what you do and we'll show you exactly what Amy costs — and what you're losing without her.
          </p>
        </div>

        {/* Step tracker */}
        <div className="reveal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 48 }}>
          {[
            { n: 1, label: 'Your industry' },
            { n: 2, label: 'Call volume' },
            { n: 3, label: 'Your price' },
          ].map(({ n, label }, i) => (
            <div key={n} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: step >= n ? (step > n ? '#22c55e' : '#0ea5e9') : 'rgba(255,255,255,0.06)',
                  border: step >= n ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: 'white',
                  transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                  boxShadow: step === n ? `0 0 20px ${step >= n ? '#0ea5e9' : 'transparent'}40` : 'none',
                }}>
                  {step > n ? '✓' : n}
                </div>
                <span style={{ fontSize: 11, fontWeight: 500, color: step >= n ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)', whiteSpace: 'nowrap', transition: 'color 0.3s' }}>
                  {label}
                </span>
              </div>
              {i < 2 && (
                <div style={{ width: 80, height: 1, background: step > n ? '#22c55e' : 'rgba(255,255,255,0.08)', margin: '0 8px 20px', transition: 'background 0.4s', flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1 — Industry */}
        {step === 1 && (
          <div className="reveal">
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: 'white', marginBottom: 8 }}>What kind of business are you running?</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>Pick the one that fits — Amy speaks the language of your industry.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px,1fr))', gap: 12 }}>
              {INDUSTRIES.map((ind) => (
                <button
                  key={ind.id}
                  onClick={() => handleIndustrySelect(ind.id)}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 16, padding: '20px 14px',
                    cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                    transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                    color: 'white', textAlign: 'center',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${ind.color}0f`;
                    e.currentTarget.style.borderColor = `${ind.color}40`;
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 12px 40px ${ind.color}15`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span style={{ fontSize: 32, display: 'block', lineHeight: 1 }}>{ind.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', marginBottom: 3 }}>{ind.label}</div>
                    <div style={{ fontSize: 11, color: ind.color, fontWeight: 600 }}>{ind.role}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — Volume */}
        {step === 2 && industry && (
          <div style={{ animation: 'fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both' }}>
            {/* Industry preview card */}
            <div style={{
              background: `linear-gradient(135deg, ${industry.color}08, rgba(0,0,0,0))`,
              border: `1px solid ${industry.color}25`,
              borderRadius: 20, padding: '28px 32px', marginBottom: 28,
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, ${industry.color}10 0%, transparent 70%)`, pointerEvents: 'none' }} />
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
                <div style={{ fontSize: 44, lineHeight: 1 }}>{industry.icon}</div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>{industry.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: industry.color, background: `${industry.color}15`, border: `1px solid ${industry.color}30`, borderRadius: 20, padding: '2px 10px' }}>
                      {industry.role}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 16, lineHeight: 1.6, fontStyle: 'italic' }}>
                    "{industry.pain}"
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {industry.stats.map((s) => (
                      <span key={s} style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ color: industry.color, fontSize: 10 }}>✓</span> {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sample call */}
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${industry.color}15` }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Amy sounds like this</div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${industry.color}20`, border: `1px solid ${industry.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12 }}>
                    🎙
                  </div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>
                    {industry.sample}
                  </p>
                </div>
              </div>
            </div>

            {/* Slider */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '28px 32px', marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'white', marginBottom: 3 }}>How many calls per month?</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Include all calls — answered and missed</div>
                </div>
                <div style={{
                  fontSize: 28, fontWeight: 800, color: 'white', letterSpacing: '-0.02em',
                  background: `${industry.color}12`, border: `1px solid ${industry.color}30`,
                  borderRadius: 12, padding: '8px 20px',
                  transition: 'all 0.2s',
                }}>
                  {calls < 800 ? calls : '800+'}
                </div>
              </div>

              <input
                type="range" min={20} max={800} step={10} value={calls}
                onChange={(e) => setCalls(Number(e.target.value))}
                style={{
                  width: '100%', appearance: 'none', height: 5, borderRadius: 10, outline: 'none', cursor: 'pointer',
                  background: `linear-gradient(to right, ${industry.color} 0%, ${industry.color} ${((calls - 20) / 780) * 100}%, rgba(255,255,255,0.08) ${((calls - 20) / 780) * 100}%, rgba(255,255,255,0.08) 100%)`,
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
                {['20', '200', '400', '600', '800+'].map((l) => <span key={l}>{l}</span>)}
              </div>
            </div>

            {/* Live price preview */}
            <div style={{
              background: `linear-gradient(135deg, ${industry.color}08, rgba(0,0,0,0))`,
              border: `1px solid ${industry.color}30`,
              borderRadius: 16, padding: '20px 28px', marginBottom: 24,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
            }}>
              <div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>Estimated monthly price</div>
                <div style={{ fontSize: 38, fontWeight: 800, color: 'white', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  $<AnimatedNumber value={calcPrice(industry.multiplier, calls)} />
                  <span style={{ fontSize: 15, fontWeight: 400, color: 'rgba(255,255,255,0.3)', marginLeft: 4 }}>/mo</span>
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>
                  ${(calcPrice(industry.multiplier, calls) / 30).toFixed(2)}/day · unlimited calls & SMS
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginBottom: 4 }}>vs human {industry.role.toLowerCase()}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#ef4444', textDecoration: 'line-through', opacity: 0.7 }}>$5,417/mo</div>
                <div style={{ fontSize: 12, color: '#22c55e', fontWeight: 600, marginTop: 2 }}>
                  Save ${(5417 - calcPrice(industry.multiplier, calls)).toLocaleString()}/month
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStep(1)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', borderRadius: 12, padding: '14px 20px', fontSize: 14, cursor: 'pointer' }}>
                ← Back
              </button>
              <button
                onClick={handleReveal}
                className="electric-btn"
                style={{
                  flex: 1, background: industry.color, color: 'white',
                  border: 'none', borderRadius: 12, padding: '15px',
                  fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: `0 0 40px ${industry.color}30`,
                }}
              >
                See my full breakdown <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Result */}
        {step === 3 && industry && (
          <div style={{ animation: 'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both' }}>

            {/* Hero price */}
            <div style={{
              background: `linear-gradient(135deg, ${industry.color}10, rgba(14,165,233,0.04))`,
              border: `1px solid ${industry.color}30`,
              borderRadius: 24, padding: 'clamp(28px,4vw,44px)',
              marginBottom: 16, textAlign: 'center', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)', width: 300, height: 300, borderRadius: '50%', background: `radial-gradient(circle, ${industry.color}15 0%, transparent 70%)`, pointerEvents: 'none' }} />
              <div style={{ fontSize: 38, marginBottom: 8 }}>{industry.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: industry.color, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                {industry.label} — {industry.role}
                {isHealthcare && (
                  <span style={{ marginLeft: 10, background: 'rgba(14,165,233,0.15)', border: '1px solid rgba(14,165,233,0.3)', borderRadius: 20, padding: '2px 10px', fontSize: 10, color: '#38bdf8' }}>
                    On-Premise Hardware Included
                  </span>
                )}
              </div>
              <div style={{
                fontSize: 'clamp(64px,10vw,96px)', fontWeight: 800, color: 'white',
                letterSpacing: '-0.05em', lineHeight: 1,
                opacity: revealed ? 1 : 0, transform: revealed ? 'translateY(0)' : 'translateY(16px)',
                transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
              }}>
                $<AnimatedNumber value={price} />
              </div>
              <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.35)', marginTop: 6, marginBottom: 20 }}>
                per month · ${perDay}/day · unlimited everything
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 10 }}>
                {['Unlimited calls', 'Unlimited SMS', '24/7 coverage', 'Cancel anytime', 'Live in 48hrs'].map((f) => (
                  <span key={f} style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '5px 14px', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ color: '#22c55e', fontSize: 10 }}>✓</span> {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Comparison grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 16, padding: '20px' }}>
                <div style={{ fontSize: 10, color: 'rgba(239,68,68,0.7)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Human {industry.role}</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: '#ef4444', letterSpacing: '-0.02em' }}>$5,417</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 4 }}>avg/month</div>
              </div>
              <div style={{ background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 16, padding: '20px' }}>
                <div style={{ fontSize: 10, color: '#22c55e', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>You save</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: '#22c55e', letterSpacing: '-0.02em' }}>
                  ${saving.toLocaleString()}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 4 }}>every month</div>
              </div>
              <div style={{ background: `${industry.color}06`, border: `1px solid ${industry.color}20`, borderRadius: 16, padding: '20px' }}>
                <div style={{ fontSize: 10, color: industry.color, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Return</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: 'white', letterSpacing: '-0.02em' }}>{roiX}×</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 4 }}>ROI on Amy</div>
              </div>
            </div>

            {/* Healthcare special breakdown */}
            {isHealthcare && (
              <div style={{ background: 'rgba(14,165,233,0.04)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 14, padding: '20px 24px', marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#0ea5e9', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>What's included at $997/month</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    { icon: '🖥️', text: 'Raspberry Pi 5 hardware unit — installed on-site by our team' },
                    { icon: '🔒', text: 'Data never leaves your premises — ever' },
                    { icon: '⚖️', text: 'Full Privacy Act APP 8 & APP 11 compliance' },
                    { icon: '👤', text: 'Dedicated account manager included' },
                    { icon: '🩺', text: 'HotDoc & Cliniko integration' },
                    { icon: '⚡', text: '30-minute support response guarantee' },
                  ].map((item) => (
                    <div key={item.text} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{item.text}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(14,165,233,0.15)', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
                  No other agency in Australia offers on-premise AI for healthcare. This is the only compliant option.
                </div>
              </div>
            )}

            {/* Pain stat */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 22px', marginBottom: 24 }}>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
                "{industry.pain}"
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={() => onSignUp(price, industry.id, calls)}
              className="electric-btn"
              style={{
                width: '100%', border: 'none', borderRadius: 14, padding: '18px',
                fontSize: 17, fontWeight: 700, cursor: 'pointer',
                background: `linear-gradient(135deg, ${industry.color}, #0ea5e9)`,
                color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                boxShadow: `0 0 60px ${industry.color}25, 0 8px 32px rgba(0,0,0,0.3)`,
                transition: 'all 0.3s',
              }}
            >
              <Zap size={18} />
              Start my 14-day free trial — ${price}/month after
            </button>
            <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 12 }}>
              No setup fee · No lock-in contract · Cancel anytime
            </p>

            <button onClick={() => { setStep(isHealthcare ? 1 : 2); setRevealed(false); }} style={{ display: 'block', margin: '12px auto 0', background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', fontSize: 13, cursor: 'pointer' }}>
              ← {isHealthcare ? 'Choose a different industry' : 'Adjust my details'}
            </button>
          </div>
        )}

        {/* Trust strip */}
        <div className="reveal" style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(16px,4vw,48px)', marginTop: 56, flexWrap: 'wrap' }}>
          {[
            { icon: '🇦🇺', label: 'Australian owned' },
            { icon: '⚡', label: 'Live in 48 hours' },
            { icon: '🔒', label: 'No lock-in' },
            { icon: '📍', label: 'Melbourne support' },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>
              <span>{item.icon}</span><span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
