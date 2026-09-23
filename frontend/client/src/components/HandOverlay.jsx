import { useEffect, useRef } from "react";

// Connessioni tra i landmark (le "ossa" della mano).
// Indici basati sulla mappa standard MediaPipe Hands.
const HAND_CONNECTIONS = [
  // Pollice
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  // Indice
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  // Medio
  [9, 10],
  [10, 11],
  [11, 12],
  [5, 9],
  // Anulare
  [13, 14],
  [14, 15],
  [15, 16],
  [9, 13],
  // Mignolo
  [0, 17],
  [17, 18],
  [18, 19],
  [19, 20],
  [13, 17],
];

const POINT_COLOR = "#4ade80"; // verde neon
const LINE_COLOR = "rgba(74, 222, 128, 0.7)";
const POINT_RADIUS = 5;
const LINE_WIDTH = 2;

export function HandOverlay({ landmarksRef }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Adatta il canvas alla dimensione reale del suo contenitore
    function resizeCanvas() {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Loop di disegno
    function draw() {
      rafRef.current = requestAnimationFrame(draw);

      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const landmarks = landmarksRef?.current;
      if (!landmarks || landmarks.length < 21) return;

      // Specchia x: il video è scaleX(-1), quindi anche i landmark vanno specchiati
      const points = landmarks.map((lm) => ({
        x: (1 - lm.x) * rect.width,
        y: lm.y * rect.height,
      }));

      // 1. Linee (ossa)
      ctx.strokeStyle = LINE_COLOR;
      ctx.lineWidth = LINE_WIDTH;
      ctx.lineCap = "round";
      for (const [a, b] of HAND_CONNECTIONS) {
        ctx.beginPath();
        ctx.moveTo(points[a].x, points[a].y);
        ctx.lineTo(points[b].x, points[b].y);
        ctx.stroke();
      }

      // 2. Punti (landmark)
      ctx.fillStyle = POINT_COLOR;
      for (const p of points) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, POINT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "#ffffff";
      for (const idx of [4, 8, 12, 16, 20]) {
        const p = points[idx];
        ctx.beginPath();
        ctx.arc(p.x, p.y, POINT_RADIUS + 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [landmarksRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
