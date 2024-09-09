import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Balance from "./components/Balance";
import Referal from "./components/Referral";
import Game from "./components/Game";
import Lottery from "./components/Lottery";
import {
  GamesPage,
  BlackjackPage,
  BlackjackBot,
  BlackjackGame,
  DicePage,
  DiceBot,
  DiceGame,
  GuessGame,
  MinesGame,
  RouletteGame,
  CrashGame
} from "./components/Games";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
//import { retrieveLaunchParams } from "@telegram-apps/sdk";
import "./App.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const retrieveLaunchParams = () => {
  const initDataRaw = "2";
  return { initDataRaw }
}

function App() {
  const { initDataRaw } = retrieveLaunchParams();
  useEffect(() => {
    fetch("/api/initdata/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ initDataRaw }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.ok) {
          return (
            <>
              <p>Ok</p>
            </>
          );
        }
      })
      .catch(() => {
        return (
          <>
            <p>Ok</p>
          </>
        );
      });
  });

  return (
    <>
      <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
        <Routes>
          <Route path="/referal" element={<Referal />} />
          <Route path="/balance" element={<Balance />} />
          <Route path="/lottery" element={<Lottery />} />
          <Route path="/game" element={<Game />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/dice" element={<DicePage />} />
          <Route path="/dice_game" element={<DiceGame />} />
          <Route path="/dice_bot" element={<DiceBot />} />
          <Route path="/blackjack" element={<BlackjackPage />} />
          <Route path="/blackjack_game" element={<BlackjackGame />} />
          <Route path="/blackjack_bot" element={<BlackjackBot />} />
          <Route path="/mines" element={<MinesGame />} />
          <Route path="/crash" element={<CrashGame />} />
          <Route path="/roulette" element={<RouletteGame />} />
          <Route path="/guess" element={<GuessGame />} />
        </Routes>
      </TonConnectUIProvider>
      <ToastContainer />
    </>
  );
}

export default App;
