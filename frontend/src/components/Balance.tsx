import { useEffect, useState } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";

function Balance() {
  const balance: number = 10;
  // useEffect(() => {
  //     // Fetch player data from API
  //     const playerId = "1331282319";
  //       fetch(`/api/player/${playerId}`, {method: "GET"})
  //       .then(response => response.json())
  //       .then(response => {
  //         if (!response.ok)
  //           {return <></>}
  //         else {
  //             const player = response.player;
  //             console.log(response)
  //             balance = player[5];
  //         }
  //       });
  //   }, []);
  const balance_ending: string =
    balance % 10 === 1 && balance % 100 !== 11
      ? "монета"
      : 2 <= balance % 10 &&
        balance % 10 <= 4 &&
        !(12 <= balance % 100 && balance % 100 <= 14)
      ? "монеты"
      : "монет";

  const [withdrawPopup, setWithdrawPopup] = useState(false);
  const [depositPopup, setDepositPopup] = useState(false);
  const [historyPopup, setHistoryPopup] = useState(false);

  const showWithdrawPopup = () => {
    const closeWithdraw = () => {
      const popup = document.getElementById("withdrawPopup");
      popup?.classList.remove("show");
      setTimeout(() => {
        setWithdrawPopup(false);
      }, 100);
    };

    const withdraw = () => {
      // Logic to withdraw money from the balance
      console.log("Withdrawal initiated");
      closeWithdraw();
    };

    return (
      <div className="popup" id="withdrawPopup">
        <div className="popup-content">
          <h2>Вывод средств</h2>
          <label>Сумма вывода($):</label>
          <input
            type="number"
            id="withdrawAmount"
            min="5"
            step="0.01"
            placeholder="Мин 5$"
          />
          <label>Метод вывода:</label>
          <input
            className="tgl tgl-skewed"
            id="withdrawMethod"
            type="checkbox"
          />
          <label className="tgl-btn" data-tg-off="SOL" data-tg-on="TON"></label>
          <div className="popup-buttons">
            <button className="btn-create" onClick={withdraw}>
              Вывод
            </button>
            <button className="btn-cancel" onClick={closeWithdraw}>
              Отмена
            </button>
          </div>
        </div>
      </div>
    );
  };

  const showDepositPopup = () => {
    const closeDeposit = () => {
      const popup = document.getElementById("depositPopup");
      popup?.classList.remove("show");
      setTimeout(() => {
        setDepositPopup(false);
      }, 100);
    };

    const deposit = () => {
      // Logic to deposit money to the balance
      console.log("Deposit initiated");
      closeDeposit();
    };

    return (
      <div className="popup" id="depositPopup">
        <div className="popup-content">
          <h2>Депозит</h2>
          <label>Сумма вывода($):</label>
          <input
            type="number"
            id="depositAmount"
            min="5"
            step="0.01"
            placeholder="Мин 5$"
          />
          <label>Метод депозита:</label>
          <input
            className="tgl tgl-skewed"
            id="depositMethod"
            type="checkbox"
          />
          <label className="tgl-btn" data-tg-off="SOL" data-tg-on="TON"></label>
          <div className="popup-buttons">
            <button className="btn-create" onClick={deposit}>
              Deposit
            </button>
            <button className="btn-cancel" onClick={closeDeposit}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const showHistoryPopup = () => {
    const closeHistory = () => {
      const popup = document.getElementById("historyPopup");
      popup?.classList.remove("show");
      setTimeout(() => {
        setHistoryPopup(false);
      }, 100);
    };

    return (
      <div className="popup" id="historyPopup">
        <div className="popup-content">
          <h2>История транзакций</h2>
          <div className="history-content">
            <div className="cell">
              <p>Депозит: 50 TON</p>
              <p>2023-07-22</p>
            </div>
            <div className="cell">
              <p>Вывод: 10 SOL</p>
              <p>2023-07-23</p>
            </div>
          </div>
          <div className="popup-buttons">
            <button className="btn-cancel" onClick={closeHistory}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const setShowWithdrawPopup = () => {
    setWithdrawPopup(true);
    setTimeout(() => {
      const popup = document.getElementById("withdrawPopup");
      if (popup) popup.classList.add("show");
    }, 10);
  };

  const setShowDepositPopup = () => {
    setDepositPopup(true);
    setTimeout(() => {
      const popup = document.getElementById("depositPopup");
      if (popup) popup.classList.add("show");
    }, 10);
  };

  const setShowHistoryPopup = () => {
    setHistoryPopup(true);

    setTimeout(() => {
      const popup = document.getElementById("historyPopup");
      if (popup) popup.classList.add("show");
    }, 10);
  };

  const [tonConnectUI] = useTonConnectUI();

  return (
    <>
      <div className="page-title">
        <div className="page-title-cell">
          <b className="page-title-cell-title"> Баланс:</b> {balance}{" "}
          {balance_ending}
        </div>
      </div>
      <div className="page-other">
        <button
          className="cell btn-active"
          onClick={() => {
            setShowWithdrawPopup();
          }}
        >
          Вывод средств
        </button>
        <button
          className="cell btn-active"
          onClick={() => {
            setShowDepositPopup();
          }}
        >
          Депозит средств
        </button>
        <button
          className="cell btn-active"
          onClick={() => {
            setShowHistoryPopup();
          }}
        >
          История выводов и депозитов
        </button>
        <button
          className="cell btn-money"
          onClick={() => tonConnectUI.openModal()}
        >
          Привязать TON Кошёлёк
        </button>
      </div>
      {withdrawPopup && showWithdrawPopup()}
      {depositPopup && showDepositPopup()}
      {historyPopup && showHistoryPopup()}
    </>
  );
}

export default Balance;
