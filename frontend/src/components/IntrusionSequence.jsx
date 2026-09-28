import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Lock, Rocket } from 'lucide-react';
import sound from '../lib/sound';
import hackerMain from '../assets/hacker_main.png';

const HACKER_LINES = [
  'HELLO, CYBER TEAM.',
  'I HAVE LOCKED YOUR SYSTEM.',
  'IF YOU WANT IT BACK...',
  "YOU'LL HAVE TO BEAT ME.",
];

// step: 0 warning, 1 hacker typing, 2 locks activating, 3 begin CTA
export function IntrusionSequence({ onBegin }) {
  const [step, setStep] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [locksClosed, setLocksClosed] = useState(0);
  const timers = useRef([]);

  const addTimer = (fn, ms) => {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
    return t;
  };

  useEffect(() => {
    sound.play('alarm');
    sound.play('glitch');
    addTimer(() => {
      sound.play('whoosh');
      setStep(1);
    }, 2200);
    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // typing effect for hacker lines
  useEffect(() => {
    if (step !== 1) return;
    if (lineIdx >= HACKER_LINES.length) {
      addTimer(() => setStep(2), 900);
      return;
    }
    const full = HACKER_LINES[lineIdx];
    let i = 0;
    setTyped('');
    const iv = setInterval(() => {
      i++;
      setTyped(full.slice(0, i));
      if (i % 2 === 0) sound.play('type');
      if (i >= full.length) {
        clearInterval(iv);
        addTimer(() => setLineIdx((n) => n + 1), 550);
      }
    }, 40);
    timers.current.push(iv);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, lineIdx]);

  // locks closing
  useEffect(() => {
    if (step !== 2) return;
    [0, 1, 2].forEach((i) =>
      addTimer(() => {
        sound.play('lock');
        setLocksClosed(i + 1);
      }, 500 + i * 650)
    );
    addTimer(() => setStep(3), 500 + 3 * 650 + 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  return (
    <div className="cyber-app scanlines flex items-center justify-center overflow-hidden" data-testid="intrusion-sequence">
      <div className="cyber-grid" style={{ opacity: 0.3 }} />
      <div className="vignette" />

      <AnimatePresence mode="wait">
        {/* STEP 0 — WARNING */}
        {step === 0 && (
          <motion.div
            key="warn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flicker relative z-10 text-center px-4"
          >
            <AlertTriangle className="text-[#ff3b5c] mx-auto mb-6 pulse-dot" size={110} />
            <h1
              className="glitch font-display text-6xl md:text-8xl font-black tracking-widest text-[#ff3b5c] text-glow-red"
              data-text="WARNING"
            >
              WARNING
            </h1>
            <p className="font-mono2 text-xl md:text-4xl tracking-[0.25em] text-white mt-6">
              UNAUTHORIZED USER DETECTED
            </p>
          </motion.div>
        )}

        {/* STEP 1 — HACKER TYPING */}
        {step === 1 && (
          <motion.div
            key="hacker"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-14 px-6 max-w-6xl"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="relative shrink-0"
            >
              <div className="absolute -inset-3 rounded-3xl glow-magenta" />
              <img
                src={hackerMain}
                alt="Mystery Hacker"
                className="relative w-56 h-56 md:w-80 md:h-80 object-cover rounded-3xl border-2 border-[#e024a5]"
                data-testid="hacker-avatar"
              />
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#e024a5] px-4 py-1 rounded-full font-display text-xs md:text-sm font-black tracking-widest text-white glow-magenta">
                MYSTERY HACKER
              </div>
            </motion.div>

            <div className="panel glow-purple p-6 md:p-10 min-h-[220px] md:min-w-[520px] flex flex-col justify-center">
              {HACKER_LINES.slice(0, lineIdx).map((l) => (
                <p
                  key={l}
                  className="font-display text-xl md:text-4xl font-black text-[#a855f7] text-glow-purple mb-3 leading-tight"
                >
                  {l}
                </p>
              ))}
              {lineIdx < HACKER_LINES.length && (
                <p className="font-display text-xl md:text-4xl font-black text-white blink-caret leading-tight">
                  {typed}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* STEP 2/3 — LOCKS ACTIVATED + CTA */}
        {(step === 2 || step === 3) && (
          <motion.div
            key="locks"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 text-center px-4"
          >
            <div className="flex items-center justify-center gap-6 md:gap-14 mb-10">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.4, opacity: 0.3, rotate: -20 }}
                  animate={
                    locksClosed > i
                      ? { scale: 1, opacity: 1, rotate: 0 }
                      : { scale: 0.5, opacity: 0.3 }
                  }
                  transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                >
                  <Lock
                    size={90}
                    className={locksClosed > i ? 'text-[#ff3b5c]' : 'text-[#3a3f55]'}
                    style={locksClosed > i ? { filter: 'drop-shadow(0 0 20px #ff3b5c)' } : {}}
                  />
                </motion.div>
              ))}
            </div>

            <AnimatePresence>
              {locksClosed === 3 && (
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-display text-3xl md:text-5xl font-black text-[#ff3b5c] text-glow-red tracking-wider"
                >
                  3 SECURITY LOCKS ACTIVATED
                </motion.h2>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {step === 3 && (
                <motion.button
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  data-testid="begin-mission-btn"
                  onClick={() => {
                    sound.play('powerup');
                    onBegin();
                  }}
                  onMouseEnter={() => sound.play('hover')}
                  className="cyber-btn glow-magenta mt-12 inline-flex items-center gap-4 px-12 py-6 rounded-2xl text-2xl md:text-4xl font-black uppercase text-white"
                  style={{ background: 'linear-gradient(135deg,#e024a5,#a855f7)' }}
                >
                  <Rocket size={34} /> Begin Cyber Mission
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
