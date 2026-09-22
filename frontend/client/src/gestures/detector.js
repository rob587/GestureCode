// Mappa dei landmark MediaPipe (indice → parte della mano):
//   0  = polso
//   1-4   = pollice (4 = punta)
//   5-8   = indice (5 = MCP/base, 8 = punta)
//   9-12  = medio (9 = MCP, 12 = punta)
//   13-16 = anulare (13 = MCP, 16 = punta)
//   17-20 = mignolo (17 = MCP, 20 = punta)
//
// NOTA: y cresce verso il basso. "Su" = y piccola.

import { GESTURES } from "./definitions.js";

// --- Costanti ---------------------------------------------------------------

const LM = {
  WRIST: 0,
  THUMB_TIP: 4,
  INDEX_MCP: 5,
  INDEX_TIP: 8,
  MIDDLE_MCP: 9,
  MIDDLE_TIP: 12,
  RING_MCP: 13,
  RING_TIP: 16,
  PINKY_MCP: 17,
  PINKY_TIP: 20,
};

// Soglie (da tarare se necessario)
const PINCH_DISTANCE_THRESHOLD = 0.06; // distanza normalizzata pollice-indice
const INDEX_DIRECTION_THRESHOLD = 0.05; // delta y minimo per "su" o "giù"

// --- Helper geometrici ------------------------------------------------------

function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function isFingerExtended(landmarks, mcpIndex, tipIndex) {
  const wrist = landmarks[LM.WRIST];
  const mcp = landmarks[mcpIndex];
  const tip = landmarks[tipIndex];

  const distMcp = distance(wrist, mcp);
  const distTip = distance(wrist, tip);

  // Il tip deve essere almeno il 20% più lontano del MCP
  return distTip > distMcp * 1.2;
}

function isThumbExtended(landmarks) {
  const wrist = landmarks[LM.WRIST];
  const thumbTip = landmarks[LM.THUMB_TIP];
  const indexMcp = landmarks[LM.INDEX_MCP];

  const distFromWrist = distance(wrist, thumbTip);
  const distFromIndexMcp = distance(indexMcp, thumbTip);

  return distFromWrist > 0.15 && distFromIndexMcp > 0.08;
}

function isOpenPalm(landmarks) {
  const indexExt = isFingerExtended(landmarks, LM.INDEX_MCP, LM.INDEX_TIP);
  const middleExt = isFingerExtended(landmarks, LM.MIDDLE_MCP, LM.MIDDLE_TIP);
  const ringExt = isFingerExtended(landmarks, LM.RING_MCP, LM.RING_TIP);
  const pinkyExt = isFingerExtended(landmarks, LM.PINKY_MCP, LM.PINKY_TIP);
  const thumbExt = isThumbExtended(landmarks);

  return indexExt && middleExt && ringExt && pinkyExt && thumbExt;
}

function isFist(landmarks) {
  const indexExt = isFingerExtended(landmarks, LM.INDEX_MCP, LM.INDEX_TIP);
  const middleExt = isFingerExtended(landmarks, LM.MIDDLE_MCP, LM.MIDDLE_TIP);
  const ringExt = isFingerExtended(landmarks, LM.RING_MCP, LM.RING_TIP);
  const pinkyExt = isFingerExtended(landmarks, LM.PINKY_MCP, LM.PINKY_TIP);
  const thumbExt = isThumbExtended(landmarks);

  return !indexExt && !middleExt && !ringExt && !pinkyExt && !thumbExt;
}

function getIndexDirection(landmarks) {
  const indexExt = isFingerExtended(landmarks, LM.INDEX_MCP, LM.INDEX_TIP);
  const middleExt = isFingerExtended(landmarks, LM.MIDDLE_MCP, LM.MIDDLE_TIP);
  const ringExt = isFingerExtended(landmarks, LM.RING_MCP, LM.RING_TIP);
  const pinkyExt = isFingerExtended(landmarks, LM.PINKY_MCP, LM.PINKY_TIP);

  // Solo l'indice deve essere esteso
  if (!indexExt || middleExt || ringExt || pinkyExt) return null;

  const mcp = landmarks[LM.INDEX_MCP];
  const tip = landmarks[LM.INDEX_TIP];
  const deltaY = mcp.y - tip.y; // positivo se il tip è più in alto dell'MCP

  if (deltaY > INDEX_DIRECTION_THRESHOLD) return "up";
  if (deltaY < -INDEX_DIRECTION_THRESHOLD) return "down";
  return null;
}

function isPinch(landmarks) {
  const thumbTip = landmarks[LM.THUMB_TIP];
  const indexTip = landmarks[LM.INDEX_TIP];
  const d = distance(thumbTip, indexTip);

  if (d > PINCH_DISTANCE_THRESHOLD) return false;

  // Le altre tre dita devono essere piegate (non estese)
  const middleExt = isFingerExtended(landmarks, LM.MIDDLE_MCP, LM.MIDDLE_TIP);
  const ringExt = isFingerExtended(landmarks, LM.RING_MCP, LM.RING_TIP);
  const pinkyExt = isFingerExtended(landmarks, LM.PINKY_MCP, LM.PINKY_TIP);

  return !middleExt && !ringExt && !pinkyExt;
}

function isShaka(landmarks) {
  const thumbExt = isThumbExtended(landmarks);
  const indexExt = isFingerExtended(landmarks, LM.INDEX_MCP, LM.INDEX_TIP);
  const middleExt = isFingerExtended(landmarks, LM.MIDDLE_MCP, LM.MIDDLE_TIP);
  const ringExt = isFingerExtended(landmarks, LM.RING_MCP, LM.RING_TIP);
  const pinkyExt = isFingerExtended(landmarks, LM.PINKY_MCP, LM.PINKY_TIP);

  return thumbExt && !indexExt && !middleExt && !ringExt && pinkyExt;
}

export function detectGesture(landmarks) {
  if (!landmarks || landmarks.length < 21) return null;

  // 1. Pizzico (molto specifico: distanza minima pollice-indice)
  if (isPinch(landmarks)) return GESTURES.PINCH.id;

  // 2. Shaka (specifico: pollice+mignolo, il resto chiuso)
  if (isShaka(landmarks)) return GESTURES.SHAKA.id;

  // 3. Indice su/giù (specifico: solo indice esteso)
  const indexDir = getIndexDirection(landmarks);
  if (indexDir === "up") return GESTURES.INDEX_UP.id;
  if (indexDir === "down") return GESTURES.INDEX_DOWN.id;

  // 4. Mano aperta (generico: tutte le dita estese)
  if (isOpenPalm(landmarks)) return GESTURES.OPEN_PALM.id;

  // 5. Pugno (generico: tutte le dita chiuse)
  if (isFist(landmarks)) return GESTURES.FIST.id;

  return null;
}

export const _internal = {
  isFingerExtended,
  isThumbExtended,
  isOpenPalm,
  isFist,
  isPinch,
  isShaka,
  getIndexDirection,
  distance,
};
