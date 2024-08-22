import React, { useState, useEffect } from "react";
import "./CrashGame.css";
import rocketImage from "../assets/rocket.png";

const CrashGame: React.FC = () => {
  const [multiplier, setMultiplier] = useState<number>(1);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [crashStatus, setCrashStatus] = useState<string>("");
  const [notifyPopup, setNotifyPopup] = useState<string | null>(null);
  const [betPlaced, setBetPlaced] = useState<boolean>(false);
  const [reward, setReward] = useState<number>(100);
  const [rocketStartTime, setRocketStartTime] = useState<number | null>(null);

  crashStatus;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      setRocketStartTime(Date.now());
      interval = setInterval(() => {
        setMultiplier((prev) => {
          const newMultiplier = prev + 0.1;
          if (newMultiplier >= 5) {
            setCrashStatus("crashed");
            setIsActive(false);
            clearInterval(interval);
            showNotifyPopup("The game has crashed!");
            return newMultiplier;
          }
          return newMultiplier;
        });
      }, 1000); // Update multiplier every second
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const placeBet = () => {
    if (betPlaced) {
      showNotifyPopup("You have already placed a bet!");
      return;
    }
    setBetPlaced(true);
    setIsActive(true);
    setMultiplier(1);
    setCrashStatus("");
    showNotifyPopup("Bet placed! The game is starting.");
  };

  const cashOut = () => {
    if (!isActive) {
      showNotifyPopup("You need to place a bet first!");
      return;
    }
    setIsActive(false);
    setBetPlaced(false);
    showNotifyPopup(
      `You cashed out with a multiplier of ${multiplier.toFixed(1)}x!`
    );
  };

  const handleRewardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setReward(value);
  };

  const showNotifyPopup = (message: string) => {
    setNotifyPopup(message);
    setTimeout(() => {
      setNotifyPopup(null);
    }, 1000);
  };

  return (
    <div className="crash-game">
      <div
        className="procedural-background"
        style={{
          animationDuration: `${Math.max(5 - multiplier, 1)}s`,
          animationPlayState: isActive ? "running" : "paused",
        }}
      />
      {rocketStartTime && (
        <div
          className="rocket-background"
          style={{
            animationDuration: `${Math.max(5 - multiplier, 1)}s`,
            animationDelay: `${-1 * ((Date.now() - rocketStartTime) / 1000)}s`,
            transition: `2s all linear`,
          }}
        >
          <img src={rocketImage} alt="Rocket" className="rocket-image" />
        </div>
      )}
      <div className="page-title">
        <div className="page-title-cell">
          <b className="page-title-cell-title">💰Reward💰:</b> {reward}$
        </div>
        <div className="page-title-cell">
          <b className="page-title-cell-title">Multiplier:</b>{" "}
          {multiplier.toFixed(1)}x
        </div>
        <div className="page-title-cell">
          <span>{isActive ? "Game Active" : "Game Not Active"}</span>
        </div>
      </div>
      <div className="page-other">
        <button
          type="button"
          className="cell"
          onClick={cashOut}
          disabled={!isActive}
        >
          Cash Out
        </button>
        <button
          type="button"
          className="cell"
          onClick={placeBet}
          disabled={isActive}
        >
          Place Bet
        </button>

        <div className="cell">
          <input
            style={{ textAlign: "center", fontSize: "1.3rem" }}
            id="reward-input"
            type="number"
            value={reward}
            onChange={handleRewardChange}
            min="0"
            step="0.01"
            disabled={isActive} // Disable input when the game is active
          />
        </div>
      </div>
      {notifyPopup && (
        <div id="notify-popup" className="popup show">
          <div className="popup-content">
            <h2>{notifyPopup}</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrashGame;
