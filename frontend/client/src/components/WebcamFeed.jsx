import { useMediaPipe } from "../hooks/useMediaPipe.js";

export function WebcamFeed() {
  const { videoRef, fps, isReady, handDetected, error } = useMediaPipe();

  // --- Stato errore ---
  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>
          <div style={styles.errorEmoji}>⚠️</div>
          <div style={styles.errorTitle}>Impossibile avviare la webcam</div>
          <div style={styles.errorText}>
            {error.name === "NotAllowedError"
              ? "Hai negato il permesso. Ricarica la pagina e concedi l'accesso alla webcam."
              : error.message || "Errore sconosciuto."}
          </div>
        </div>
      </div>
    );
  }

  // --- Stato loading ---
  if (!isReady) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingBox}>
          <div style={styles.spinner} />
          <div style={styles.loadingText}>Avvio webcam e modello...</div>
        </div>
      </div>
    );
  }

  // --- Stato pronto ---
  return (
    <div style={styles.container}>
      <div style={styles.videoWrapper}>
        <video ref={videoRef} style={styles.video} autoPlay playsInline muted />

        {/* HUD in alto a sinistra */}
        <div style={styles.hud}>
          <div style={styles.hudRow}>
            <span style={styles.hudLabel}>FPS</span>
            <span style={styles.hudValue}>{fps}</span>
          </div>
          <div style={styles.hudRow}>
            <span style={styles.hudLabel}>Mano</span>
            <span
              style={{
                ...styles.hudValue,
                color: handDetected ? "#4ade80" : "#f87171",
              }}
            >
              {handDetected ? "● rilevata" : "○ assente"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

//provvisorio

const styles = {
  container: {
    width: "100%",
    maxWidth: 640,
    margin: "0 auto",
  },
  videoWrapper: {
    position: "relative",
    width: "100%",
    aspectRatio: "4 / 3",
    background: "#000",
    borderRadius: 12,
    overflow: "hidden",
  },
  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: "scaleX(-1)",
  },
  hud: {
    position: "absolute",
    top: 12,
    left: 12,
    display: "flex",
    flexDirection: "column",
    gap: 4,
    padding: "8px 12px",
    background: "rgba(0, 0, 0, 0.6)",
    borderRadius: 8,
    fontFamily: "monospace",
    fontSize: 12,
    color: "#e5e7eb",
    backdropFilter: "blur(4px)",
  },
  hudRow: {
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  hudLabel: {
    opacity: 0.6,
    minWidth: 40,
  },
  hudValue: {
    fontWeight: "bold",
    color: "#e5e7eb",
  },

  // Loading
  loadingBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: "4 / 3",
    background: "#0a0a0a",
    borderRadius: 12,
    gap: 16,
  },
  spinner: {
    width: 32,
    height: 32,
    border: "3px solid rgba(255,255,255,0.1)",
    borderTopColor: "#4ade80",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    color: "#9ca3af",
    fontFamily: "monospace",
    fontSize: 13,
  },

  // Errore
  errorBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: "4 / 3",
    background: "#0a0a0a",
    borderRadius: 12,
    gap: 12,
    padding: 24,
    textAlign: "center",
  },
  errorEmoji: {
    fontSize: 40,
  },
  errorTitle: {
    color: "#f87171",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    color: "#9ca3af",
    fontSize: 13,
    maxWidth: 400,
  },
};
