import { useEffect, useRef, useState } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { retrieveLaunchParams } from "@telegram-apps/sdk";

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  created_at: string;
  transaction_hash: string;
  confirmed: boolean;
}

/**
 * A functional component that displays the user's balance and provides options to withdraw, deposit, and view transaction history.
 *
 * @return {JSX.Element} The JSX element representing the balance page.
 */
export default function Balance(): JSX.Element {
  const { initDataRaw, initData } = retrieveLaunchParams();
  const [withdrawPopup, setWithdrawPopup] = useState<boolean>(false);
  const [depositPopup, setDepositPopup] = useState<boolean>(false);
  const [historyPopup, setHistoryPopup] = useState<boolean>(false);
  const [dollarBalance, setDollarBalance] = useState<number>(0);
  const [moneyBalance, setMoneyBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Array<Transaction>>([]);
  const withdrawAmount = useRef<HTMLInputElement | null>(null);
  const depositAmount = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    /**
     * Fetches player data from the API and updates the dollar and money balances.
     *
     * @return {Promise<void>}
     */
    const fetchData = async (): Promise<void> => {
      const response = await fetch("/api/player", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          initData: initDataRaw,
          player_id: initData?.user?.id,
        }),
      });
      const data = await response.json();
      if (data.ok) {
        setDollarBalance(data.player.dollar_balance);
        setMoneyBalance(data.player.money_balance);
      } else {
        window.location.href = "/register";
      }
    };
    fetchData();
  }, [initData?.user?.id, initDataRaw]);
  useEffect(() => {
    /**
     * Fetches the transaction history from the API and updates the transactions state.
     *
     * @return {Promise<void>}
     */
    const fetchHistory = async (): Promise<void> => {
      const response = await fetch("/api/transactions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          initData: initDataRaw,
          player_id: initData?.user?.id,
        }),
      });
      const data = await response.json();
      if (data.ok) {
        setTransactions(data.data);
      }
    };
    fetchHistory();
  });

  const moneyEnding: string =
    moneyBalance % 10 === 1 && moneyBalance % 100 !== 11
      ? "монета"
      : 2 <= moneyBalance % 10 &&
        moneyBalance % 10 <= 4 &&
        !(12 <= moneyBalance % 100 && moneyBalance % 100 <= 14)
      ? "монеты"
      : "монет";

  const showWithdrawPopup = (): JSX.Element => {
    const closeWithdraw = () => {
      const popup = document.getElementById("withdrawPopup");
      popup?.classList.remove("show");
      setTimeout(() => {
        setWithdrawPopup(false);
      }, 100);
    };

    const withdraw = () => {};

    return (
      <div className="popup" id="withdrawPopup">
        <div className="popup-content">
          <h2>Вывод средств</h2>
          <label>Сумма вывода($):</label>
          <input
            type="number"
            ref={withdrawAmount}
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

  const showDepositPopup = (): JSX.Element => {
    const closeDeposit = (): void => {
      const popup = document.getElementById("depositPopup");
      popup?.classList.remove("show");
      setTimeout(() => {
        setDepositPopup(false);
      }, 100);
    };

    const deposit = (): void => {
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
            ref={depositAmount}
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

  const showHistoryPopup = (): JSX.Element => {
    const closeHistory = (): void => {
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
            {transactions?.map((transaction) => (
              <div className="cell">
                <p>
                  {transaction.transaction_type}: {transaction.amount} $
                </p>
                <p>{transaction.created_at}</p>
              </div>
            ))}
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

  const setShowWithdrawPopup = (): void => {
    setWithdrawPopup(true);
    setTimeout(() => {
      const popup = document.getElementById("withdrawPopup");
      if (popup) popup.classList.add("show");
    }, 10);
  };

  const setShowDepositPopup = (): void => {
    setDepositPopup(true);
    setTimeout(() => {
      const popup = document.getElementById("depositPopup");
      if (popup) popup.classList.add("show");
    }, 10);
  };

  const setShowHistoryPopup = (): void => {
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
          <b className="page-title-cell-title"> Монет:</b> {moneyBalance}{" "}
          {moneyEnding}
        </div>
        <div className="page-title-cell">
          <b className="page-title-cell-title"> Долларов:</b> {dollarBalance} $
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
