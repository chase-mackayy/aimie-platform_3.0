'use client';

import { useState, useEffect } from 'react';
import { AuthModal } from '@/components/auth-modal';
import { Navbar } from '@/components/landing/navbar';
import { Hero } from '@/components/landing/hero';
import { Ticker } from '@/components/landing/ticker';
import { StatsBar } from '@/components/landing/stats-bar';
import { DashboardMockup } from '@/components/landing/dashboard-mockup';
import { FeaturesSection } from '@/components/landing/features-section';
import { IndustriesSection } from '@/components/landing/industries-section';
import { HowItWorks } from '@/components/landing/how-it-works';
import { Testimonials } from '@/components/landing/testimonials';
import { PricingSection } from '@/components/landing/pricing-section';
import { FinalCTA } from '@/components/landing/final-cta';
import { Footer } from '@/components/landing/footer';

export default function LandingPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');

  const openSignUp = () => { setAuthMode('signup'); setAuthOpen(true); };
  const openSignIn = () => { setAuthMode('signin'); setAuthOpen(true); };

  // Scroll-reveal observer
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) (e.target as HTMLElement).classList.add('visible'); }),
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar onSignIn={openSignIn} onSignUp={openSignUp} />
      <Hero onSignUp={openSignUp} />
      <Ticker />
      <StatsBar />
      <DashboardMockup />
      <FeaturesSection />
      <IndustriesSection />
      <HowItWorks />
      <Testimonials />
      <PricingSection onSignUp={openSignUp} />
      <FinalCTA onSignUp={openSignUp} />
      <Footer />

      <AuthModal
        isOpen={authOpen}
        mode={authMode}
        onClose={() => setAuthOpen(false)}
        onModeChange={setAuthMode}
      />
    </div>
  );
}
