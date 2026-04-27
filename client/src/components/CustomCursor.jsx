import { useEffect, useState, useCallback } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // High-performance motion values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for the outer ring
  const springConfig = { damping: 30, stiffness: 250, mass: 0.5 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  useEffect(() => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    const moveCursor = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const attachListeners = (root = document) => {
      const elements = root.querySelectorAll('a, button, input, select, textarea, .interactive, [role="button"]');
      elements.forEach(el => {
        if (!el.dataset.cursorAttached) {
          el.addEventListener('mouseenter', handleMouseEnter);
          el.addEventListener('mouseleave', handleMouseLeave);
          el.dataset.cursorAttached = 'true';
        }
      });
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    attachListeners();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) attachListeners(node);
          });
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      observer.disconnect();
    };
  }, [isVisible, handleMouseEnter, handleMouseLeave, mouseX, mouseY]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Inner Dot - follows mouse exactly */}
      <motion.div
        className="absolute w-1.5 h-1.5 bg-accent rounded-full"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
          willChange: 'transform',
        }}
      />
      
      {/* Outer Ring - smooth trailing effect */}
      <motion.div
        className="absolute rounded-full border border-accent/40"
        animate={{
          width: isHovered ? 60 : 30,
          height: isHovered ? 60 : 30,
          backgroundColor: isHovered ? 'rgba(184, 146, 46, 0.15)' : 'rgba(184, 146, 46, 0)',
          borderColor: isHovered ? 'rgba(184, 146, 46, 0.6)' : 'rgba(184, 146, 46, 0.3)',
          borderWidth: isHovered ? '1.5px' : '1px',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          willChange: 'transform, width, height',
        }}
      />

      {/* Luxury Backdrop Blur for the ring on hover */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute w-20 h-20 bg-accent/5 blur-xl rounded-full"
          style={{
            x: ringX,
            y: ringY,
            translateX: '-50%',
            translateY: '-50%',
          }}
        />
      )}
    </div>
  );
};

export default CustomCursor;