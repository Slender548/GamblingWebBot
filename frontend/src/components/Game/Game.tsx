import * as React from "react";
import NavBar from "../NavBar";

class Game extends React.Component {
  render() {
    return (
      <>
        <iframe
          id="game"
          src={`KickTheDoll.html?val=${24}&trast=${10}&lavai=${1}`}
          title="Game"
          width={"100%"}
          style={{ height: "90vh" }}
        />

        <NavBar stricted={false} />
      </>
    );
  }
}

export default Game;
