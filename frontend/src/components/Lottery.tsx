import React, { useState, useRef } from "react";
import "./Lottery.css";

const Lottery: React.FC = () => {
  const segments = [
    // 10 crypto rewards
    "10 TON",
    "50 TON",
    "100 TON",
    "200 TON",
    "500 TON",
    "1000 TON",
    "5000 TON",
    "10000 TON",
    "20000 TON",
    "50000 TON",
    // 10 fiat rewards
  ];
  const [currentDeg, setCurrentDeg] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const pointerRef = useRef<HTMLDivElement>(null);
  const lightsRef = useRef<HTMLDivElement[]>([]);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    lightsRef.current.forEach((light) =>
      light.classList.add("light-twinkling")
    );

    const rotateDeg = Math.random() * 360 + 1080; // Rotate 3 to 4 full turns
    const newDeg = currentDeg + rotateDeg;
    setCurrentDeg(newDeg);

    setTimeout(() => {
      lightsRef.current.forEach((light) =>
        light.classList.remove("light-twinkling")
      );
      setIsSpinning(false);
    }, 3000); // Spin duration
    // spin again
  };
  setInterval(spin, 5500);

  return (
    <>
      <div className="page-title">
        <div className="page-title-cell">
          <b className="page-title-cell-title">Лотерея</b>
        </div>
        <div className="page-title-cell">
          <b className="page-title-cell-title">Общий оборот:</b> 1234$
        </div>
      </div>
      <div className="page-other">
        <div className="cell btn-money">💰Сделать депозит💰</div>
        <div className="cell">Топ депозитов</div>
        <div className="wrapper">
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              className="light"
              ref={(el) => {
                if (el) lightsRef.current[i] = el;
              }}
            ></div>
          ))}
          <div className="panel">
            {segments.map((segment, index) => (
              <div
                key={index}
                className="sector"
                style={{ transform: `rotate(${index * 36 - 18}deg)` }}
              >
                <div className="sector-inner">
                  <span>{segment}</span>
                </div>
              </div>
            ))}
            <div
              className="pointer"
              ref={pointerRef}
              style={{ transform: `rotate(${currentDeg}deg)` }}
            >
              Spin
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Lottery;
