export function ProgressBar({
  value = 0, // 0..1
  color = "#3b82f6",
  height = 8,
  label = null, // testo sotto la barra (opzionale)
  animated = true,
}) {
  const clamped = Math.max(0, Math.min(1, value));
  const percent = clamped * 100;
  return (
    <div style={styles.wrapper}>
      <div style={{ ...styles.track, height }}>
        <div
          style={{
            ...styles.fill,
            width: `${percent}%`,
            background: color,
            transition: animated
              ? "width 0.1s linear, background 0.2s"
              : "none",
          }}
        />
      </div>
      {label && <div style={styles.label}>{label}</div>}
    </div>
  );
}

export function StepProgress({ current, total }) {
  return (
    <div style={styles.stepWrapper}>
      <div style={styles.stepText}>
        Step <strong>{current}</strong> / {total}
      </div>
      <div style={styles.dots}>
        {Array.from({ length: total }).map((_, i) => {
          const isActive = i < current;
          const isCurrent = i === current - 1;
          return (
            <span
              key={i}
              style={{
                ...styles.dot,
                background: isActive ? "#4ade80" : "rgba(255,255,255,0.15)",
                transform: isCurrent ? "scale(1.3)" : "scale(1)",
                boxShadow: isCurrent
                  ? "0 0 8px rgba(74, 222, 128, 0.8)"
                  : "none",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    width: "100%",
  },

  track: {
    width: "100%",
    background: "rgba(255,255,255,0.08)",
    borderRadius: 999,
    overflow: "hidden",
  },

  fill: {
    height: "100%",
    borderRadius: 999,
  },

  label: {
    marginTop: 8,
    fontSize: 12,
    color: "#9ca3af",
    fontFamily: "monospace",
    textAlign: "center",
  },

  // StepProgress
  stepWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },

  stepText: {
    fontSize: 13,
    color: "#9ca3af",
    fontFamily: "monospace",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  dots: {
    display: "flex",
    gap: 8,
    alignItems: "center",
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    transition: "background 0.3s, transform 0.3s, box-shadow 0.3s",
  },
};
