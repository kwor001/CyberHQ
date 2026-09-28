import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import sound from '../../lib/sound';
import hackerMain from '../../assets/hacker_main.png';

// Types an array of lines sequentially with a blinking caret.
export function TypeLines({
  lines,
  cps = 26,
  startDelay = 200,
  lineDelay = 550,
  onDone,
  className = '',
  lineClassName = '',
  playSound = true,
}) {
  const [shown, setShown] = useState(lines.map(() => ''));
  const [done, setDone] = useState(false);
  const timers = useRef([]);

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setShown(lines.map(() => ''));
    setDone(false);
    let t = startDelay;
    const step = 1000 / cps;
    lines.forEach((line, li) => {
      for (let ci = 1; ci <= line.length; ci++) {
        const id = setTimeout(() => {
          setShown((prev) => {
            const next = prev.slice();
            next[li] = line.slice(0, ci);
            return next;
          });
          if (playSound && ci % 2 === 0) sound.play('type');
        }, t);
        timers.current.push(id);
        t += step;
      }
      t += lineDelay;
    });
    const doneId = setTimeout(() => {
      setDone(true);
      if (onDone) onDone();
    }, t);
    timers.current.push(doneId);
    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(lines)]);

  const activeLine = shown.findIndex((s, i) => s.length < lines[i].length);

  return (
    <div className={className} data-testid="typed-lines">
      {shown.map((s, i) => (
        <p key={i} className={lineClassName}>
          {s}
          {!done && i === activeLine && <span className="type-caret">▋</span>}
        </p>
      ))}
    </div>
  );
}

// Mystery Hacker avatar + speech, mischievous tone.
export function HackerBubble({ lines, onDone, accent = '#e024a5', small = false, testId = 'hacker-bubble' }) {
  const size = small ? 'w-24 h-24 md:w-36 md:h-36' : 'w-32 h-32 md:w-56 md:h-56';
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-5 md:gap-8 max-w-5xl"
      data-testid={testId}
    >
      <motion.img
        initial={{ scale: 0, rotate: -18 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
        src={hackerMain}
        alt="Mystery Hacker"
        className={`${size} rounded-3xl border-2 object-cover shrink-0`}
        style={{ borderColor: accent, boxShadow: `0 0 34px ${accent}` }}
        data-testid="hacker-avatar"
      />
      <div
        className="panel px-6 md:px-8 py-5 md:py-6 rounded-2xl relative"
        style={{ borderColor: accent, boxShadow: `0 0 22px ${accent}55` }}
      >
        <span
          className="absolute -left-3 top-1/2 -translate-y-1/2 w-4 h-4 rotate-45"
          style={{ background: 'var(--card)', borderLeft: `2px solid ${accent}`, borderBottom: `2px solid ${accent}` }}
        />
        <TypeLines
          lines={lines}
          onDone={onDone}
          className="space-y-1 md:space-y-2"
          lineClassName="font-display text-2xl md:text-4xl font-black text-white glitch-text tracking-wide"
        />
      </div>
    </motion.div>
  );
}
