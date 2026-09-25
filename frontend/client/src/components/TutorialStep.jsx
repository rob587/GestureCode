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
