import { GestureAnimation } from "./GestureAnimation.jsx";
import { ProgressBar, StepProgress } from "./ProgressBar.jsx";

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
      <StepProgress current={stepIndex + 1} total={totalSteps} />

      <GestureAnimation gesture={gesture} isCorrect={isCorrectGesture} />

      <div
        style={{
          ...styles.hint,
          opacity: isHintVisible ? 1 : 0.7,
        }}
      >
        {gesture.hint}
      </div>

      {/* Progress bar di conferma */}
      <ProgressBar
        value={progress}
        color={isCorrectGesture ? "#4ade80" : "#3b82f6"}
        label={
          isCorrectGesture
            ? "✅ Gesto corretto!"
            : progress > 0
              ? `Tieni il gesto... ${Math.round(progress * 100)}%`
              : "Fai il gesto davanti alla webcam"
        }
      />

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
