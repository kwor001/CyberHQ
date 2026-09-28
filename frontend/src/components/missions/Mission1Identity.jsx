import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Mail, CheckCircle2, XCircle, ShieldQuestion } from 'lucide-react';
import { MissionFrame, MissionSuccess } from '../MissionFrame';
import sound from '../../lib/sound';

const SCENARIOS = [
  {
    from: 'GAMEZONE_PRIZES',
    text: 'YOU WON a FREE game console! Just type your password here to claim it now!!!',
    trust: false,
    hint: 'Real prizes never ask for your PASSWORD. This is a trick!',
  },
  {
    from: 'CYBER HQ OFFICIAL',
    text: 'Great job today, cadets! Remember: keep your passwords secret and never share them.',
    trust: true,
    hint: 'Good advice with no scary demands — this one is safe to trust.',
  },
  {
    from: 'unknown_sender_x99',
    text: 'URGENT!!! Your account will be DELETED in 5 minutes. Send your password NOW!',
    trust: false,
    hint: 'Scary countdowns that rush you and want your password are a trap.',
  },
  {
    from: 'Sam (your friend)',
    text: 'Hi! Want to team up for the coding club project after school tomorrow?',
    trust: true,
    hint: 'A friendly message that asks for nothing secret — safe to trust.',
  },
  {
    from: 'FREE-ROBUX-4-U',
    text: 'Click this link for 1,000,000 FREE coins!!! No catch!!! Enter your login first.',
    trust: false,
    hint: '“Too good to be true” + asking you to log in = phishing scam.',
  },
];

export function Mission1Identity({ completed, onSolved, onContinue, isLast }) {
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState(null); // {correct, hint}
  const [solved, setSolved] = useState(false);

  const scenario = SCENARIOS[idx];

  const answer = (choice) => {
    if (feedback) return;
    const correct = choice === scenario.trust;
    if (correct) {
      sound.play('success');
      setFeedback({ correct: true, hint: scenario.hint });
      setTimeout(() => {
        setFeedback(null);
        if (idx + 1 >= SCENARIOS.length) {
          setSolved(true);
          onSolved(1);
        } else {
          setIdx((i) => i + 1);
        }
      }, 1500);
    } else {
      sound.play('error');
      setFeedback({ correct: false, hint: scenario.hint });
      setTimeout(() => setFeedback(null), 2200);
    }
  };

  return (
    <MissionFrame
      number={1}
      name="IDENTITY"
      question="Can you tell who to trust?"
      completed={completed}
      accent="#a855f7"
    >
      {solved ? (
        <MissionSuccess name="IDENTITY" isLast={isLast} onContinue={onContinue} />
      ) : (
        <div className="w-full max-w-4xl flex flex-col items-center gap-6">
          {/* progress */}
          <div className="flex gap-2" data-testid="mission1-progress">
            {SCENARIOS.map((_, i) => (
              <span
                key={i}
                className="h-2 w-12 rounded-full"
                style={{ background: i <= idx ? '#a855f7' : '#3a3f55' }}
              />
            ))}
          </div>
          <p className="font-mono2 text-sm md:text-base text-[#94a3b8] tracking-widest">
            MESSAGE {idx + 1} OF {SCENARIOS.length} · TRUST IT OR NOT?
          </p>

          {/* message card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="panel glow-purple w-full p-6 md:p-10"
              data-testid="message-card"
            >
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#a855f7]/25">
                <Mail className="text-[#00f0ff]" size={28} />
                <span className="font-mono2 text-base md:text-xl text-[#00f0ff] tracking-wide">
                  FROM: {scenario.from}
                </span>
              </div>
              <p className="text-white text-2xl md:text-4xl font-bold leading-snug">
                {scenario.text}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* feedback */}
          <div className="h-16 flex items-center">
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className={`flex items-center gap-3 font-display text-xl md:text-3xl font-black ${
                    feedback.correct ? 'text-[#00e676]' : 'text-[#ff3b5c]'
                  }`}
                  data-testid="mission1-feedback"
                >
                  {feedback.correct ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
                  <span>{feedback.correct ? 'CORRECT!' : 'TRY AGAIN!'}</span>
                  <span className="font-body font-medium text-base md:text-xl text-[#cbd5e1] flex items-center gap-2">
                    <ShieldQuestion size={22} /> {feedback.hint}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* choices */}
          <div className="flex gap-6 md:gap-10">
            <button
              data-testid="choice-trust"
              onClick={() => answer(true)}
              onMouseEnter={() => sound.play('hover')}
              className="cyber-btn glow-green flex items-center gap-3 px-10 md:px-14 py-6 rounded-2xl text-2xl md:text-3xl font-black uppercase text-[#0b0c10]"
              style={{ background: '#00e676' }}
            >
              <ThumbsUp size={34} /> Trust
            </button>
            <button
              data-testid="choice-dont-trust"
              onClick={() => answer(false)}
              onMouseEnter={() => sound.play('hover')}
              className="cyber-btn glow-red flex items-center gap-3 px-10 md:px-14 py-6 rounded-2xl text-2xl md:text-3xl font-black uppercase text-white"
              style={{ background: '#ff3b5c' }}
            >
              <ThumbsDown size={34} /> Don't Trust
            </button>
          </div>
        </div>
      )}
    </MissionFrame>
  );
}
