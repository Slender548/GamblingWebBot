import { retrieveLaunchParams } from "@telegram-apps/sdk";
import { useEffect, useState } from "react";

/**
 * A React component that displays the number of referrals and rewards earned by a user.
 * It also provides functionality to copy the referral link and claim the reward.
 *
 * @return {JSX.Element} The JSX element representing the component.
 */
export default function Referal(): JSX.Element {
  const [reward, setReward] = useState<number>(0);
  const [referal, setReferal] = useState<number>(0);
  const [popup, setShowPopup] = useState<boolean>(false);
  const [link, setLink] = useState<string>("");
  const { initDataRaw, initData } = retrieveLaunchParams();
  useEffect(() => {
    /**
     * Fetches the reward data from the "/api/reward" endpoint using a GET request.
     * The request body includes the "initData" and "player_id" parameters.
     * If the response is successful, the reward value is updated using the "setReward" function.
     *
     * @return {Promise<void>} A promise that resolves when the reward data is fetched and updated.
     */
    const fetchReward = async (): Promise<void> => {
      const response = await fetch("/api/reward", {
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
        setReward(data.reward);
      }
    };
    fetchReward();
    /**
     * Fetches the referal data from the "/api/referal" endpoint using a GET request.
     * The request body includes the "initData" and "player_id" parameters.
     * If the response is successful, the referal value is updated using the "setReferal" function.
     *
     * @return {Promise<void>} A promise that resolves when the referal data is fetched and updated.
     */
    const fetchReferal = async (): Promise<void> => {
      const response = await fetch("/api/referal", {
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
        setReferal(data.referal);
      }
    };
    fetchReferal();
    /**
     * Fetches the link data from the "/api/link" endpoint using a GET request.
     * The request body includes the "initData" and "player_id" parameters.
     * If the response is successful, the link value is updated using the "setLink" function.
     *
     * @return {Promise<void>} A promise that resolves when the link data is fetched and updated.
     */
    const fetchLink = async () => {
      const response = await fetch("/api/link", {
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
        setLink(data.link);
      }
    };
    fetchLink();
  }, [initDataRaw, initData?.user?.id]);
  const referalEnding: string =
    referal % 10 === 1 && referal % 100 !== 11
      ? "пользователь"
      : 2 <= referal % 10 &&
        referal % 10 <= 4 &&
        !(12 <= referal % 100 && referal % 100 <= 14)
      ? "пользователя"
      : "пользователей";
  const rewardEnding: string =
    reward % 10 === 1 && reward % 100 !== 11
      ? "монета"
      : 2 <= reward % 10 &&
        reward % 10 <= 4 &&
        !(12 <= reward % 100 && reward % 100 <= 14)
      ? "монеты"
      : "монет";
  /**
   * Copies the referral link to the clipboard and displays a notification popup.
   *
   * @return {void} No return value.
   */
  const takeLink = (): void => {
    setShowPopup(true);
    setTimeout(() => {
      document.getElementById("notify-popup")?.classList.add("show");
    }, 10);
    setTimeout(() => {
      document.getElementById("notify-popup")?.classList.remove("show");
    }, 1400);
    setTimeout(() => setShowPopup(false), 1500);
    navigator.clipboard.writeText(link);
  };

  /**
   * Asynchronously takes a reward by making a POST request to the "/api/take-reward" endpoint.
   * If the response is successful, decrements the reward value by 1 every 10 milliseconds until it reaches 0.
   *
   * @return {Promise<void>} A Promise that resolves when the reward is taken.
   */
  const takeReward = async (): Promise<void> => {
    const fetchTakeReward = async () => {
      const response = await fetch("/api/take-reward", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          initData: initDataRaw,
          player_id: initData?.user?.id,
        }),
      });
      if ((await response.json()).ok) {
        const intervalId = setInterval(() => {
          setReward((reward) =>
            reward > 0 ? reward - 1 : clearInterval(intervalId) || 0
          );
        }, 10);
      }
    };
    fetchTakeReward();
  };

  const createPopup = (message: string): JSX.Element => {
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
