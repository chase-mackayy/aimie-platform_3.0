export function Ticker() {
  const items = [
    '✓ 24/7 availability',
    '✓ Sub-500ms response',
    '✓ OpenTable integration',
    '✓ SevenRooms integration',
    '✓ Fresha integration',
    '✓ Australian data storage',
    '✓ SMS confirmations',
    '✓ Real-time dashboard',
    '✓ No call limits',
    '✓ HotDoc integration',
    '✓ Unlimited inbound calls',
  ];

  // Join with a styled blue dot separator
  const separator = '  ·  ';
  const text = items.join(separator);
  const doubled = `${text}${separator}${text}${separator}`;

  return (
    <div
      className="w-full overflow-hidden"
      style={{
        height: 48,
        background: '#0d0d0d',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        className="animate-marquee whitespace-nowrap"
        style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, letterSpacing: '0.02em' }}
      >
        {doubled.split(separator).map((item, i, arr) => (
          <span key={i}>
            {item}
            {i < arr.length - 1 && (
              <span style={{ color: 'rgba(14,165,233,0.5)', margin: '0 10px' }}>●</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
