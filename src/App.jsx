import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import LetterLock from './LetterLock.jsx';
import QuestionScreen from './QuestionScreen.jsx';
import CelebrationScreen from './CelebrationScreen.jsx';

export default function App() {
  const [stage, setStage] = useState(1);
  return <div className={`app-shell stage-${stage}`}>
    <div className="ambient ambient-one" aria-hidden="true" />
    <div className="ambient ambient-two" aria-hidden="true" />
    <AnimatePresence mode="wait">
      {stage === 1 && <LetterLock key="lock" onUnlock={() => setStage(2)} />}
      {stage === 2 && <QuestionScreen key="question" onCelebrate={() => setStage(3)} />}
      {stage === 3 && <CelebrationScreen key="celebration" />}
    </AnimatePresence>
    <Analytics />
  </div>;
}
