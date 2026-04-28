import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Lightweight hook for scroll-triggered animations using GSAP
 * More performant than Framer Motion for scroll-heavy animations
 */
export const useScrollReveal = (options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      gsap.from(element, {
        opacity: 0,
        y: options.y || 30,
        duration: options.duration || 0.8,
        delay: options.delay || 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: `top ${options.threshold ? 100 - options.threshold * 100 : 80}%`,
          toggleActions: 'play none none reverse',
        }
      });
    }, element);

    return () => ctx.revert();
  }, [options]);

  return ref;
};

export default useScrollReveal;
