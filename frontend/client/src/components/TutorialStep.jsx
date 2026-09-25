export function TutorialStep({
  currentStep,
  stepIndex,
  totalSteps,
  isCompleted,
  isHintVisible,
  isCorrectGesture,
  progress,
}) {
  if (isCompleted) {
    return (
      <div style={styles.container}>
        <div style={styles.completedBox}>
          <div style={styles.completedEmoji}>🎉</div>
          <div style={styles.completedTitle}>Tutorial completato!</div>
          <div style={styles.completedText}>
            Hai imparato tutti i {totalSteps} gesti. Ora puoi passare alla
            dashboard.
          </div>
        </div>
      </div>
    );
  }

  if (!currentStep) return null;

  const { gesture } = currentStep;

  return (
    <div style={styles.container}>
      {/* Progress step (3/6) */}
      <div style={styles.stepCounter}>
        Step <strong>{stepIndex + 1}</strong> / {totalSteps}
      </div>

      <div
        style={{
          ...styles.gestureEmoji,
          transform: isCorrectGesture ? "scale(1.15)" : "scale(1)",
          filter: isCorrectGesture
            ? "drop-shadow(0 0 24px rgba(74, 222, 128, 0.8))"
            : "drop-shadow(0 0 8px rgba(255,255,255,0.1))",
        }}
      >
        {gesture.emoji}
      </div>

      <div style={styles.gestureLabel}>{gesture.label}</div>

      <div
        style={{
          ...styles.hint,
          opacity: isHintVisible ? 1 : 0.7,
        }}
      >
        {gesture.hint}
      </div>

      <div style={styles.confirmWrapper}>
        <div style={styles.confirmBar}>
          <div
            style={{
              ...styles.confirmFill,
              width: `${Math.min(progress * 100, 100)}%`,
              background: isCorrectGesture ? "#4ade80" : "#3b82f6",
            }}
          />
        </div>
        <div style={styles.confirmText}>
          {isCorrectGesture
            ? "✅ Gesto corretto!"
            : progress > 0
              ? `Tieni il gesto... ${Math.round(progress * 100)}%`
              : "Fai il gesto davanti alla webcam"}
        </div>
      </div>

      {isHintVisible && !isCorrectGesture && (
        <div style={styles.hintBox}>
          💡 Suggerimento: assicurati che la mano sia ben visibile e ben
          illuminata
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    padding: "24px 16px",
    color: "#e5e7eb",
    textAlign: "center",
    maxWidth: 480,
    margin: "0 auto",
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  },

  stepCounter: {
    fontSize: 13,
    color: "#9ca3af",
    fontFamily: "monospace",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  gestureEmoji: {
    fontSize: 96,
    lineHeight: 1,
    transition: "transform 0.2s, filter 0.2s",
    userSelect: "none",
  },

  gestureLabel: {
    fontSize: 24,
    fontWeight: 700,
    letterSpacing: 0.5,
  },

  hint: {
    fontSize: 14,
    color: "#9ca3af",
    maxWidth: 360,
    lineHeight: 1.5,
    transition: "opacity 0.3s",
  },

  confirmWrapper: {
    width: "100%",
    maxWidth: 360,
    marginTop: 8,
  },

  confirmBar: {
    width: "100%",
    height: 8,
    background: "rgba(255,255,255,0.08)",
    borderRadius: 999,
    overflow: "hidden",
  },

  confirmFill: {
    height: "100%",
    borderRadius: 999,
    transition: "width 0.1s linear, background 0.2s",
  },

  confirmText: {
    marginTop: 8,
    fontSize: 12,
    color: "#9ca3af",
    fontFamily: "monospace",
  },

  hintBox: {
    marginTop: 8,
    padding: "10px 14px",
    background: "rgba(59, 130, 246, 0.12)",
    border: "1px solid rgba(59, 130, 246, 0.3)",
    borderRadius: 8,
    fontSize: 13,
    color: "#93c5fd",
    maxWidth: 360,
  },

  // Completato
  completedBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    padding: 32,
  },
  completedEmoji: {
    fontSize: 72,
    lineHeight: 1,
  },
  completedTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: "#4ade80",
  },
  completedText: {
    fontSize: 14,
    color: "#9ca3af",
    maxWidth: 360,
    lineHeight: 1.5,
  },
};
