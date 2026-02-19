import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          className: "font-sans text-sm",
          success: {
            duration: 3000,
            theme: { primary: "#3B82F6" },
          },
        }}
      />
      <App />
    </BrowserRouter>
  </StrictMode>,
);
