import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { EventProvider } from "./contexts/EventContext"; // 👈 Importa el nuevo contexto
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    
      <AuthProvider>
        <EventProvider> {/* 👈 Envolvemos toda la app */}
          <App />
        </EventProvider>
      </AuthProvider>
    
  </React.StrictMode>
);
