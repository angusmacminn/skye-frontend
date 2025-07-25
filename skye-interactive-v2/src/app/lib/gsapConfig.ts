import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { TextPlugin } from 'gsap/TextPlugin';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { useGSAP } from '@gsap/react';

// Register all plugins once, globally
gsap.registerPlugin(ScrollTrigger, SplitText, TextPlugin, ScrambleTextPlugin, useGSAP);

// Check for reduced motion preference
const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false; // SSR safety
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Global GSAP configuration
export const initGSAP = () => {
  if (prefersReducedMotion()) {
    gsap.defaults({
      duration: 0,
      ease: "none"
    });
  }
};

// Utility function to conditionally run animations
export const animateWithMotionCheck = (
  targets: gsap.TweenTarget, 
  vars: gsap.TweenVars,
  fallback?: () => void
) => {
  if (prefersReducedMotion()) {
    // Skip animation, just set final state
    gsap.set(targets, {
      ...vars,
      duration: 0,
      delay: 0,
      ease: "none"
    });
    fallback?.();
  } else {
    return gsap.to(targets, vars);
  }
};

// Export wrapped matchMedia that includes reduced motion check
export const gsapMatchMedia = () => {
  const mm = gsap.matchMedia();
  
  // Only add animations if user prefers motion
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    return { shouldAnimate: true };
  });
  
  return mm;
};

export { prefersReducedMotion };
