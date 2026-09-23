//   - videoRef: ref al <video> (da collegare)
//   - landmarksRef: ref ai landmark correnti (aggiornato OGNI frame, no re-render)
//   - landmarks: state con gli ultimi landmark (aggiornato ~5/sec, per UI)
//   - fps: FPS correnti (aggiornato ~2/sec)
//   - isReady: true quando webcam + modello sono pronti
//   - handDetected: true se nell'ultimo frame c'era una mano
//   - error: eventuale errore (permesso negato, modello non caricato, ...)
//
// Uso:
//   const { videoRef, landmarksRef, landmarks, fps, isReady, handDetected, error } = useMediaPipe();

import { useEffect, useRef, useState } from "react";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

const WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm";

// Frequenza di aggiornamento dello state React (per UI)
const UI_UPDATE_INTERVAL_MS = 200;

export function useMediaPipe() {
  // --- Refs (non causano re-render) ---
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const landmarksRef = useRef(null);
  const lastUiUpdateRef = useRef(0);
  const lastVideoTimeRef = useRef(-1);
  const fpsRef = useRef({ count: 0, lastCheck: performance.now(), value: 0 });

  // --- State React (bassa frequenza) ---
  const [landmarks, setLandmarks] = useState(null);
  const [fps, setFps] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [handDetected, setHandDetected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        // 1. Webcam
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: "user" },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;

        if (!videoRef.current) return;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        // 2. MediaPipe HandLandmarker
        const vision = await FilesetResolver.forVisionTasks(WASM_URL);
        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: MODEL_URL,
            delegate: "GPU", // fallback a CPU se GPU non disponibile
          },
          runningMode: "VIDEO",
          numHands: 1,
          minHandDetectionConfidence: 0.5,
          minHandPresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        if (cancelled) {
          landmarker.close();
          return;
        }

        landmarkerRef.current = landmarker;

        // 3. Loop di rilevamento
        loop();
        setIsReady(true);
      } catch (err) {
        if (!cancelled) {
          console.error("[useMediaPipe] init error:", err);
          setError(err);
        }
      }
    }

    function loop() {
      if (cancelled) return;
      rafRef.current = requestAnimationFrame(loop);

      const video = videoRef.current;
      const landmarker = landmarkerRef.current;
      if (!video || !landmarker) return;

      // MediaPipe richiede che il video sia avanzato di frame
      const now = performance.now();
      if (video.currentTime === lastVideoTimeRef.current) return;
      lastVideoTimeRef.current = video.currentTime;

      let result;
      try {
        result = landmarker.detectForVideo(video, now);
      } catch (e) {
        // A volte detectForVideo lancia se il video non è pronto: skip
        return;
      }

      const hasHand = result?.landmarks && result.landmarks.length > 0;
      const handLandmarks = hasHand ? result.landmarks[0] : null;

      // Aggiorna SEMPRE il ref (veloce, no re-render)
      landmarksRef.current = handLandmarks;

      // --- FPS ---
      fpsRef.current.count++;
      if (now - fpsRef.current.lastCheck >= 1000) {
        fpsRef.current.value = fpsRef.current.count;
        fpsRef.current.count = 0;
        fpsRef.current.lastCheck = now;
      }

      // --- State React a bassa frequenza ---
      if (now - lastUiUpdateRef.current >= UI_UPDATE_INTERVAL_MS) {
        lastUiUpdateRef.current = now;
        setLandmarks(handLandmarks);
        setHandDetected(hasHand);
        setFps(fpsRef.current.value);
      }
    }

    init();

    // Cleanup
    return () => {
      cancelled = true;

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }

      if (landmarkerRef.current) {
        try {
          landmarkerRef.current.close();
        } catch (e) {
          // ignora errori di close
        }
        landmarkerRef.current = null;
      }
    };
  }, []);

  return {
    videoRef,
    landmarksRef,
    landmarks,
    fps,
    isReady,
    handDetected,
    error,
  };
}
