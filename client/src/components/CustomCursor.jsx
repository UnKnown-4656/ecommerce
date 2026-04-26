import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const observerRef = useRef(null);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 200 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

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
    // Skip custom cursor on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    attachListeners();

    // Use MutationObserver to handle dynamically added elements
    observerRef.current = new MutationObserver((mutations) => {
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

    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isVisible, attachListeners, cursorX, cursorY]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-accent rounded-full pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
      <motion.div
        className="fixed top-0 left-0 border border-accent rounded-full pointer-events-none z-[9998]"
        animate={{
          width: isHovered ? 60 : 30,
          height: isHovered ? 60 : 30,
          backgroundColor: isHovered ? 'rgba(184, 146, 46, 0.1)' : 'rgba(184, 146, 46, 0)',
          borderColor: isHovered ? 'rgba(184, 146, 46, 0.5)' : 'rgba(184, 146, 46, 0.3)',
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 150 }}
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </>
  );
};

export default CustomCursor;
