import { useEffect, useRef, useState } from "react";
import { getActionByGestureId } from "../data/dashboardActions.js";

const ZOOM_MIN = 1.0;
const ZOOM_MAX = 3.0;
const ZOOM_STEP = 0.25;
const SCROLL_ITEMS = 10;

function buildItems() {
  const emojis = ["🎯", "🚀", "🎨", "🎧", "📷", "🔥", "💎", "🌈", "⚡", "🎮"];
  return emojis.slice(0, SCROLL_ITEMS).map((emoji, i) => ({
    id: i,
    emoji,
    label: `Elemento ${i + 1}`,
  }));
}
