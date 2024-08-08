import { RefObject, useRef, useState } from "react";

const BlackjackPage = () => {
  const [notifyPopup, setNotifyPopup] = useState<string | null>(null);
  const [showClass, setShowClass] = useState<boolean>(false);
  const [createPopup, setCreatePopup] = useState<boolean>(false);
  const nameRef: RefObject<HTMLInputElement> = useRef(null);
  const rewardRef: RefObject<HTMLInputElement> = useRef(null);
  const rooms = [{ name: "Фафаф", reward: 23, room_id: "fafafa" }];

  const showNotifyPopup = (message: string) => {
    setNotifyPopup(message);
    setTimeout(() => {
      setShowClass(true); // Показать класс "show"
    }, 50); // Небольшая задержка перед показом класса "show"

    setTimeout(() => {
      setShowClass(false); // Убрать класс "show" перед скрытием
      setTimeout(() => {
        setNotifyPopup(null);
      }, 500); // Дождаться завершения анимации исчезновения
    }, 1000); // Показ сообщения в течение 1 секунды
  };

  const createBlackjack = async () => {
    const name = nameRef.current?.value;
    const reward = rewardRef.current?.value;
    if (!name || !reward) {
      showNotifyPopup("Необходимо заполнить все поля");
      return;
    }
    const response = await fetch("/api/dice/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name, reward: reward }),
    });

    if (!response.ok) {
      const data = await response.json();
      showNotifyPopup(data.msg);
      return;
    }

    const data: {
      msg: string;
      ok: boolean;
      status: number;
      room_id: string;
      name: string;
      reward: number;
    } = await response.json();

    //redirect to blackjack?room_id=room_id&reward=reward
    window.location.href = `/blackjack_game?room_id=${data.room_id}&reward=${data.reward}`;
  };

  const joinBlackjack = async (room_id: string) => {
    const response = await fetch(`/api/dice/join?room_id=${room_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ room_id: room_id }),
    });
    if (!response.ok) {
      const data = await response.json();
      showNotifyPopup(data.msg);
      return;
    }

    const data: {
      msg: string;
      ok: boolean;
      status: number;
      room_id: string;
      name: string;
      reward: number;
    } = await response.json();

    //redirect to blackjack?room_id=room_id&reward=reward
    window.location.href = `/blackjack_game?room_id=${data.room_id}&reward=${data.reward}`;
  };

  const botStartDice = () => {
    window.location.href = "/blackjack_bot";
  };

  const setShowCreatePopup = () => {
    setCreatePopup(true);
    setTimeout(() => {
      const popup = document.getElementById("createPopup");
      if (popup) popup.classList.add("show");
    }, 10);
  };

  const closeCreatePopup = () => {
    setCreatePopup(false);
    setTimeout(() => {
      const popup = document.getElementById("createPopup");
      if (popup) popup.classList.remove("show");
    }, 100);
  };

  const createGame = () => {
    createBlackjack();
    closeCreatePopup();
  };

  const showCreatePopup = () => {
    return (
      <div id="createPopup" className="popup">
        <div className="popup-content">
          <h2>Создать игру</h2>
          <label>Название</label>
          <input type="text" ref={nameRef} name="game-name" maxLength={20} />
          <label>Награда</label>
          <input type="number" ref={rewardRef} name="game-reward" />
          <div className="popup-buttons">
            <button type="submit" className="btn-create" onClick={createGame}>
              Создать
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={closeCreatePopup}
            >
              Отменить
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="page-title"></div>
      <div className="page-other-dice">
        <div className="dice-create">
          <button onClick={setShowCreatePopup} className="btn-dice-create">
            Создать игру
          </button>
        </div>
        <div className="dice-start-bot">
          <button onClick={() => botStartDice()} className="btn-dice-create">
            Играть с ботом
          </button>
        </div>
        <div className="dice-table">
          {rooms.map(
            (
              room: { name: string; reward: number; room_id: string },
              index: number
            ) => (
              <button
                className="dice-join"
                key={index}
                onClick={joinBlackjack(room.room_id)}
              >
                <div className="dice-join-title">{room.name}</div>
                <div className="dice-join-reward">{room.reward}$</div>
              </button>
            )
          )}
        </div>
      </div>
      {createPopup && showCreatePopup()}
      {notifyPopup && (
        <div id="notify-popup" className={`popup ${showClass ? "show" : ""}`}>
          <div className="popup-content">
            <h2>{notifyPopup}</h2>
          </div>
        </div>
      )}
    </>
  );
};

export default BlackjackPage;
