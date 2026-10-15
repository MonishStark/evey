import React, { useCallback, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import LetterWheel from './LetterWheel.jsx';

const HINTS = [
  'Four letters unlock this heart 💗',
  'It starts with the letter E 👀',
  'The first and third letters are the same.',
  'It ends with a Y ❤️',
  'Think of the name I call u, baby.'
];

export default function LetterLock({ onUnlock }) {
  const [letters, setLetters] = useState([0, 0, 0, 0]);
  const [attempts, setAttempts] = useState(0);
  const [hintOrder, setHintOrder] = useState([]);
  const [hintIndex, setHintIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [shaking, setShaking] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const reduced = useReducedMotion();
  const updateLetter = useCallback((index, value) => {
    setLetters(current => current.map((letter, i) => i === index ? value : letter));
  }, []);

  function submit() {
    if (unlocking) return;
    if (letters.map(n => String.fromCharCode(65 + n)).join('') === 'EVEY') {
      setUnlocking(true);
      window.setTimeout(onUnlock, reduced ? 300 : 950);
      return;
    }
    const next = attempts + 1;
    setAttempts(next);
    setMessage('Nope, try again 🤭');
    setShaking(true);
    window.setTimeout(() => setShaking(false), reduced ? 0 : 500);
    if (next > 3) {
      let order = hintOrder;
      let index = hintIndex;
      if (!order.length || index >= order.length) {
        order = HINTS.map((_, i) => i).sort(() => Math.random() - 0.5);
        setHintOrder(order);
        index = 0;
      }
      setHintIndex(index + 1);
      setMessage(HINTS[order[index]]);
    }
  }

  return <motion.main className="stage lock-stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -12 }}>
    <motion.div className="lock-card" animate={unlocking ? { scale: [1, 1.04, 0.97, 1.08], rotate: [0, -2, 2, 0] } : shaking ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }} transition={{ duration: reduced ? 0 : unlocking ? 0.8 : 0.42 }}>
      <div className="lock-icon" aria-hidden="true">{unlocking ? '🔓' : '🔒'}</div>
      <h1>Unlock my heart <span aria-hidden="true">❤️</span></h1>
      <div className="wheels" aria-label="Four letter combination">
        {letters.map((letter, i) => <LetterWheel key={i} index={i} value={String.fromCharCode(65 + letter)} onChange={value => updateLetter(i, value)} disabled={unlocking} />)}
      </div>
      <button className="primary-button unlock-button" onClick={submit} disabled={unlocking}>Unlock 🔓</button>
      <div className="message-slot" aria-live="polite" aria-atomic="true">
        <AnimatePresence mode="wait"><motion.p key={message} className={`lock-message ${attempts > 3 ? 'hint-message' : ''}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: reduced ? 0 : 0.2 }}>{message}</motion.p></AnimatePresence>
      </div>
    </motion.div>
  </motion.main>;
}
