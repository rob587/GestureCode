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
