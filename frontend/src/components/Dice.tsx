


function Dice() {
    const rooms = [{name: "Фафаф", reward: 23, room_id: "fafafa"}];

    const createDice = () => {
        const room_id = Math.random().toString(36).substr(2, 9);
        rooms.push({name: `Игра #${room_id}`, reward: 0, room_id});
    }

    const botStartDice = () => {
        // bot logic here
    }

    return <>
    <div className="page-title">
</div>
<div className="page-other-dice">
    <div className="dice-create">
        <button onClick={createDice} className="btn-dice-create">Создать игру</button>
    </div>
    <div className="dice-start-bot">
        <button onClick={botStartDice} className="btn-dice-create">Играть с ботом</button>
    </div>
    <div className="dice-table">
    {rooms.map((room, index) => (
    <button className="dice-join" key={index}>
        <div className="dice-join-title">{room.name}</div><div className="dice-join-reward">{room.reward}$</div>
    </button>
))}
    </div>
</div>
    </>
}

export default Dice;