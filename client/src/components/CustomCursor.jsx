import { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Check for touch device - standard check
    const touchCheck = () => {
      return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
    };

    if (touchCheck()) {
      setIsTouchDevice(true);
      return;
    }

    const onMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      
      // On first move, snap the ring to the mouse to avoid "trailing from zero"
      if (!isInitialized.current) {
        ringPos.current = { x: e.clientX, y: e.clientY };
        isInitialized.current = true;
        setIsVisible(true);
      }
    };

    const onMouseOver = (e) => {
      const target = e.target;
      if (target.closest('a, button, input, select, textarea, .interactive, [role="button"]')) {
        dotRef.current?.classList.add('hovering');
        ringRef.current?.classList.add('hovering');
      }
    };

    const onMouseOut = (e) => {
      const target = e.target;
      if (target.closest('a, button, input, select, textarea, .interactive, [role="button"]')) {
        dotRef.current?.classList.remove('hovering');
        ringRef.current?.classList.remove('hovering');
      }
    };

    const updateCursor = () => {
      if (!isInitialized.current) {
        rafId.current = requestAnimationFrame(updateCursor);
        return;
      }

      // Smooth interpolation for the ring (0.15 is the "lag" factor)
      const lerp = (start, end, factor) => start + (end - start) * factor;
      
      ringPos.current.x = lerp(ringPos.current.x, mousePos.current.x, 0.15);
      ringPos.current.y = lerp(ringPos.current.y, mousePos.current.y, 0.15);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      rafId.current = requestAnimationFrame(updateCursor);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver);
    window.addEventListener('mouseout', onMouseOut);
    rafId.current = requestAnimationFrame(updateCursor);

    // Clean up visibility if mouse leaves window
    const onMouseLeaveWindow = () => setIsVisible(false);
    const onMouseEnterWindow = () => setIsVisible(true);
    document.addEventListener('mouseleave', onMouseLeaveWindow);
    document.addEventListener('mouseenter', onMouseEnterWindow);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mouseout', onMouseOut);
      document.removeEventListener('mouseleave', onMouseLeaveWindow);
      document.removeEventListener('mouseenter', onMouseEnterWindow);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <div 
      className={`fixed inset-0 pointer-events-none z-[10001] transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{ mixBlendMode: 'normal' }}
    >
      <div id="cursor-dot" ref={dotRef} className="absolute left-0 top-0 will-change-transform" />
      <div id="cursor-ring" ref={ringRef} className="absolute left-0 top-0 will-change-transform" />
    </div>
  );
};

export default CustomCursor;