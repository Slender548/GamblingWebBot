/* eslint-disable no-case-declarations */
import React, { useEffect, useState } from "react";
import { RouletteTable, RouletteWheel } from "../../../roulette/src";
import "./RouletteGame.css";

import { getRandomInt } from "../../../roulette/src/utills";
import { getRandomRouletteWinBet } from "../../../roulette/src/helpers";
import whiteChip from "../../../assets/images/chips/white-chip.png";
import blueChip from "../../../assets/images/chips/blue-chip.png";
import blackChip from "../../../assets/images/chips/black-chip.png";
import cyanChip from "../../../assets/images/chips/cyan-chip.png";
import NavBar from "../../NavBar";
import { toast } from "react-toastify";

const API = {
  getRandomBet: async (): Promise<string> => {
    return getRandomRouletteWinBet();
  },
};

interface Chip {
  icon: string;
  value: number;
}

interface Bet {
  icon: string;
  number: number;
}

interface BetHistory {
  id: string;
  icon: string;
  value: number;
}

const chipsMap: Record<string, Chip> = {
  whiteChip: {
    icon: whiteChip,
    value: 1,
  },
  blueChip: {
    icon: blueChip,
    value: 10,
  },
  blackChip: {
    icon: blackChip,
    value: 100,
  },
  cyanChip: {
    icon: cyanChip,
    value: 500,
  },
};

const calcTotalBet = (bets: Record<string, Bet>): number =>
  Object.entries(bets).reduce((acc, [, value]) => acc + value.number, 0);

const RouletteGame = () => {
  const [bets, setBets] = useState<Record<string, Bet>>({});
  const [betHistory, setBetHistory] = useState<BetHistory[]>([]);
  const [activeChip, setActiveChip] = useState<string>(
    Object.keys(chipsMap)[0]
  );

  const [isRouletteWheelSpinning, setIsRouletteWheelSpinning] =
    useState<boolean>(false);
  const [rouletteWheelStart, setRouletteWheelStart] = useState<boolean>(false);
  const [rouletteWheelBet, setRouletteWheelBet] = useState<string>("-1");


  useEffect(() => {
    const backgroundIndex = getRandomInt(0, 5);
    const backgroundClass = `bg-${backgroundIndex}`;

    document.body.classList.add(backgroundClass);

    return () => {
      document.body.classList.remove(backgroundClass);
    };
  }, []);

  useEffect(() => {
    if (rouletteWheelBet === "-1" || rouletteWheelStart === true) {
      return;
    }

    setRouletteWheelStart(true);
  }, [rouletteWheelBet, rouletteWheelStart]);

  useEffect(() => {
    if (isRouletteWheelSpinning === false) {
      return;
    }

    const prepare = async () => {
      const bet = await API.getRandomBet();

      setRouletteWheelStart(false);
      setRouletteWheelBet(bet);
    };

    prepare();
  }, [isRouletteWheelSpinning]);

  const handleDoSpin = () => {
    setIsRouletteWheelSpinning(true);
  };

  const handleEndSpin = () => {
    setIsRouletteWheelSpinning(false);

    const winningBet = rouletteWheelBet; // Replace with the actual winning bet

    let winAmount: number = 0;
    Object.entries(bets).forEach(([betId, { number: betAmount }]) => {
      switch (betId) {
        case "1ST_COLUMN":
          if (
            [
              "1",
              "4",
              "7",
              "10",
              "13",
              "16",
              "19",
              "22",
              "25",
              "28",
              "31",
              "34",
            ].includes(winningBet)
          ) {
            winAmount += betAmount * 2;
          }
          break;
        case "2ND_COLUMN":
          if (
            [
              "2",
              "5",
              "8",
              "11",
              "14",
              "17",
              "20",
              "23",
              "26",
              "29",
              "32",
              "35",
            ].includes(winningBet)
          ) {
            winAmount += betAmount * 2;
          }
          break;
        case "3RD_COLUMN":
          if (
            [
              "3",
              "6",
              "9",
              "12",
              "15",
              "18",
              "21",
              "24",
              "27",
              "30",
              "33",
              "36",
            ].includes(winningBet)
          ) {
            winAmount += betAmount * 2;
          }
          break;
        case "1ST_DOZEN":
          if (parseInt(winningBet) > 0 && parseInt(winningBet) < 13) {
            winAmount += betAmount * 2;
          }
          break;
        case "2ND_DOZEN":
          if (parseInt(winningBet) > 12 && parseInt(winningBet) < 25) {
            winAmount += betAmount * 2;
          }
          break;
        case "3RD_DOZEN":
          if (parseInt(winningBet) > 24 && parseInt(winningBet) < 37) {
            winAmount += betAmount * 2;
          }
          break;
        case "1_TO_18":
          if (parseInt(winningBet) > 0 && parseInt(winningBet) < 19) {
            winAmount += betAmount * 2;
          }
          break;
        case "19_TO_36":
          if (parseInt(winningBet) > 18 && parseInt(winningBet) < 37) {
            winAmount += betAmount * 2;
          }
          break;
        case "EVEN":
          const evens: string[] = [
            "1",
            "3",
            "5",
            "7",
            "9",
            "11",
            "13",
            "15",
            "17",
            "19",
            "21",
            "23",
            "25",
            "27",
            "29",
            "31",
            "33",
            "35",
          ];
          if (evens.includes(winningBet)) {
            winAmount += betAmount * 2;
          }
          break;
        case "ODD":
          const odds: string[] = [
            "2",
            "4",
            "6",
            "8",
            "10",
            "12",
            "14",
            "16",
            "18",
            "20",
            "22",
            "24",
            "26",
            "28",
            "30",
            "32",
            "34",
            "36",
          ];
          if (odds.includes(winningBet)) {
            winAmount += betAmount * 2;
          }
          break;
        case "RED":
          const reds: string[] = [
            "2",
            "4",
            "6",
            "8",
            "10",
            "11",
            "13",
            "15",
            "17",
            "20",
            "22",
            "24",
            "26",
            "28",
            "29",
            "31",
            "33",
            "35",
          ];
          if (reds.includes(winningBet)) {
            winAmount += betAmount * 2;
          }
          break;
        case "BLACK":
          const blacks: string[] = [
            "1",
            "3",
            "5",
            "7",
            "9",
            "12",
            "14",
            "16",
            "18",
            "21",
            "23",
            "25",
            "27",
            "29",
            "31",
            "33",
            "35",
          ];
          if (blacks.includes(winningBet)) {
            winAmount += betAmount * 2;
          }
          break;
        default:
          const betts: string[] = betId.split("-");
          if (betts.includes(winningBet)) {
            winAmount += (betAmount * 35) / betts.length;
          }
          break;
      }
    });
    if (totalBet > winAmount) {
      toast.warn(`Вы проиграли ${totalBet - winAmount}$`);
    } else if (totalBet === winAmount) {
      toast.success(`Вы ничего не потеряли`);
    } else if (totalBet < winAmount) {
      toast.success(`Вы выиграли ${winAmount - totalBet}$`);
    }
  };

  const undoLastBet = () => {
    if (betHistory.length === 0) {
      return;
    }

    setBets((prevState) => {
      const state = { ...prevState };

      const lastBet = betHistory[betHistory.length - 1];
      const prevIcon = betHistory[betHistory.length - 2]?.icon;

      const { id: lastBetId, value } = lastBet;

      if (state[lastBetId].number === 1) {
        delete state[lastBetId];
        return state;
      }

      state[lastBetId].icon = prevIcon || state[lastBetId].icon;
      state[lastBetId].number -= value;

      return state;
    });

    setBetHistory((prevState) => prevState.slice(0, -1));
  };


  const cleanAllBets = () => {
    return;
    setBetHistory([]);
    setBets({});
  };

  const addBet = (id: string) => {
    const { icon, value } = chipsMap[activeChip];

    setBetHistory((prevState) => [...prevState, { id, icon, value }]);

    setBets((prevState) => {
      const state = { ...prevState };

      if (state[id] !== undefined) {
        state[id] = {
          ...state[id],
          icon,
          number: state[id].number + value,
        };
        return state;
      }

      state[id] = {
        icon,
        number: value,
      };

      return state;
    });
  };

  const handleOnBet = ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    bet,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    payload,
    id,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bet: any;
    payload: string[];
    id: string;
  }) => {
    if (isRouletteWheelSpinning) {
      return;
    }

    addBet(id);
  };

  const handleChipChange = (event: React.MouseEvent<HTMLLIElement>) => {
    const chipName = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-name]"
    )?.dataset.name as string;

    setActiveChip(chipName);
  };

  const totalBet = calcTotalBet(bets);

  return (
    <>
      <div className="page-title">
        <div className="page-title-cell">
          <b className="page-title-cell-title">Баланс: </b>2314$
        </div>
        <div className="page-title-cell">
          <b className="page-title-cell-title">Поставлено:</b>
          {totalBet}
        </div>
      </div>
      <div
        style={{
          backgroundColor: "red",
          display: "flex",
          flexDirection: "column-reverse",
          alignItems: "center",
        }}
      >
        <div className="roulette-wrapper" style={{ marginTop: "-58%" }}>
          <RouletteTable onBet={handleOnBet} bets={bets} isDebug={false} />
          <div className="menu">
            <ul className="chips">
              {Object.entries(chipsMap).map(([name, { icon }]) => (
                <li
                  key={name}
                  data-name={name}
                  className={activeChip === name ? "active" : ""}
                  onClick={handleChipChange}
                >
                  <img width={64} height={64} src={icon} alt="chip" />
                </li>
              ))}
            </ul>
            <div className="buttons">
              <button type="button" onClick={undoLastBet}>
                Undo
              </button>
              <button type="button" onClick={cleanAllBets}>
                Clean
              </button>
            </div>
          </div>
          <div />
        </div>
        <div className="roulette-wheel-wrapper" style={{ marginTop: "-11%" }}>
          <RouletteWheel
            start={rouletteWheelStart}
            winningBet={rouletteWheelBet}
            onSpinningEnd={handleEndSpin}
          />
          <div className="buttons">
            <button
              type="button"
              disabled={isRouletteWheelSpinning}
              onClick={handleDoSpin}
            >
              Крутить
            </button>
          </div>
        </div>
      </div>
      <NavBar stricted={true} />
    </>
  );
}

export default RouletteGame;