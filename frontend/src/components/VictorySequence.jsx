import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldX, RotateCcw, KeyRound, UserX, Fingerprint, Lock, Search, ArrowRight } from 'lucide-react';
import { BackgroundFX } from './BackgroundFX';
import { TypeLines } from './shared/Typewriter';
import sound from '../lib/sound';
import hackerMain from '../assets/hacker_main.png';

const CONFETTI = Array.from({ length: 70 }).map((_, i) => ({
  id: i,
  x: (i * 47) % 100,
  color: ['#00f0ff', '#a855f7', '#e024a5', '#ffb800', '#00e676'][i % 5],
  delay: (i % 14) * 0.1,
  dur: 2 + (i % 5) * 0.4,
}));

function Bar({ label, value, color }) {
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="font-mono2 text-sm md:text-lg text-[#cbd5e1] tracking-widest">{label}</span>
        <span className="font-display text-sm md:text-lg font-black" style={{ color }}>
          {value}% {value >= 100 ? '✓' : ''}
        </span>
      </div>
      <div className="finale-bar-track">
        <div className="finale-bar-fill" style={{ width: `${value}%`, background: color, boxShadow: `0 0 14px ${color}` }} />
      </div>
    </div>
  );
}

const CHECKS = [
  { name: 'IDENTITY', color: '#a855f7' },
  { name: 'SECRETS', color: '#e024a5' },
  { name: 'INTEGRITY', color: '#00f0ff' },
];

export function VictorySequence({ onReset }) {
  const [stage, setStage] = useState('keys'); // keys|verify|removing|plead|flash|denied|complete|conclusion|welcome
  const [v, setV] = useState([0, 0, 0]);
  const [rem, setRem] = useState(0);
  const [mini, setMini] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const timers = useRef([]);

  const clearAll = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  const at = (ms, fn) => timers.current.push(setTimeout(fn, ms));

  useEffect(() => () => clearAll(), []);

  const activate = () => {
    sound.play('boom');
    sound.play('powerup');
    setStage('verify');
    at(300, () => { sound.play('scan'); setV([100, 0, 0]); });
    at(1000, () => { sound.play('scan'); setV([100, 100, 0]); });
    at(1700, () => { sound.play('scan'); setV([100, 100, 100]); });

    at(2700, () => { setStage('removing'); setRem(10); sound.play('scan'); });
    at(3100, () => { setRem(35); sound.play('scan'); });
    at(3600, () => { setRem(68); sound.play('scan'); });
    at(4100, () => { setRem(92); sound.play('scan'); });
    at(4700, () => { setRem(99); sound.play('alarm'); });

    at(5600, () => { setStage('plead'); sound.play('deny'); });

    at(8400, () => { setStage('flash'); setRem(100); sound.play('glitch'); sound.play('boom'); });
    at(9700, () => { setStage('denied'); sound.play('victory'); });

    at(12200, () => setStage('complete'));

    at(16000, () => { setMini(true); sound.play('type'); });
    at(17400, () => { setMini(false); setBlocked(true); sound.play('block'); });

    at(19500, () => setStage('conclusion'));
  };

  const showConfetti = ['denied', 'complete', 'conclusion', 'welcome'].includes(stage);
  const breached = ['removing', 'plead', 'flash'].includes(stage);

  return (
    <div className="cyber-app scanlines flex flex-col items-center justify-center overflow-hidden" data-testid="victory-sequence">
      <BackgroundFX breached={breached} />

      {(stage === 'flash') && <div className="glitch-flash" />}
      {(stage === 'flash') && <div className="fixed inset-0 z-[66] bg-white/60 pointer-events-none" />}

      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {CONFETTI.map((c) => (
            <motion.span
              key={c.id}
              className="absolute rounded-sm"
              style={{ left: `${c.x}%`, top: '-5%', width: 10, height: 16, background: c.color }}
              initial={{ y: '-10vh', rotate: 0, opacity: 1 }}
              animate={{ y: '110vh', rotate: 720, opacity: [1, 1, 0.7] }}
              transition={{ duration: c.dur, delay: c.delay, repeat: Infinity, ease: 'linear' }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 w-full flex flex-col items-center text-center px-4 max-w-4xl">
        <AnimatePresence mode="wait">
          {/* KEYS + ACTIVATE ------------------------------------------- */}
          {stage === 'keys' && (
            <motion.div key="keys" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-6">
              <h1 className="font-display text-4xl md:text-6xl font-black text-[#ffb800] tracking-widest" style={{ textShadow: '0 0 22px #ffb800' }}>
                ALL CYBER KEYS RECOVERED
              </h1>
              <div className="text-5xl md:text-7xl">🔑 🔑 🔑</div>
              <div className="panel glow-purple px-8 py-6 space-y-2" data-testid="keys-checklist">
                {CHECKS.map((c) => (
                  <div key={c.name} className="flex items-center justify-between gap-10 font-display text-xl md:text-3xl font-black">
                    <span style={{ color: c.color }}>{c.name}</span>
                    <span className="text-[#00e676]">✓</span>
                  </div>
                ))}
              </div>
              <motion.button
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                data-testid="activate-defense-btn"
                onClick={activate}
                onMouseEnter={() => sound.play('hover')}
                className="cyber-btn glow-green inline-flex items-center gap-4 px-14 md:px-20 py-8 md:py-10 rounded-3xl text-3xl md:text-5xl font-black uppercase text-[#0b0c10]"
                style={{ background: '#00e676', boxShadow: '0 0 40px rgba(0,230,118,0.7)' }}
              >
                🛡️ Activate Cyber Defense
              </motion.button>
              <p className="font-mono2 text-sm text-[#94a3b8] tracking-widest">PRESENTER: INVITE A CADET TO PRESS THE BUTTON</p>
            </motion.div>
          )}

          {/* VERIFY ---------------------------------------------------- */}
          {stage === 'verify' && (
            <motion.div key="verify" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-2xl flex flex-col items-center gap-6" data-testid="verify-stage">
              <h2 className="font-display text-2xl md:text-4xl font-black text-[#00f0ff] tracking-widest animate-pulse">
                CYBER DEFENSE INITIALIZING...
              </h2>
              <div className="w-full space-y-5">
                <div className="flex items-center gap-3">
                  <Lock className="text-[#a855f7] shrink-0" size={26} />
                  <div className="flex-1"><Bar label="VERIFYING IDENTITY" value={v[0]} color="#a855f7" /></div>
                </div>
                <div className="flex items-center gap-3">
                  <KeyRound className="text-[#e024a5] shrink-0" size={26} />
                  <div className="flex-1"><Bar label="VERIFYING CRYPTOGRAPHY" value={v[1]} color="#e024a5" /></div>
                </div>
                <div className="flex items-center gap-3">
                  <Fingerprint className="text-[#00f0ff] shrink-0" size={26} />
                  <div className="flex-1"><Bar label="VERIFYING INTEGRITY" value={v[2]} color="#00f0ff" /></div>
                </div>
              </div>
            </motion.div>
          )}

          {/* REMOVING -------------------------------------------------- */}
          {stage === 'removing' && (
            <motion.div key="removing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-2xl flex flex-col items-center gap-6" data-testid="removing-stage">
              <ShieldX className="text-[#ff3b5c]" size={60} />
              <h2 className="font-display text-2xl md:text-4xl font-black text-[#ff3b5c] tracking-widest glitch-text">
                UNAUTHORIZED USER DETECTED
              </h2>
              <p className="font-mono2 text-lg md:text-2xl text-[#ffb800] tracking-widest">REMOVING MYSTERY HACKER...</p>
              <div className="w-full"><Bar label="REMOVAL PROGRESS" value={rem} color="#ff3b5c" /></div>
            </motion.div>
          )}

          {/* PLEAD ----------------------------------------------------- */}
          {stage === 'plead' && (
            <motion.div key="plead" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-6" data-testid="plead-stage">
              <div className="w-full max-w-2xl mb-2"><Bar label="REMOVAL PROGRESS" value={99} color="#ff3b5c" /></div>
              <motion.img
                src={hackerMain}
                alt="Mystery Hacker"
                className="w-40 h-40 md:w-56 md:h-56 rounded-3xl border-2 border-[#e024a5] object-cover"
                style={{ boxShadow: '0 0 40px #e024a5' }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
              <TypeLines
                lines={['WAIT!', 'WAIT WAIT WAIT!', 'WE CAN TALK ABOUT THIS!']}
                cps={26}
                lineDelay={250}
                className="space-y-1"
                lineClassName="font-display text-3xl md:text-5xl font-black text-[#e024a5] glitch-text"
              />
            </motion.div>
          )}

          {/* FLASH (transition — minimal content) ---------------------- */}
          {stage === 'flash' && (
            <motion.div key="flash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-40" />
          )}

          {/* DENIED ---------------------------------------------------- */}
          {stage === 'denied' && (
            <motion.div key="denied" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }} className="flex flex-col items-center gap-4" data-testid="access-denied">
              <div className="text-6xl md:text-8xl">🛡️</div>
              <h1 className="font-display text-5xl md:text-8xl font-black text-[#00e676] text-glow-green tracking-widest">ACCESS DENIED</h1>
              <p className="font-display text-2xl md:text-4xl font-black text-[#00f0ff] tracking-widest">SYSTEM SECURE</p>
            </motion.div>
          )}

          {/* COMPLETE -------------------------------------------------- */}
          {stage === 'complete' && (
            <motion.div key="complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-5" data-testid="mission-complete">
              <h1 className="font-display text-4xl md:text-6xl font-black text-[#ffb800] tracking-widest" style={{ textShadow: '0 0 22px #ffb800' }}>
                🎉 MISSION COMPLETE 🎉
              </h1>
              <p className="font-display text-2xl md:text-4xl font-black text-white tracking-wide">CYBER HQ RESTORED</p>
              <div className="panel glow-green px-8 py-6 space-y-2">
                {CHECKS.map((c) => (
                  <div key={c.name} className="flex items-center justify-between gap-10 font-display text-xl md:text-3xl font-black">
                    <span style={{ color: c.color }}>{c.name}</span>
                    <span className="text-[#00e676]">✓</span>
                  </div>
                ))}
              </div>
              <motion.p initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="font-display text-2xl md:text-4xl font-black text-[#a855f7] tracking-widest mt-2" style={{ textShadow: '0 0 18px #a855f7' }}>
                🏅 CYBER DEFENDERS CERTIFIED
              </motion.p>

              {/* Hacker's final tiny message + block */}
              <div className="h-24 flex items-center justify-center">
                <AnimatePresence>
                  {mini && (
                    <motion.div key="mini" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-3 bg-[#1f2338] border border-[#e024a5]/50 rounded-2xl px-5 py-3">
                      <img src={hackerMain} alt="hacker" className="w-12 h-12 rounded-full object-cover" />
                      <span className="font-display text-xl md:text-3xl font-black text-[#e024a5]">I'LL BE BA—</span>
                    </motion.div>
                  )}
                  {blocked && (
                    <motion.div key="blocked" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-3 bg-[#00e676]/15 border border-[#00e676]/60 rounded-2xl px-6 py-3" data-testid="user-blocked">
                      <UserX className="text-[#00e676]" size={34} />
                      <span className="font-display text-2xl md:text-4xl font-black text-[#00e676] tracking-wide">USER BLOCKED ✓</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* CONCLUSION ------------------------------------------------ */}
          {stage === 'conclusion' && (
            <motion.div key="conclusion" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-6" data-testid="career-conclusion">
              <h2 className="font-display text-2xl md:text-4xl font-black text-[#00f0ff] tracking-wider">
                TODAY YOU USED REAL CYBERSECURITY IDEAS
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
                {[
                  { icon: '🕵️', title: 'IDENTITY', q: 'Can we verify who someone is?', color: '#a855f7' },
                  { icon: '🔐', title: 'CRYPTOGRAPHY', q: 'How can we protect secret information?', color: '#e024a5' },
                  { icon: '🧩', title: 'INTEGRITY', q: 'How can we tell if information was changed?', color: '#00f0ff' },
                ].map((c) => (
                  <div key={c.title} className="panel px-6 py-6 flex flex-col items-center gap-2" style={{ borderColor: `${c.color}70`, boxShadow: `0 0 18px ${c.color}30` }}>
                    <span className="text-5xl">{c.icon}</span>
                    <span className="font-display text-xl md:text-2xl font-black" style={{ color: c.color }}>{c.title}</span>
                    <span className="text-[#cbd5e1] text-sm md:text-base">{c.q}</span>
                  </div>
                ))}
              </div>
              <p className="font-display text-xl md:text-3xl font-black text-white tracking-wide max-w-3xl mt-2">
                CYBERSECURITY IS ABOUT PROTECTING{' '}
                <span className="text-[#00e676]">PEOPLE</span> + <span className="text-[#00f0ff]">INFORMATION</span> +{' '}
                <span className="text-[#a855f7]">TECHNOLOGY</span>
              </p>
              <button
                data-testid="meet-team-btn"
                onClick={() => { sound.play('victory'); setStage('welcome'); }}
                onMouseEnter={() => sound.play('hover')}
                className="cyber-btn glow-cyan inline-flex items-center gap-3 px-12 py-6 rounded-2xl text-xl md:text-3xl font-black uppercase text-[#0b0c10] mt-2"
                style={{ background: '#00f0ff' }}
              >
                Meet the Cyber Team <ArrowRight size={28} />
              </button>
            </motion.div>
          )}

          {/* WELCOME --------------------------------------------------- */}
          {stage === 'welcome' && (
            <motion.div key="welcome" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-8" data-testid="welcome-cyber-team">
              <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="text-7xl md:text-9xl">🛡️</motion.div>
              <h1 className="font-display text-4xl md:text-7xl font-black text-[#00e676] text-glow-green tracking-widest leading-tight">
                WELCOME TO THE<br />CYBER TEAM
              </h1>
              <ShieldCheck size={64} className="text-[#00e676]" />
              <button
                data-testid="victory-reset-btn"
                onClick={() => { sound.play('click'); onReset(); }}
                onMouseEnter={() => sound.play('hover')}
                className="cyber-btn inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-lg md:text-2xl font-black uppercase text-white glow-cyan"
                style={{ background: 'linear-gradient(135deg,#00f0ff,#a855f7)' }}
              >
                <RotateCcw size={26} /> Reset Cyber HQ
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Always-available reset for the presenter once the finale is rolling */}
      {stage !== 'keys' && stage !== 'welcome' && (
        <button
          data-testid="finale-reset-btn"
          onClick={() => { sound.play('click'); onReset(); }}
          className="fixed bottom-3 left-3 z-[75] text-white/20 hover:text-white/70 transition-colors font-mono2 text-xs tracking-widest"
        >
          RESET
        </button>
      )}
    </div>
  );
}

// Quick celebratory burst overlay triggered by the V key (does not change phase).
export function VictoryBurst({ trigger }) {
  if (!trigger) return null;
  return (
    <div key={trigger} className="fixed inset-0 z-[70] pointer-events-none overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => {
        const angle = (i / 40) * Math.PI * 2;
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{ width: 12, height: 12, background: ['#00f0ff', '#a855f7', '#e024a5', '#ffb800', '#00e676'][i % 5] }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(angle) * (window.innerWidth * 0.45),
              y: Math.sin(angle) * (window.innerHeight * 0.45),
              opacity: 0,
              scale: 0.3,
            }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          />
        );
      })}
    </div>
  );
}
