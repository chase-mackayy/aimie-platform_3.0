'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/dashboard/header';
import {
  CreditCard, CheckCircle, Zap, AlertCircle, ArrowRight,
  Shield, Clock, Phone, ExternalLink, Loader2, Package,
} from 'lucide-react';

const PLAN_FEATURES = [
  'Unlimited inbound calls',
  '24/7 AI receptionist',
  'Automatic booking',
  'Custom voice & personality',
  'Call transcripts & summaries',
  'Email & SMS notifications',
  'Victoria-based support',
  'Advanced analytics dashboard',
];

interface BillingData {
  subscriptionStatus: string | null;
  callsThisMonth: number;
  bookingsThisMonth: number;
  activeAddons: number;
  addonsTotal: number;
}

export default function BillingPage() {
  const [data, setData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [loadingPortal, setLoadingPortal] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [settingsRes, callsRes, bookingsRes, addonsRes] = await Promise.all([
          fetch('/api/settings'),
          fetch('/api/calls'),
          fetch('/api/bookings'),
          fetch('/api/addons'),
        ]);

        const settings = settingsRes.ok ? await settingsRes.json() : {};
        const calls = callsRes.ok ? await callsRes.json() : {};
        const bookings = bookingsRes.ok ? await bookingsRes.json() : {};
        const addonsData = addonsRes.ok ? await addonsRes.json() : {};

        const activeAddons: { addonId: string; enabled: boolean }[] = Array.isArray(addonsData.addons)
          ? addonsData.addons.filter((a: { enabled: boolean }) => a.enabled)
          : [];

        // Compute add-ons cost from known price map
        const ADDON_PRICES: Record<string, number> = {
          'smart-waitlist': 49, 'specials-broadcaster': 79, 'meta-ads-restaurant': 149,
          'no-show-shield': 49, 'rebooking-engine': 69, 'meta-ads-beauty': 149,
          'new-patient-intake': 89, 'treatment-followup': 79, 'meta-ads-health': 149,
          'proximity-scheduler': 99, 'job-quote-capture': 79, 'emergency-surge': 99,
          'upsell-concierge': 99, 'guest-experience': 69, 'function-inquiry': 129,
          'group-booking': 49, 'loyalty-reminder': 49, 'meta-ads-nail': 99,
        };
        const addonsTotal = activeAddons.reduce(
          (sum, a) => sum + (ADDON_PRICES[a.addonId] ?? 0), 0
        );

        setData({
          subscriptionStatus: settings.business?.subscriptionStatus ?? null,
          callsThisMonth: Array.isArray(calls.calls) ? calls.calls.length : 0,
          bookingsThisMonth: bookings.stats?.thisMonth ?? 0,
          activeAddons: activeAddons.length,
          addonsTotal,
        });
      } catch {
        setData({
          subscriptionStatus: null,
          callsThisMonth: 0,
          bookingsThisMonth: 0,
          activeAddons: 0,
          addonsTotal: 0,
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubscribe = async () => {
    setLoadingCheckout(true);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'professional' }),
      });
      const d = await res.json();
      if (d.url) window.location.href = d.url;
      else alert(d.error ?? 'Stripe not configured yet — contact aimiesolutions@aimiesolutions.com to get set up.');
    } finally {
      setLoadingCheckout(false);
    }
  };

  const handlePortal = async () => {
    setLoadingPortal(true);
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' });
      const d = await res.json();
      if (d.url) window.location.href = d.url;
      else alert(d.error ?? 'Billing portal unavailable — contact aimiesolutions@aimiesolutions.com');
    } finally {
      setLoadingPortal(false);
    }
  };

  const isActive = data?.subscriptionStatus === 'active' || data?.subscriptionStatus === 'trialing';
  const isTrialing = data?.subscriptionStatus === 'trialing';
  const totalMonthly = 299 + (data?.addonsTotal ?? 0);

  if (loading) {
    return (
      <div>
        <Header title="Billing" subtitle="Manage your subscription and payments" />
        <div className="p-6 flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-6 w-6 text-[#0ea5e9] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Billing" subtitle="Manage your subscription and payments" />

      <div className="p-6 space-y-6">

        {/* ── No subscription state ── */}
        {!isActive && (
          <div className="electric-card rounded-xl overflow-hidden">
            <div className="relative p-8 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(14,165,233,0.05)] to-transparent pointer-events-none" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-[rgba(14,165,233,0.1)] border border-[rgba(14,165,233,0.2)] flex items-center justify-center mx-auto mb-5">
                  <CreditCard className="h-7 w-7 text-[#0ea5e9]" />
                </div>
                <h2 className="text-xl font-bold text-[#f0f9ff] mb-2">No active subscription</h2>
                <p className="text-sm text-[#64748b] max-w-md mx-auto mb-6 leading-relaxed">
                  Start your 14-day free trial to activate your AI receptionist. No credit card required to begin — you&apos;re only billed after the trial ends.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto mb-8">
                  {[
                    { label: 'Plan price', value: '$299 AUD/mo' },
                    { label: 'Free trial', value: '14 days' },
                    { label: 'Setup fee', value: 'None' },
                    { label: 'Cancel anytime', value: 'Yes' },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-3 rounded-xl bg-[#0a0a0a] border border-[#1a2744]">
                      <div className="text-xs text-[#64748b] mb-1">{label}</div>
                      <div className="text-sm font-bold text-[#f0f9ff]">{value}</div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSubscribe}
                  disabled={loadingCheckout}
                  className="electric-button inline-flex items-center gap-2 bg-[#0ea5e9] hover:bg-[#38bdf8] text-[#0a0a0a] font-bold py-3 px-8 rounded-xl text-sm disabled:opacity-60 transition-colors"
                >
                  {loadingCheckout
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <Zap className="h-4 w-4" />}
                  Start 14-Day Free Trial
                </button>
                <p className="text-xs text-[#64748b] mt-3">No credit card required · Cancel anytime · Australian GST included</p>
              </div>
            </div>

            {/* Plan features preview */}
            <div className="border-t border-[#1a2744] px-8 py-6">
              <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-4">Everything included in your plan</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PLAN_FEATURES.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-[#64748b]">
                    <CheckCircle className="h-3.5 w-3.5 text-[#22c55e] flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Active subscription state ── */}
        {isActive && (
          <>
            <div className="relative electric-card rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(14,165,233,0.06)] via-transparent to-[rgba(56,189,248,0.03)] pointer-events-none" />

              <div className="relative p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-[rgba(14,165,233,0.1)]">
                        <Zap className="h-5 w-5 text-[#0ea5e9]" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-[#f0f9ff]">Professional Plan</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                          <span className="text-xs font-medium" style={{ color: isTrialing ? '#eab308' : '#22c55e' }}>
                            {isTrialing ? 'Free trial active' : 'Active subscription'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-3 rounded-lg bg-[#0a0a0a] border border-[#1a2744]">
                        <div className="text-xs text-[#64748b] mb-1">Base plan</div>
                        <div className="font-bold text-[#f0f9ff]">$299 AUD</div>
                        <div className="text-xs text-[#64748b]">per month</div>
                      </div>
                      <div className="p-3 rounded-lg bg-[#0a0a0a] border border-[#1a2744]">
                        <div className="text-xs text-[#64748b] mb-1">Add-ons</div>
                        <div className="font-bold text-[#38bdf8]">
                          {data!.addonsTotal > 0 ? `+$${data!.addonsTotal} AUD` : 'None active'}
                        </div>
                        <div className="text-xs text-[#64748b]">{data!.activeAddons} active</div>
                      </div>
                      <div className="p-3 rounded-lg bg-[rgba(14,165,233,0.05)] border border-[rgba(14,165,233,0.2)]">
                        <div className="text-xs text-[#64748b] mb-1">Total monthly</div>
                        <div className="font-bold text-[#0ea5e9] text-lg">${totalMonthly} AUD</div>
                        <div className="text-xs text-[#64748b]">incl. GST</div>
                      </div>
                      <div className="p-3 rounded-lg bg-[#0a0a0a] border border-[#1a2744]">
                        <div className="text-xs text-[#64748b] mb-1">Invoices & billing</div>
                        <div className="text-xs text-[#0ea5e9] font-medium">Managed in Stripe</div>
                        <div className="text-xs text-[#64748b]">via portal below</div>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-4">
                      {PLAN_FEATURES.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm text-[#64748b]">
                          <CheckCircle className="h-3.5 w-3.5 text-[#22c55e] flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 md:w-48">
                    <button
                      onClick={handlePortal}
                      disabled={loadingPortal}
                      className="electric-button flex items-center justify-center gap-2 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-[#0a0a0a] font-bold py-2.5 px-4 rounded-lg text-sm disabled:opacity-60"
                    >
                      {loadingPortal
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <ExternalLink className="h-4 w-4" />}
                      Manage in Stripe
                    </button>
                    <button
                      onClick={() => setCancelConfirm(!cancelConfirm)}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium text-[#64748b] hover:text-[#ef4444] hover:bg-[rgba(239,68,68,0.05)] transition-all border border-transparent hover:border-[rgba(239,68,68,0.2)]"
                    >
                      Cancel Subscription
                    </button>
                  </div>
                </div>

                {cancelConfirm && (
                  <div className="mt-5 p-4 rounded-xl border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.05)]">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-[#ef4444] flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#f0f9ff] mb-1">Are you sure you want to cancel?</p>
                        <p className="text-xs text-[#64748b] mb-3">
                          Your AI receptionist will stop answering calls at the end of your current billing period.
                          All call history and settings will be saved for 90 days.
                          To cancel, manage your subscription in the Stripe portal.
                        </p>
                        <div className="flex gap-3">
                          <button
                            onClick={handlePortal}
                            className="px-4 py-1.5 rounded-lg text-xs font-medium bg-[rgba(239,68,68,0.15)] text-[#ef4444] border border-[rgba(239,68,68,0.3)] hover:bg-[rgba(239,68,68,0.25)] transition-colors"
                          >
                            Open Stripe portal to cancel
                          </button>
                          <button
                            onClick={() => setCancelConfirm(false)}
                            className="px-4 py-1.5 rounded-lg text-xs font-medium border border-[#1a2744] text-[#64748b] hover:text-[#f0f9ff] hover:border-[#0ea5e9] transition-colors"
                          >
                            Keep my subscription
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* This month's activity */}
            <div className="electric-card rounded-xl p-6">
              <h3 className="text-base font-semibold text-[#f0f9ff] mb-5 flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#0ea5e9]" />
                This Month&apos;s Activity
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: 'Calls Answered', value: String(data!.callsThisMonth), color: '#0ea5e9', note: 'Unlimited' },
                  { label: 'Bookings Made', value: String(data!.bookingsThisMonth), color: '#22c55e', note: 'Unlimited' },
                  { label: 'Active Add-ons', value: String(data!.activeAddons), color: '#38bdf8', note: data!.addonsTotal > 0 ? `$${data!.addonsTotal}/mo` : 'None' },
                ].map((stat) => (
                  <div key={stat.label} className="p-4 rounded-xl bg-[#080c12] border border-[#1a2744]">
                    <div className="text-2xl font-bold mb-0.5" style={{ color: stat.color }}>{stat.value}</div>
                    <div className="text-xs font-medium text-[#f0f9ff]">{stat.label}</div>
                    <div className="text-xs text-[#64748b] mt-0.5">{stat.note}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-lg bg-[rgba(14,165,233,0.04)] border border-[rgba(14,165,233,0.12)] flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-[#0ea5e9] flex-shrink-0" />
                <p className="text-xs text-[#64748b]">Your Professional plan includes <span className="text-[#0ea5e9] font-medium">unlimited calls</span>. No caps, no overages — ever.</p>
              </div>
            </div>

            {/* Invoices via Stripe */}
            <div className="electric-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-[#f0f9ff] flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#0ea5e9]" />
                  Invoices & Payment Method
                </h3>
              </div>
              <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#1a2744] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[rgba(14,165,233,0.08)] border border-[rgba(14,165,233,0.15)] flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-[#0ea5e9]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#f0f9ff]">Invoices, receipts & card details</div>
                    <div className="text-xs text-[#64748b] mt-0.5">Managed securely in the Stripe customer portal</div>
                  </div>
                </div>
                <button
                  onClick={handlePortal}
                  disabled={loadingPortal}
                  className="flex items-center gap-2 text-xs font-semibold text-[#0ea5e9] hover:text-[#38bdf8] transition-colors whitespace-nowrap disabled:opacity-50"
                >
                  {loadingPortal ? <Loader2 className="h-3 w-3 animate-spin" /> : <ExternalLink className="h-3 w-3" />}
                  Open portal
                </button>
              </div>
              <p className="text-xs text-[#64748b] mt-3 flex items-center gap-1.5">
                <Shield className="h-3 w-3" />
                Payments processed securely by Stripe. AImie Solutions never stores your card details.
              </p>
            </div>
          </>
        )}

        {/* Add-ons upsell (shown when no addons active) */}
        {(data?.activeAddons ?? 0) === 0 && (
          <div className="electric-card rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[rgba(14,165,233,0.1)] border border-[rgba(14,165,233,0.2)] flex items-center justify-center flex-shrink-0">
                <Package className="h-5 w-5 text-[#0ea5e9]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#f0f9ff] mb-0.5">Supercharge with add-ons</h3>
                <p className="text-xs text-[#64748b]">Industry-specific add-ons from $49/mo. No-show shield, Meta Ads, rebooking engine, and more.</p>
              </div>
            </div>
            <a
              href="/dashboard/addons"
              className="electric-button flex items-center gap-2 bg-[#0ea5e9] hover:bg-[#38bdf8] text-[#0a0a0a] font-semibold px-5 py-2.5 rounded-lg text-xs transition-colors whitespace-nowrap"
            >
              Browse Marketplace <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        )}

        {/* Help */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="electric-card rounded-xl p-5">
            <h4 className="font-semibold text-[#f0f9ff] mb-1">Billing questions?</h4>
            <p className="text-sm text-[#64748b] mb-3">Our Melbourne-based team is here to help with any billing or payment queries.</p>
            <a href="mailto:aimiesolutions@aimiesolutions.com" className="text-sm text-[#0ea5e9] hover:text-[#38bdf8] transition-colors flex items-center gap-1">
              aimiesolutions@aimiesolutions.com <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="electric-card rounded-xl p-5">
            <h4 className="font-semibold text-[#f0f9ff] mb-1">Australian Business?</h4>
            <p className="text-sm text-[#64748b] mb-3">All prices include GST. Your invoices are GST-compliant for Australian tax purposes.</p>
            <span className="text-sm text-[#64748b] flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-[#22c55e]" /> ABN: 24 690 118 275
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
