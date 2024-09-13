import { useEffect, useState } from "react";
import NavBar from "../NavBar";
import { retrieveLaunchParams } from "@telegram-apps/sdk";



const Game: React.FC = () => {
  const { initData, initDataRaw } = retrieveLaunchParams();
  const [variable, setVariable] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);
  const [bonus, setBonus] = useState<boolean>(false);
  // TODO: Fetch game parameters from the launch parameters
  useEffect(() => {
    const fetchGameParams = () => {
      fetch('/api/game/params/get', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          player_id: initData?.user?.id,
          initData: initDataRaw
        }),
      }).then(response => response.json()).then((data) => {
        if (data.ok) {
          setVariable(data.var);
          setBalance(data.bal);
          setBonus(data.bon);
        }
      })
    }
    fetchGameParams();
  })

  //TODO: Game fetching at the end

  return (
    <>
      <iframe
        id="game"
        src={`KickTheDoll.html?val=${variable}&trast=${balance}&lavai=${bonus ? 1 : 0}`}
        title="Game"
        width={"100%"}
        style={{ height: "90vh" }}
      />

      <NavBar stricted={false} />
    </>
  );
}

export default Game;
