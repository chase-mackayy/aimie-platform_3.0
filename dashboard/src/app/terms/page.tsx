export default function TermsPage() {
  return (
    <div style={{ background: '#070707', minHeight: '100vh', color: 'white', padding: 'clamp(60px, 8vw, 120px) clamp(24px, 5vw, 80px)' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: '#0ea5e9', textTransform: 'uppercase', marginBottom: 16 }}>
            Legal
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 12 }}>
            Terms of Service
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>Last updated: March 2026</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 40, fontSize: 15, lineHeight: 1.8, color: 'rgba(255,255,255,0.65)' }}>
          <section>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: 'white', marginBottom: 12 }}>1. Agreement to Terms</h2>
            <p>
              By accessing or using the AImie Solutions service (&ldquo;Service&rdquo;), you agree to be bound by these Terms of Service
              (&ldquo;Terms&rdquo;). If you do not agree, you may not use the Service. These Terms apply to all users, including
              businesses and their representatives.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: 'white', marginBottom: 12 }}>2. Description of Service</h2>
            <p>
              AImie Solutions provides an AI-powered voice receptionist service that answers inbound phone calls on behalf of your
              business. The Service includes call handling, booking management, FAQ responses, and integration with third-party
              scheduling platforms. Features vary by subscription plan.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: 'white', marginBottom: 12 }}>3. Account Responsibilities</h2>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>You are responsible for maintaining the security of your account credentials.</li>
              <li>You must provide accurate and current information during registration.</li>
              <li>You are responsible for all activity that occurs under your account.</li>
              <li>You must notify us immediately of any unauthorised access.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: 'white', marginBottom: 12 }}>4. Acceptable Use</h2>
            <p style={{ marginBottom: 12 }}>You agree not to use the Service to:</p>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>Violate any applicable Australian or international law or regulation</li>
              <li>Engage in deceptive, fraudulent, or misleading practices</li>
              <li>Transmit unlawful, defamatory, or offensive content</li>
              <li>Attempt to reverse-engineer, copy, or resell the Service</li>
              <li>Interfere with the operation of the Service or related systems</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: 'white', marginBottom: 12 }}>5. Billing & Payments</h2>
            <p>
              Subscription fees are billed monthly or annually depending on your plan. All prices are in Australian Dollars (AUD)
              and inclusive of GST where applicable. You authorise us to charge your nominated payment method on the billing date.
              Unused call credits do not roll over between billing periods. We reserve the right to modify pricing with 30 days&rsquo; notice.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: 'white', marginBottom: 12 }}>6. Service Availability</h2>
            <p>
              We aim to provide 99.9% uptime but do not guarantee uninterrupted service. Scheduled maintenance will be communicated
              in advance. We are not liable for downtime caused by third-party providers (including telecommunications carriers,
              cloud infrastructure, or AI model providers) or events outside our reasonable control.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: 'white', marginBottom: 12 }}>7. Intellectual Property</h2>
            <p>
              All technology, branding, and content within the AImie platform is the intellectual property of AImie Solutions Pty Ltd.
              You retain ownership of your business data and call recordings. By using the Service, you grant us a limited licence to
              process your data solely to deliver and improve the Service.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: 'white', marginBottom: 12 }}>8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by Australian law, AImie Solutions shall not be liable for any indirect, incidental,
              special, or consequential damages arising from your use of the Service. Our total liability to you shall not exceed
              the fees paid in the three months preceding the claim.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: 'white', marginBottom: 12 }}>9. Termination</h2>
            <p>
              Either party may terminate the Service with 30 days&rsquo; written notice. We reserve the right to suspend or terminate
              your account immediately for breach of these Terms. Upon termination, your data will be retained for 90 days before
              deletion, unless you request earlier removal.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: 'white', marginBottom: 12 }}>10. Governing Law</h2>
            <p>
              These Terms are governed by the laws of Victoria, Australia. Any disputes shall be subject to the exclusive jurisdiction
              of the courts of Victoria. If any provision of these Terms is found to be unenforceable, the remaining provisions
              shall continue in full force.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: 'white', marginBottom: 12 }}>11. Contact</h2>
            <p>
              Questions about these Terms? Contact us at{' '}
              <a href="mailto:hello@aimiesolutions.com.au" style={{ color: '#0ea5e9', textDecoration: 'none' }}>
                hello@aimiesolutions.com.au
              </a>
              .
            </p>
          </section>
        </div>

        <div style={{ marginTop: 60, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <a href="/" style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
            ← Back to home
          </a>
        </div>
      </div>
    </div>
  );
}
