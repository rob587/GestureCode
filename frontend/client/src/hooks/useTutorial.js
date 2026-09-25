// GestureCode — Hook stato del tutorial
// Gestisce l'avanzamento del tutorial guidato.

import { useEffect, useRef, useState } from "react";
import {
  TUTORIAL_STEPS,
  TOTAL_STEPS,
  TUTORIAL_TIMING,
} from "../data/tutorialSteps.js";

export function useTutorial({ confirmedGestureId, enabled = true } = {}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isHintVisible, setIsHintVisible] = useState(false);
  const [isCorrectGesture, setIsCorrectGesture] = useState(false);

  const lastActivityRef = useRef(performance.now());

  const currentStep = TUTORIAL_STEPS[stepIndex] || null;

  // --- Avanzamento step quando il gesto confermato corrisponde ---
  useEffect(() => {
    if (!enabled || isCompleted) return;
    if (!confirmedGestureId || !currentStep) return;

    if (confirmedGestureId === currentStep.gesture.id) {
      setIsCorrectGesture(true);

      const timer = setTimeout(() => {
        setIsCorrectGesture(false);
        setIsHintVisible(false);
        lastActivityRef.current = performance.now();

        if (stepIndex + 1 >= TOTAL_STEPS) {
          setIsCompleted(true);
        } else {
          setStepIndex((i) => i + 1);
        }
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [confirmedGestureId, currentStep, stepIndex, isCompleted, enabled]);

  // --- Hint dopo inattività ---
  useEffect(() => {
    if (!enabled || isCompleted) return;

    const interval = setInterval(() => {
      const elapsed = performance.now() - lastActivityRef.current;

      if (elapsed >= TUTORIAL_TIMING.HINT_TIMEOUT_MS) {
        setIsHintVisible(true);
      }

      if (elapsed >= TUTORIAL_TIMING.RESET_TIMEOUT_MS) {
        lastActivityRef.current = performance.now();
        setIsHintVisible(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [enabled, isCompleted]);

  function reset() {
    setStepIndex(0);
    setIsCompleted(false);
    setIsHintVisible(false);
    setIsCorrectGesture(false);
    lastActivityRef.current = performance.now();
  }

  function restart() {
    reset();
  }

  return {
    currentStep,
    stepIndex,
    totalSteps: TOTAL_STEPS,
    isCompleted,
    isHintVisible,
    isCorrectGesture,
    reset,
    restart,
  };
}
