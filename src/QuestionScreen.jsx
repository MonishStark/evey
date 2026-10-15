import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import AnswerButton from './AnswerButton.jsx';

export default function QuestionScreen({ onCelebrate }) {
  const [yesDodges, setYesDodges] = useState(0);
  const [yesPosition, setYesPosition] = useState({ x: 0, y: 0 });
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [message, setMessage] = useState('');
  const [settled, setSettled] = useState('');
  const noButtonRef = useRef(null);

  function dodgeYes() {
    if (yesDodges >= 3) return;
    const next = yesDodges + 1;
    setYesDodges(next);
    const distance = Math.min(34, window.innerWidth * 0.08);
    setYesPosition({ x: next % 2 ? -distance : distance, y: next % 2 ? 3 : -3 });
    setMessage('Only yes? 🤨🤭');
  }

  function dodgeNo() {
    setMessage('U really wanna choose this? 😭');
    const rect = noButtonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const minX = Math.max(-78 - noPosition.x, 8 - rect.left);
    const maxX = Math.min(78 - noPosition.x, window.innerWidth - 8 - rect.right);
    const delta = (min, max) => min >= max ? 0 : min + Math.random() * (max - min);
    setNoPosition(position => ({ x: position.x + delta(minX, maxX), y: 0 }));
  }
  function chooseAfter(kind) {
    setSettled(kind);
    setMessage(kind === 'yes' ? 'Aww, I’ll take it 🤭' : 'Hehe, I know u do ❤️');
  }

  return <motion.main className="stage question-stage" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
    <section className="question-card">
      <div className="question-heart" aria-hidden="true">💗</div>
      <h1>Do u love Monish? <span aria-hidden="true">🤭❤️</span></h1>
      <div className="answers">
        <AnswerButton className="answer-primary" onClick={onCelebrate}>Very much ❤️</AnswerButton>
        <div className="answer-wrap">
          <AnswerButton x={yesPosition.x} y={yesPosition.y}
            onHoverStart={dodgeYes} onClick={() => yesDodges < 3 ? dodgeYes() : chooseAfter('yes')}>Yes 😊</AnswerButton>
        </div>
        <div className="answer-wrap no-wrap">
          <AnswerButton buttonRef={noButtonRef} x={noPosition.x} y={noPosition.y} label="No 🙈, this button dodges playfully"
            onHoverStart={dodgeNo} onClick={dodgeNo}>No 🙈</AnswerButton>
        </div>
      </div>
      <div className="question-message-slot" aria-live="polite">
        <motion.p key={message} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>{message}</motion.p>
        {settled && <motion.button className="continue-button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onCelebrate}>Continue to my heart ❤️</motion.button>}
      </div>
    </section>
  </motion.main>;
}
