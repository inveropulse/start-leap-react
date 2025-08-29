import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize logging system - MUST be imported before App
import "./lib/logging/setup";

createRoot(document.getElementById("root")!).render(<App />);
