export const GESTURES = {
  OPEN_PALM: {
    id: "open_palm",
    emoji: "✋",
    label: "Mano aperta",
    action: "stop",
    hint: "Apri bene la mano, palmo verso la webcam",
  },
  FIST: {
    id: "fist",
    emoji: "✊",
    label: "Pugno chiuso",
    action: "select",
    hint: "Chiudi la mano a pugno",
  },
  INDEX_UP: {
    id: "index_up",
    emoji: "👆",
    label: "Indice su",
    action: "scroll_up",
    hint: "Alza solo l'indice verso l'alto",
  },
  INDEX_DOWN: {
    id: "index_down",
    emoji: "👇",
    label: "Indice giù",
    action: "scroll_down",
    hint: "Punta l'indice verso il basso",
  },
  PINCH: {
    id: "pinch",
    emoji: "🤏",
    label: "Pizzico",
    action: "zoom",
    hint: "Unisci pollice e indice come a pizzicare",
  },
  SHAKA: {
    id: "shaka",
    emoji: "🤙",
    label: "Shaka",
    action: "reset",
    hint: "Pollice e mignolo fuori, il resto chiuso",
  },
};

export const GESTURE_ORDER = [
  "OPEN_PALM",
  "FIST",
  "INDEX_UP",
  "INDEX_DOWN",
  "PINCH",
  "SHAKA",
];

// Array di id puri
export const GESTURE_IDS = Object.values(GESTURES).map((g) => g.id);
