import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar.tsx";
import Balance from "./components/Balance.tsx";
import Referal from "./components/Referal.tsx";
import Game from "./components/Game.tsx";
import Games from "./components/Games.tsx";
import Lottery from "./components/Lottery.tsx";
import Dice from "./components/Dice.tsx";
import Blackjack from "./components/Blackjack.tsx";
import Mines from "./components/Mines.tsx";
import Crash from "./components/Crash.tsx";
import Roulette from "./components/Roulette.tsx";
import BlackjackPage from "./components/Blackjack_page.tsx";
import BlackjackBot from "./components/Blackjack_bot.tsx";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import "./App.css";

function App() {
  //connect JWT Token

  useEffect(() => {
    // Fetch player data from API
    const playerId = "1331282319";
    fetch(`/api/player/${playerId}`, { method: "GET" })
      .then((response) => response.json())
      .then((response) => {
        if (response.status !== 200) {
          return <></>;
        }
      });
  });
  return (
    <>
      <TonConnectUIProvider
        className="cell"
        manifestUrl="http://localhost:5173/tonconnect-manifest.json"
      >
        <Routes>
          <Route path="/referal" element={<Referal />} />
          <Route path="/balance" element={<Balance />} />
          <Route path="/game" element={<Game />} />
          <Route path="/games" element={<Games />} />
          <Route path="/lottery" element={<Lottery />} />
          <Route path="/dice" element={<Dice />} />
          <Route path="/blackjack" element={<BlackjackPage />} />
          <Route path="/blackjack_bot" element={<BlackjackBot />} />
          <Route path="/mines" element={<Mines />} />
          <Route path="/crash" element={<Crash />} />
          <Route path="/roulette" element={<Roulette />} />
          <Route
            path="/blackjack_game/:roomId/:playerId/:reward"
            element={<Blackjack />}
          />
        </Routes>
        <NavBar />
      </TonConnectUIProvider>
    </>
  );
}

export default App;
