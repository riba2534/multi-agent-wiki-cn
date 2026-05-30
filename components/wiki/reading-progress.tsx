'use client';
import { motion, useScroll, useSpring } from 'framer-motion';

/** Thin brand-gradient bar pinned to the very top that tracks scroll progress. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-40 h-[2px] origin-left"
      style={{ scaleX, background: 'var(--brand-gradient)' }}
      aria-hidden
    />
  );
}
