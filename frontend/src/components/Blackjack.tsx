/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import _2_h from "../assets/blackjack/2_h.svg";
import _2_s from "../assets/blackjack/2_s.svg";
import _2_c from "../assets/blackjack/2_c.svg";
import _2_d from "../assets/blackjack/2_d.svg";
import _3_h from "../assets/blackjack/3_h.svg";
import _3_s from "../assets/blackjack/3_s.svg";
import _3_c from "../assets/blackjack/3_c.svg";
import _3_d from "../assets/blackjack/3_d.svg";
import _4_h from "../assets/blackjack/4_h.svg";
import _4_s from "../assets/blackjack/4_s.svg";
import _4_c from "../assets/blackjack/4_c.svg";
import _4_d from "../assets/blackjack/4_d.svg";
import _5_h from "../assets/blackjack/5_h.svg";
import _5_s from "../assets/blackjack/5_s.svg";
import _5_c from "../assets/blackjack/5_c.svg";
import _5_d from "../assets/blackjack/5_d.svg";
import _6_h from "../assets/blackjack/6_h.svg";
import _6_s from "../assets/blackjack/6_s.svg";
import _6_c from "../assets/blackjack/6_c.svg";
import _6_d from "../assets/blackjack/6_d.svg";
import _7_h from "../assets/blackjack/7_h.svg";
import _7_s from "../assets/blackjack/7_s.svg";
import _7_c from "../assets/blackjack/7_c.svg";
import _7_d from "../assets/blackjack/7_d.svg";
import _8_h from "../assets/blackjack/8_h.svg";
import _8_s from "../assets/blackjack/8_s.svg";
import _8_c from "../assets/blackjack/8_c.svg";
import _8_d from "../assets/blackjack/8_d.svg";
import _9_h from "../assets/blackjack/9_h.svg";
import _9_s from "../assets/blackjack/9_s.svg";
import _9_c from "../assets/blackjack/9_c.svg";
import _9_d from "../assets/blackjack/9_d.svg";
import _10_h from "../assets/blackjack/10_h.svg";
import _10_s from "../assets/blackjack/10_s.svg";
import _10_c from "../assets/blackjack/10_c.svg";
import _10_d from "../assets/blackjack/10_d.svg";
import _j_h from "../assets/blackjack/j_h.svg";
import _j_s from "../assets/blackjack/j_s.svg";
import _j_c from "../assets/blackjack/j_c.svg";
import _j_d from "../assets/blackjack/j_d.svg";
import _q_h from "../assets/blackjack/q_h.svg";
import _q_s from "../assets/blackjack/q_s.svg";
import _q_c from "../assets/blackjack/q_c.svg";
import _q_d from "../assets/blackjack/q_d.svg";
import _k_h from "../assets/blackjack/k_h.svg";
import _k_s from "../assets/blackjack/k_s.svg";
import _k_c from "../assets/blackjack/k_c.svg";
import _k_d from "../assets/blackjack/k_d.svg";
import _a_h from "../assets/blackjack/a_h.svg";
import _a_s from "../assets/blackjack/a_s.svg";
import _a_c from "../assets/blackjack/a_c.svg";
import _a_d from "../assets/blackjack/a_d.svg";
import back from "../assets/blackjack/back.svg";
import { retrieveLaunchParams } from "@telegram-apps/sdk";

const BlackjackGame: React.FC = () => {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("room_id");
  const { initDataRaw, initData } = retrieveLaunchParams();
  const playerId = initData?.user?.id;
  const [steps, setSteps] = useState<number>(-1);
  const [notifyPopup, setNotifyPopup] = useState<string | null>(null);
  const [player1Result, setPlayer1Result] = useState<number>(0);
  const [player2Result, setPlayer2Result] = useState<number>(0);
  const [activePlayer, setActivePlayer] = useState<boolean>(false);
  const [selfHand, setSelfHand] = useState<string[]>([]);
  const [opponentHand, setOpponentHand] = useState<string[]>([]);
  const [hiddenCards, setHiddenCards] = useState<boolean>(false);
  const [reward, setReward] = useState<number>(0);
  // const cardsMap = {
  //   "2_h": _2_h,
  //   "2_s": _2_s,
  //   "2_c": _2_c,
  //   "2_d": _2_d,
  //   "3_h": _3_h,
  //   "3_s": _3_s,
  //   "3_c": _3_c,
  //   "3_d": _3_d,
  //   "4_h": _4_h,
  //   "4_s": _4_s,
  //   "4_c": _4_c,
  //   "4_d": _4_d,
  //   "5_h": _5_h,
  //   "5_s": _5_s,
  //   "5_c": _5_c,
  //   "5_d": _5_d,
  //   "6_h": _6_h,
  //   "6_s": _6_s,
  //   "6_c": _6_c,
  //   "6_d": _6_d,
  //   "7_h": _7_h,
  //   "7_s": _7_s,
  //   "7_c": _7_c,
  //   "7_d": _7_d,
  //   "8_h": _8_h,
  //   "8_s": _8_s,
  //   "8_c": _8_c,
  //   "8_d": _8_d,
  //   "9_h": _9_h,
  //   "9_s": _9_s,
  //   "9_c": _9_c,
  //   "9_d": _9_d,
  //   "10_h": _10_h,
  //   "10_s": _10_s,
  //   "10_c": _10_c,
  //   "10_d": _10_d,
  //   j_h: _j_h,
  //   j_s: _j_s,
  //   j_c: _j_c,
  //   j_d: _j_d,
  //   q_h: _q_h,
  //   q_s: _q_s,
  //   q_c: _q_c,
  //   q_d: _q_d,
  //   k_h: _k_h,
  //   k_s: _k_s,
  //   k_c: _k_c,
  //   k_d: _k_d,
  //   a_h: _a_h,
  //   a_s: _a_s,
  //   a_c: _a_c,
  //   a_d: _a_d,
  // };

  useEffect(() => {
    const getReward = async () => {
      try {
        const response = await fetch("api/blackjack/get_reward", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ room_id: roomId }),
        });
        const data = await response.json();
        setReward(data.reward);
      } catch {
        showNotifyPopup("Произошла ошибка.");
      }
    };
    getReward();
  }, []);
  useEffect(() => {
    const interval = setInterval(getBlackjackUpdates, 1500);
    return () => clearInterval(interval);
  }, []);

  const getBlackjackUpdates = async () => {
    try {
      const response = await fetch("api/blackjack/get_updates", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ player_id: playerId, room_id: roomId }),
      });
      const data = await response.json();
      if (response.ok) {
        if (data.msg !== "Обновления успешно получены.") {
          showNotifyPopup(data.msg);
        }
        setSelfHand(data.data.self.hands);
        setPlayer1Result(data.data.self.results);
        setPlayer2Result(data.data.opponent.results);
        setActivePlayer(data.data.active_player);
        if (
          data.self.count == data.opponent.count &&
          steps !== data.self.count
        ) {
          setSteps(data.self.count);
          checkWinner(data.self.hands, opponentHand, data.opponent.hands);
        } else {
          setOpponentHand(data.data.opponent.hands);
        }
      }
    } catch (error) {
      showNotifyPopup("Произошла ошибка.");
    }
  };

  const takeCard = async () => {
    try {
      const response = await fetch("/api/blackjack/take", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          initData: initDataRaw,
          player_id: playerId,
          room_id: roomId,
        }),
      });
      const data = await response.json();
      if (data.ok) {
        setSelfHand(data.hand);
        if (data.status === 202) {
          showNotifyPopup("Перебор!");
          if (data.opponent) {
            setHiddenCards(true);
            setTimeout(() => setHiddenCards(false), 1000);
          }
        }
      } else {
        showNotifyPopup(data.msg);
      }
    } catch (error) {
      showNotifyPopup("Ошибка!");
    }
  };

  const passTurn = async () => {
    try {
      const response = await fetch("/api/blackjack/pass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          initData: initDataRaw,
          player_id: playerId,
          room_id: roomId,
        }),
      });
      const data = await response.json();
      if (!data.ok) {
        showNotifyPopup(data.msg);
      }
    } catch (error) {
      showNotifyPopup("Ошибка!");
    }
  };

  const parseCard = (card: string) => {
    const rank = card.slice(0, 2).replace("_", "");
    return rank === "a"
      ? 11
      : parseInt(rank.replace("q", "10").replace("k", "10").replace("j", "10"));
  };

  const parseHand = (hand: string[]) => {
    let total = 0;
    let aces = 0;

    for (const card of hand) {
      total += parseCard(card);
      if (card.slice(0, 2) === "a_") {
        aces++;
      }
    }

    while (total > 21 && aces > 0) {
      total -= 10;
      aces--;
    }

    return total;
  };

  const checkWinner = (
    hand1: string[],
    hand2: string[],
    opponent_current_hands: string[]
  ) => {
    setHiddenCards(true);
    const score1 = parseHand(hand1);
    const score2 = parseHand(hand2);
    if (score1 > 21) {
      showNotifyPopup("Перебор! Вы проиграли.");
    } else if (score2 > 21) {
      showNotifyPopup("Противник перебрал! Вы выиграли!");
    } else if (score1 > score2) {
      showNotifyPopup("Вы выиграли!");
    } else if (score2 > score1) {
      showNotifyPopup("Вы проиграли.");
    } else {
      showNotifyPopup("Ничья");
    }
    setTimeout(() => {
      setHiddenCards(false);
      setOpponentHand(opponent_current_hands);
    }, 1400);
  };

  const showNotifyPopup = (message: string) => {
    setNotifyPopup(message);
    setTimeout(() => {
      setNotifyPopup(null);
    }, 1000);
  };

  return (
    <div>
      <div className="page-title">
        <div className="page-title-cell">
          <b className="page-title-cell-title">Противник:</b>{" "}
          <span>{player2Result}</span>
        </div>
        <div className="page-title-cell">
          <b className="page-title-cell-title">Вы:</b>{" "}
          <span>{player1Result}</span>
        </div>
        <div className="page-title-cell">
          <b className="page-title-cell-title">Награда💰:</b> {reward}$
        </div>
        <div className="page-title-cell">
          <span>{activePlayer ? "Ваш ход" : "Ход противника"}</span>
        </div>
      </div>
      <div className="page-other">
        <div className="cell cell-dividable">
          <button
            type="button"
            className="btn-money take-button"
            onClick={takeCard}
            disabled={!activePlayer}
          >
            Ещё
          </button>
          <button
            type="button"
            className="btn-money pass-button"
            onClick={passTurn}
            disabled={!activePlayer}
          >
            Хватит
          </button>
        </div>
        <div className="card-hand-self">
          {selfHand.map((card: string, index: number) => (
            <img
              key={index}
              src={`_${card}`}
              width="10%"
              style={{
                transform: `rotate(${calculateAngle(
                  index,
                  selfHand.length
                )}deg) translateY(20px)`,
              }}
            />
          ))}
        </div>
        <div className="card-hand-opponent">
          {opponentHand.map((card, index) => (
            <img
              key={index}
              src={hiddenCards ? back : `_${card}`}
              width="10%"
              style={{
                transform: `rotate(${calculateAngle(
                  index,
                  opponentHand.length,
                  true
                )}deg) translateY(20px)`,
              }}
            />
          ))}
        </div>
      </div>
      {notifyPopup && (
        <div id="dice-popup" className="popup show">
          <div className="popup-content">
            <h2>{notifyPopup}</h2>
          </div>
        </div>
      )}
    </div>
  );

  function calculateAngle(
    index: number,
    totalCards: number,
    isOpponent = false
  ): number {
    const arcAngle = 90;
    const angleStep = arcAngle / (totalCards - 1);
    return (isOpponent ? 180 : 0) - arcAngle / 2 + angleStep * index;
  }
};

export default BlackjackGame;
