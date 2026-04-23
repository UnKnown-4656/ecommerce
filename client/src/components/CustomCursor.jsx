import { useEffect } from 'react';

const CustomCursor = () => {
  useEffect(() => {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    
    const moveCursor = (e) => {
      dot.style.left = e.clientX - 3 + 'px';
      dot.style.top = e.clientY - 3 + 'px';
      ring.style.left = e.clientX - 14 + 'px';
      ring.style.top = e.clientY - 14 + 'px';
    };

    const growCursor = () => {
      dot.style.transform = 'scale(2.5)';
      ring.style.width = '14px';
      ring.style.height = '14px';
      ring.style.left = 'calc(' + ring.style.left + ' + 7px)';
    };

    const shrinkCursor = () => {
      dot.style.transform = 'scale(1)';
      ring.style.width = '28px';
      ring.style.height = '28px';
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
        width: '6px', height: '6px',
        background: '#b8922e', borderRadius: '50%',
        position: 'fixed', pointerEvents: 'none', zIndex: 9999
      }} />
      <div id="cursor-ring" style={{
        width: '28px', height: '28px',
        border: '1px solid rgba(184,146,46,0.4)',
        borderRadius: '50%', position: 'fixed',
        pointerEvents: 'none', zIndex: 9998,
        transition: 'all 0.12s ease'
      }} />
    </>
  );
};

export default CustomCursor;
