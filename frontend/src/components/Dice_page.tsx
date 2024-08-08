import { useState } from "react";

const BlackjackPage = () => {
  const rooms = [{ name: "Фафаф", reward: 23, room_id: "fafafa" }];

  const createBlackjack = () => {
    const room_id = Math.random().toString(36).substr(2, 9);
    rooms.push({ name: `Игра #${room_id}`, reward: 0, room_id });
  };

  const botStartDice = () => {
    // bot logic here
  };

  const [createPopup, setCreatePopup] = useState(false);
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
          <input type="text" id="game-name" name="game-name" />
          <label>Награда</label>
          <input type="number" id="game-reward" name="game-reward" />
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
          {rooms.map((room, index) => (
            <button className="dice-join" key={index}>
              <div className="dice-join-title">{room.name}</div>
              <div className="dice-join-reward">{room.reward}$</div>
            </button>
          ))}
        </div>
      </div>
      {createPopup && showCreatePopup()}
    </>
  );
};

export default BlackjackPage;
