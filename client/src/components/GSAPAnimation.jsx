import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Reusable GSAP Animation Component
 * More performant than Framer Motion for scroll-based animations
 */
const GSAPAnimation = ({
  children,
  animation = 'fadeInUp',
  delay = 0,
  duration = 0.8,
  threshold = 0.1,
  className = '',
  ...props
}) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      let animationConfig;

      switch (animation) {
        case 'fadeInUp':
          animationConfig = {
            opacity: 0,
            y: 30,
            duration,
            delay,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: `top ${80 + threshold * 100}%`,
              toggleActions: 'play none none reverse'
            }
          };
          break;
        case 'fadeIn':
          animationConfig = {
            opacity: 0,
            duration,
            delay,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: `top ${80 + threshold * 100}%`,
              toggleActions: 'play none none reverse'
            }
          };
          break;
        case 'scaleIn':
          animationConfig = {
            opacity: 0,
            scale: 0.9,
            duration,
            delay,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: `top ${80 + threshold * 100}%`,
              toggleActions: 'play none none reverse'
            }
          };
          break;
        default:
          animationConfig = {
            opacity: 0,
            duration,
            delay,
            ease: 'power2.out'
          };
      }

      gsap.fromTo(element, animationConfig, { opacity: 1, y: 0, scale: 1, duration, ease: 'power2.out' });
    }, element);

    return () => ctx.revert();
  }, [animation, delay, duration, threshold]);

  return (
    <div ref={elementRef} className={className} {...props}>
      {children}
    </div>
  );
};

export default GSAPAnimation;
