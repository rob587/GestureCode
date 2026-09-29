import { useEffect, useState } from "react";

const FLASH_DURATION_MS = 900;

const SuccessFlash = ({ trigger, gesture = null }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    setIsVisible(true);

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, FLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [trigger]);

  if (!isVisible) return null;

  return (
    <>
      <div style={styles.overlay}>
        <div style={styles.wave} />

        <div style={styles.content}>
          <div style={styles.check}>✅</div>
          <div style={styles.title}>Gesto corretto!</div>
          {gesture && (
            <div style={styles.subtitle}>
              {gesture.emoji} {gesture.label}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SuccessFlash;

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
    zIndex: 1000,
    background:
      "radial-gradient(circle at center, rgba(74,222,128,0.15) 0%, rgba(0,0,0,0.4) 80%)",
    animation: "flashFadeIn 0.2s ease-out",
  },

  wave: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: "50%",
    border: "4px solid rgba(74,222,128,0.8)",
    animation: "flashWave 0.9s ease-out forwards",
  },

  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    animation: "flashContent 0.6s ease-out",
  },

  check: {
    fontSize: 96,
    lineHeight: 1,
    filter: "drop-shadow(0 0 24px rgba(74,222,128,0.9))",
  },

  title: {
    fontSize: 28,
    fontWeight: 700,
    color: "#4ade80",
    textShadow: "0 0 16px rgba(74,222,128,0.6)",
    letterSpacing: 0.5,
  },

  subtitle: {
    fontSize: 16,
    color: "#e5e7eb",
    fontFamily: "monospace",
    opacity: 0.8,
  },
};
