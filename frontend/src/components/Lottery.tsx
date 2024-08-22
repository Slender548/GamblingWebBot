import React, { useState, useRef, useEffect } from "react";
import "./Lottery.css";
import { retrieveLaunchParams } from "@telegram-apps/sdk";

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
  ];
  const [currentDeg, setCurrentDeg] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const pointerRef = useRef<HTMLDivElement>(null);
  const lightsRef = useRef<HTMLDivElement[]>([]);
  const { initDataRaw, initData } = retrieveLaunchParams();
  const [currentLottery, setCurrentLottery] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [remainStringTime, setRemainStringTime] = useState<string>("");

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const response = await fetch("/api/lottery", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          initData: initDataRaw,
        }),
      });
      const data = await response.json();
      if (data.ok) {
        setCurrentLottery(data.lottery);
        setEndTime(data.time);
      }
    };
    fetchData();
  }, [initData?.user?.id, initDataRaw]);

  if (endTime) {
    const x = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime?.getTime() - now;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      let out: string = "";
      if (days) {
        out += days + "д ";
      }
      if (hours) {
        out += hours + "ч ";
      }
      if (minutes) {
        out += minutes + "м ";
      }
      if (seconds) {
        out += seconds + "с";
      }
      if (distance > 0) {
        setRemainStringTime(out);
      } else {
        clearInterval(x);
        setRemainStringTime("");
      }
    }, 1000);
  }
  const makeDeposit = () => {};

  const showTopDeposits = () => {};

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
          {<b className="page-title-cell-title">
            Общий оборот: {currentLottery}
          </b> ? (
            currentLottery
          ) : (
            <b className="page-title-cell-title">Лотерея не выставлена</b>
          )}
        </div>
        {<div className="page-title-cell">
          {<>
            <b className="page-title-cell-title">Осталось:</b>{" "}
            {remainStringTime}
          </> ? (
            remainStringTime
          ) : (
            <b className="page-title-cell-title">Лотерея закончилась</b>
          )}
        </div> ? (
          endTime === null
        ) : null}
      </div>
      <div className="page-other">
        <button
          className="cell btn-money"
          disabled={endTime === null || remainStringTime === ""}
          onClick={makeDeposit}
        >
          💰Сделать депозит💰
        </button>
        <button
          className="cell"
          disabled={endTime === null}
          onClick={showTopDeposits}
        >
          Топ депозитов
        </button>
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
