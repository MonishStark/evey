import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function CelebrationScreen() {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const colors = ['#ff5c9a', '#ffc2d8', '#c2185b', '#f0e7ff'];
    const burst = origin => confetti({ particleCount: 55, spread: 85, startVelocity: 30, origin, colors, ticks: 120, scalar: 0.8 });
    burst({ x: 0.5, y: 0.53 });
    const timer = window.setTimeout(() => burst({ x: 0.5, y: 0.53 }), 220);
    return () => window.clearTimeout(timer);
  }, [reduced]);

  return <motion.main className="stage celebration-stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    {!reduced && <div className="floaties" aria-hidden="true">{['♡', '✦', '♥', '✧', '♡', '♥', '✦', '♡'].map((item, i) => <span key={i} style={{ '--i': i }}>{item}</span>)}</div>}
    <motion.section className="celebration-card" initial={{ opacity: 0, scale: 0.8, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 150, damping: 16 }}>
      <div className="glow" aria-hidden="true" />
      <div className="celebration-heart" aria-hidden="true">💖</div>
      <h1>I love u more ❤️</h1>
      <p>Hehehe, I knew it, princess 🤭❤️</p>
    </motion.section>
  </motion.main>;
}
