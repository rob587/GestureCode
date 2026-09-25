// GestureCode — GestureAnimation
// Mostra l'emoji del gesto atteso con animazione di richiamo:
// pulse + alone che si espande. Guida l'occhio dell'utente senza distrarre.

export function GestureAnimation({ gesture, isCorrect = false }) {
  if (!gesture) return null;

  return (
    <div style={styles.wrapper}>
      <div style={styles.label}>Fai questo gesto</div>

      <div style={styles.emojiWrapper}>
        <div
          style={{
            ...styles.halo,
            background: isCorrect
              ? "radial-gradient(circle, rgba(74,222,128,0.4) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)",
          }}
        />

        <div
          style={{
            ...styles.emoji,
            animation: isCorrect
              ? "gestureSuccess 0.5s ease-out"
              : "gesturePulse 2s ease-in-out infinite",
            filter: isCorrect
              ? "drop-shadow(0 0 24px rgba(74,222,128,0.9))"
              : "drop-shadow(0 0 12px rgba(59,130,246,0.4))",
          }}
        >
          {gesture.emoji}
        </div>
      </div>

      <div style={styles.gestureLabel}>{gesture.label}</div>
    </div>
  );
}

// --- Stili ---

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    userSelect: "none",
  },

  label: {
    fontSize: 12,
    color: "#6b7280",
    fontFamily: "monospace",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },

  emojiWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 160,
    height: 160,
  },

  halo: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    animation: "haloPulse 2s ease-in-out infinite",
  },

  emoji: {
    fontSize: 88,
    lineHeight: 1,
    position: "relative",
    zIndex: 1,
  },

  gestureLabel: {
    fontSize: 20,
    fontWeight: 700,
    color: "#e5e7eb",
    letterSpacing: 0.5,
  },
};
