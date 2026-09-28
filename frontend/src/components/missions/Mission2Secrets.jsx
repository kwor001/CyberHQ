import { useState } from 'react';
import { motion } from 'framer-motion';
import { Delete, Unlock, KeyRound, Vault } from 'lucide-react';
import { MissionFrame, MissionSuccess } from '../MissionFrame';
import sound from '../../lib/sound';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const ANSWER = 'CYBER';
const CODE = ANSWER.split('').map((c) => ALPHABET.indexOf(c) + 1);

export function Mission2Secrets({ completed, onSolved, onContinue, isLast }) {
  const [guess, setGuess] = useState([]);
  const [wrong, setWrong] = useState(false);
  const [solved, setSolved] = useState(false);

  const addLetter = (l) => {
    if (guess.length >= ANSWER.length) return;
    sound.play('blip');
    setWrong(false);
    setGuess((g) => [...g, l]);
  };
  const back = () => {
    sound.play('click');
    setGuess((g) => g.slice(0, -1));
  };
  const submit = () => {
    if (guess.join('') === ANSWER) {
      sound.play('success');
      setSolved(true);
      onSolved(2);
    } else {
      sound.play('error');
      setWrong(true);
      setTimeout(() => {
        setWrong(false);
        setGuess([]);
      }, 1200);
    }
  };

  return (
    <MissionFrame
      number={2}
      name="SECRETS"
      question="Can you crack the secret code?"
      completed={completed}
      accent="#e024a5"
    >
      {solved ? (
        <MissionSuccess name="SECRETS" isLast={isLast} onContinue={onContinue} />
      ) : (
        <div className="w-full max-w-5xl flex flex-col items-center gap-4 md:gap-5">
          <p className="font-mono2 text-sm md:text-base text-[#94a3b8] tracking-widest text-center">
            THE HACKER LOCKED THE VAULT WITH A SECRET WORD. USE THE DECODER RING!
          </p>

          {/* Coded message */}
          <div className="panel glow-magenta flex items-center gap-3 md:gap-5 px-5 md:px-8 py-4" data-testid="secret-code">
            <Vault className="text-[#e024a5]" size={34} />
            {CODE.map((n, i) => (
              <span
                key={i}
                className="font-display text-3xl md:text-5xl font-black text-[#e024a5] text-glow-magenta"
              >
                {n}
                {i < CODE.length - 1 && <span className="text-[#94a3b8] mx-1">-</span>}
              </span>
            ))}
          </div>

          {/* Decoder legend */}
          <div
            className="grid gap-1 md:gap-2 w-full max-w-4xl"
            style={{ gridTemplateColumns: 'repeat(13,minmax(0,1fr))' }}
          >
            {ALPHABET.map((l, i) => (
              <div
                key={l}
                className="flex flex-col items-center rounded-md bg-[#1f2338] border border-[#a855f7]/25 py-1"
              >
                <span className="font-display text-sm md:text-lg font-black text-[#00f0ff]">{l}</span>
                <span className="font-mono2 text-[10px] md:text-xs text-[#94a3b8]">{i + 1}</span>
              </div>
            ))}
          </div>

          {/* Guess display */}
          <motion.div
            animate={wrong ? { x: [-10, 10, -8, 8, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="flex gap-3 md:gap-4"
            data-testid="guess-display"
          >
            {Array.from({ length: ANSWER.length }).map((_, i) => (
              <div
                key={i}
                className="w-12 h-14 md:w-16 md:h-20 rounded-xl border-2 flex items-center justify-center font-display text-3xl md:text-5xl font-black"
                style={{
                  borderColor: wrong ? '#ff3b5c' : guess[i] ? '#00e676' : '#a855f7',
                  color: wrong ? '#ff3b5c' : '#00e676',
                  boxShadow: guess[i] ? '0 0 14px rgba(0,230,118,0.5)' : 'none',
                }}
              >
                {guess[i] || ''}
              </div>
            ))}
          </motion.div>

          {/* Letter picker */}
          <div
            className="grid gap-1.5 md:gap-2 w-full max-w-4xl"
            style={{ gridTemplateColumns: 'repeat(13,minmax(0,1fr))' }}
          >
            {ALPHABET.map((l) => (
              <button
                key={l}
                data-testid={`letter-${l}`}
                onClick={() => addLetter(l)}
                className="cyber-btn rounded-lg bg-[#121420] border border-[#a855f7]/40 py-2 md:py-3 font-display text-lg md:text-2xl font-black text-white hover:bg-[#a855f7] hover:text-[#0b0c10]"
              >
                {l}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-4 md:gap-6 mt-1">
            <button
              data-testid="backspace-btn"
              onClick={back}
              className="cyber-btn flex items-center gap-2 px-6 py-4 rounded-xl bg-[#1f2338] border border-[#a855f7]/40 text-lg md:text-xl font-bold text-[#cbd5e1]"
            >
              <Delete size={26} /> Delete
            </button>
            <button
              data-testid="unlock-vault-btn"
              onClick={submit}
              onMouseEnter={() => sound.play('hover')}
              disabled={guess.length !== ANSWER.length}
              className="cyber-btn glow-magenta flex items-center gap-3 px-10 py-4 rounded-xl text-xl md:text-2xl font-black uppercase text-white disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg,#e024a5,#a855f7)' }}
            >
              <Unlock size={28} /> Unlock Vault
            </button>
          </div>

          {wrong && (
            <p className="font-display text-lg md:text-2xl font-black text-[#ff3b5c] flex items-center gap-2">
              <KeyRound size={24} /> NOT QUITE — CHECK THE DECODER AND TRY AGAIN!
            </p>
          )}
        </div>
      )}
    </MissionFrame>
  );
}
