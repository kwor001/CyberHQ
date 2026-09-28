import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  Lock,
  Unlock,
  KeyRound,
  Gamepad2,
  ShieldQuestion,
} from 'lucide-react';
import { MissionFrame } from '../MissionFrame';
import { HackerBubble } from '../shared/Typewriter';
import sound from '../../lib/sound';

const SCAN_ROWS = [
  { label: 'NAME', value: 'UNKNOWN' },
  { label: 'IDENTITY', value: 'UNVERIFIED' },
  { label: 'TRUST STATUS', value: '⚠️ NOT VERIFIED' },
];

const dots = (label) => '.'.repeat(Math.max(4, 22 - label.length));

export function Mission1Identity({ completed, onSolved, onContinue, isLast }) {
  const [stage, setStage] = useState('intro'); // intro | chat | warning | scan | passed
  const [scanStep, setScanStep] = useState(0);

  // Scan reveal stepping
  useEffect(() => {
    if (stage !== 'scan') return;
    setScanStep(0);
    let i = 0;
    const iv = setInterval(() => {
      i += 1;
      sound.play('scan');
      setScanStep(i);
      if (i >= SCAN_ROWS.length) {
        clearInterval(iv);
        setTimeout(() => {
          sound.play('powerup');
          onSolved(1);
          setStage('passed');
        }, 1400);
      }
    }, 850);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const chooseTrust = () => {
    sound.play('alarm');
    setStage('warning');
  };
  const chooseDont = () => {
    sound.play('reveal');
    setStage('scan');
  };

  return (
    <MissionFrame
      number={1}
      name="IDENTITY CHECK"
      question="People online are not always who they say they are."
      completed={completed}
      accent="#a855f7"
    >
      <AnimatePresence mode="wait">
        {/* INTRO ---------------------------------------------------------- */}
        {stage === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <HackerBubble
              lines={["LET'S SEE HOW EASY", 'YOU ARE TO TRICK...']}
              accent="#a855f7"
              onDone={() => setTimeout(() => setStage('chat'), 900)}
            />
          </motion.div>
        )}

        {/* CHAT ----------------------------------------------------------- */}
        {stage === 'chat' && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-4xl flex flex-col items-center gap-6"
            data-testid="identity-chat"
          >
            <div className="w-full panel glow-purple p-0 overflow-hidden rounded-3xl">
              <div className="flex items-center gap-3 px-6 py-4 bg-[#1f2338] border-b border-[#a855f7]/30">
                <span className="w-11 h-11 rounded-full bg-[#a855f7]/25 grid place-items-center">
                  <Gamepad2 className="text-[#00f0ff]" size={26} />
                </span>
                <div>
                  <p className="font-display text-xl md:text-2xl font-black text-white">🎮 DragonMaster99</p>
                  <p className="font-mono2 text-xs md:text-sm text-[#94a3b8]">NEW MESSAGE · IDENTITY UNKNOWN</p>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <div className="inline-block bg-[#121420] border border-[#00f0ff]/30 rounded-2xl rounded-tl-none px-6 py-5 text-left">
                  <p className="text-white text-xl md:text-3xl font-bold leading-relaxed">
                    Hey! It's me!<br />
                    I'm friends with your brother!<br />
                    What's your name?<br />
                    What school do you go to?
                  </p>
                </div>
              </div>
            </div>

            <p className="font-display text-lg md:text-2xl font-black text-[#00f0ff] tracking-wide text-center">
              CYBER TEAM: CAN WE VERIFY WHO THIS PERSON REALLY IS?
            </p>

            <div className="flex flex-col md:flex-row gap-5 md:gap-8 w-full justify-center">
              <button
                data-testid="choice-trust"
                onClick={chooseTrust}
                onMouseEnter={() => sound.play('hover')}
                className="cyber-btn flex-1 md:flex-none flex items-center justify-center gap-3 px-10 md:px-14 py-7 md:py-9 rounded-3xl text-2xl md:text-4xl font-black uppercase text-[#0b0c10]"
                style={{ background: '#00e676', boxShadow: '0 0 26px rgba(0,230,118,0.55)' }}
              >
                ✅ Trust Them
              </button>
              <button
                data-testid="choice-dont-trust"
                onClick={chooseDont}
                onMouseEnter={() => sound.play('hover')}
                className="cyber-btn flex-1 md:flex-none flex items-center justify-center gap-3 px-10 md:px-14 py-7 md:py-9 rounded-3xl text-2xl md:text-4xl font-black uppercase text-white"
                style={{ background: '#a855f7', boxShadow: '0 0 26px rgba(168,85,247,0.6)' }}
              >
                🛑 Don't Trust Yet
              </button>
            </div>
          </motion.div>
        )}

        {/* WARNING (Trust selected — gentle re-think, no shame) ------------ */}
        {stage === 'warning' && (
          <motion.div
            key="warning"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="panel glow-red text-center p-10 md:p-14 max-w-3xl"
            data-testid="identity-warning"
          >
            <ShieldAlert size={72} className="text-[#ffb800] mx-auto mb-4" />
            <h2 className="font-display text-3xl md:text-5xl font-black text-[#ffb800] tracking-widest">
              ⚠️ SECURITY WARNING
            </h2>
            <p className="font-display text-2xl md:text-4xl font-black text-[#ff3b5c] mt-4 tracking-wide">
              IDENTITY NOT VERIFIED
            </p>
            <p className="text-[#cbd5e1] text-lg md:text-2xl mt-6 leading-relaxed">
              How do we know this person is really who they say they are?
            </p>
            <button
              data-testid="try-again-btn"
              onClick={() => {
                sound.play('click');
                setStage('chat');
              }}
              onMouseEnter={() => sound.play('hover')}
              className="cyber-btn glow-cyan mt-9 inline-flex items-center gap-3 px-12 py-6 rounded-2xl text-xl md:text-3xl font-black uppercase text-[#0b0c10]"
              style={{ background: '#00f0ff' }}
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* SCAN (Don't trust selected) ------------------------------------ */}
        {stage === 'scan' && (
          <motion.div
            key="scan"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="panel glow-cyan w-full max-w-3xl p-8 md:p-12"
            data-testid="identity-scan"
          >
            <p className="font-display text-2xl md:text-4xl font-black text-[#00f0ff] tracking-widest mb-8 flex items-center gap-3">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                className="inline-block"
              >
                <ShieldQuestion size={38} />
              </motion.span>
              CHECKING IDENTITY...
            </p>
            <div className="space-y-4">
              {SCAN_ROWS.map((row, i) => (
                <div
                  key={row.label}
                  className="mono-field flex items-center justify-between text-xl md:text-3xl font-black"
                  style={{ opacity: scanStep > i ? 1 : 0.15, transition: 'opacity 0.3s' }}
                >
                  <span className="text-[#94a3b8]">
                    {row.label} <span className="text-[#3a3f55]">{dots(row.label)}</span>
                  </span>
                  <span className="text-[#ff3b5c]">{scanStep > i ? row.value : '· · ·'}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* PASSED --------------------------------------------------------- */}
        {stage === 'passed' && (
          <motion.div
            key="passed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-4xl flex flex-col items-center gap-5 text-center"
            data-testid="identity-passed"
          >
            <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <ShieldCheck size={70} className="text-[#00e676] mx-auto" />
              <h2 className="font-display text-3xl md:text-5xl font-black text-[#00e676] text-glow-green tracking-wider mt-2">
                CYBER DEFENSE SUCCESSFUL
              </h2>
              <p className="font-display text-xl md:text-3xl font-black text-white mt-2">
                IDENTITY CHECK PASSED ✓
              </p>
            </motion.div>

            {/* Locks */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-6 my-1"
              data-testid="lock-row"
            >
              <Unlock size={54} className="text-[#00e676]" style={{ filter: 'drop-shadow(0 0 12px #00e676)' }} />
              <Lock size={54} className="text-[#ff3b5c]" />
              <Lock size={54} className="text-[#ff3b5c]" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, type: 'spring' }}
              className="flex items-center gap-3 bg-[#ffb800]/15 border border-[#ffb800]/50 rounded-2xl px-6 py-3"
            >
              <KeyRound className="text-[#ffb800]" size={34} />
              <span className="font-display text-xl md:text-3xl font-black text-[#ffb800] tracking-wide">
                🔑 CYBER KEY #1 RECOVERED
              </span>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
              <HackerBubble small lines={['HEY!', "THAT DOESN'T COUNT! 😡"]} accent="#a855f7" testId="hacker-angry" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
              className="panel glow-purple px-8 py-6 max-w-2xl"
              data-testid="cyber-rule-1"
            >
              <p className="font-display text-lg md:text-2xl font-black text-[#a855f7] tracking-widest">CYBER RULE #1</p>
              <p className="font-display text-2xl md:text-4xl font-black text-white mt-1">DON'T JUST TRUST. VERIFY.</p>
              <p className="text-[#cbd5e1] text-base md:text-xl mt-3">
                If something online feels strange or confusing, ask a trusted grown-up.
              </p>
            </motion.div>

            {!isLast && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.3 }}
                data-testid="continue-mission-btn"
                onClick={() => {
                  sound.play('powerup');
                  onContinue();
                }}
                onMouseEnter={() => sound.play('hover')}
                className="cyber-btn glow-magenta inline-flex items-center gap-3 px-12 py-6 rounded-2xl text-xl md:text-3xl font-black uppercase text-white mt-1"
                style={{ background: 'linear-gradient(135deg,#e024a5,#a855f7)' }}
              >
                Continue to Mission 2 <ArrowRight size={30} />
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </MissionFrame>
  );
}
