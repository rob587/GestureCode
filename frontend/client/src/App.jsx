import { WebcamFeed } from "./components/WebcamFeed.jsx";

function App() {
  return (
    <>
      <div style={{ minHeight: "100vh", background: "#0a0a0a", padding: 24 }}>
        <h1
          style={{
            color: "#e5e7eb",
            textAlign: "center",
            fontFamily: "monospace",
          }}
        >
          GestureCode
        </h1>
        <WebcamFeed />
      </div>
    </>
  );
}

export default App;
