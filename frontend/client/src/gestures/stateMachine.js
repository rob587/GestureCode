const DEFAULT_OPTIONS = {
  confirmFrames: 30,
  cooldownFrames: 15,
};

export function createGestureStateMachine(options = {}) {
  const { confirmFrames, cooldownFrames } = { ...DEFAULT_OPTIONS, ...options };

  // Stato interno
  let candidate = null;
  let candidateCount = 0;
  let cooldown = 0;
  let state = "idle";

  function update(detectedGestureId) {
    // 1. Se siamo in cooldown, decrementa e ignora tutto
    if (cooldown > 0) {
      cooldown--;
      state = "cooldown";
      return {
        status: "cooldown",
        cooldownRemaining: cooldown,
      };
    }

    // 2. Se non viene rilevato nessun gesto, reset del candidato
    if (detectedGestureId === null || detectedGestureId === undefined) {
      candidate = null;
      candidateCount = 0;
      state = "idle";
      return { status: "idle" };
    }

    // 3. Se il gesto rilevato è lo stesso del candidato, incrementa
    if (detectedGestureId === candidate) {
      candidateCount++;

      //Raggiunta la soglia → confermato
      if (candidateCount >= confirmFrames) {
        const confirmedGesture = candidate;
        candidate = null;
        candidateCount = 0;
        cooldown = cooldownFrames;
        state = "cooldown";
        return {
          status: "confirmed",
          gesture: confirmedGesture,
        };
      }

      //Ancora in corso → in conferma
      state = "candidate";
      return {
        status: "confirming",
        gesture: candidate,
        progress: candidateCount / confirmFrames, // 0..1
        framesRemaining: confirmFrames - candidateCount,
      };
    }

    // 4. Nuovo gesto diverso dal candidato → riparte il conteggio
    candidate = detectedGestureId;
    candidateCount = 1;
    state = "candidate";
    return {
      status: "confirming",
      gesture: candidate,
      progress: 1 / confirmFrames,
      framesRemaining: confirmFrames - 1,
    };
  }

  function reset() {
    candidate = null;
    candidateCount = 0;
    cooldown = 0;
    state = "idle";
  }

  function getState() {
    return {
      state,
      candidate,
      candidateCount,
      cooldownRemaining: cooldown,
      progress: candidate ? candidateCount / confirmFrames : 0,
    };
  }

  return { update, reset, getState };
}
