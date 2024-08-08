import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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

interface BlackjackProps {
  roomId: string;
  playerId: string;
  reward: number;
}

const BlackjackGame: React.FC<BlackjackProps> = () => {
  const { roomId, playerId, reward } = useParams<BlackjackProps>();
  const [steps, setSteps] = useState(-1);
  const [cards, setCards] = useState({ p1: 0, p2: 0 });
  const [player1Result, setPlayer1Result] = useState(0);
  const [player2Result, setPlayer2Result] = useState(0);
  const [activePlayer, setActivePlayer] = useState<string | null>(null);
  const [selfHand, setSelfHand] = useState<string[]>([]);
  const [opponentHand, setOpponentHand] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(getBlackjackUpdates, 3000);
    return () => clearInterval(interval);
  }, []);

  const getBlackjackUpdates = async () => {
    try {
      const response = await fetch(`/get_blackjack_updates?room_id=${roomId}`);
      const data = await response.json();
      if (playerId === "p1") {
        setPlayer1Result(data.blackjack_results.p1);
        setPlayer2Result(data.blackjack_results.p2);
        if (data.blackjack_hands.p2.length > cards.p2) {
          addCardOpponent();
          setCards((prevCards) => ({ ...prevCards, p2: prevCards.p2 + 1 }));
        }
      } else {
        setPlayer1Result(data.blackjack_results.p2);
        setPlayer2Result(data.blackjack_results.p1);
        if (data.blackjack_hands.p1.length > cards.p1) {
          addCardOpponent();
          setCards((prevCards) => ({ ...prevCards, p1: prevCards.p1 + 1 }));
        }
      }

      const buttonDisabled = playerId !== data.active_player;
      setActivePlayer(data.active_player);

      if (
        data.blackjack_count.p1 === data.blackjack_count.p2 &&
        steps !== data.blackjack_count.p1
      ) {
        setSteps(data.blackjack_count.p1);
        if (playerId === "p1") {
          clearCards(data.blackjack_hands.p1);
          checkWinner(data.blackjack_hands.p1, data.blackjack_hands.p2);
        } else {
          clearCards(data.blackjack_hands.p2);
          checkWinner(data.blackjack_hands.p2, data.blackjack_hands.p1);
        }
        setSteps(steps + 1);
      }
    } catch (error) {
      console.error("Error fetching blackjack updates:", error);
    }
  };

  const addCardSelf = (card: string) => {
    const newSelfHand = [...selfHand, card];
    setSelfHand(newSelfHand);
  };

  const addCardOpponent = () => {
    const newOpponentHand = [...opponentHand, "back"];
    setOpponentHand(newOpponentHand);
  };

  const clearCards = (selfCards: string[]) => {
    setSelfHand(selfCards);
    setOpponentHand(Array(2).fill("back"));
  };

  const takeCard = async () => {
    try {
      const response = await fetch(
        `/take_card?room_id=${roomId}&player=${playerId}`
      );
      const data = await response.json();
      if (data.error) {
        showNotifyPopup(data.error);
      } else {
        addCardSelf(data.card);
      }
    } catch (error) {
      console.error("Error taking card:", error);
    }
  };

  const passTurn = async () => {
    try {
      const response = await fetch(
        `/pass_turn?room_id=${roomId}&player=${playerId}`
      );
      const data = await response.json();
      if (data.error) {
        showNotifyPopup(data.error);
      } else {
        setActivePlayer(null); // Assuming passing turn disables the buttons
      }
    } catch (error) {
      console.error("Error passing turn:", error);
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

  const checkWinner = (hand1: string[], hand2: string[]) => {
    const score1 = parseHand(hand1);
    const score2 = parseHand(hand2);
    if (score1 > 21) {
      showNotifyPopup("Player 1 Busts! Player 2 Wins!");
    } else if (score2 > 21) {
      showNotifyPopup("Player 2 Busts! Player 1 Wins!");
    } else if (score1 > score2) {
      showNotifyPopup("Player 1 Wins!");
    } else if (score2 > score1) {
      showNotifyPopup("Player 2 Wins!");
    } else {
      showNotifyPopup("It's a Tie!");
    }
  };

  const [notifyPopup, setNotifyPopup] = useState<string | null>(null);
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
          <span>
            {activePlayer === playerId ? "Ваш ход" : "Ход противника"}
          </span>
        </div>
      </div>
      <div className="page-other">
        <div className="cell cell-dividable">
          <button
            type="button"
            className="btn-money take-button"
            onClick={takeCard}
            disabled={activePlayer !== playerId}
          >
            Ещё
          </button>
          <button
            type="button"
            className="btn-money pass-button"
            onClick={passTurn}
            disabled={activePlayer !== playerId}
          >
            Хватит
          </button>
        </div>
        <div className="card-hand-self">
          {selfHand.map((card, index) => (
            <img
              key={index}
              src={`static/img/blackjack/${card}.svg`}
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
              src={`static/img/blackjack/${card}.svg`}
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
