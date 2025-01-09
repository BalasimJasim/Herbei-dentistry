import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Base styles (order matters)
import "./styles/variables.css";
import "./styles/reset.css";
import "./styles/global.css";

// Third-party styles
import "react-toastify/dist/ReactToastify.css";

// Initialize the app
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
