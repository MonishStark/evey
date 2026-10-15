import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const wrap = n => (n + 26) % 26;

export default function LetterWheel({ value, onChange, index, disabled }) {
  const root = useRef(null);
  const drag = useRef(null);
  const [snap, setSnap] = useState(false);
  const reduced = useReducedMotion();
  const selected = ALPHABET.indexOf(value);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const onWheel = event => {
      event.preventDefault();
      onChange(wrap(selected + (event.deltaY > 0 ? 1 : -1)));
      pulse();
    };
    element.addEventListener('wheel', onWheel, { passive: false });
    return () => element.removeEventListener('wheel', onWheel);
  }, [selected, onChange]);

  function pulse() {
    setSnap(true);
    window.setTimeout(() => setSnap(false), 150);
  }
  function move(direction) {
    if (disabled) return;
    onChange(wrap(selected + direction));
    pulse();
  }
  function startDrag(event) {
    if (disabled) return;
    drag.current = { y: event.clientY, moved: 0 };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function duringDrag(event) {
    if (!drag.current) return;
    drag.current.moved += event.clientY - drag.current.y;
    drag.current.y = event.clientY;
    if (Math.abs(drag.current.moved) >= 24) {
      const direction = drag.current.moved < 0 ? 1 : -1;
      move(direction);
      drag.current.moved = 0;
    }
  }
  function stopDrag() { if (drag.current) { drag.current = null; pulse(); } }

  return <div className={`wheel ${snap ? 'wheel-snap' : ''}`} ref={root} role="spinbutton"
    aria-label={`Letter ${index + 1}`} aria-valuenow={selected} aria-valuetext={value}
    aria-valuemin={0} aria-valuemax={25} tabIndex={disabled ? -1 : 0}
    onKeyDown={event => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowRight') { event.preventDefault(); move(1); }
      if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
      if (event.key === 'Home') { event.preventDefault(); onChange(0); pulse(); }
    }}
    onPointerDown={startDrag} onPointerMove={duringDrag} onPointerUp={stopDrag} onPointerCancel={stopDrag}>
    <div className="wheel-fade wheel-fade-top" />
    <div className="wheel-selection" />
    <div className="wheel-items" aria-hidden="true">
      {[-2, -1, 0, 1, 2].map(offset => <motion.div key={offset} className={`wheel-letter ${offset === 0 ? 'chosen' : ''}`}
        animate={{ y: 0, scale: offset === 0 ? 1 : 0.9 }} transition={{ duration: reduced ? 0 : 0.18 }}
        onClick={() => offset !== 0 && move(offset)}>{ALPHABET[wrap(selected + offset)]}</motion.div>)}
    </div>
    <div className="wheel-fade wheel-fade-bottom" />
  </div>;
}
