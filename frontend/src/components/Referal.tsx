import { useState } from "react";

function Referal() {
  const referal: number = 23;
  const referalEnding: string =
    referal % 10 === 1 && referal % 100 !== 11
      ? "пользователь"
      : 2 <= referal % 10 &&
        referal % 10 <= 4 &&
        !(12 <= referal % 100 && referal % 100 <= 14)
      ? "пользователя"
      : "пользователей";
  const [reward, setReward] = useState(995);
  const rewardEnding: string =
    reward % 10 === 1 && reward % 100 !== 11
      ? "монета"
      : 2 <= reward % 10 &&
        reward % 10 <= 4 &&
        !(12 <= reward % 100 && reward % 100 <= 14)
      ? "монеты"
      : "монет";
  const takeLink = () => {
    setShowPopup(true);
    setTimeout(() => {
      document.getElementById("notify-popup")?.classList.add("show");
    }, 10);
    setTimeout(() => {
      document.getElementById("notify-popup")?.classList.remove("show");
    }, 1400);
    setTimeout(() => setShowPopup(false), 1500);
    //save to buffer link youtube.com
    navigator.clipboard.writeText("user?bot_id=12321412");
  };

  const takeReward = async () => {
    const intervalId = setInterval(() => {
      console.log("ok");
      setReward((reward) =>
        reward > 0 ? reward - 1 : clearInterval(intervalId) || 0
      );
    }, 10);
  };

  const [popup, setShowPopup] = useState(false);

  const createPopup = (message: string) => {
    return (
      <div id="notify-popup" className="popup">
        <div className="popup-content">
          <h2>{message}</h2>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="page-title">
        <div className="page-title-cell">
          <b className="page-title-cell-title"> Приглашено:</b> {referal}{" "}
          {referalEnding}
        </div>
        <div className="page-title-cell">
          <b className="page-title-cell-title"> Награда:</b> {reward}{" "}
          {rewardEnding}
        </div>
      </div>
      <div className="page-other">
        <button className="cell btn-active" onClick={takeLink}>
          Скопировать ссылку
        </button>
        <button className="cell btn-money" onClick={takeReward}>
          💰Забрать награду💰
        </button>
      </div>
      {popup && createPopup("Ссылка скопирована!")}
    </>
  );
}

export default Referal;
