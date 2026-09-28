import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Fingerprint, Search, ShieldCheck, KeyRound, Unlock, AlertTriangle, ArrowRight } from 'lucide-react';
import { MissionFrame } from '../MissionFrame';
import { TypeLines } from '../shared/Typewriter';
import sound from '../../lib/sound';
import hackerMain from '../../assets/hacker_main.png';

const ORIGINAL = { chair: 'BLUE', hash: '7A-91-C4-22', color: '#00a3ff' };
const TAMPERED = { chair: 'RED', hash: '3F-82-B9-17', color: '#ff3b5c' };

export function Mission3Integrity({ completed, onSolved, onFinale, isLast }) {
  const [stage, setStage] = useState('original'); // original | intercept | tampered | investigate | compared | verified
  const [scanning, setScanning] = useState(false);
  const [wrongChoice, setWrongChoice] = useState(false);

  // ORIGINAL -> auto tamper after a read pause, or presenter presses G
  useEffect(() => {
    if (stage !== 'original') return;
    const h = (e) => {
      if (e.key.toLowerCase() === 'g') setStage('intercept');
    };
    window.addEventListener('keydown', h);
    const auto = setTimeout(() => setStage('intercept'), 7000);
    return () => {
      window.removeEventListener('keydown', h);
      clearTimeout(auto);
    };
  }, [stage]);

  useEffect(() => {
    if (stage !== 'intercept') return;
    sound.play('glitch');
    sound.play('boom');
    const t = setTimeout(() => setStage('tampered'), 2900);
    return () => clearTimeout(t);
  }, [stage]);

  const compare = () => {
    sound.play('scan');
    setScanning(true);
    setStage('compared');
    setTimeout(() => {
      sound.play('alarm');
      setScanning(false);
    }, 1600);
  };

  const pickChair = (chair) => {
    if (chair === 'BLUE') {
      sound.play('powerup');
      onSolved(3);
      setStage('verified');
    } else {
      sound.play('error');
      setWrongChoice(true);
      setTimeout(() => setWrongChoice(false), 2600);
    }
  };

  const MessagePanel = ({ data, label, labelColor }) => (
    <div className="panel p-5 md:p-7 rounded-2xl" style={{ borderColor: `${data.color}80` }}>
      <p className="font-mono2 text-sm md:text-base tracking-widest mb-3" style={{ color: labelColor }}>
        {label}
      </p>
      <p className="font-display text-xl md:text-3xl font-black text-white leading-snug">
        FINAL CYBER KEY LOCATION:
        <br />
        UNDER THE <span style={{ color: data.color }}>{data.chair}</span> CHAIR
      </p>
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
        <Fingerprint size={22} style={{ color: data.color }} />
        <span className="font-mono2 text-xs md:text-sm text-[#94a3b8]">DIGITAL FINGERPRINT</span>
        <span className="mono-field font-display text-lg md:text-2xl font-black" style={{ color: data.color }}>
          {data.hash}
        </span>
      </div>
    </div>
  );

  return (
    <MissionFrame
      number={3}
      name="WHO CHANGED THE MESSAGE?"
      question="How can we tell if information was secretly changed?"
      completed={completed}
      accent="#00f0ff"
    >
      <AnimatePresence mode="wait">
        {/* ORIGINAL ----------------------------------------------------- */}
        {stage === 'original' && (
          <motion.div key="orig" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-3xl">
            <div className="flex items-center gap-3 justify-center mb-6">
              <Radio className="text-[#00e676] animate-pulse" size={30} />
              <span className="font-display text-xl md:text-3xl font-black text-[#00e676] tracking-widest">
                📨 SECURE MESSAGE RECEIVED
              </span>
            </div>
            <div className="panel glow-cyan p-8 md:p-10" data-testid="original-message">
              <TypeLines
                lines={['FINAL CYBER KEY LOCATION:', 'UNDER THE BLUE CHAIR']}
                cps={22}
                className="space-y-2"
                lineClassName="font-display text-2xl md:text-4xl font-black text-white"
              />
              <div className="flex items-center gap-2 mt-6 pt-5 border-t border-white/10">
                <Fingerprint size={26} className="text-[#00f0ff]" />
                <span className="font-mono2 text-sm text-[#94a3b8]">DIGITAL FINGERPRINT</span>
                <span className="mono-field font-display text-2xl md:text-3xl font-black text-[#00f0ff]">
                  {ORIGINAL.hash}
                </span>
              </div>
            </div>
            <p className="font-mono2 text-xs text-[#64748b] tracking-widest text-center mt-4">
              PRESENTER: PRESS <span className="text-[#ff3b5c]">G</span> TO LET THE HACKER STRIKE
            </p>
          </motion.div>
        )}

        {/* INTERCEPT ---------------------------------------------------- */}
        {stage === 'intercept' && (
          <motion.div
            key="intercept"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-6"
            data-testid="intercept"
          >
            <div className="glitch-flash" />
            <motion.img
              src={hackerMain}
              alt="Mystery Hacker"
              className="w-40 h-40 md:w-56 md:h-56 rounded-3xl border-2 border-[#ff3b5c] object-cover"
              style={{ boxShadow: '0 0 40px #ff3b5c' }}
              animate={{ x: [-6, 6, -4, 4, 0], opacity: [1, 0.4, 1, 0.5, 1] }}
              transition={{ duration: 0.4, repeat: Infinity }}
            />
            <motion.h2
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 0.3, repeat: Infinity }}
              className="font-display text-3xl md:text-5xl font-black text-[#ff3b5c] glitch-text tracking-widest"
            >
              SIGNAL INTERRUPTED
            </motion.h2>
            <TypeLines
              lines={['INTERCEPTING MESSAGE...', 'MODIFYING...']}
              cps={30}
              className="space-y-1 text-center"
              lineClassName="font-mono2 text-lg md:text-2xl text-[#ffb800] tracking-widest"
            />
          </motion.div>
        )}

        {/* TAMPERED ----------------------------------------------------- */}
        {stage === 'tampered' && (
          <motion.div key="tampered" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-3xl flex flex-col items-center gap-6">
            <div className="panel glow-red p-8 md:p-10 w-full" data-testid="tampered-message">
              <p className="font-display text-2xl md:text-4xl font-black text-white leading-snug">
                FINAL CYBER KEY LOCATION:
                <br />
                UNDER THE <span className="text-[#ff3b5c]">RED</span> CHAIR
              </p>
              <div className="flex items-center gap-2 mt-6 pt-5 border-t border-white/10">
                <Fingerprint size={26} className="text-[#ff3b5c]" />
                <span className="font-mono2 text-sm text-[#94a3b8]">DIGITAL FINGERPRINT</span>
                <span className="mono-field font-display text-2xl md:text-3xl font-black text-[#ff3b5c]">
                  {TAMPERED.hash}
                </span>
              </div>
            </div>
            <p className="font-display text-2xl md:text-4xl font-black text-[#00f0ff] tracking-wide text-center">
              CYBER TEAM... DID SOMETHING CHANGE?
            </p>
            <button
              data-testid="investigate-btn"
              onClick={() => {
                sound.play('reveal');
                setStage('investigate');
              }}
              onMouseEnter={() => sound.play('hover')}
              className="cyber-btn glow-cyan inline-flex items-center gap-3 px-12 py-6 rounded-2xl text-2xl md:text-3xl font-black uppercase text-[#0b0c10]"
              style={{ background: '#00f0ff' }}
            >
              <Search size={32} /> Investigate
            </button>
          </motion.div>
        )}

        {/* INVESTIGATE + COMPARED --------------------------------------- */}
        {(stage === 'investigate' || stage === 'compared') && (
          <motion.div key="invest" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-5xl flex flex-col items-center gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 w-full" data-testid="compare-view">
              <MessagePanel data={ORIGINAL} label="ORIGINAL" labelColor="#00e676" />
              <MessagePanel data={TAMPERED} label="CURRENT" labelColor="#ff3b5c" />
            </div>

            {stage === 'investigate' && (
              <button
                data-testid="compare-fingerprints-btn"
                onClick={compare}
                onMouseEnter={() => sound.play('hover')}
                className="cyber-btn glow-magenta inline-flex items-center gap-3 px-12 py-6 rounded-2xl text-xl md:text-3xl font-black uppercase text-white"
                style={{ background: 'linear-gradient(135deg,#e024a5,#a855f7)' }}
              >
                <Fingerprint size={30} /> Compare Fingerprints
              </button>
            )}

            {stage === 'compared' && scanning && (
              <p className="font-mono2 text-lg md:text-2xl text-[#00f0ff] tracking-widest animate-pulse">
                SCANNING FINGERPRINTS...
              </p>
            )}

            {stage === 'compared' && !scanning && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4 w-full">
                <div className="flex items-center gap-3 bg-[#ff3b5c]/15 border border-[#ff3b5c]/60 rounded-2xl px-6 py-3" data-testid="hash-mismatch">
                  <AlertTriangle className="text-[#ff3b5c]" size={34} />
                  <div className="text-left">
                    <p className="font-display text-xl md:text-3xl font-black text-[#ff3b5c]">🚨 FINGERPRINTS DO NOT MATCH</p>
                    <p className="font-display text-lg md:text-2xl font-black text-white">MESSAGE HAS BEEN CHANGED</p>
                  </div>
                </div>

                <div className="panel glow-cyan px-7 py-5 max-w-2xl text-center">
                  <p className="text-[#cbd5e1] text-base md:text-xl">
                    A <span className="text-[#00f0ff] font-bold">digital fingerprint</span> can help us notice when information changes.
                  </p>
                  <p className="font-display text-lg md:text-2xl font-black text-[#a855f7] tracking-widest mt-3">CYBER WORD: HASH</p>
                  <p className="text-[#94a3b8] text-sm md:text-lg mt-1">"A hash is like a digital fingerprint for information."</p>
                </div>

                <p className="font-display text-xl md:text-3xl font-black text-white tracking-wide mt-1">
                  WHICH MESSAGE SHOULD WE TRUST?
                </p>
                <div className="flex gap-5 md:gap-8">
                  <button
                    data-testid="choice-blue"
                    onClick={() => pickChair('BLUE')}
                    onMouseEnter={() => sound.play('hover')}
                    className="cyber-btn flex items-center gap-3 px-12 py-6 rounded-2xl text-2xl md:text-3xl font-black uppercase text-white"
                    style={{ background: '#00a3ff', boxShadow: '0 0 24px rgba(0,163,255,0.6)' }}
                  >
                    Blue Chair
                  </button>
                  <button
                    data-testid="choice-red"
                    onClick={() => pickChair('RED')}
                    onMouseEnter={() => sound.play('hover')}
                    className="cyber-btn flex items-center gap-3 px-12 py-6 rounded-2xl text-2xl md:text-3xl font-black uppercase text-white"
                    style={{ background: '#ff3b5c', boxShadow: '0 0 24px rgba(255,59,92,0.6)' }}
                  >
                    Red Chair
                  </button>
                </div>
                {wrongChoice && (
                  <p className="font-display text-lg md:text-2xl font-black text-[#ffb800] text-center" data-testid="choice-wrong">
                    HMM — THAT'S THE CHANGED MESSAGE. THE ORIGINAL SAID BLUE!
                  </p>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* VERIFIED ----------------------------------------------------- */}
        {stage === 'verified' && (
          <motion.div key="verified" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-3xl flex flex-col items-center gap-5 text-center" data-testid="integrity-verified">
            <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <ShieldCheck size={72} className="text-[#00e676] mx-auto" />
              <h2 className="font-display text-3xl md:text-5xl font-black text-[#00e676] text-glow-green tracking-wider mt-2">
                INTEGRITY VERIFIED ✓
              </h2>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex items-center gap-6" data-testid="lock-row">
              <Unlock size={54} className="text-[#00e676]" style={{ filter: 'drop-shadow(0 0 12px #00e676)' }} />
              <Unlock size={54} className="text-[#00e676]" style={{ filter: 'drop-shadow(0 0 12px #00e676)' }} />
              <Unlock size={54} className="text-[#00e676]" style={{ filter: 'drop-shadow(0 0 12px #00e676)' }} />
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, type: 'spring' }} className="flex items-center gap-3 bg-[#ffb800]/15 border border-[#ffb800]/50 rounded-2xl px-6 py-3">
              <KeyRound className="text-[#ffb800]" size={34} />
              <span className="font-display text-xl md:text-3xl font-black text-[#ffb800] tracking-wide">🔑 FINAL CYBER KEY LOCATED</span>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="panel glow-cyan px-8 py-6">
              <p className="font-display text-2xl md:text-4xl font-black text-[#00f0ff] tracking-wide">CYBER TEAM...</p>
              <p className="font-display text-3xl md:text-5xl font-black text-white tracking-widest mt-1">GO FIND THE KEY! 🪑</p>
              <p className="text-[#94a3b8] text-sm md:text-lg mt-3">Look under the BLUE chair in the room!</p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              data-testid="start-finale-btn"
              onClick={() => {
                sound.play('powerup');
                onFinale();
              }}
              onMouseEnter={() => sound.play('hover')}
              className="cyber-btn inline-flex items-center gap-3 px-10 py-4 rounded-xl text-base md:text-xl font-black uppercase text-white/70 border-2 border-[#a855f7]/50 bg-[#1f2338] hover:text-white opacity-60 hover:opacity-100 transition-opacity"
            >
              Presenter: Activate Finale <ArrowRight size={22} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </MissionFrame>
  );
}
