import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Radar } from 'lucide-react';
import { MODULES } from '../context/GameContext';
import { SecurityModule } from './SecurityModule';
import { BackgroundFX } from './BackgroundFX';

export function CommandCenter({ completed, intruded }) {
  const threats = intruded ? completed.filter((c) => !c).length : 0;
  const allSecure = !intruded || completed.every(Boolean);

  const statusText = allSecure ? 'SECURE' : 'CRITICAL BREACH';
  const statusColor = allSecure ? '#00e676' : '#ff3b5c';

  const moduleStatus = (i) => {
    if (!intruded) return 'secure-locked';
    return completed[i] ? 'restored' : 'breached';
  };

  return (
    <div className="cyber-app scanlines flex flex-col" data-testid="command-center">
      <BackgroundFX breached={!allSecure} />

      {/* Header */}
      <div className="relative z-10 flex flex-col items-center pt-6 md:pt-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4"
        >
          <Radar className="text-[#a855f7] pulse-dot" size={40} />
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-black tracking-widest text-white text-glow-purple">
            CYBER HQ
          </h1>
          <Radar className="text-[#a855f7] pulse-dot" size={40} />
        </motion.div>
        <p className="font-mono2 text-sm md:text-xl text-[#00f0ff] tracking-[0.4em] mt-2 uppercase text-glow-cyan">
          Cyber Defense System
        </p>
      </div>

      {/* Status bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 md:gap-8 mt-6 px-4">
        <div
          className="panel px-5 py-3 flex items-center gap-3"
          style={{ borderColor: `${statusColor}66` }}
          data-testid="system-status"
        >
          <span
            className="w-3 h-3 rounded-full pulse-dot"
            style={{ background: statusColor, boxShadow: `0 0 12px ${statusColor}` }}
          />
          <span className="font-mono2 text-sm md:text-lg tracking-widest text-[#94a3b8]">
            SYSTEM STATUS:
          </span>
          <span
            className="font-display text-lg md:text-2xl font-black tracking-wider"
            style={{ color: statusColor, textShadow: `0 0 14px ${statusColor}` }}
          >
            {statusText}
          </span>
        </div>

        <div
          className="panel px-5 py-3 flex items-center gap-3"
          style={{ borderColor: threats > 0 ? 'rgba(255,59,92,0.5)' : 'rgba(168,85,247,0.35)' }}
          data-testid="threats-counter"
        >
          <Activity className={threats > 0 ? 'text-[#ff3b5c]' : 'text-[#94a3b8]'} size={22} />
          <span className="font-mono2 text-sm md:text-lg tracking-widest text-[#94a3b8]">
            THREATS DETECTED:
          </span>
          <motion.span
            key={threats}
            initial={{ scale: 1.6 }}
            animate={{ scale: 1 }}
            className="font-display text-2xl md:text-3xl font-black"
            style={{ color: threats > 0 ? '#ff3b5c' : '#00e676' }}
          >
            {threats}
          </motion.span>
        </div>
      </div>

      {/* Modules */}
      <div className="relative z-10 flex-1 flex items-center px-4 md:px-10 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 max-w-7xl mx-auto w-full h-full max-h-[62vh]">
          {MODULES.map((m, i) => (
            <SecurityModule key={m.id} module={m} status={moduleStatus(i)} index={i} />
          ))}
        </div>
      </div>

      {/* Secure indicator footer */}
      <div className="relative z-10 flex justify-center pb-6 md:pb-10 px-4">
        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
          className={`panel px-8 py-4 flex items-center gap-4 ${allSecure ? 'glow-green' : 'glow-red'}`}
          style={{ borderColor: `${statusColor}66` }}
          data-testid="system-secure-indicator"
        >
          <ShieldCheck size={30} style={{ color: statusColor }} />
          <span
            className="font-display text-xl md:text-3xl font-black tracking-[0.2em]"
            style={{ color: statusColor, textShadow: `0 0 16px ${statusColor}` }}
          >
            {allSecure ? 'SYSTEM SECURE' : 'SYSTEM UNDER ATTACK'}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
