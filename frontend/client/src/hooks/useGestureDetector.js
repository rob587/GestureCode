//
// Uso:
//   const { currentGestureId, confirmedGestureId, progress, reset } = useGestureDetector({
//     landmarksRef,
//     confirmFrames: 30,
//     cooldownFrames: 15,
//   });

import { useEffect, useRef, useState } from "react";
import { detectGesture } from "../gestures/detector.js";
import { createGestureStateMachine } from "../gestures/stateMachine.js";
import { TUTORIAL_TIMING } from "../data/tutorialSteps.js";

// Frequenza di aggiornamento dello state React (per UI)
const UI_UPDATE_INTERVAL_MS = 100; // 10 volte al secondo

export function useGestureDetector({
  landmarksRef,
  enabled = true,
  confirmFrames = TUTORIAL_TIMING.CONFIRM_FRAMES,
  cooldownFrames = TUTORIAL_TIMING.COOLDOWN_FRAMES,
} = {}) {
  // Ref che contiene l'istanza della state machine (creata una volta)
  const stateMachineRef = useRef(null);
  const rafRef = useRef(null);
  const lastUiUpdateRef = useRef(0);

  // Ref per il gesto grezzo corrente (no re-render)
  const currentGestureRef = useRef(null);

  // State React (bassa frequenza, per UI)
  const [currentGestureId, setCurrentGestureId] = useState(null);
  const [confirmedGestureId, setConfirmedGestureId] = useState(null);
  const [progress, setProgress] = useState(0);

  // Init state machine una volta sola
  useEffect(() => {
    stateMachineRef.current = createGestureStateMachine({
      confirmFrames,
      cooldownFrames,
    });
  }, [confirmFrames, cooldownFrames]);

  // Loop di rilevamento
  useEffect(() => {
    if (!enabled) return;
    if (!landmarksRef) return;

    let cancelled = false;

    function loop() {
      if (cancelled) return;
      rafRef.current = requestAnimationFrame(loop);

      const sm = stateMachineRef.current;
      if (!sm) return;

      const landmarks = landmarksRef.current;
      const detected = landmarks ? detectGesture(landmarks) : null;

      // Aggiorna ref (veloce, no re-render)
      currentGestureRef.current = detected;

      // Passa allo state machine
      const result = sm.update(detected);

      // Gesture CONFERMATO → aggiorna state
      if (result.status === "confirmed") {
        setConfirmedGestureId(result.gesture);
      }

      // Aggiorna UI a bassa frequenza
      const now = performance.now();
      if (now - lastUiUpdateRef.current >= UI_UPDATE_INTERVAL_MS) {
        lastUiUpdateRef.current = now;
        setCurrentGestureId(detected);
        setProgress(result.progress || 0);
      }
    }

    loop();

    return () => {
      cancelled = true;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [landmarksRef, enabled]);

  function reset() {
    if (stateMachineRef.current) {
      stateMachineRef.current.reset();
    }
    currentGestureRef.current = null;
    setCurrentGestureId(null);
    setConfirmedGestureId(null);
    setProgress(0);
  }

  return {
    currentGestureRef,
    currentGestureId,
    confirmedGestureId,
    progress,
    reset,
  };
}
