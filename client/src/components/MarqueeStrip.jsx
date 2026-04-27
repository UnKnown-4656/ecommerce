
const MarqueeStrip = () => {
  const items = ['Free Returns', 'Handcrafted', 'Worldwide Shipping', 'SS 2026', 'Premium Quality', 'Noir & Co.', 'Sustainable Fashion', 'Limited Editions'];
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div className="border-t border-b border-border/60 py-3.5 overflow-hidden bg-bg relative min-h-[50px]">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none" />

      <div className="marquee-track">
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center gap-6 px-6 font-sans text-[10px] tracking-[0.25em] uppercase text-muted/30 whitespace-nowrap select-none">
            {item}
            <span className="text-accent/40 text-[7px]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
};

MarqueeStrip.displayName = 'MarqueeStrip';

export default MarqueeStrip;
