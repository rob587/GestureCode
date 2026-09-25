// GestureCode — Componente WebcamFeed
// Il <video> è SEMPRE nel DOM (anche durante loading/errore), altrimenti
// il ref non è disponibile quando useMediaPipe prova ad accedervi.

import { useMediaPipe } from "../hooks/useMediaPipe.js";
import { useGestureDetector } from "../hooks/useGestureDetector.js";
import { useTutorial } from "../hooks/useTutorial.js";
import { HandOverlay } from "./HandOverlay.jsx";
import { TutorialStep } from "./TutorialStep.jsx";
import { getGestureById } from "../gestures/definitions.js";

export function WebcamFeed() {
  const { videoRef, landmarksRef, fps, isReady, handDetected, error } =
    useMediaPipe();

  const { currentGestureId, confirmedGestureId, progress } = useGestureDetector(
    {
      landmarksRef,
      enabled: isReady,
    },
  );

  const {
    currentStep,
    stepIndex,
    totalSteps,
    isCompleted,
    isHintVisible,
    isCorrectGesture,
  } = useTutorial({
    confirmedGestureId,
    enabled: isReady,
  });

  const currentGesture = getGestureById(currentGestureId);

  return (
    <div style={styles.container}>
      <div style={styles.videoWrapper}>
        {/* Video SEMPRE presente nel DOM */}
        <video ref={videoRef} style={styles.video} autoPlay playsInline muted />
        <HandOverlay landmarksRef={landmarksRef} />

        {/* Overlay di caricamento */}
        {!isReady && !error && (
          <div style={styles.overlay}>
            <div style={styles.spinner} />
            <div style={styles.overlayText}>Avvio webcam e modello...</div>
          </div>
        )}

        {/* Overlay di errore */}
        {error && (
          <div style={styles.overlay}>
            <div style={styles.errorEmoji}>⚠️</div>
            <div style={styles.errorTitle}>Impossibile avviare la webcam</div>
            <div style={styles.errorText}>
              {error.name === "NotAllowedError"
                ? "Hai negato il permesso. Ricarica la pagina e concedi l'accesso alla webcam."
                : error.message || "Errore sconosciuto."}
            </div>
          </div>
        )}

        {/* HUD quando è pronto */}
        {isReady && (
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
            <div style={styles.hudRow}>
              <span style={styles.hudLabel}>Gesto</span>
              <span style={styles.hudValue}>
                {currentGesture
                  ? `${currentGesture.emoji} ${currentGesture.label}`
                  : "—"}
              </span>
            </div>
            <div style={styles.hudRow}>
              <span style={styles.hudLabel}>Conf</span>
              <span style={styles.hudValue}>{Math.round(progress * 100)}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Tutorial sotto il video */}
      {isReady && (
        <TutorialStep
          currentStep={currentStep}
          stepIndex={stepIndex}
          totalSteps={totalSteps}
          isCompleted={isCompleted}
          isHintVisible={isHintVisible}
          isCorrectGesture={isCorrectGesture}
          progress={progress}
        />
      )}
    </div>
  );
}

// --- Stili ---

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

  // Overlay generico (loading / errore)
  overlay: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    background: "rgba(0, 0, 0, 0.85)",
    padding: 24,
    textAlign: "center",
  },
  spinner: {
    width: 32,
    height: 32,
    border: "3px solid rgba(255,255,255,0.1)",
    borderTopColor: "#4ade80",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  overlayText: {
    color: "#9ca3af",
    fontFamily: "monospace",
    fontSize: 13,
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

  // HUD
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
};
