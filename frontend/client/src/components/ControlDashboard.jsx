import { getActionByGestureId } from "../data/dashboardActions.js";

export function ControlDashboard({
  // Stato dashboard
  zoomLevel,
  isPlaying,
  scrollIndex,
  selectedIndex,
  items,
  lastAction,
  // Limiti zoom
  ZOOM_MIN,
  ZOOM_MAX,
  // Dati dal detector (per mostrare gesto corrente)
  currentGestureId,
  onBackToTutorial,
}) {
  const zoomPercent = (zoomLevel - ZOOM_MIN) / (ZOOM_MAX - ZOOM_MIN);
  const currentAction = getActionByGestureId(currentGestureId);

  return (
    <div style={styles.dashboard}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <h2 style={styles.title}>🎛️ Control Dashboard</h2>
          {onBackToTutorial && (
            <button
              style={styles.backButton}
              onClick={onBackToTutorial}
              title="Torna al tutorial"
            >
              ← Tutorial
            </button>
          )}
        </div>
        <p style={styles.subtitle}>Usa i gesti per controllare gli elementi</p>
      </div>

      {/* Gesto corrente + azione mappata */}
      <div style={styles.currentGesture}>
        <div style={styles.currentLabel}>Gesto corrente</div>
        <div style={styles.currentValue}>
          {currentAction ? (
            <>
              <span style={styles.currentIcon}>{currentAction.icon}</span>
              <span style={styles.currentText}>{currentAction.label}</span>
            </>
          ) : (
            <span style={styles.currentTextMuted}>— nessun gesto —</span>
          )}
        </div>
      </div>

      {/* Grid dei widget */}
      <div style={styles.widgets}>
        {/* Widget 1: Play/Pausa */}
        <div style={styles.widget}>
          <div style={styles.widgetHeader}>
            <span style={styles.widgetIcon}>▶️</span>
            <span style={styles.widgetTitle}>Play / Pausa</span>
            <span style={styles.widgetGesture}>✋</span>
          </div>
          <div style={styles.widgetBody}>
            <div
              style={{
                ...styles.animBox,
                animationPlayState: isPlaying ? "running" : "paused",
              }}
            >
              <div style={styles.animDot} />
            </div>
            <div style={styles.widgetStatus}>
              {isPlaying ? "▶️ In esecuzione" : "⏸️ In pausa"}
            </div>
          </div>
        </div>

        {/* Widget 2: Zoom */}
        <div style={styles.widget}>
          <div style={styles.widgetHeader}>
            <span style={styles.widgetIcon}>🔍</span>
            <span style={styles.widgetTitle}>Zoom</span>
            <span style={styles.widgetGesture}>🤏</span>
          </div>
          <div style={styles.widgetBody}>
            <div style={styles.zoomBox}>
              <div
                style={{
                  ...styles.zoomTarget,
                  transform: `scale(${zoomLevel})`,
                }}
              >
                🎯
              </div>
            </div>
            <div style={styles.zoomBarWrapper}>
              <div style={styles.zoomBar}>
                <div
                  style={{
                    ...styles.zoomFill,
                    width: `${zoomPercent * 100}%`,
                  }}
                />
              </div>
              <div style={styles.widgetStatus}>{zoomLevel.toFixed(2)}×</div>
            </div>
          </div>
        </div>

        {/* Widget 3: Lista scrollabile */}
        <div style={styles.widget}>
          <div style={styles.widgetHeader}>
            <span style={styles.widgetIcon}>📋</span>
            <span style={styles.widgetTitle}>Lista</span>
            <span style={styles.widgetGesture}>👆 👇</span>
          </div>
          <div style={styles.widgetBody}>
            <div style={styles.listContainer}>
              {items.map((item, i) => {
                const isCurrent = i === scrollIndex;
                const isSelected = i === selectedIndex;
                return (
                  <div
                    key={item.id}
                    style={{
                      ...styles.listItem,
                      background: isSelected
                        ? "rgba(74, 222, 128, 0.2)"
                        : isCurrent
                          ? "rgba(59, 130, 246, 0.2)"
                          : "transparent",
                      borderColor: isSelected
                        ? "#4ade80"
                        : isCurrent
                          ? "#3b82f6"
                          : "transparent",
                    }}
                  >
                    <span>{item.emoji}</span>
                    <span>{item.label}</span>
                    {isSelected && (
                      <span style={styles.badge}>SELEZIONATO</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Widget 4: Seleziona + Reset */}
        <div style={styles.widget}>
          <div style={styles.widgetHeader}>
            <span style={styles.widgetIcon}>🎯</span>
            <span style={styles.widgetTitle}>Azioni</span>
          </div>
          <div style={styles.widgetBody}>
            <div style={styles.actionRow}>
              <div style={styles.actionBox}>
                <span style={styles.actionEmoji}>✊</span>
                <span style={styles.actionLabel}>Seleziona</span>
                <span style={styles.actionHint}>
                  Elemento {selectedIndex + 1}
                </span>
              </div>
              <div style={styles.actionBox}>
                <span style={styles.actionEmoji}>🤙</span>
                <span style={styles.actionLabel}>Reset</span>
                <span style={styles.actionHint}>Azzera tutto</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  dashboard: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    padding: 24,
    background: "#0a0a0a",
    borderRadius: 12,
    minWidth: 380,
    maxWidth: 480,
    fontFamily: "system-ui, -apple-system, sans-serif",
    color: "#e5e7eb",
  },

  header: {
    textAlign: "center",
  },

  title: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
  },

  subtitle: {
    margin: "4px 0 0",
    fontSize: 13,
    color: "#9ca3af",
  },

  // Gesto corrente
  currentGesture: {
    padding: 12,
    background: "rgba(59, 130, 246, 0.1)",
    border: "1px solid rgba(59, 130, 246, 0.3)",
    borderRadius: 10,
    textAlign: "center",
  },

  currentLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#9ca3af",
    marginBottom: 6,
  },

  currentValue: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  currentIcon: {
    fontSize: 24,
  },

  currentText: {
    fontSize: 16,
    fontWeight: 700,
    color: "#e5e7eb",
  },

  currentTextMuted: {
    fontSize: 14,
    color: "#6b7280",
    fontStyle: "italic",
  },

  // Grid widget
  widgets: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  widget: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 10,
    overflow: "hidden",
  },

  widgetHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 14px",
    background: "rgba(255,255,255,0.02)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    fontSize: 13,
  },

  widgetIcon: {
    fontSize: 16,
  },

  widgetTitle: {
    fontWeight: 600,
    flex: 1,
  },

  widgetGesture: {
    fontSize: 14,
    opacity: 0.7,
  },

  widgetBody: {
    padding: 14,
  },

  widgetStatus: {
    marginTop: 8,
    fontSize: 12,
    color: "#9ca3af",
    fontFamily: "monospace",
    textAlign: "center",
  },

  // Widget Play
  animBox: {
    width: "100%",
    height: 40,
    background: "rgba(255,255,255,0.04)",
    borderRadius: 6,
    position: "relative",
    overflow: "hidden",
  },

  animDot: {
    width: 16,
    height: 16,
    borderRadius: "50%",
    background: "#4ade80",
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    animation: "playPingPong 1.5s ease-in-out infinite alternate",
  },

  // Widget Zoom
  zoomBox: {
    width: "100%",
    height: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.04)",
    borderRadius: 6,
    overflow: "hidden",
  },

  zoomTarget: {
    fontSize: 40,
    transition: "transform 0.2s ease-out",
  },

  zoomBarWrapper: {
    marginTop: 12,
  },

  zoomBar: {
    width: "100%",
    height: 6,
    background: "rgba(255,255,255,0.08)",
    borderRadius: 999,
    overflow: "hidden",
  },

  zoomFill: {
    height: "100%",
    background: "#3b82f6",
    borderRadius: 999,
    transition: "width 0.2s ease-out",
  },

  // Widget Lista
  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    maxHeight: 200,
    overflowY: "auto",
  },

  listItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 12px",
    borderRadius: 6,
    border: "1px solid transparent",
    fontSize: 13,
    transition: "background 0.15s, border-color 0.15s",
  },

  badge: {
    marginLeft: "auto",
    fontSize: 9,
    fontWeight: 700,
    color: "#4ade80",
    letterSpacing: 0.5,
  },

  // Widget Azioni
  actionRow: {
    display: "flex",
    gap: 12,
  },

  actionBox: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    padding: 12,
    background: "rgba(255,255,255,0.03)",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.06)",
  },

  actionEmoji: {
    fontSize: 28,
  },

  actionLabel: {
    fontSize: 12,
    fontWeight: 600,
  },

  actionHint: {
    fontSize: 10,
    color: "#9ca3af",
    fontFamily: "monospace",
  },

  headerTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  backButton: {
    padding: "6px 12px",
    fontSize: 12,
    fontWeight: 600,
    color: "#9ca3af",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 6,
    cursor: "pointer",
    transition: "background 0.2s, color 0.2s",
    fontFamily: "inherit",
  },
};
