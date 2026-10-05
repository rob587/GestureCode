import { useState } from "react";
import { WebcamFeed } from "./components/WebcamFeed.jsx";

export default function App() {
  const [mode, setMode] = useState("tutorial"); // 'tutorial' | 'dashboard'

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
      }}
    >
      <h1
        style={{
          color: "#e5e7eb",
          fontFamily: "monospace",
          margin: 0,
          fontSize: 28,
          letterSpacing: 1,
        }}
      >
        GestureCode
      </h1>

      <WebcamFeed mode={mode} onModeChange={setMode} />
    </div>
  );
}
