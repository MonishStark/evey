import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function AnswerButton({ children, className = '', onClick, onHoverStart, buttonRef, x = 0, y = 0, label }) {
  const reduced = useReducedMotion();
  return <motion.button ref={buttonRef} className={`answer-button ${className}`} onClick={onClick} onHoverStart={onHoverStart} aria-label={label}
    animate={{ x, y }} transition={{ type: 'tween', duration: reduced ? 0 : 0.08 }}>
    {children}
  </motion.button>;
}
