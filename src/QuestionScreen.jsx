import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import AnswerButton from './AnswerButton.jsx';

const KEEP_CLEAR = 14;
const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

export default function QuestionScreen({ onCelebrate }) {
  const [flights, setFlights] = useState({ yes: null, no: null });
  const [yesDodges, setYesDodges] = useState(0);
  const [yesSettled, setYesSettled] = useState(false);
  const [message, setMessage] = useState('');
  const [settled, setSettled] = useState(false);
  const flightId = useRef(0);
  const primaryRef = useRef(null);
  const yesRef = useRef(null);
  const noRef = useRef(null);
  const headingRef = useRef(null);
  const heartRef = useRef(null);
  const messageRef = useRef(null);

  function flyButton(kind) {
    const buttonRef = kind === 'yes' ? yesRef : noRef;
    const otherRef = kind === 'yes' ? noRef : yesRef;
    const element = buttonRef.current;
    if (!element) return;

    const current = element.getBoundingClientRect();
    const previous = flights[kind];
    const origin = previous?.origin ?? {
      left: current.left,
      top: current.top,
      width: current.width,
      height: current.height
    };
    const safe = 12;
    const maxLeft = Math.max(safe, window.innerWidth - current.width - safe);
    const maxTop = Math.max(safe, window.innerHeight - current.height - safe);
    const obstacles = [primaryRef.current, otherRef.current, headingRef.current, heartRef.current, messageRef.current]
      .filter(Boolean)
      .map(node => node.getBoundingClientRect());

    let target = null;
    let farthest = -1;
    for (let i = 0; i < 90; i += 1) {
      const candidate = {
        left: safe + Math.random() * Math.max(0, maxLeft - safe),
        top: safe + Math.random() * Math.max(0, maxTop - safe),
        right: 0,
        bottom: 0
      };
      candidate.right = candidate.left + current.width;
      candidate.bottom = candidate.top + current.height;
      const blocked = obstacles.some(rect =>
        candidate.left < rect.right + KEEP_CLEAR && candidate.right > rect.left - KEEP_CLEAR &&
        candidate.top < rect.bottom + KEEP_CLEAR && candidate.bottom > rect.top - KEEP_CLEAR
      );
      if (blocked) continue;
      const distance = Math.hypot(candidate.left - current.left, candidate.top - current.top);
      if (distance > farthest) { target = candidate; farthest = distance; }
    }
    if (!target) return;

    const fromX = current.left - origin.left;
    const fromY = current.top - origin.top;
    const toX = target.left - origin.left;
    const toY = target.top - origin.top;
    const arc = (Math.random() < 0.5 ? -1 : 1) * Math.min(68, window.innerHeight * 0.1);
    const midTop = clamp((current.top + target.top) / 2 + arc, safe, maxTop);
    const fromRotate = previous?.toRotate ?? 0;
    const toRotate = (Math.random() - 0.5) * 16;

    flightId.current += 1;
    setFlights(all => ({ ...all, [kind]: {
      origin,
      fromX,
      fromY,
      midX: ((current.left + target.left) / 2) - origin.left,
      midY: midTop - origin.top,
      toX,
      toY,
      fromRotate,
      midRotate: (fromRotate + toRotate) / 2 + (Math.random() < 0.5 ? -8 : 8),
      toRotate,
      id: flightId.current
    } }));
  }

  function dodgeNo() {
    setMessage('U gonna choose this? 🤨');
    flyButton('no');
  }

  function dodgeYes() {
    if (yesSettled) return;
    const next = yesDodges + 1;
    if (next > 4) {
      setYesSettled(true);
      setMessage('I give up—choose me 🥺❤️');
      return;
    }
    setYesDodges(next);
    setMessage(next === 4 ? 'I give up—choose me 🥺❤️' : 'Only yes? 🤨🤭');
    flyButton('yes');
    if (next === 4) setYesSettled(true);
  }

  function chooseYes() {
    setSettled(true);
    setMessage('Aww, I’ll take it 🤭');
  }

  return <motion.main className="stage question-stage" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
    <section className="question-card">
      <div className="question-heart" ref={heartRef} aria-hidden="true">💗</div>
      <h1 ref={headingRef}>Do u love Monish? <span aria-hidden="true">🤭❤️</span></h1>
      <div className="answers">
        <AnswerButton buttonRef={primaryRef} className="answer-primary" onClick={onCelebrate}>Very much ❤️</AnswerButton>
        <div className="answer-wrap">
          <AnswerButton buttonRef={yesRef} flight={flights.yes} className={flights.yes ? `yes-answer swoosh-${flights.yes.id % 2}` : 'yes-answer'}
            label="Yes 😊" onHoverStart={dodgeYes} onClick={() => yesSettled ? chooseYes() : dodgeYes()}>Yes 😊</AnswerButton>
        </div>
        <div className="answer-wrap">
          <AnswerButton buttonRef={noRef} flight={flights.no} className={flights.no ? `no-answer swoosh-${flights.no.id % 2}` : 'no-answer'}
            label="No 🙈, this button dodges playfully" onHoverStart={dodgeNo} onClick={dodgeNo}>No 🙈</AnswerButton>
        </div>
      </div>
      <div className="question-message-slot" ref={messageRef} aria-live="polite">
        <motion.p key={message} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>{message}</motion.p>
        {settled && <motion.button className="continue-button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onCelebrate}>Continue to my heart ❤️</motion.button>}
      </div>
    </section>
  </motion.main>;
}
