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

export const DASHBOARD_ACTIONS_LIST = [
  DASHBOARD_ACTIONS.OPEN_PALM,
  DASHBOARD_ACTIONS.FIST,
  DASHBOARD_ACTIONS.INDEX_UP,
  DASHBOARD_ACTIONS.INDEX_DOWN,
  DASHBOARD_ACTIONS.PINCH,
  DASHBOARD_ACTIONS.SHAKA,
];

export function getActionByGestureId(gestureId) {
  if (!gestureId) return null;
  return DASHBOARD_ACTIONS_LIST.find((a) => a.gestureId === gestureId) || null;
}

export function getActionByType(type) {
  if (!type) return null;
  return DASHBOARD_ACTIONS_LIST.find((a) => a.type === type) || null;
}
