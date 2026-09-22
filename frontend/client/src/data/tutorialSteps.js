import { GESTURES, GESTURE_ORDER } from "../gestures/definitions.js";

// Ogni step ha: indice (0-based), chiave del gesto, e oggetto gesto completo.
export const TUTORIAL_STEPS = GESTURE_ORDER.map((key, index) => ({
  index,
  key,
  gesture: GESTURES[key],
}));

//  progress bar
export const TOTAL_STEPS = TUTORIAL_STEPS.length;

// Timing del tutorial
export const TUTORIAL_TIMING = {
  // Frame consecutivi in cui il gesto deve essere rilevato per essere confermato.
  // A ~20-30 fps, 30 frame = circa 1-1.5 secondi.
  CONFIRM_FRAMES: 30,

  // Frame di pausa dopo una conferma, per evitare doppi trigger.
  COOLDOWN_FRAMES: 15,

  // Dopo quanti ms di attesa senza progresso mostriamo un suggerimento.
  HINT_TIMEOUT_MS: 15000,

  // Dopo quanti ms di attesa senza progresso resettiamo il contatore.
  RESET_TIMEOUT_MS: 45000,
};
