import React, { useRef, useState } from "react";
import "./MinesGame.css";
import NavBar from "../../NavBar";
import { toast } from "react-toastify";
import { retrieveLaunchParams } from "@telegram-apps/sdk";

interface Cell {
  hasMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  surroundingMines: number;
}

const difficulties = {
  лёгкая: { rows: 8, cols: 8, mines: 10 },
  сложная: { rows: 10, cols: 10, mines: 25 },
};

const generateBoard = (rows: number, cols: number, mines: number) => {
  const board: Cell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      hasMine: false,
      isRevealed: false,
      isFlagged: false,
      surroundingMines: 0,
    }))
  );

  // Place mines
  let minesPlaced = 0;
  while (minesPlaced < mines) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    if (!board[row][col].hasMine) {
      board[row][col].hasMine = true;
      minesPlaced++;
      // Update surrounding cells
      for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
          if (
            r >= 0 &&
            r < rows &&
            c >= 0 &&
            c < cols &&
            !board[r][c].hasMine
          ) {
            board[r][c].surroundingMines++;
          }
        }
      }
    }
  }

  return board;
};

const Mines: React.FC = () => {
  const [board, setBoard] = useState<Cell[][]>([]);
  const { initData, initDataRaw } = retrieveLaunchParams();
  const [difficulty, setDifficulty] = useState<"лёгкая" | "сложная" | null>(
    null
  );
  const [gameOver, setGameOver] = useState<boolean>(false);
  const betRef = useRef<HTMLInputElement>(null);

  const startGame = (difficulty: "лёгкая" | "сложная") => {
    const { rows, cols, mines } = difficulties[difficulty];
    if (betRef.current?.value && Number(betRef.current.value) > 0) {
      toast.info("Игра началась");
    } else {
      toast.error("Введите ставку");
      return;
    }
    //TODO: check if money are available
    setBoard(generateBoard(rows, cols, mines));
    setDifficulty(difficulty);
  };

  const handleClick = (row: number, col: number) => {
    if (
      gameOver ||
      !difficulty ||
      board[row][col].isRevealed ||
      board[row][col].isFlagged
    )
      return;

    const newBoard = board.map((r) => r.map((cell) => ({ ...cell })));
    const cell = newBoard[row][col];

    if (cell.hasMine) {
      toast.warn("Вы проиграли");
      fetch('/api/game/finish', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          player_id: initData?.user?.id,
          initData: initDataRaw,
          reward: betRef.current?.value ? -Number(betRef.current.value) : 0,
        }),
      })
      setGameOver(true);
      revealAllMines(newBoard);
    } else {
      revealCell(newBoard, row, col);
      checkWin(newBoard);
    }
    setBoard(newBoard);
  };

  const revealCell = (board: Cell[][], row: number, col: number) => {
    const cell = board[row][col];
    if (cell.isRevealed || cell.isFlagged) return;

    cell.isRevealed = true;
    if (cell.surroundingMines === 0) {
      for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
          if (r >= 0 && r < board.length && c >= 0 && c < board[0].length) {
            revealCell(board, r, c);
          }
        }
      }
    }
  };

  const checkWin = (board: Cell[][]) => {
    const unrevealedCells = board
      .flat()
      .filter((cell) => !cell.isRevealed && !cell.hasMine);
    if (unrevealedCells.length === 0) {
      setGameOver(true);
      toast.success("Вы выиграли!");
      fetch('/api/game/finish', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          player_id: initData?.user?.id,
          initData: initDataRaw,
          reward: betRef.current?.value ? -Number(betRef.current.value) : 0
        }),
      })
    }
  };

  const handleRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (gameOver || !difficulty || board[row][col].isRevealed) return;

    const newBoard = board.map((r) => r.map((cell) => ({ ...cell })));
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
    setBoard(newBoard);
  };

  const revealAllMines = (board: Cell[][]) => {
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        if (board[r][c].hasMine) {
          board[r][c].isRevealed = true;
        }
      }
    }
  };

  return (
    <>
      {difficulty === null ? (
        <>
          <div className="page-title">
            <div className="page-title-cell">
              <b className="page-title-cell-title">Mines</b>
            </div>
            <div className="page-title-cell">Выбор сложности</div>
          </div>
          <div className="difficulty-selection">
            <h2>Выберите сложность</h2>
            <button className="easy" onClick={() => startGame("лёгкая")}>
              Лёгкая
            </button>
            <button className="hard" onClick={() => startGame("сложная")}>
              Сложная
            </button>
            <br />
            <h2>Ставка</h2>
            <input type="number" className="mines-cost" ref={betRef} />
          </div>
        </>
      ) : (
        <>
          <div className="page-title">
            <div className="page-title-cell">
              <b className="page-title-cell-title">Mines</b>
            </div>
            <div className="page-title-cell">
              <b className="page-title-cell-title">Сложность:</b> {difficulty}
            </div>
          </div>
          <div
            className="board"
            style={{
              gridTemplateColumns: `repeat(${difficulties[difficulty].cols}, 30px)`,
            }}
          >
            {board.map((row, rowIndex) => (
              <div key={rowIndex} className="row">
                {row.map((cell, colIndex) => (
                  <div
                    key={colIndex}
                    className={`celll ${cell.isRevealed ? "revealed" : ""} ${cell.isFlagged ? "flagged" : ""
                      }`}
                    onClick={() => handleClick(rowIndex, colIndex)}
                    onContextMenu={(e) =>
                      handleRightClick(e, rowIndex, colIndex)
                    }
                  >
                    {cell.isRevealed && cell.hasMine
                      ? "💣"
                      : cell.isRevealed && cell.surroundingMines > 0
                        ? cell.surroundingMines
                        : ""}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
      <NavBar stricted={true} />
    </>
  );
};

export default Mines;
