import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Lock, Unlock, KeyRound, ScanLine, Sparkles } from 'lucide-react';
import { MissionFrame } from '../MissionFrame';
import { HackerBubble } from '../shared/Typewriter';
import sound from '../../lib/sound';

const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const STEP = 360 / 26;
const SIZE = 380;
const R_OUT = 168;
const R_IN = 112;

const PUZZLES = {
  easy: { enc: 'FDW', plain: 'CAT', label: 'EASY' },
  medium: { enc: 'KHOOR', plain: 'HELLO', label: 'MEDIUM' },
  challenge: { enc: 'VHFUHW', plain: 'SECRET', label: 'CHALLENGE' },
};

const decodeStr = (enc, shift) =>
  enc
    .split('')
    .map((ch) => ALPHA[(ALPHA.indexOf(ch) - shift + 26) % 26])
    .join('');

function Ring({ letters, radius, rotationDeg, color, fontSize }) {
  return letters.map((l, i) => {
    const theta = i * STEP + rotationDeg;
    return (
      <span
        key={i}
        className="wheel-letter"
        style={{
          transform: `rotate(${theta}deg) translateY(-${radius}px) rotate(${-theta}deg)`,
          fontSize,
          color,
          transition: 'transform 0.22s ease',
        }}
      >
        {l}
      </span>
    );
  });
}

export function Mission2Secrets({ completed, onSolved, isLast }) {
  const [puzzleKey, setPuzzleKey] = useState('medium');
  const [shift, setShift] = useState(0);
  const [stage, setStage] = useState('intro'); // intro | decode | cracked
  const [wrong, setWrong] = useState(false);
  const [flash, setFlash] = useState(false);
  const wheelRef = useRef(null);
  const dragRef = useRef(null);

  const puzzle = PUZZLES[puzzleKey];
  const decoded = decodeStr(puzzle.enc, shift);
  const isCorrect = decoded === puzzle.plain;

  const rotate = (dir) => {
    setWrong(false);
    sound.play('blip');
    setShift((s) => (((s + dir) % 26) + 26) % 26);
  };

  // Keyboard arrows rotate the wheel during decode stage.
  useEffect(() => {
    if (stage !== 'decode') return;
    const h = (e) => {
      if (e.key === 'ArrowLeft') rotate(-1);
      else if (e.key === 'ArrowRight') rotate(1);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const angleFromCenter = (e) => {
    const r = wheelRef.current.getBoundingClientRect();
    return (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI;
  };
  const onDown = (e) => {
    dragRef.current = { a: angleFromCenter(e), s: shift };
  };
  const onMove = (e) => {
    if (!dragRef.current) return;
    const delta = angleFromCenter(e) - dragRef.current.a;
    const ns = ((Math.round(dragRef.current.s + delta / STEP) % 26) + 26) % 26;
    if (ns !== shift) {
      sound.play('blip');
      setWrong(false);
      setShift(ns);
    }
  };
  const onUp = () => (dragRef.current = null);

  const check = () => {
    if (isCorrect) {
      sound.play('powerup');
      setFlash(true);
      setTimeout(() => setFlash(false), 500);
      onSolved(2);
      setStage('cracked');
    } else {
      sound.play('error');
      setWrong(true);
      setTimeout(() => setWrong(false), 1800);
    }
  };

  const pickPuzzle = (k) => {
    sound.play('click');
    setPuzzleKey(k);
    setShift(0);
    setWrong(false);
    setStage('decode');
  };

  return (
    <MissionFrame
      number={2}
      name="CRACK THE SECRET CODE"
      question="How can we protect — and uncover — secret information?"
      completed={completed}
      accent="#e024a5"
    >
      {flash && <div className="fixed inset-0 z-[65] bg-white/70 pointer-events-none" />}

      <AnimatePresence mode="wait">
        {/* INTRO -------------------------------------------------------- */}
        {stage === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-8">
            <HackerBubble
              lines={['YOU GOT LUCKY.', "BUT YOU'LL NEVER READ THIS."]}
              accent="#e024a5"
              onDone={() => setTimeout(() => setStage('decode'), 900)}
            />
          </motion.div>
        )}

        {/* DECODE ------------------------------------------------------- */}
        {stage === 'decode' && (
          <motion.div
            key="decode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-6xl flex flex-col items-center gap-3"
            data-testid="cipher-decoder"
          >
            {/* Encrypted message */}
            <div className="flex flex-col items-center gap-1">
              <span className="font-mono2 text-sm md:text-base text-[#e024a5] tracking-widest flex items-center gap-2">
                🔐 ENCRYPTED MESSAGE DETECTED · CYBER TEAM: CRACK THE CODE
              </span>
              <div className="flex items-center gap-2 md:gap-3" data-testid="encrypted-message">
                {puzzle.enc.split('').map((c, i) => (
                  <span
                    key={i}
                    className="font-display text-4xl md:text-6xl font-black text-[#e024a5] text-glow-magenta"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
              {/* Wheel */}
              <div className="flex items-center gap-3">
                <button
                  data-testid="rotate-left-btn"
                  onClick={() => rotate(-1)}
                  className="cyber-btn w-16 h-16 md:w-20 md:h-20 rounded-full grid place-items-center bg-[#1f2338] border-2 border-[#00f0ff]/60 text-[#00f0ff]"
                >
                  <ChevronLeft size={44} />
                </button>

                <div
                  ref={wheelRef}
                  onPointerDown={onDown}
                  onPointerMove={onMove}
                  onPointerUp={onUp}
                  onPointerLeave={onUp}
                  className="wheel-wrap select-none cursor-grab active:cursor-grabbing"
                  style={{ width: SIZE, height: SIZE, touchAction: 'none' }}
                  data-testid="cipher-wheel"
                >
                  <div className="wheel-marker" />
                  {/* outer ring plate */}
                  <div
                    className="wheel-ring"
                    style={{ width: R_OUT * 2 + 44, height: R_OUT * 2 + 44, background: 'radial-gradient(circle,#15172a 60%,#1f2338 61%)', border: '2px solid rgba(224,36,165,0.5)' }}
                  />
                  <div
                    className="wheel-ring"
                    style={{ width: R_IN * 2 + 40, height: R_IN * 2 + 40, background: '#0b0c10', border: '2px solid rgba(0,240,255,0.5)' }}
                  />
                  <Ring letters={ALPHA} radius={R_OUT} rotationDeg={0} color="#e024a5" fontSize={22} />
                  <Ring letters={ALPHA} radius={R_IN} rotationDeg={shift * STEP} color="#00f0ff" fontSize={20} />
                  <div className="absolute grid place-items-center text-center">
                    <span className="font-mono2 text-xs text-[#94a3b8]">SHIFT</span>
                    <span className="font-display text-3xl md:text-4xl font-black text-white">{shift}</span>
                  </div>
                </div>

                <button
                  data-testid="rotate-right-btn"
                  onClick={() => rotate(1)}
                  className="cyber-btn w-16 h-16 md:w-20 md:h-20 rounded-full grid place-items-center bg-[#1f2338] border-2 border-[#00f0ff]/60 text-[#00f0ff]"
                >
                  <ChevronRight size={44} />
                </button>
              </div>

              {/* Live decode + check */}
              <div className="flex flex-col items-center gap-4">
                <span className="font-mono2 text-sm text-[#94a3b8] tracking-widest">DECODED MESSAGE</span>
                <motion.div
                  animate={wrong ? { x: [-10, 10, -8, 8, 0] } : {}}
                  className="flex items-center gap-2"
                  data-testid="decoded-message"
                >
                  {decoded.split('').map((c, i) => (
                    <span
                      key={i}
                      className="w-11 md:w-14 h-14 md:h-20 grid place-items-center rounded-xl border-2 font-display text-3xl md:text-5xl font-black"
                      style={{
                        borderColor: isCorrect ? '#00e676' : '#00f0ff',
                        color: isCorrect ? '#00e676' : '#00f0ff',
                        boxShadow: isCorrect ? '0 0 16px rgba(0,230,118,0.6)' : 'none',
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </motion.div>
                <p className="font-mono2 text-xs text-[#94a3b8] text-center max-w-[240px]">
                  Rotate the wheel with the arrows, drag, or ← → keys until the message makes sense.
                </p>
                <button
                  data-testid="check-code-btn"
                  onClick={check}
                  onMouseEnter={() => sound.play('hover')}
                  className="cyber-btn glow-magenta inline-flex items-center gap-3 px-12 py-5 rounded-2xl text-2xl md:text-3xl font-black uppercase text-white"
                  style={{ background: 'linear-gradient(135deg,#e024a5,#a855f7)' }}
                >
                  <ScanLine size={30} /> Check Code
                </button>
                {wrong && (
                  <p className="font-display text-lg md:text-2xl font-black text-[#ffb800] text-center" data-testid="cipher-wrong">
                    CODE DOESN'T MAKE SENSE YET... KEEP DECODING!
                  </p>
                )}
              </div>
            </div>

            {/* Hidden presenter puzzle selector */}
            <div className="flex items-center gap-2 mt-1 opacity-40 hover:opacity-100 transition-opacity">
              <span className="font-mono2 text-[10px] text-[#64748b] tracking-widest">PRESENTER:</span>
              {Object.entries(PUZZLES).map(([k, p]) => (
                <button
                  key={k}
                  data-testid={`puzzle-${k}`}
                  onClick={() => pickPuzzle(k)}
                  className={`font-mono2 text-[10px] md:text-xs px-2.5 py-1 rounded-md border ${
                    puzzleKey === k
                      ? 'bg-[#e024a5] text-[#0b0c10] border-[#e024a5]'
                      : 'text-[#94a3b8] border-[#3a3f55] hover:border-[#e024a5]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* CRACKED ------------------------------------------------------ */}
        {stage === 'cracked' && (
          <motion.div
            key="cracked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-4xl flex flex-col items-center gap-4 text-center"
            data-testid="cipher-cracked"
          >
            <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <h2 className="font-display text-4xl md:text-6xl font-black text-[#00e676] text-glow-green tracking-widest">
                CODE CRACKED
              </h2>
              <div className="flex items-center justify-center gap-4 mt-3 font-display font-black">
                <span className="text-3xl md:text-5xl text-[#e024a5]">{puzzle.enc}</span>
                <span className="text-2xl md:text-4xl text-[#94a3b8]">↓</span>
                <span className="text-3xl md:text-5xl text-[#00e676]">{puzzle.plain}</span>
              </div>
              <p className="font-display text-xl md:text-3xl font-black text-[#00f0ff] mt-3 flex items-center justify-center gap-2">
                <Sparkles size={28} /> DECRYPTION SUCCESSFUL <Sparkles size={28} />
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-6 my-1"
              data-testid="lock-row"
            >
              <Unlock size={54} className="text-[#00e676]" style={{ filter: 'drop-shadow(0 0 12px #00e676)' }} />
              <Unlock size={54} className="text-[#00e676]" style={{ filter: 'drop-shadow(0 0 12px #00e676)' }} />
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
                🔑 CYBER KEY #2 RECOVERED
              </span>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
              <HackerBubble small lines={['WHAT?!', 'HOW DID YOU READ THAT?! 😡']} accent="#e024a5" testId="hacker-angry" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
              className="panel glow-magenta px-8 py-6 max-w-2xl"
              data-testid="cryptanalysis-note"
            >
              <p className="font-display text-lg md:text-2xl font-black text-[#e024a5] tracking-widest">
                YOU JUST USED CRYPTANALYSIS
              </p>
              <p className="text-[#cbd5e1] text-base md:text-xl mt-3 leading-relaxed">
                <span className="text-white font-bold">Cryptography</span> helps protect secret information.{' '}
                <span className="text-white font-bold">Cryptanalysis</span> means trying to figure out a secret code.
              </p>
              {!isLast && (
                <p className="font-mono2 text-xs md:text-sm text-[#64748b] mt-4 tracking-widest">
                  PRESENTER: PRESS <span className="text-[#00f0ff]">3</span> WHEN READY FOR MISSION 3
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MissionFrame>
  );
}
