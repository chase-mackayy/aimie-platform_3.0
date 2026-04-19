// Onboarding is a full-screen standalone experience — no sidebar
export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#050507' }}>
      {children}
    </div>
  );
}
