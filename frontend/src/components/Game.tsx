import ReactGodot from "react-godot";

function Game() {
  const pckFile = "../assets/game/KickTheDoll.pck";
  const scriptFile = "../assets/game/KickTheDoll.js";

  return (
    <>
      <ReactGodot
        pck={pckFile}
        script={scriptFile}
        resize={false}
        params={"32"}
      />
    </>
  );
}

export default Game;
