import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, RotateCcw, Trophy } from 'lucide-react';
import { BackgroundFX } from './BackgroundFX';
import sound from '../lib/sound';
import hackerDefeated from '../assets/hacker_defeated.png';

const CONFETTI = Array.from({ length: 60 }).map((_, i) => ({
  id: i,
  x: (i * 53) % 100,
  color: ['#00f0ff', '#a855f7', '#e024a5', '#ffb800', '#00e676'][i % 5],
  delay: (i % 12) * 0.12,
  dur: 2 + (i % 5) * 0.4,
}));

export function VictorySequence({ onReset }) {
  useEffect(() => {
    sound.play('victory');
  }, []);

  return (
    <div className="cyber-app scanlines flex flex-col items-center justify-center overflow-hidden" data-testid="victory-sequence">
      <BackgroundFX breached={false} />

      {/* confetti */}
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

      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl">
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          className="flex items-center gap-4 mb-4"
        >
          <Trophy size={56} className="text-[#ffb800]" style={{ filter: 'drop-shadow(0 0 18px #ffb800)' }} />
          <h1 className="font-display text-5xl md:text-7xl font-black tracking-widest text-[#00e676] text-glow-green">
            VICTORY!
          </h1>
          <Trophy size={56} className="text-[#ffb800]" style={{ filter: 'drop-shadow(0 0 18px #ffb800)' }} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-mono2 text-lg md:text-2xl tracking-widest text-[#00f0ff] text-glow-cyan"
        >
          ALL 3 SECURITY MODULES RESTORED
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="relative my-6"
        >
          <div className="absolute -inset-3 rounded-3xl glow-green" />
          <img
            src={hackerDefeated}
            alt="Defeated Mystery Hacker"
            className="relative w-48 h-48 md:w-64 md:h-64 object-cover rounded-3xl border-2 border-[#00e676]"
            data-testid="hacker-defeated"
          />
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#00e676] px-5 py-1 rounded-full font-display text-sm font-black tracking-widest text-[#0b0c10] whitespace-nowrap">
            HACKER DEFEATED!
          </div>
        </motion.div>

        {/* Certificate */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="panel glow-purple px-8 py-6 flex items-center gap-5"
          data-testid="cyber-certificate"
        >
          <Award size={54} className="text-[#a855f7]" />
          <div className="text-left">
            <p className="font-mono2 text-xs md:text-sm text-[#94a3b8] tracking-widest">AWARDED TO</p>
            <p className="font-display text-2xl md:text-4xl font-black text-white tracking-wider">
              CYBER DEFENDERS
            </p>
            <p className="font-mono2 text-xs md:text-sm text-[#00f0ff] tracking-widest">
              CYBER HQ · SYSTEM SECURE · THREATS: 0
            </p>
          </div>
          <ShieldCheck size={54} className="text-[#00e676]" />
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          data-testid="victory-reset-btn"
          onClick={() => {
            sound.play('click');
            onReset();
          }}
          onMouseEnter={() => sound.play('hover')}
          className="cyber-btn mt-8 inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-xl md:text-2xl font-black uppercase text-white glow-cyan"
          style={{ background: 'linear-gradient(135deg,#00f0ff,#a855f7)' }}
        >
          <RotateCcw size={28} /> Reset Cyber HQ
        </motion.button>
      </div>
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
            style={{
              width: 12,
              height: 12,
              background: ['#00f0ff', '#a855f7', '#e024a5', '#ffb800', '#00e676'][i % 5],
            }}
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
