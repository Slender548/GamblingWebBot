import React, { useState } from "react";
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

const BlackjackGame: React.FC = () => {
  const [notifyPopup, setNotifyPopup] = useState<string | null>(null);
  const [player1Result, setPlayer1Result] = useState<number>(0);
  const [player2Result, setPlayer2Result] = useState<number>(0);
  const [activePlayer, setActivePlayer] = useState<boolean>(true); // Player 1 starts
  const [selfHand, setSelfHand] = useState<string[]>([]);
  const [opponentHand, setOpponentHand] = useState<string[]>([]);
  const [hiddenCards, setHiddenCards] = useState<boolean>(false);

  // Function to draw a random card
  const drawCard = (): string => {
    const suits = ["h", "s", "c", "d"];
    const ranks = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "j",
      "q",
      "k",
      "a",
    ];
    const randomSuit = suits[Math.floor(Math.random() * suits.length)];
    const randomRank = ranks[Math.floor(Math.random() * ranks.length)];
    return `${randomRank}_${randomSuit}`;
  };

  const takeCard = () => {
    const newCard = drawCard();
    const newHand = [...selfHand, newCard];
    setSelfHand(newHand);

    const newScore = parseHand(newHand);
    setPlayer1Result(newScore);

    if (newScore > 21) {
      showNotifyPopup("Перебор! Вы проиграли.");
      setActivePlayer(false);
    }
  };

  const passTurn = () => {
    setActivePlayer(false);
    opponentMove();
  };

  const opponentMove = () => {
    let newHand = opponentHand;
    let newScore = parseHand(newHand);

    while (newScore < 17) {
      const newCard = drawCard();
      newHand = [...newHand, newCard];
      newScore = parseHand(newHand);
    }

    setOpponentHand(newHand);
    setPlayer2Result(newScore);

    setTimeout(() => {
      checkWinner(selfHand, newHand);
    }, 1000);
  };

  const parseCard = (card: string) => {
    const rank = card.split("_")[0];
    return rank === "a"
      ? 11
      : parseInt(
          rank.replace("q", "10").replace("k", "10").replace("j", "10"),
          10
        );
  };

  const parseHand = (hand: string[]) => {
    let total = 0;
    let aces = 0;

    for (const card of hand) {
      total += parseCard(card);
      if (card.startsWith("a")) aces++;
    }

    while (total > 21 && aces > 0) {
      total -= 10;
      aces--;
    }

    return total;
  };

  const checkWinner = (hand1: string[], hand2: string[]) => {
    const score1 = parseHand(hand1);
    const score2 = parseHand(hand2);
    setHiddenCards(true);
    if (score1 > 21) {
      showNotifyPopup("Вы проиграли.");
    } else if (score2 > 21) {
      showNotifyPopup("Противник перебрал! Вы выиграли!");
    } else if (score1 > score2) {
      showNotifyPopup("Вы выиграли!");
    } else if (score2 > score1) {
      showNotifyPopup("Вы проиграли.");
    } else {
      showNotifyPopup("Ничья");
    }
    setTimeout(() => setHiddenCards(false), 1000);
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
              src={card}
              alt={`card-${index}`}
              className="blackjack-card"
            />
          ))}
        </div>
      </div>
      <div className="page-other">
        <div className="card-hand-opponent">
          {opponentHand.map((card: string, index: number) => (
            <img
              key={index}
              src={hiddenCards && index !== 0 ? back : card}
              alt={`card-${index}`}
              className="blackjack-card"
            />
          ))}
        </div>
      </div>
      {notifyPopup && <div className="notification-popup">{notifyPopup}</div>}
    </div>
  );
};

export default BlackjackGame;
