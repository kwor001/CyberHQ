# CYBER HQ: Stop the Mystery Hacker — PRD

## Original Problem Statement
Interactive full-screen web experience for a cybersecurity career-day presentation for kids ages 7–10. A theatrical, presenter-controlled classroom game (NOT a real hacking tool), displayed on a projector — must be extremely readable from the back of the room. Futuristic but kid-friendly cyber command center; playful, not scary. Presenter secretly triggers a Mystery Hacker intrusion, then leads the class through 3 security missions to restore the system.

## User Choices
- Sound: generated in-browser via Web Audio API (offline, no assets).
- Missions: fully playable mini-games for all three.
- Theme: dark charcoal with electric purple/magenta accents.
- Entry: "Enter Fullscreen" start button, then runs fullscreen.

## Architecture
- Pure frontend React app (no accounts, no backend usage, no external APIs). Backend left at template default.
- State machine via `GameContext` (useReducer). Phases: launcher → secure → intrusion → mission → victory.
- Global keyboard handler + phase renderer in `App.js` with framer-motion AnimatePresence transitions.
- Web Audio synth engine `lib/sound.js` (click, alarm, glitch, lock, success, victory, etc.).
- Hacker art (main + defeated) generated and bundled locally in `src/assets/`.
- Fonts: Orbitron / Outfit / JetBrains Mono (Google Fonts, cached after first load; sans-serif fallback).

## Personas
- Presenter (teacher): drives the show with hidden keyboard shortcuts.
- Students 7–10 (audience/participants): watch and solve the missions.

## Core Requirements (static)
- Highly reliable, full-screen, 1920x1080 responsive, large touch-friendly + keyboard controls.
- No personal data, no internet dependency after load where possible, prevent accidental scrolling.
- Extensible mission architecture (each mission is a separate module component).

## Implemented (2026-06)
- Fullscreen launcher (fire-and-forget fullscreen + audio unlock, never blocks entry).
- SECURE command center: CYBER HQ header, CYBER DEFENSE SYSTEM, SYSTEM STATUS: SECURE, THREATS: 0, three modules (IDENTITY/SECRETS/INTEGRITY) with lock icons, SYSTEM SECURE indicator.
- Hacker intrusion cinematic: WARNING/UNAUTHORIZED USER DETECTED, typed hacker messages, three locks closing, "3 SECURITY LOCKS ACTIVATED", BEGIN CYBER MISSION button.
- Mission 1 Identity: trust / don't-trust phishing detector (5 scenarios).
- Mission 2 Secrets: number→letter decoder cipher (answer CYBER) with on-screen keypad.
- Mission 3 Integrity: spot-the-difference between ORIGINAL and TAMPERED data grids (3 cells).
- Per-mission success ("MODULE RESTORED") + lock unlock; full Victory sequence with defeated hacker, confetti, and CYBER DEFENDERS certificate.
- Presenter shortcuts: H,1,2,3,G,A,U,V,F,R,P,M, Enter. Hidden Presenter Help overlay (P).
- Glitch/alarm effect overlays; victory burst.
- Tested: frontend E2E 100% pass (test_reports/iteration_1.json).

## Backlog / Remaining
- P1: Optional self-hosted fonts for guaranteed 100% offline first load.
- P2: Accessibility (aria-live on intrusion messages).
- P2: Additional mission variants / difficulty levels; printable certificate.
- P2: Adjustable intrusion pacing / sound volume presenter controls.

## Next Tasks
- Await presenter feedback after live rehearsal; tune pacing/difficulty if needed.
