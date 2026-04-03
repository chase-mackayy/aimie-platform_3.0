'use client';

import { useState, useEffect, useRef } from 'react';
import { UtensilsCrossed, Scissors, Heart, Activity, Wrench, Sparkles, Building2 } from 'lucide-react';

interface CallLine {
  speaker: 'ai' | 'caller' | 'system';
  text: string;
}

interface Industry {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  heading: string;
  subheading: string;
  bullets: string[];
  stat: string;
  callTitle: string;
  call: CallLine[];
}

const INDUSTRIES: Industry[] = [
  {
    id: 'hospitality',
    label: 'Hospitality',
    icon: UtensilsCrossed,
    heading: 'Restaurants & Bars',
    subheading: 'Never lose a booking to voicemail again.',
    bullets: [
      'OpenTable & SevenRooms integration',
      'Takes reservations after hours',
      'Handles function & event inquiries',
      'Answers menu & dietary questions',
      'Manages waitlist calls',
      'Promotes seasonal specials',
    ],
    stat: 'Restaurants recover an average of $4,200/month in missed bookings',
    callTitle: '📞 Incoming call · Naught Distilling · 9:47 PM',
    call: [
      { speaker: 'ai',     text: "Hi, this is AImie from Naught Distilling — how can I help you tonight?" },
      { speaker: 'caller', text: "Hi, do you have a table for 4 available Saturday around 7pm?" },
      { speaker: 'ai',     text: "Let me check availability for Saturday evening... I have 7:00pm and 7:30pm available. Which would work better?" },
      { speaker: 'caller', text: "7:30 would be perfect." },
      { speaker: 'ai',     text: "Wonderful! Can I get your name and a mobile number for the confirmation SMS?" },
      { speaker: 'caller', text: "Sure, it's Marcus, 0412 345 678" },
      { speaker: 'ai',     text: "Perfect Marcus — you're all booked for Saturday 7:30pm, table for 4. You'll receive a confirmation SMS shortly. See you Saturday!" },
      { speaker: 'system', text: "✓ Booking confirmed in OpenTable · SMS sent to +61 412 345 678" },
    ],
  },
  {
    id: 'beauty',
    label: 'Hair & Beauty',
    icon: Scissors,
    heading: 'Hair Salons & Barbershops',
    subheading: 'Fill every chair. Reduce no-shows.',
    bullets: [
      'Fresha & Booksy integration',
      'Books specific stylists by name',
      'Handles colour appointment timing',
      'Sends reminder SMS 24hrs before',
      'Manages cancellations & rebooks',
      'Promotes slow-day specials',
    ],
    stat: 'Salons see 34% fewer no-shows with automated reminders',
    callTitle: '📞 Incoming call · Botanica Hair Studio · 7:22 PM',
    call: [
      { speaker: 'ai',     text: "Thanks for calling Botanica Hair Studio, I'm AImie. How can I help?" },
      { speaker: 'caller', text: "Hi, I'd like to book a cut and colour with Sophie." },
      { speaker: 'ai',     text: "Great choice! Sophie has availability this Thursday at 10am or Friday at 2pm. Which works better for you?" },
      { speaker: 'caller', text: "Friday at 2pm please." },
      { speaker: 'ai',     text: "Booked! Can I get your name and number for a reminder SMS the day before?" },
      { speaker: 'caller', text: "Emma, 0423 111 222." },
      { speaker: 'ai',     text: "Done, Emma! Friday 2pm with Sophie. You'll get a reminder Thursday morning. See you then!" },
      { speaker: 'system', text: "✓ Booking confirmed in Fresha · Reminder SMS scheduled" },
    ],
  },
  {
    id: 'healthcare',
    label: 'Healthcare',
    icon: Heart,
    heading: 'Medical Clinics & GP Practices',
    subheading: 'Compliant, capable, always available.',
    bullets: [
      'HotDoc & HealthEngine integration',
      'Privacy Act 1988 compliant',
      'Books with specific doctors',
      'Handles repeat prescription calls',
      'After-hours emergency guidance',
      'On-premise option available (Raspberry Pi 5)',
    ],
    stat: 'Medical practices reduce front desk call volume by 67%',
    callTitle: '📞 Incoming call · Bayside Medical · 8:05 PM',
    call: [
      { speaker: 'ai',     text: "Thanks for calling Bayside Medical. I'm AImie. How can I help tonight?" },
      { speaker: 'caller', text: "Hi, I need to book an appointment with Dr. Chen." },
      { speaker: 'ai',     text: "Dr. Chen has availability tomorrow at 9:15am or Thursday at 11:30am. Do either of those suit?" },
      { speaker: 'caller', text: "Tomorrow at 9:15 please." },
      { speaker: 'ai',     text: "Confirmed. Can I get your name and date of birth for our records?" },
      { speaker: 'caller', text: "James Williams, 15 June 1985." },
      { speaker: 'ai',     text: "All booked, James. Tomorrow 9:15am with Dr. Chen. You'll receive a confirmation SMS. See you then." },
      { speaker: 'system', text: "✓ Appointment created in HotDoc · Patient notified via SMS" },
    ],
  },
  {
    id: 'allied',
    label: 'Allied Health',
    icon: Activity,
    heading: 'Physio, Psychology & Allied Health',
    subheading: '8+ hours of admin time saved per week.',
    bullets: [
      'Books initial and follow-up appointments',
      'Handles Medicare & insurance questions',
      'NDIS inquiry handling',
      'Sends intake forms via SMS',
      'Manages cancellation waitlists',
      'Coordinates multiple practitioners',
    ],
    stat: 'Allied health practices recover 8+ hours of admin time per week',
    callTitle: '📞 Incoming call · Core Physio Clinic · 6:55 PM',
    call: [
      { speaker: 'ai',     text: "Hi, you've reached Core Physio Clinic. I'm AImie — how can I help?" },
      { speaker: 'caller', text: "I'd like to book a physio appointment for a lower back injury." },
      { speaker: 'ai',     text: "Of course. Is this your first visit to the clinic?" },
      { speaker: 'caller', text: "Yes, first time." },
      { speaker: 'ai',     text: "Great, I'll book you an initial 60-minute consultation. We have Wednesday at 4pm or Friday at 10am. Any preference?" },
      { speaker: 'caller', text: "Wednesday at 4 works." },
      { speaker: 'ai',     text: "Booked! I'll send an intake form to your mobile before the appointment. What number should I use?" },
      { speaker: 'system', text: "✓ Initial consult booked · Intake form SMS sent" },
    ],
  },
  {
    id: 'trades',
    label: 'Trades',
    icon: Wrench,
    heading: 'Tradies & Construction',
    subheading: 'Quote more jobs. Drive less.',
    bullets: [
      'Proximity-based booking (service radius)',
      'Qualifies leads before booking',
      'Gives rough estimates on call',
      'Books site visits automatically',
      'After-hours emergency call handling',
      'ServiceM8 & Tradify integration',
    ],
    stat: 'Tradies report saving 12+ hours/week on phone admin',
    callTitle: '📞 Incoming call · Mitchell Plumbing · 10:14 PM',
    call: [
      { speaker: 'ai',     text: "Thanks for calling Mitchell Plumbing. I'm AImie — what can I help you with tonight?" },
      { speaker: 'caller', text: "We've got a burst pipe and water is coming through the ceiling." },
      { speaker: 'ai',     text: "That's an emergency — I'll get someone to you urgently. What's the address?" },
      { speaker: 'caller', text: "42 Smith Street, Fitzroy." },
      { speaker: 'ai',     text: "I have a plumber who can be there within 45 minutes. After-hours emergency rate applies. I'll send you a confirmation SMS with their details now." },
      { speaker: 'system', text: "✓ Emergency job created in ServiceM8 · Nearest plumber dispatched" },
    ],
  },
  {
    id: 'nails',
    label: 'Nail Salons',
    icon: Sparkles,
    heading: 'Nail Salons & Beauty Studios',
    subheading: 'Increase booking rate by 41%.',
    bullets: [
      'Books gel, acrylic, dip appointments',
      'Knows duration of each service',
      'Assigns to available nail technician',
      'Handles walk-in vs appointment questions',
      'Promotes new seasonal designs',
      'Upsells nail art add-ons',
    ],
    stat: 'Nail salons increase booking rate by 41% with 24/7 availability',
    callTitle: '📞 Incoming call · Luxe Nails & Beauty · 8:30 PM',
    call: [
      { speaker: 'ai',     text: "Hi, thanks for calling Luxe Nails! I'm AImie. What service can I book for you?" },
      { speaker: 'caller', text: "Hi, I'd like to get a full set of acrylics with nail art." },
      { speaker: 'ai',     text: "Perfect! That's about 2 hours. We have Saturday at 11am or Sunday at 1pm — which works?" },
      { speaker: 'caller', text: "Saturday 11am please." },
      { speaker: 'ai',     text: "Lovely! Can I get your name and number for the reminder?" },
      { speaker: 'caller', text: "Priya, 0411 222 333." },
      { speaker: 'ai',     text: "See you Saturday at 11am, Priya! We'll send you our current nail art catalogue tonight so you can pick your design." },
      { speaker: 'system', text: "✓ Appointment booked · Nail art catalogue SMS sent" },
    ],
  },
  {
    id: 'hotels',
    label: 'Hotels',
    icon: Building2,
    heading: 'Hotels & Accommodation',
    subheading: 'Your front desk, always staffed.',
    bullets: [
      'Handles reservation inquiries 24/7',
      'Room type & availability questions',
      'Check-in / check-out information',
      'Concierge & local recommendations',
      'Directs maintenance & housekeeping requests',
      'Manages group & function bookings',
    ],
    stat: 'Hotels reduce front desk call volume by 58% with AImie',
    callTitle: '📞 Incoming call · The Langham Melbourne · 11:22 PM',
    call: [
      { speaker: 'ai',     text: "Good evening, thank you for calling The Langham Melbourne. I'm AImie — how may I assist you?" },
      { speaker: 'caller', text: "Hi, I'd like to book a room for two nights, checking in Friday." },
      { speaker: 'ai',     text: "Of course! We have a Deluxe King room available Friday and Saturday — would that suit, or would you prefer a suite?" },
      { speaker: 'caller', text: "The Deluxe King sounds perfect." },
      { speaker: 'ai',     text: "Wonderful. Can I take your name and email to hold the reservation?" },
      { speaker: 'caller', text: "Sarah Mitchell, sarah@email.com." },
      { speaker: 'ai',     text: "All set, Sarah! Your Deluxe King is reserved for Friday and Saturday. You'll receive a confirmation email within a few minutes. We look forward to welcoming you." },
      { speaker: 'system', text: "✓ Reservation created · Confirmation email sent to sarah@email.com" },
    ],
  },
];

function CallBubble({ line }: { line: CallLine }) {
  if (line.speaker === 'system') {
    return (
      <div style={{
        textAlign: 'center',
        fontSize: 12,
        color: '#22c55e',
        background: 'rgba(34,197,94,0.08)',
        border: '1px solid rgba(34,197,94,0.15)',
        borderRadius: 8,
        padding: '8px 12px',
        margin: '8px 0',
      }}>
        {line.text}
      </div>
    );
  }
  const isAI = line.speaker === 'ai';
  return (
    <div style={{ display: 'flex', justifyContent: isAI ? 'flex-start' : 'flex-end', marginBottom: 10 }}>
      <div style={{
        maxWidth: '80%',
        background: isAI ? 'rgba(14,165,233,0.1)' : 'rgba(255,255,255,0.06)',
        border: `1px solid ${isAI ? 'rgba(14,165,233,0.2)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: isAI ? '4px 12px 12px 12px' : '12px 4px 12px 12px',
        padding: '10px 14px',
        fontSize: 13,
        color: isAI ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.65)',
        lineHeight: 1.6,
      }}>
        {isAI && (
          <div style={{ fontSize: 10, color: '#0ea5e9', fontWeight: 600, marginBottom: 4, letterSpacing: '0.06em' }}>
            AIMIE
          </div>
        )}
        {line.text}
      </div>
    </div>
  );
}

export function IndustriesSection() {
  const [active, setActive] = useState('hospitality');
  const [contentKey, setContentKey] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const industry = INDUSTRIES.find((i) => i.id === active)!;
  const Icon = industry.icon;

  // Reveal on scroll
  useEffect(() => {
    const els = ref.current?.querySelectorAll('.reveal');
    if (!els) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) (e.target as HTMLElement).classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const handleTabChange = (id: string) => {
    setActive(id);
    setContentKey((k) => k + 1);
  };

  return (
    <section id="industries" ref={ref} style={{ background: '#0d0d0d', padding: 'clamp(80px, 10vw, 120px) 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(24px, 5vw, 80px)' }}>

        {/* Heading */}
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: '#0ea5e9', textTransform: 'uppercase', marginBottom: 16 }}>
            INDUSTRIES
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 56px)', fontWeight: 700, letterSpacing: '-0.03em', color: 'white', marginBottom: 16 }}>
            Built for your industry
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', maxWidth: 520, margin: '0 auto' }}>
            AImie isn&apos;t generic. It&apos;s customised to understand the specific language, workflows, and booking patterns of your industry.
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: 0,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          marginBottom: 56,
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}>
          {INDUSTRIES.map((ind) => {
            const TabIcon = ind.icon;
            const isActive = ind.id === active;
            return (
              <button
                key={ind.id}
                onClick={() => handleTabChange(ind.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 20px',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #0ea5e9' : '2px solid transparent',
                  color: isActive ? 'white' : 'rgba(255,255,255,0.4)',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  marginBottom: -1,
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
              >
                <TabIcon size={16} color={isActive ? '#0ea5e9' : 'currentColor'} />
                {ind.label}
              </button>
            );
          })}
        </div>

        {/* Content — keyed to trigger fadeIn on tab switch */}
        <div
          key={contentKey}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 48,
            alignItems: 'start',
            animation: 'fadeIn 0.35s ease-out',
          }}
        >
          {/* Left */}
          <div>
            <div style={{
              width: 56, height: 56,
              borderRadius: 16,
              background: 'rgba(14,165,233,0.08)',
              border: '1px solid rgba(14,165,233,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
            }}>
              <Icon size={28} color="#0ea5e9" />
            </div>
            <h3 style={{ fontSize: 28, fontWeight: 700, color: 'white', letterSpacing: '-0.02em', marginBottom: 8 }}>
              {industry.heading}
            </h3>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', marginBottom: 28 }}>
              {industry.subheading}
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {industry.bullets.map((b) => (
                <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 15, color: 'rgba(255,255,255,0.75)' }}>
                  <span style={{ color: '#0ea5e9', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                  {b}
                </li>
              ))}
            </ul>
            <div style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.15)', borderRadius: 12, padding: '16px 20px' }}>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                📊 <strong style={{ color: 'white' }}>{industry.stat}</strong>
              </p>
            </div>
          </div>

          {/* Right — Call transcript */}
          <div style={{
            background: '#0f0f0f',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: 24,
            overflow: 'hidden',
          }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {industry.callTitle}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 380, overflowY: 'auto' }}>
              {industry.call.map((line, i) => (
                <div
                  key={i}
                  style={{ animation: `fadeUp 0.4s ease-out ${i * 0.06}s both` }}
                >
                  <CallBubble line={line} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
