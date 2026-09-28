import { motion } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';

const SHORTCUTS = [
  ['H', 'Trigger hacker intrusion'],
  ['1', 'Jump to Mission 1 — Identity'],
  ['2', 'Jump to Mission 2 — Secrets'],
  ['3', 'Jump to Mission 3 — Integrity'],
  ['G', 'Glitch effect'],
  ['A', 'Alarm / warning effect'],
  ['U', 'Unlock current security lock'],
  ['V', 'Victory animation'],
  ['F', 'Final mission-complete sequence'],
  ['R', 'Reset entire experience'],
  ['P', 'Toggle this help overlay'],
  ['M', 'Mute / unmute sound'],
  ['Enter', 'Begin mission (during intrusion)'],
];

export function PresenterHelp({ onClose, muted }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      data-testid="presenter-help"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="panel glow-purple w-full max-w-3xl p-8 md:p-10 relative"
      >
        <button
          onClick={onClose}
          data-testid="close-help-btn"
          className="absolute top-5 right-5 text-[#94a3b8] hover:text-white transition-colors"
        >
          <X size={30} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <Keyboard className="text-[#00f0ff]" size={34} />
          <h2 className="font-display text-2xl md:text-4xl font-black tracking-wider text-white text-glow-cyan">
            PRESENTER CONTROLS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
          {SHORTCUTS.map(([key, desc]) => (
            <div key={key} className="flex items-center gap-4">
              <kbd className="font-mono2 min-w-[52px] text-center px-3 py-2 rounded-lg bg-[#1f2338] border border-[#a855f7]/50 text-[#a855f7] font-bold text-lg glow-purple">
                {key}
              </kbd>
              <span className="text-[#cbd5e1] text-base md:text-lg">{desc}</span>
            </div>
          ))}
        </div>

        <p className="text-center font-mono2 text-sm text-[#94a3b8] mt-8 tracking-widest">
          SOUND: {muted ? 'MUTED' : 'ON'} · Press P again to hide · This overlay is hidden from the audience
        </p>
      </motion.div>
    </motion.div>
  );
}
