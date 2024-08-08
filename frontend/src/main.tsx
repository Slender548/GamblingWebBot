import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element not found");
}
const reactDom = ReactDOM.createRoot(root);
// const playerId = "1331282319";
//   fetch(`/api/player/${playerId}`, {method: "GET"})
//   .then(response => response.json())
//   .then(response => {
//     if (!response.ok)
//       reactDom.render(
//         <>
//           <h1>Доступ запрёщен</h1>
//         </>
//     );
//     else {
//       reactDom.render(
//         <React.StrictMode>
//           <Router>
//             <App />
//           </Router>
//         </React.StrictMode>
//       );
//     }
//   });
reactDom.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
