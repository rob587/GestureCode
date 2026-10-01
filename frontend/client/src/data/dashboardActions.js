export const DASHBOARD_ACTIONS = {
  OPEN_PALM: {
    gestureId: "open_palm",
    type: "toggle_play",
    label: "Play / Pausa",
    icon: "▶️",
    description: "Ferma o riavvia l'animazione",
  },
  FIST: {
    gestureId: "fist",
    type: "select_item",
    label: "Seleziona",
    icon: "🎯",
    description: "Seleziona l'elemento corrente",
  },
  INDEX_UP: {
    gestureId: "index_up",
    type: "scroll_up",
    label: "Su",
    icon: "⬆️",
    description: "Scorri verso l'alto",
  },
  INDEX_DOWN: {
    gestureId: "index_down",
    type: "scroll_down",
    label: "Giù",
    icon: "⬇️",
    description: "Scorri verso il basso",
  },
  PINCH: {
    gestureId: "pinch",
    type: "zoom_in",
    label: "Zoom",
    icon: "🔍",
    description: "Ingrandisci / rimpicciolisci",
  },
  SHAKA: {
    gestureId: "shaka",
    type: "reset",
    label: "Reset",
    icon: "🔄",
    description: "Riporta tutto allo stato iniziale",
  },
};
