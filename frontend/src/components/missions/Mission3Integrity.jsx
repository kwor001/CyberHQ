import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ScanSearch, Database } from 'lucide-react';
import { MissionFrame, MissionSuccess } from '../MissionFrame';
import sound from '../../lib/sound';

const COLORS = ['#00f0ff', '#a855f7', '#e024a5', '#ffb800', '#00e676'];
// Original data grid (12 blocks)
const ORIGINAL = [
  { v: 'A7', c: 0 }, { v: '3F', c: 1 }, { v: '9C', c: 2 }, { v: 'B2', c: 3 },
  { v: '4E', c: 4 }, { v: 'D8', c: 0 }, { v: '1A', c: 1 }, { v: '6B', c: 2 },
  { v: 'F0', c: 3 }, { v: '5C', c: 4 }, { v: '2D', c: 0 }, { v: '8E', c: 1 },
];
// Tampered indices
const TAMPERED_IDX = [2, 6, 9];
const TAMPERED = ORIGINAL.map((cell, i) =>
  TAMPERED_IDX.includes(i) ? { v: cell.v === '9C' ? 'X4' : cell.v === '1A' ? 'Z9' : 'Q1', c: (cell.c + 2) % COLORS.length } : cell
);

export function Mission3Integrity({ completed, onSolved, onContinue, isLast }) {
  const [found, setFound] = useState([]);
  const [wrongCell, setWrongCell] = useState(null);
  const [solved, setSolved] = useState(false);

  const clickCell = (i) => {
    if (solved) return;
    if (TAMPERED_IDX.includes(i)) {
      if (found.includes(i)) return;
      sound.play('success');
      const nf = [...found, i];
      setFound(nf);
      if (nf.length === TAMPERED_IDX.length) {
        setTimeout(() => {
          setSolved(true);
          onSolved(3);
        }, 700);
      }
    } else {
      sound.play('error');
      setWrongCell(i);
      setTimeout(() => setWrongCell(null), 500);
    }
  };

  const Cell = ({ cell, i, clickable }) => {
    const isFound = found.includes(i);
    const isWrong = wrongCell === i;
    return (
      <motion.button
        disabled={!clickable}
        onClick={() => clickable && clickCell(i)}
        animate={isWrong ? { x: [-6, 6, -4, 4, 0] } : {}}
        data-testid={clickable ? `tampered-cell-${i}` : `original-cell-${i}`}
        className="relative rounded-lg flex items-center justify-center aspect-square font-mono2 text-xl md:text-3xl font-black"
        style={{
          background: '#121420',
          border: `2px solid ${isFound ? '#00e676' : isWrong ? '#ff3b5c' : COLORS[cell.c] + '80'}`,
          color: COLORS[cell.c],
          boxShadow: isFound ? '0 0 16px rgba(0,230,118,0.6)' : 'none',
          cursor: clickable ? 'pointer' : 'default',
        }}
      >
        {cell.v}
        {isFound && (
          <CheckCircle2
            size={22}
            className="absolute -top-2 -right-2 text-[#00e676] bg-[#0b0c10] rounded-full"
          />
        )}
      </motion.button>
    );
  };

  return (
    <MissionFrame
      number={3}
      name="INTEGRITY"
      question="Can you detect what changed?"
      completed={completed}
      accent="#00f0ff"
    >
      {solved ? (
        <MissionSuccess name="INTEGRITY" isLast={isLast} onContinue={onContinue} />
      ) : (
        <div className="w-full max-w-6xl flex flex-col items-center gap-4">
          <p className="font-mono2 text-sm md:text-base text-[#94a3b8] tracking-widest text-center">
            THE HACKER SCRAMBLED 3 DATA BLOCKS. TAP THE {TAMPERED_IDX.length} CHANGED BLOCKS IN THE TAMPERED FILE!
          </p>
          <div className="flex items-center gap-2 font-display text-lg md:text-2xl font-black text-[#00e676]">
            <ScanSearch size={26} /> RESTORED: {found.length} / {TAMPERED_IDX.length}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 w-full">
            {/* Original */}
            <div className="panel glow-green p-4 md:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Database className="text-[#00e676]" size={24} />
                <span className="font-display text-lg md:text-2xl font-black text-[#00e676] tracking-wider">
                  ORIGINAL FILE
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 md:gap-3">
                {ORIGINAL.map((cell, i) => (
                  <Cell key={i} cell={cell} i={i} clickable={false} />
                ))}
              </div>
            </div>

            {/* Tampered */}
            <div className="panel glow-red p-4 md:p-6" data-testid="tampered-grid">
              <div className="flex items-center gap-2 mb-4">
                <Database className="text-[#ff3b5c]" size={24} />
                <span className="font-display text-lg md:text-2xl font-black text-[#ff3b5c] tracking-wider">
                  TAMPERED FILE
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 md:gap-3">
                {TAMPERED.map((cell, i) => (
                  <Cell key={i} cell={cell} i={i} clickable />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </MissionFrame>
  );
}
