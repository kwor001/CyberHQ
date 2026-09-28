import { useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import '@/App.css';
import { GameProvider, useGame } from '@/context/GameContext';
import sound from '@/lib/sound';
import { FullscreenLauncher } from '@/components/FullscreenLauncher';
import { CommandCenter } from '@/components/CommandCenter';
import { IntrusionSequence } from '@/components/IntrusionSequence';
import { EffectsOverlay } from '@/components/EffectsOverlay';
import { PresenterHelp } from '@/components/PresenterHelp';
import { VictorySequence, VictoryBurst } from '@/components/VictorySequence';
import { Mission1Identity } from '@/components/missions/Mission1Identity';
import { Mission2Secrets } from '@/components/missions/Mission2Secrets';
import { Mission3Integrity } from '@/components/missions/Mission3Integrity';

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.45, ease: 'easeInOut' },
};

function Experience() {
  const { state, dispatch } = useGame();
  const { phase, completed, currentMission, intruded, effects, showHelp, muted } = state;

  useEffect(() => {
    sound.setMuted(muted);
  }, [muted]);

  // prevent accidental scrolling with space / arrow keys
  useEffect(() => {
    const stop = (e) => {
      if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown'].includes(e.key)) {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', stop, { passive: false });
    return () => window.removeEventListener('keydown', stop);
  }, []);

  const handleKey = useCallback(
    (e) => {
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (phase === 'launcher') return;
      const k = e.key.toLowerCase();
      switch (k) {
        case 'h':
          sound.play('glitch');
          dispatch({ type: 'INTRUDE' });
          break;
        case '1':
          sound.play('whoosh');
          dispatch({ type: 'GOTO_MISSION', n: 1 });
          break;
        case '2':
          sound.play('whoosh');
          dispatch({ type: 'GOTO_MISSION', n: 2 });
          break;
        case '3':
          sound.play('whoosh');
          dispatch({ type: 'GOTO_MISSION', n: 3 });
          break;
        case 'g':
          sound.play('glitch');
          dispatch({ type: 'GLITCH' });
          break;
        case 'a':
          sound.play('alarm');
          dispatch({ type: 'ALARM' });
          break;
        case 'u':
          if (intruded) {
            sound.play('powerup');
            dispatch({ type: 'FORCE_COMPLETE' });
          }
          break;
        case 'v':
          sound.play('success');
          dispatch({ type: 'BURST' });
          break;
        case 'f':
          dispatch({ type: 'FINAL' });
          break;
        case 'r':
          sound.play('whoosh');
          dispatch({ type: 'RESET' });
          break;
        case 'p':
          sound.play('click');
          dispatch({ type: 'TOGGLE_HELP' });
          break;
        case 'm':
          dispatch({ type: 'TOGGLE_MUTE' });
          break;
        case 'enter':
          if (phase === 'intrusion') {
            sound.play('powerup');
            dispatch({ type: 'BEGIN_MISSIONS' });
          }
          break;
        default:
          break;
      }
    },
    [phase, intruded, dispatch]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const isLastMission = (n) => completed.filter((c, i) => i !== n - 1).every(Boolean);
  const onSolved = (n) => {
    sound.play('powerup');
    dispatch({ type: 'COMPLETE_MISSION', n });
  };
  const onContinue = () => dispatch({ type: 'NEXT_MISSION' });
  const onFinale = () => dispatch({ type: 'FINAL' });

  const renderMission = () => {
    const props = { completed, onSolved, onContinue, onFinale, isLast: isLastMission(currentMission) };
    if (currentMission === 1) return <Mission1Identity {...props} />;
    if (currentMission === 2) return <Mission2Secrets {...props} />;
    if (currentMission === 3) return <Mission3Integrity {...props} />;
    return null;
  };

  return (
    <div className="cyber-app">
      <AnimatePresence mode="wait">
        {phase === 'launcher' && (
          <motion.div key="launcher" {...fade}>
            <FullscreenLauncher onEnter={() => dispatch({ type: 'ENTER' })} />
          </motion.div>
        )}
        {phase === 'secure' && (
          <motion.div key="secure" {...fade}>
            <CommandCenter completed={completed} intruded={intruded} />
          </motion.div>
        )}
        {phase === 'intrusion' && (
          <motion.div key="intrusion" {...fade}>
            <IntrusionSequence onBegin={() => dispatch({ type: 'BEGIN_MISSIONS' })} />
          </motion.div>
        )}
        {phase === 'mission' && (
          <motion.div key={`mission-${currentMission}`} {...fade}>
            {renderMission()}
          </motion.div>
        )}
        {phase === 'victory' && (
          <motion.div key="victory" {...fade}>
            <VictorySequence onReset={() => dispatch({ type: 'RESET' })} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global effect layers */}
      <EffectsOverlay glitch={effects.glitch} alarm={effects.alarm} />
      <VictoryBurst trigger={effects.burst} />

      {/* Presenter help */}
      <AnimatePresence>
        {showHelp && (
          <PresenterHelp muted={muted} onClose={() => dispatch({ type: 'SET_HELP', value: false })} />
        )}
      </AnimatePresence>

      {/* Subtle presenter affordance (touch fallback) — intentionally low-key */}
      {phase !== 'launcher' && !showHelp && (
        <button
          data-testid="presenter-help-toggle"
          onClick={() => dispatch({ type: 'TOGGLE_HELP' })}
          className="fixed bottom-3 right-3 z-[75] text-white/20 hover:text-white/70 transition-colors"
          aria-label="Presenter controls"
        >
          <HelpCircle size={26} />
        </button>
      )}
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <Experience />
    </GameProvider>
  );
}

export default App;
