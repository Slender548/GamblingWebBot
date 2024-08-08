import React, { useState, useEffect } from "react";

import _2_h from "../assets/blackjack/2_h.svg";
import _2_s from "../assets/blackjack/2_s.svg";
import _2_c from "../assets/blackjack/2_c.svg";
import _2_d from "../assets/blackjack/2_d.svg";
// (Other imports omitted for brevity)

import _a_h from "../assets/blackjack/a_h.svg";
import _a_s from "../assets/blackjack/a_s.svg";
import _a_c from "../assets/blackjack/a_c.svg";
import _a_d from "../assets/blackjack/a_d.svg";
import back from "../assets/blackjack/back.svg";

const cardImages = {
  "2_h": _2_h,
  "2_s": _2_s,
  "2_c": _2_c,
  "2_d": _2_d,
  // (Other card mappings omitted for brevity)
  a_h: _a_h,
  a_s: _a_s,
  a_c: _a_c,
  a_d: _a_d,
  back: back,
};

const BlackjackBot: React.FC = () => {
  const [player1Result, setPlayer1Result] = useState(0);
  const [player2Result, setPlayer2Result] = useState(0);
  const [activePlayer, setActivePlayer] = useState<string | null>("p1");
  const [selfHand, setSelfHand] = useState<string[]>([]);
  const [opponentHand, setOpponentHand] = useState<string[]>([]);
  const [notifyPopup, setNotifyPopup] = useState<string | null>(null);

  const deck = [
    "2_h",
    "2_s",
    "2_c",
    "2_d",
    "3_h",
    "3_s",
    "3_c",
    "3_d",
    "4_h",
    "4_s",
    "4_c",
    "4_d",
    "5_h",
    "5_s",
    "5_c",
    "5_d",
    "6_h",
    "6_s",
    "6_c",
    "6_d",
    "7_h",
    "7_s",
    "7_c",
    "7_d",
    "8_h",
    "8_s",
    "8_c",
    "8_d",
    "9_h",
    "9_s",
    "9_c",
    "9_d",
    "10_h",
    "10_s",
    "10_c",
    "10_d",
    "j_h",
    "j_s",
    "j_c",
    "j_d",
    "q_h",
    "q_s",
    "q_c",
    "q_d",
    "k_h",
    "k_s",
    "k_c",
    "k_d",
    "a_h",
    "a_s",
    "a_c",
    "a_d",
  ];

  useEffect(() => {
    startGame();
  }, []);

  const startGame = () => {
    const initialPlayerHand = [drawCard(), drawCard()];
    const initialOpponentHand = [drawCard(), "back"];
    setSelfHand(initialPlayerHand);
    setOpponentHand(initialOpponentHand);
    setPlayer1Result(parseHand(initialPlayerHand));
    setActivePlayer("p1");
  };

  const drawCard = () => {
    const randomIndex = Math.floor(Math.random() * deck.length);
    return deck[randomIndex];
  };

  const addCardSelf = (card: string) => {
    const newSelfHand = [...selfHand, card];
    setSelfHand(newSelfHand);
    const newResult = parseHand(newSelfHand);
    setPlayer1Result(newResult);
    if (newResult > 21) {
      showNotifyPopup("Player Busts! You Lose!");
      setActivePlayer(null);
    }
  };

  const addCardOpponent = (card: string) => {
    const newOpponentHand = [...opponentHand];
    newOpponentHand[opponentHand.indexOf("back")] = card;
    setOpponentHand(newOpponentHand);
    const newResult = parseHand(newOpponentHand);
    setPlayer2Result(newResult);
    if (newResult > 21) {
      showNotifyPopup("Opponent Busts! You Win!");
      setActivePlayer(null);
    }
  };

  const takeCard = () => {
    const card = drawCard();
    addCardSelf(card);
    if (parseHand(selfHand) <= 21) {
      passTurn();
    }
  };

  const passTurn = () => {
    setActivePlayer(null);
    setTimeout(() => {
      botPlay();
    }, 1000);
  };

  const botPlay = () => {
    const newOpponentHand = [...opponentHand];
    newOpponentHand[newOpponentHand.indexOf("back")] = drawCard();
    setOpponentHand(newOpponentHand);
    let botScore = parseHand(newOpponentHand);
    setPlayer2Result(botScore);

    while (botScore < 17) {
      const card = drawCard();
      addCardOpponent(card);
      botScore = parseHand(opponentHand);
      setPlayer2Result(botScore);
    }

    checkWinner(selfHand, opponentHand);
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
      if (card.slice(0, 2) === "a_") aces++;
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
    if (score1 > 21) {
      showNotifyPopup("You Bust! Opponent Wins!");
    } else if (score2 > 21) {
      showNotifyPopup("Opponent Busts! You Win!");
    } else if (score1 > score2) {
      showNotifyPopup("You Win!");
    } else if (score2 > score1) {
      showNotifyPopup("Opponent Wins!");
    } else {
      showNotifyPopup("It's a Tie!");
    }
  };

  const showNotifyPopup = (message: string) => {
    setNotifyPopup(message);
    setTimeout(() => {
      setNotifyPopup(null);
    }, 2000);
  };

  return (
    <div>
      <div className="page-title">
        <div className="page-title-cell">
          <b className="page-title-cell-title">Opponent:</b>{" "}
          <span>{player2Result}</span>
        </div>
        <div className="page-title-cell">
          <b className="page-title-cell-title">You:</b>{" "}
          <span>{player1Result}</span>
        </div>
        <div className="page-title-cell">
          <b className="page-title-cell-title">Reward💰:</b> {reward}$
        </div>
        <div className="page-title-cell">
          <span>{activePlayer === "p1" ? "Your Turn" : "Opponent's Turn"}</span>
        </div>
      </div>
      <div className="page-other">
        <div className="cell cell-dividable">
          <button
            type="button"
            className="btn-money take-button"
            onClick={takeCard}
            disabled={activePlayer !== "p1"}
          >
            Take Card
          </button>
          <button
            type="button"
            className="btn-money pass-button"
            onClick={passTurn}
            disabled={activePlayer !== "p1"}
          >
            Pass
          </button>
        </div>
        <div className="card-hand-self">
          {selfHand.map((card, index) => (
            <img
              key={index}
              src={cardImages[card]}
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
              src={cardImages[card]}
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

export default BlackjackBot;
