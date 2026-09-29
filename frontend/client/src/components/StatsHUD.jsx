export function StatsHUD({
  fps = 0,
  handDetected = false,
  currentGesture = null,
  progress = 0,
  stepIndex = 0,
  totalSteps = 0,
}) {
  const fpsColor = fps >= 20 ? "#4ade80" : fps >= 10 ? "#facc15" : "#f87171";

  return (
    <div style={styles.hud}>
      <div style={styles.row}>
        <span style={styles.label}>FPS</span>
        <span style={{ ...styles.value, color: fpsColor }}>{fps}</span>
      </div>

      <div style={styles.row}>
        <span style={styles.label}>Mano</span>
        <span
          style={{
            ...styles.value,
            color: handDetected ? "#4ade80" : "#f87171",
          }}
        >
          <span
            style={{
              ...styles.dot,
              background: handDetected ? "#4ade80" : "#f87171",
              boxShadow: handDetected ? "0 0 8px rgba(74,222,128,0.8)" : "none",
            }}
          />
          {handDetected ? "rilevata" : "assente"}
        </span>
      </div>

      <div style={styles.row}>
        <span style={styles.label}>Gesto</span>
        <span style={styles.value}>
          {currentGesture
            ? `${currentGesture.emoji} ${currentGesture.label}`
            : "—"}
        </span>
      </div>

      <div style={styles.row}>
        <span style={styles.label}>Conf</span>
        <div style={styles.confWrapper}>
          <span style={styles.confValue}>{Math.round(progress * 100)}%</span>
          <div style={styles.confBar}>
            <div
              style={{
                ...styles.confFill,
                width: `${Math.min(progress * 100, 100)}%`,
                background: progress >= 1 ? "#4ade80" : "#3b82f6",
              }}
            />
          </div>
        </div>
      </div>

      {totalSteps > 0 && (
        <div style={styles.row}>
          <span style={styles.label}>Step</span>
          <span style={styles.value}>
            {stepIndex + 1} / {totalSteps}
          </span>
        </div>
      )}
    </div>
  );
}

const styles = {
  hud: {
    position: "absolute",
    top: 12,
    left: 12,
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: "10px 14px",
    background: "rgba(0, 0, 0, 0.65)",
    borderRadius: 10,
    fontFamily: "monospace",
    fontSize: 12,
    color: "#e5e7eb",
    backdropFilter: "blur(6px)",
    border: "1px solid rgba(255,255,255,0.06)",
    minWidth: 180,
  },

  row: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  label: {
    opacity: 0.55,
    minWidth: 44,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  value: {
    fontWeight: "bold",
    color: "#e5e7eb",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },

  dot: {
    display: "inline-block",
    width: 8,
    height: 8,
    borderRadius: "50%",
    transition: "background 0.2s, box-shadow 0.2s",
  },

  // Confidenza
  confWrapper: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  confValue: {
    fontWeight: "bold",
    minWidth: 34,
    color: "#e5e7eb",
  },

  confBar: {
    flex: 1,
    height: 4,
    background: "rgba(255,255,255,0.1)",
    borderRadius: 999,
    overflow: "hidden",
  },

  confFill: {
    height: "100%",
    borderRadius: 999,
    transition: "width 0.1s linear, background 0.2s",
  },
};
