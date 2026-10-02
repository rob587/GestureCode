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

export function useDashboard({ confirmedGestureId, confirmationCount } = {}) {
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [resetCount, setResetCount] = useState(0);
  const [lastAction, setLastAction] = useState(null);

  const items = useRef(buildItems()).current;
}
