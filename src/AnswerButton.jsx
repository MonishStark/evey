import React from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'framer-motion';

export default function AnswerButton({ children, className = '', onClick, onHoverStart, buttonRef, x = 0, y = 0, label, flight }) {
  const reduced = useReducedMotion();
  const button = <motion.button ref={buttonRef} className={`answer-button ${className} ${flight ? 'flying-button' : ''}`}
    style={flight ? { position: 'fixed', left: flight.origin.left, top: flight.origin.top, width: flight.origin.width, height: flight.origin.height, zIndex: 30 } : undefined}
    onClick={onClick} onHoverStart={onHoverStart} aria-label={label}
    animate={flight ? {
      x: [flight.fromX, flight.midX, flight.toX],
      y: [flight.fromY, flight.midY, flight.toY],
      rotate: [flight.fromRotate, flight.midRotate, flight.toRotate]
    } : { x, y, rotate: 0 }}
    transition={flight ? { duration: reduced ? 0 : 0.5, ease: [0.16, 0.75, 0.24, 1] } : { type: 'tween', duration: reduced ? 0 : 0.12 }}>
    {children}
  </motion.button>;
  return flight ? createPortal(button, document.body) : button;
}
