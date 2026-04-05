'use client';

import React, { useState } from 'react';
import { Header } from '@/components/dashboard/header';
import {
  CreditCard,
  CheckCircle,
  Download,
  Zap,
  AlertCircle,
  ArrowRight,
  Shield,
  Clock,
  Phone,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

const INVOICES = [
  { id: 'INV-2026-03', date: '2026-03-01', amount: 348, status: 'paid', period: 'March 2026' },
  { id: 'INV-2026-02', date: '2026-02-01', amount: 348, status: 'paid', period: 'February 2026' },
  { id: 'INV-2026-01', date: '2026-01-01', amount: 299, status: 'paid', period: 'January 2026' },
  { id: 'INV-2025-12', date: '2025-12-01', amount: 299, status: 'paid', period: 'December 2025' },
  { id: 'INV-2025-11', date: '2025-11-01', amount: 299, status: 'paid', period: 'November 2025' },
];

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

function _UsageBar({ used, total, color }: { used: number; total: number; color: string }) {
  const pct = Math.min((used / total) * 100, 100);
  const isWarning = pct > 80;
  return (
    <div className="w-full h-2 rounded-full bg-[#1a1a2e] overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${pct}%`,
          background: isWarning
            ? 'linear-gradient(90deg, #eab308, #ef4444)'
            : `linear-gradient(90deg, ${color}, ${color}cc)`,
          boxShadow: `0 0 8px ${color}66`,
        }}
      />
    </div>
  );
}

export default function BillingPage() {
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [showInvoices, setShowInvoices] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [loadingPortal, setLoadingPortal] = useState(false);

  const callsAnswered = 312;
  const bookingsMade = 87;
  const nextBillingDate = '1 May 2026';
  const monthlyAmount = 299;

  const handleSubscribe = async () => {
    setLoadingCheckout(true);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'professional' }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error ?? 'Stripe not configured yet — add real keys to go live.');
    } finally {
      setLoadingCheckout(false);
    }
  };

  const handlePortal = async () => {
    setLoadingPortal(true);
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error ?? 'Billing portal unavailable — Stripe not configured yet.');
    } finally {
      setLoadingPortal(false);
    }
  };

  return (
    <div>
      <Header
        title="Billing"
        subtitle="Manage your subscription and payments"
        userName="Jane Smith"
        userEmail="jane@mitchellplumbing.com.au"
      />

      <div className="p-6 space-y-6">
        {/* Current Plan */}
        <div className="relative electric-card rounded-xl bg-[#0d1117] overflow-hidden">
          {/* Electric glow background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(14,165,233,0.06)] via-transparent to-[rgba(56,189,248,0.03)] pointer-events-none" />

          <div className="relative p-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2 rounded-lg bg-[rgba(14,165,233,0.1)]">
                    <Zap className="h-5 w-5 text-[#0ea5e9]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#f0f9ff]">Professional Plan</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                      <span className="text-xs text-[#22c55e] font-medium">Active subscription</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-[#0a0a0a] border border-[#1e3a5f]">
                    <div className="text-xs text-[#64748b] mb-1">Base plan</div>
                    <div className="font-bold text-[#f0f9ff]">$299 AUD</div>
                    <div className="text-xs text-[#64748b]">per month</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0a0a0a] border border-[#1e3a5f]">
                    <div className="text-xs text-[#64748b] mb-1">Add-ons</div>
                    <div className="font-bold text-[#38bdf8]">+$49 AUD</div>
                    <div className="text-xs text-[#64748b]">2 active</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[rgba(14,165,233,0.05)] border border-[rgba(14,165,233,0.2)]">
                    <div className="text-xs text-[#64748b] mb-1">Total monthly</div>
                    <div className="font-bold text-[#0ea5e9] text-lg">$348 AUD</div>
                    <div className="text-xs text-[#64748b]">incl. GST</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0a0a0a] border border-[#1e3a5f]">
                    <div className="text-xs text-[#64748b] mb-1">Next billing</div>
                    <div className="font-bold text-[#f0f9ff]">{nextBillingDate}</div>
                    <div className="text-xs text-[#64748b]">auto-renews</div>
                  </div>
                </div>

                {/* Features */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-4">
                  {PLAN_FEATURES.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-[#64748b]">
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
                    ? <div className="h-4 w-4 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />
                    : <ExternalLink className="h-4 w-4" />}
                  Manage in Stripe
                </button>
                <button
                  onClick={handleSubscribe}
                  disabled={loadingCheckout}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium border border-[#1e3a5f] text-[#64748b] hover:border-[#0ea5e9] hover:text-[#f0f9ff] transition-all disabled:opacity-60"
                >
                  {loadingCheckout
                    ? <div className="h-3 w-3 border border-[#64748b] border-t-[#0ea5e9] rounded-full animate-spin" />
                    : null}
                  Subscribe / Update
                </button>
                <button
                  onClick={() => setCancelConfirm(!cancelConfirm)}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium text-[#64748b] hover:text-[#ef4444] hover:bg-[rgba(239,68,68,0.05)] transition-all border border-transparent hover:border-[rgba(239,68,68,0.2)]"
                >
                  Cancel Subscription
                </button>
              </div>
            </div>

            {/* Cancel confirmation */}
            {cancelConfirm && (
              <div className="mt-5 p-4 rounded-xl border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.05)]">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-[#ef4444] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#f0f9ff] mb-1">Are you sure you want to cancel?</p>
                    <p className="text-xs text-[#64748b] mb-3">
                      Your AI receptionist will stop answering calls at the end of your current billing period (31 March 2026).
                      All call history and settings will be saved for 90 days.
                    </p>
                    <div className="flex gap-3">
                      <button className="px-4 py-1.5 rounded-lg text-xs font-medium bg-[rgba(239,68,68,0.15)] text-[#ef4444] border border-[rgba(239,68,68,0.3)] hover:bg-[rgba(239,68,68,0.25)] transition-colors">
                        Yes, cancel subscription
                      </button>
                      <button
                        onClick={() => setCancelConfirm(false)}
                        className="px-4 py-1.5 rounded-lg text-xs font-medium border border-[#1e3a5f] text-[#64748b] hover:text-[#f0f9ff] hover:border-[#0ea5e9] transition-colors"
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

        {/* Usage */}
        <div className="electric-card rounded-xl p-6 bg-[#0d1117]">
          <h3 className="text-base font-semibold text-[#f0f9ff] mb-5 flex items-center gap-2">
            <Phone className="h-4 w-4 text-[#0ea5e9]" />
            This Month&apos;s Activity
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Calls Answered', value: String(callsAnswered), color: '#0ea5e9', note: 'Unlimited' },
              { label: 'Bookings Made', value: String(bookingsMade), color: '#22c55e', note: 'Unlimited' },
              { label: 'Hours Saved', value: '52h', color: '#38bdf8', note: 'Est. this month' },
              { label: 'Revenue Recovered', value: '$17,400', color: '#eab308', note: 'Est. AUD' },
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

        {/* Payment Method */}
        <div className="electric-card rounded-xl p-6 bg-[#0d1117]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-[#f0f9ff] flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-[#0ea5e9]" />
              Payment Method
            </h3>
            <button className="text-xs text-[#0ea5e9] hover:text-[#38bdf8] transition-colors">Update</button>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0a0a0a] border border-[#1e3a5f]">
            <div className="w-12 h-8 rounded-md bg-gradient-to-br from-[#1a1a2e] to-[#0d1117] border border-[#1e3a5f] flex items-center justify-center">
              <div className="flex gap-0.5">
                <div className="w-3 h-4 rounded-sm bg-[#eab308] opacity-80" />
                <div className="w-3 h-4 rounded-sm bg-[#ef4444] opacity-60 -ml-1.5" />
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-[#f0f9ff]">Mastercard ending in 4242</div>
              <div className="text-xs text-[#64748b]">Expires 09/2028</div>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-[#22c55e]" />
              <span className="text-xs text-[#22c55e]">Secure</span>
            </div>
          </div>
          <p className="text-xs text-[#64748b] mt-3 flex items-center gap-1.5">
            <Shield className="h-3 w-3" />
            Payments are processed securely by Stripe. AImie Solutions never stores your card details.
          </p>
        </div>

        {/* Invoice History */}
        <div className="electric-card rounded-xl bg-[#0d1117] overflow-hidden">
          <button
            onClick={() => setShowInvoices(!showInvoices)}
            className="w-full flex items-center justify-between p-6 text-left hover:bg-[rgba(14,165,233,0.02)] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#0ea5e9]" />
              <h3 className="text-base font-semibold text-[#f0f9ff]">Invoice History</h3>
              <span className="text-xs text-[#64748b] ml-1">{INVOICES.length} invoices</span>
            </div>
            <ChevronDown className={`h-4 w-4 text-[#64748b] transition-transform duration-200 ${showInvoices ? 'rotate-180' : ''}`} />
          </button>

          {showInvoices && (
            <>
              <div className="grid grid-cols-4 gap-4 px-6 py-3 border-t border-[#1e3a5f] text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                <div>Invoice</div>
                <div>Period</div>
                <div>Amount</div>
                <div className="text-right">Status</div>
              </div>
              <div className="divide-y divide-[#1e3a5f]">
                {INVOICES.map((invoice) => (
                  <div key={invoice.id} className="grid grid-cols-4 gap-4 px-6 py-4 items-center hover:bg-[rgba(14,165,233,0.02)] transition-colors">
                    <div>
                      <div className="text-sm font-medium text-[#f0f9ff]">{invoice.id}</div>
                      <div className="text-xs text-[#64748b]">{new Date(invoice.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    </div>
                    <div className="text-sm text-[#64748b]">{invoice.period}</div>
                    <div className="text-sm font-medium text-[#f0f9ff]">${invoice.amount} AUD</div>
                    <div className="flex items-center justify-end gap-3">
                      <span className="badge-active text-xs px-2 py-0.5 rounded-full font-medium capitalize">
                        {invoice.status}
                      </span>
                      <button className="text-[#64748b] hover:text-[#0ea5e9] transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Help section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="electric-card rounded-xl p-5 bg-[#0d1117]">
            <h4 className="font-semibold text-[#f0f9ff] mb-1">Billing questions?</h4>
            <p className="text-sm text-[#64748b] mb-3">Our Ballarat-based team is here to help with any billing or payment queries.</p>
            <a href="mailto:billing@aimiesolutions.com" className="text-sm text-[#0ea5e9] hover:text-[#38bdf8] transition-colors flex items-center gap-1">
              billing@aimiesolutions.com <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="electric-card rounded-xl p-5 bg-[#0d1117]">
            <h4 className="font-semibold text-[#f0f9ff] mb-1">Australian Business?</h4>
            <p className="text-sm text-[#64748b] mb-3">All prices include GST. Your invoices are GST-compliant for Australian tax purposes.</p>
            <span className="text-sm text-[#64748b] flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-[#22c55e]" /> ABN: 12 345 678 901
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
