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
