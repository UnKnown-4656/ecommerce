import { useEffect } from 'react';

const CustomCursor = () => {
  useEffect(() => {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    
    const moveCursor = (e) => {
      dot.style.left = e.clientX - 2 + 'px';
      dot.style.top = e.clientY - 2 + 'px';
      ring.style.left = e.clientX - 9 + 'px';
      ring.style.top = e.clientY - 9 + 'px';
    };

    const growCursor = () => {
      ring.style.width = '40px';
      ring.style.height = '40px';
      ring.style.left = 'calc(' + ring.style.left + ' - 11px)';
      ring.style.top = 'calc(' + ring.style.top + ' - 11px)';
      ring.style.background = 'rgba(184,146,46,0.15)';
    };

    const shrinkCursor = () => {
      ring.style.width = '18px';
      ring.style.height = '18px';
      ring.style.left = 'calc(' + ring.style.left + ' + 11px)';
      ring.style.top = 'calc(' + ring.style.top + ' + 11px)';
      ring.style.background = 'transparent';
    };

    window.addEventListener('mousemove', moveCursor);
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', growCursor);
      el.addEventListener('mouseleave', shrinkCursor);
    });

    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <>
      <div id="cursor-dot" style={{
        width: '4px', height: '4px',
        background: '#b8922e', borderRadius: '50%',
        position: 'fixed', pointerEvents: 'none', zIndex: 9999,
        mixBlendMode: 'difference'
      }} />
      <div id="cursor-ring" style={{
        width: '18px', height: '18px',
        border: '2px solid #b8922e',
        borderRadius: '50%', position: 'fixed',
        pointerEvents: 'none', zIndex: 9998,
        transition: 'all 0.15s ease',
        mixBlendMode: 'difference'
      }} />
    </>
  );
};

export default CustomCursor;
