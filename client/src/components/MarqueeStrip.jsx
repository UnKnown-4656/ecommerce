const MarqueeStrip = () => {
  const items = ['Free Returns','Handcrafted','Worldwide Shipping','SS 2026','Premium Quality','Noir & Co.'];
  const repeated = [...items,...items,...items,...items];

  return (
    <div style={{ 
      borderTop: '1px solid #1a1a1a',
      borderBottom: '1px solid #1a1a1a',
      padding: '12px 0', overflow: 'hidden',
      background: '#0a0a0a'
    }}>
      <div className="marquee-track">
        {repeated.map((item, i) => (
          <span key={i} style={{
            display: 'flex', alignItems: 'center',
            gap: '1.5rem', padding: '0 1.5rem',
            fontFamily: 'Inter', fontSize: '10px',
            letterSpacing: '0.25em', textTransform: 'uppercase',
            color: '#2e2e2e', whiteSpace: 'nowrap'
          }}>
            {item}
            <span style={{ color: '#b8922e', fontSize: '8px' }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default MarqueeStrip;
