import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Renders transient glitch flashes and an alarm strobe driven by effect counters.
export function EffectsOverlay({ glitch, alarm }) {
  const [showGlitch, setShowGlitch] = useState(false);
  const [showAlarm, setShowAlarm] = useState(false);

  useEffect(() => {
    if (glitch === 0) return;
    setShowGlitch(true);
    const t = setTimeout(() => setShowGlitch(false), 450);
    return () => clearTimeout(t);
  }, [glitch]);

  useEffect(() => {
    if (alarm === 0) return;
    setShowAlarm(true);
    const t = setTimeout(() => setShowAlarm(false), 1600);
    return () => clearTimeout(t);
  }, [alarm]);

  return (
    <>
      <AnimatePresence>
        {showGlitch && <motion.div key={`g${glitch}`} className="glitch-flash" exit={{ opacity: 0 }} />}
      </AnimatePresence>
      <AnimatePresence>
        {showAlarm && (
          <motion.div
            key={`a${alarm}`}
            className="alarm-strobe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
