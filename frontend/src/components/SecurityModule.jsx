import { motion } from 'framer-motion';
import { Lock, Unlock, ShieldAlert, CheckCircle2, Fingerprint, KeyRound, FileCheck2 } from 'lucide-react';

const ICONS = { 1: Fingerprint, 2: KeyRound, 3: FileCheck2 };

// status: 'secure-locked' | 'breached' | 'restored'
export function SecurityModule({ module, status, index }) {
  const Icon = ICONS[module.id];
  const config = {
    'secure-locked': {
      color: '#00f0ff',
      glow: 'glow-cyan',
      border: 'rgba(0,240,255,0.4)',
      label: 'SECURED',
      LockIcon: Lock,
    },
    breached: {
      color: '#ff3b5c',
      glow: 'glow-red',
      border: 'rgba(255,59,92,0.55)',
      label: 'LOCKED BY HACKER',
      LockIcon: Lock,
    },
    restored: {
      color: '#00e676',
      glow: 'glow-green',
      border: 'rgba(0,230,118,0.55)',
      label: 'RESTORED',
      LockIcon: Unlock,
    },
  }[status];

  const { LockIcon } = config;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 * index, duration: 0.5 }}
      data-testid={`security-module-${module.id}`}
      className={`panel ${config.glow} relative flex flex-col items-center justify-between p-6 md:p-8 h-full`}
      style={{ borderColor: config.border }}
    >
      <div className="w-full flex items-center justify-between">
        <span className="font-mono2 text-xs md:text-sm tracking-widest text-[#94a3b8]">
          MODULE 0{module.id}
        </span>
        {status === 'breached' && (
          <ShieldAlert className="text-[#ff3b5c] pulse-dot" size={22} />
        )}
        {status === 'restored' && <CheckCircle2 className="text-[#00e676]" size={22} />}
      </div>

      <div className="flex flex-col items-center gap-4 py-4">
        <Icon size={54} style={{ color: config.color }} strokeWidth={1.5} className="opacity-90" />
        <h3
          className="font-display text-2xl md:text-4xl font-black tracking-wider"
          style={{ color: config.color, textShadow: `0 0 18px ${config.color}` }}
        >
          {module.name}
        </h3>
      </div>

      <motion.div
        animate={status === 'breached' ? { rotate: [0, -8, 8, 0] } : {}}
        transition={{ repeat: status === 'breached' ? Infinity : 0, duration: 2 }}
        className="flex flex-col items-center gap-2"
      >
        <LockIcon size={40} style={{ color: config.color }} />
        <span
          className="font-mono2 text-[11px] md:text-sm tracking-widest font-bold"
          style={{ color: config.color }}
        >
          {config.label}
        </span>
      </motion.div>
    </motion.div>
  );
}
