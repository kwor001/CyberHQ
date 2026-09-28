import { motion } from 'framer-motion';
import { ShieldCheck, Volume2 } from 'lucide-react';
import sound from '../lib/sound';

export function FullscreenLauncher({ onEnter }) {
  const handleEnter = () => {
    // Advance immediately — never let audio/fullscreen APIs block entry.
    onEnter();
    try {
      sound.init();
      sound.resume();
      sound.play('powerup');
    } catch (e) {
      /* audio optional */
    }
    try {
      const el = document.documentElement;
      const req = el.requestFullscreen || el.webkitRequestFullscreen;
      if (req) {
        const p = req.call(el);
        if (p && p.catch) p.catch(() => {});
      }
    } catch (e) {
      /* fullscreen optional */
    }
  };

  return (
    <div className="cyber-app scanlines flex items-center justify-center" data-testid="fullscreen-launcher">
      <div className="cyber-grid" style={{ opacity: 0.5 }} />
      <div className="vignette" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="panel glow-purple relative z-10 px-10 py-14 md:px-20 md:py-20 text-center max-w-3xl mx-4"
      >
        <motion.div
          animate={{ rotate: [0, 6, -6, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          className="flex justify-center mb-6"
        >
          <ShieldCheck size={96} className="text-[#00f0ff] text-glow-cyan" strokeWidth={1.5} />
        </motion.div>
        <h1 className="font-display text-5xl md:text-7xl font-black tracking-widest text-white text-glow-purple">
          CYBER HQ
        </h1>
        <p className="font-mono2 text-base md:text-xl text-[#94a3b8] tracking-[0.35em] mt-4 uppercase">
          Cyber Defense System
        </p>

        <button
          data-testid="enter-fullscreen-btn"
          onClick={handleEnter}
          onMouseEnter={() => sound.play('hover')}
          className="cyber-btn glow-magenta mt-12 w-full md:w-auto px-12 py-6 rounded-2xl text-2xl md:text-3xl font-black uppercase text-white"
          style={{ background: 'linear-gradient(135deg,#e024a5,#a855f7)' }}
        >
          Enter Cyber HQ
        </button>

        <p className="flex items-center justify-center gap-2 text-[#94a3b8] text-sm md:text-base mt-8 font-mono2">
          <Volume2 size={18} /> Tap to launch full-screen with sound
        </p>
      </motion.div>
    </div>
  );
}
