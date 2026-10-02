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

  function togglePlay() {
    setIsPlaying((p) => !p);
    return "toggle_play";
  }

  function selectItem() {
    setSelectedIndex(scrollIndex);
    return "select_item";
  }

  function scrollUp() {
    setScrollIndex((i) => Math.max(0, i - 1));
    return "scroll_up";
  }

  function scrollDown() {
    setScrollIndex((i) => Math.min(items.length - 1, i + 1));
    return "scroll_down";
  }

  function zoom() {
    setZoomLevel((z) => {
      const next = z + ZOOM_STEP;
      return next > ZOOM_MAX ? ZOOM_MIN : next;
    });
    return "zoom";
  }

  function reset() {
    setZoomLevel(1.0);
    setIsPlaying(true);
    setScrollIndex(0);
    setSelectedIndex(0);
    setResetCount((c) => c + 1);
    return "reset";
  }

  useEffect(() => {
    if (!confirmedGestureId || !confirmationCount) return;

    const action = getActionByGestureId(confirmedGestureId);
    if (!action) return;

    let executed = null;
    switch (action.type) {
      case "toggle_play":
        executed = togglePlay();
        break;
      case "select_item":
        executed = selectItem();
        break;
      case "scroll_up":
        executed = scrollUp();
        break;
      case "scroll_down":
        executed = scrollDown();
        break;
      case "zoom_in":
        executed = zoom();
        break;
      case "reset":
        executed = reset();
        break;
      default:
        break;
    }

    if (executed) {
      setLastAction({ type: executed, timestamp: performance.now() });
    }
  }, [confirmationCount]);

  return {
    zoomLevel,
    isPlaying,
    scrollIndex,
    selectedIndex,
    resetCount,
    items,
    lastAction,

    togglePlay,
    selectItem,
    scrollUp,
    scrollDown,
    zoom,
    reset,

    ZOOM_MIN,
    ZOOM_MAX,
    ZOOM_STEP,
  };
}
