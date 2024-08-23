import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ServerError from "./fakes/ServerError";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
