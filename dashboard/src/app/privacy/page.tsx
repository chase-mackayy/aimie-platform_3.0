export default function PrivacyPage() {
  return (
    <div style={{ background: '#070707', minHeight: '100vh', color: 'white', padding: 'clamp(60px, 8vw, 120px) clamp(24px, 5vw, 80px)' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: '#0ea5e9', textTransform: 'uppercase', marginBottom: 16 }}>
            Legal
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 12 }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>Last updated: March 2026</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 40, fontSize: 15, lineHeight: 1.8, color: 'rgba(255,255,255,0.65)' }}>
          <section>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: 'white', marginBottom: 12 }}>1. Introduction</h2>
            <p>
              AImie Solutions Pty Ltd (&ldquo;AImie&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to protecting
              your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our
              AI receptionist service. We comply with the Australian Privacy Act 1988 (Cth) and the Australian Privacy Principles.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: 'white', marginBottom: 12 }}>2. Information We Collect</h2>
            <p style={{ marginBottom: 12 }}>We collect the following types of information:</p>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li><strong style={{ color: 'white' }}>Business information:</strong> Business name, contact details, ABN, and operational information you provide during onboarding.</li>
              <li><strong style={{ color: 'white' }}>Call data:</strong> Voice recordings, transcripts, and metadata from calls handled by AImie on your behalf.</li>
              <li><strong style={{ color: 'white' }}>Account information:</strong> Name, email address, and password when you create an account.</li>
              <li><strong style={{ color: 'white' }}>Usage data:</strong> Logs, analytics, and performance metrics related to your use of the service.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: 'white', marginBottom: 12 }}>3. How We Use Your Information</h2>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>To provide, operate, and improve the AImie service</li>
              <li>To train and personalise the AI for your specific business</li>
              <li>To communicate with you about your account and service updates</li>
              <li>To comply with legal obligations</li>
              <li>To detect and prevent fraud or misuse</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: 'white', marginBottom: 12 }}>4. Data Storage & Security</h2>
            <p>
              Your data is stored on secure servers in Australia and/or governed by Australian data sovereignty requirements where applicable.
              We use industry-standard encryption in transit (TLS) and at rest. We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: 'white', marginBottom: 12 }}>5. Third-Party Services</h2>
            <p>
              AImie integrates with third-party providers including LiveKit, Deepgram, ElevenLabs, and Twilio to deliver the voice AI
              service. These providers have their own privacy policies and we encourage you to review them. We share only the minimum
              data necessary to operate the service.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: 'white', marginBottom: 12 }}>6. Your Rights</h2>
            <p style={{ marginBottom: 12 }}>Under the Australian Privacy Act, you have the right to:</p>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your data (subject to legal retention requirements)</li>
              <li>Make a complaint to the Office of the Australian Information Commissioner (OAIC)</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: 'white', marginBottom: 12 }}>7. Contact Us</h2>
            <p>
              For any privacy-related questions or requests, please contact us at{' '}
              <a href="mailto:aimiesolutions@aimiesolutions.com" style={{ color: '#0ea5e9', textDecoration: 'none' }}>
                aimiesolutions@aimiesolutions.com
              </a>
              . We will respond within 30 days.
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
