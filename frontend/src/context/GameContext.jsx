import { createContext, useContext, useReducer } from 'react';

const GameContext = createContext(null);

export const MODULES = [
  { id: 1, name: 'IDENTITY', question: 'Can you tell who to trust?' },
  { id: 2, name: 'SECRETS', question: 'Can you crack the secret code?' },
  { id: 3, name: 'INTEGRITY', question: 'Can you detect what changed?' },
];

const initialState = {
  phase: 'launcher', // launcher | secure | intrusion | mission | victory
  intruded: false,
  currentMission: null, // 1 | 2 | 3
  completed: [false, false, false],
  effects: { glitch: 0, alarm: 0, burst: 0 },
  showHelp: false,
  muted: false,
};

function firstIncomplete(completed, from = 0) {
  for (let i = from; i < completed.length; i++) if (!completed[i]) return i + 1;
  return null;
}

function reducer(state, action) {
  switch (action.type) {
    case 'ENTER':
      return { ...state, phase: 'secure' };

    case 'INTRUDE':
      return {
        ...state,
        phase: 'intrusion',
        intruded: true,
        completed: [false, false, false],
        currentMission: null,
        effects: { ...state.effects, glitch: state.effects.glitch + 1, alarm: state.effects.alarm + 1 },
      };

    case 'BEGIN_MISSIONS':
      return { ...state, phase: 'mission', intruded: true, currentMission: 1 };

    case 'GOTO_MISSION':
      return { ...state, phase: 'mission', intruded: true, currentMission: action.n };

    case 'COMPLETE_MISSION': {
      // Mark the lock as opened. Do NOT auto-advance to the finale —
      // the presenter controls all mission-to-mission and finale transitions.
      const completed = state.completed.slice();
      completed[action.n - 1] = true;
      return { ...state, completed };
    }

    case 'NEXT_MISSION': {
      const next = firstIncomplete(state.completed);
      if (next === null) return state; // stay put; presenter triggers finale with F
      return { ...state, phase: 'mission', currentMission: next };
    }

    case 'FORCE_COMPLETE': {
      const completed = state.completed.slice();
      const n = state.currentMission || firstIncomplete(state.completed) || 1;
      completed[n - 1] = true;
      const next = firstIncomplete(completed);
      return {
        ...state,
        completed,
        phase: 'mission',
        currentMission: next || n,
      };
    }

    case 'GLITCH':
      return { ...state, effects: { ...state.effects, glitch: state.effects.glitch + 1 } };
    case 'ALARM':
      return { ...state, effects: { ...state.effects, alarm: state.effects.alarm + 1 } };
    case 'BURST':
      return { ...state, effects: { ...state.effects, burst: state.effects.burst + 1 } };

    case 'FINAL':
      return {
        ...state,
        completed: [true, true, true],
        phase: 'victory',
        intruded: true,
        effects: { ...state.effects, burst: state.effects.burst + 1 },
      };

    case 'RESET':
      return { ...initialState, phase: 'secure', muted: state.muted };

    case 'TOGGLE_HELP':
      return { ...state, showHelp: !state.showHelp };
    case 'SET_HELP':
      return { ...state, showHelp: action.value };

    case 'TOGGLE_MUTE':
      return { ...state, muted: !state.muted };

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
