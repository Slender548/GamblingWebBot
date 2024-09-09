import React, { useState, useEffect } from "react";
import "./CrashGame.css";
import { toast } from "react-toastify";
import NavBar from "../../NavBar";


const CrashGame: React.FC = () => {
  const [multiplier, setMultiplier] = useState<number>(1);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [hasBetPlaced, setHasBetPlaced] = useState<boolean>(false);
  const [reward, setReward] = useState<number>(100);
  const [graphPoints, setGraphPoints] = useState<Array<{ x: number; y: number }>>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [crashMultiplier, setCrashMultiplier] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isGameActive) {
      // Генерация случайного значения для краша
      const randomCrashMultiplier = 1 + Math.random() * 4; // Значение между 1 и 5
      setCrashMultiplier(randomCrashMultiplier);

      interval = setInterval(() => {
        setMultiplier((prevMultiplier) => {
          const newMultiplier = prevMultiplier + 0.1;
          const timeElapsed = graphPoints.length + 1; // 1 секунда интервалов
          setGraphPoints((prevPoints) => [
            ...prevPoints,
            { x: timeElapsed, y: newMultiplier },
          ]);

          if (newMultiplier >= randomCrashMultiplier) {
            crashGame();
            return newMultiplier;
          }
          return newMultiplier;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGameActive, graphPoints]);

  const crashGame = () => {
    setIsGameActive(false);
    setHasBetPlaced(false);
    toast.warn("Игра завершена!");
    //TODO: lose
  };

  const placeBet = () => {
    if (hasBetPlaced) {
      toast.info("Ставка уже сделана!");
      return;
    }
    setHasBetPlaced(true);
    setIsGameActive(true);
    setMultiplier(1);
    setGraphPoints([]);
    setCrashMultiplier(null); // Сбросить случайный множитель
    toast.info("Ставка сделана! Игра началась.");
  };

  const cashOut = () => {
    if (!isGameActive) {
      toast.error("Сначала сделайте ставку!");
      return;
    }
    setIsGameActive(false);
    setHasBetPlaced(false);
    toast.success(`Вы вывели с множителем ${multiplier.toPrecision(3)}x!`);
    //TODO: cash out
    setMultiplier(1)
  };

  const handleRewardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setReward(value);
  };

  return (
    <>
      <div className="page-title">
        <div className="page-title-cell">
          <b className="page-title-cell-title">💰Награда💰:</b> {reward ? (reward * multiplier).toFixed(1) : 0}$
        </div>
        <div className="page-title-cell">
          <b className="page-title-cell-title">Множитель:</b>{" "}
          {multiplier.toPrecision(3)}x
        </div>
        <div className="page-title-cell">
          <span>{isGameActive ? "Игра активна" : "Игра неактивна"}</span>
        </div>
      </div>
      <div className="page-other">
        <button
          type="button"
          className="cell"
          onClick={cashOut}
          disabled={!isGameActive}
        >
          Вывести
        </button>
        <button
          type="button"
          className="cell"
          onClick={placeBet}
          disabled={isGameActive}
        >
          Поставить
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
            disabled={isGameActive}
          />
        </div>
        <div className="graph-container">
          <svg width="100%" height="100%" viewBox="0 0 100 50">
            <polyline
              fill="none"
              stroke="blue"
              strokeWidth="2"
              points={graphPoints
                .map((p) => `${p.x * 2},${50 - p.y * 10}`)
                .join(" ")}
            />
          </svg>
        </div>
      </div>
      <NavBar stricted={true} />
    </>
  );
};

export default CrashGame;
