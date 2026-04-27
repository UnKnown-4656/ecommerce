import { useEffect, useState, useRef, useCallback } from 'react';

const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const posRef = useRef({ x: -100, y: -100 });
  const ringPosRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef(null);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const attachListeners = useCallback((root = document) => {
    const elements = root.querySelectorAll('a, button, input, select, textarea, .interactive, [role="button"]');
    elements.forEach(el => {
      if (!el.dataset.cursorAttached) {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
        el.dataset.cursorAttached = 'true';
      }
    });
  }, [handleMouseEnter, handleMouseLeave]);

  useEffect(() => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    const moveCursor = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    attachListeners();

    const observerRef = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              attachListeners(node);
            }
          });
        }
      }
    });

    observerRef.observe(document.body, {
      childList: true,
      subtree: true,
    });

    const animate = () => {
      const { x, y } = posRef.current;
      const ring = ringRef.current;
      const dot = dotRef.current;

      if (ring && dot) {
        ringPosRef.current.x += (x - ringPosRef.current.x) * 0.12;
        ringPosRef.current.y += (y - ringPosRef.current.y) * 0.12;

        ring.style.transform = `translate(${ringPosRef.current.x - 20}px, ${ringPosRef.current.y - 20}px)`;
        dot.style.transform = `translate(${x - 2}px, ${y - 2}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      observerRef.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isVisible, attachListeners]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1 h-1 bg-accent rounded-full pointer-events-none z-[9999] transition-opacity duration-200"
        style={{ opacity: isVisible ? 1 : 0 }}
      />
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 w-10 h-10 border border-accent/40 rounded-full pointer-events-none z-[9998] transition-all duration-150 ${isHovered ? 'w-14 h-14 bg-accent/10 border-accent/60' : ''}`}
      />
    </>
  );
};

export default CustomCursor;