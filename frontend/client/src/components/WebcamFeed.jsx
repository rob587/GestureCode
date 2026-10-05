// GestureCode — Componente WebcamFeed
// Contenitore principale: gestisce webcam, overlay, HUD e le due modalità
// (tutorial / dashboard). Il <video> non si smonta mai tra i cambi modalità.

import { useState, useEffect } from "react";
import { useMediaPipe } from "../hooks/useMediaPipe.js";
import { useGestureDetector } from "../hooks/useGestureDetector.js";
import { useTutorial } from "../hooks/useTutorial.js";
import { useDashboard } from "../hooks/useDashboard.js";
import { HandOverlay } from "./HandOverlay.jsx";
import { TutorialStep } from "./TutorialStep.jsx";
import { StatsHUD } from "./StatsHUD.jsx";
import { SuccessFlash } from "./SuccessFlash.jsx";
import { ControlDashboard } from "./ControlDashboard.jsx";
import { getGestureById } from "../gestures/definitions.js";

export function WebcamFeed({ mode = "tutorial", onModeChange }) {
  // --- Webcam + landmark ---
  const { videoRef, landmarksRef, fps, isReady, handDetected, error } =
    useMediaPipe();

  // --- Detector ---
  const { currentGestureId, confirmedGestureId, confirmationCount, progress } =
    useGestureDetector({
      landmarksRef,
      enabled: isReady,
    });

  // --- Tutorial ---
  const {
    currentStep,
    stepIndex,
    totalSteps,
    isCompleted,
    isHintVisible,
    isCorrectGesture,
  } = useTutorial({
    confirmedGestureId,
    enabled: isReady && mode === "tutorial",
  });

  // --- Dashboard ---
  const dashboard = useDashboard({
    confirmedGestureId,
    confirmationCount,
  });

  // --- Flash trigger ---
  const [flashTrigger, setFlashTrigger] = useState(0);

  useEffect(() => {
    if (isCorrectGesture) {
      setFlashTrigger((t) => t + 1);
    }
  }, [isCorrectGesture]);

  // --- Dati derivati ---
  const currentGesture = getGestureById(currentGestureId);
  const isDashboard = mode === "dashboard";
  const showGoToDashboard = isCompleted && !isDashboard;

  return (
    <div
      style={{
        ...styles.container,
        flexDirection: isDashboard ? "row" : "column",
        maxWidth: isDashboard ? 1200 : 640,
        alignItems: isDashboard ? "flex-start" : "center",
      }}
    >
      {/* === COLONNA SINISTRA: video + tutorial === */}
      <div
        style={{
          ...styles.leftColumn,
          maxWidth: isDashboard ? 640 : "100%",
        }}
      >
        <div style={styles.videoWrapper}>
          <video
            ref={videoRef}
            style={styles.video}
            autoPlay
            playsInline
            muted
          />
          <HandOverlay landmarksRef={landmarksRef} />

          {/* Overlay caricamento */}
          {!isReady && !error && (
            <div style={styles.overlay}>
              <div style={styles.spinner} />
              <div style={styles.overlayText}>Avvio webcam e modello...</div>
            </div>
          )}

          {/* Overlay errore */}
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

          {/* HUD stats */}
          {isReady && (
            <StatsHUD
              fps={fps}
              handDetected={handDetected}
              currentGesture={currentGesture}
              progress={progress}
              stepIndex={isDashboard ? -1 : stepIndex}
              totalSteps={isDashboard ? 0 : totalSteps}
            />
          )}
        </div>

        {/* Tutorial (solo in modalità tutorial) */}
        {!isDashboard && isReady && (
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

        {/* Bottone "Vai alla dashboard" */}
        {showGoToDashboard && (
          <button
            style={styles.goButton}
            onClick={() => onModeChange && onModeChange("dashboard")}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 8px 24px rgba(74, 222, 128, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 16px rgba(74, 222, 128, 0.3)";
            }}
          >
            🎛️ Vai alla Control Dashboard →
          </button>
        )}
      </div>

      {/* === COLONNA DESTRA: dashboard === */}
      {isDashboard && isReady && (
        <ControlDashboard
          zoomLevel={dashboard.zoomLevel}
          isPlaying={dashboard.isPlaying}
          scrollIndex={dashboard.scrollIndex}
          selectedIndex={dashboard.selectedIndex}
          items={dashboard.items}
          lastAction={dashboard.lastAction}
          ZOOM_MIN={dashboard.ZOOM_MIN}
          ZOOM_MAX={dashboard.ZOOM_MAX}
          currentGestureId={currentGestureId}
          onBackToTutorial={() => onModeChange && onModeChange("tutorial")}
        />
      )}

      {/* Flash di conferma (sempre, a tutto schermo) */}
      <SuccessFlash trigger={flashTrigger} gesture={currentStep?.gesture} />
    </div>
  );
}

// --- Stili ---

const styles = {
  container: {
    width: "100%",
    margin: "0 auto",
    display: "flex",
    gap: 24,
    alignItems: "center",
  },

  leftColumn: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 16,
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

  errorEmoji: { fontSize: 40 },

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

  goButton: {
    padding: "14px 24px",
    fontSize: 15,
    fontWeight: 700,
    color: "#0a0a0a",
    background: "#4ade80",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    boxShadow: "0 4px 16px rgba(74, 222, 128, 0.3)",
    fontFamily: "system-ui, -apple-system, sans-serif",
    letterSpacing: 0.3,
  },
};
