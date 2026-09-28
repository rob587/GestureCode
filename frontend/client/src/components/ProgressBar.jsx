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
