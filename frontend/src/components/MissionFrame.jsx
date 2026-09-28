import { motion } from 'framer-motion';
import { Lock, Unlock, ArrowRight, PartyPopper } from 'lucide-react';
import { BackgroundFX } from './BackgroundFX';
import sound from '../lib/sound';

export function MissionFrame({ number, name, question, completed, children, accent = '#a855f7' }) {
  return (
    <div className="cyber-app scanlines flex flex-col" data-testid={`mission-${number}`}>
      <BackgroundFX breached />

      {/* HUD */}
      <div className="relative z-10 flex items-center justify-between px-4 md:px-10 pt-5 md:pt-7 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span
              className="font-display text-lg md:text-2xl font-black px-3 py-1 rounded-lg"
              style={{ background: accent, color: '#0b0c10', boxShadow: `0 0 18px ${accent}` }}
            >
              MISSION {number}
            </span>
            <span
              className="font-display text-2xl md:text-4xl font-black tracking-wider"
              style={{ color: accent, textShadow: `0 0 16px ${accent}` }}
            >
              {name}
            </span>
          </div>
          <p className="font-mono2 text-sm md:text-lg text-[#cbd5e1] mt-2 tracking-wide">
            “{question}”
          </p>
        </div>

        <div className="flex gap-2 md:gap-3 shrink-0">
          {completed.map((c, i) =>
            c ? (
              <Unlock key={i} size={30} className="text-[#00e676]" />
            ) : (
              <Lock key={i} size={30} className="text-[#ff3b5c]" />
            )
          )}
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 md:px-8 py-4 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export function MissionSuccess({ name, isLast, onContinue, accent = '#00e676' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      className="panel glow-green text-center p-10 md:p-16 max-w-2xl"
      data-testid="mission-success"
    >
      <PartyPopper size={80} className="text-[#00e676] mx-auto mb-6" />
      <h2 className="font-display text-3xl md:text-5xl font-black text-[#00e676] text-glow-green tracking-wider">
        {name} RESTORED!
      </h2>
      <p className="text-[#cbd5e1] text-lg md:text-2xl mt-4">
        One security lock defeated. Great work, cadets!
      </p>
      {!isLast && (
        <button
          data-testid="continue-mission-btn"
          onClick={() => {
            sound.play('powerup');
            onContinue();
          }}
          onMouseEnter={() => sound.play('hover')}
          className="cyber-btn glow-magenta mt-10 inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-xl md:text-2xl font-black uppercase text-white"
          style={{ background: 'linear-gradient(135deg,#e024a5,#a855f7)' }}
        >
          Next Mission <ArrowRight size={28} />
        </button>
      )}
    </motion.div>
  );
}
