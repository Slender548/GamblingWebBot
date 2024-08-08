import { useNavigate } from "react-router-dom"
import Dice from "../assets/dice.png";
import Blackjack from "../assets/blackjack.png";
import Crash from "../assets/crash.png";
import Mines from "../assets/mines.png";
import Guess from "../assets/guess.png";
import Roulette from "../assets/roulette.png";

function Games() {
    const navigate = useNavigate();
    

    return <>
        <div className="page-title">
            <div className="page-title-cell">
                <b className="page-title-cell-title">Меню игр</b>
            </div>
        </div>
        <div className="page-other">
            <div className="page-other-games-cell">
                <div className="page-other-games-game-cell">
                    <img src={Dice} className="img-game-enter"/>
                    <button type="button" onClick={() => {navigate("/dice")}} className="btn-game-enter">
                        Dice
                    </button>
                </div>
                <div className="page-other-games-game-cell">
                    <img src={Blackjack} className="img-game-enter"/>
                    <button type="button" onClick={() => navigate("/blackjack")} className="btn-game-enter">
                        Blackjack
                    </button>
                </div>
            </div>
            <div className="page-other-games-cell">
                <div className="page-other-games-game-cell">
                    <img src={Mines} className="img-game-enter"/>
                    <button type="button" onClick={() => navigate("/mines")} className="btn-game-enter">
                        Mines
                    </button>
                </div>
                <div className="page-other-games-game-cell">
                    <img src={Crash} className="img-game-enter"/>
                    <button type="button" onClick={() => navigate("/crash")} className="btn-game-enter">
                        Crash
                    </button>
                </div>
            </div>
            <div className="page-other-games-cell">
                <div className="page-other-games-game-cell">
                    <img src={Guess} className="img-game-enter"/>
                    <button type="button" onClick={() => navigate("/guess")} className="btn-game-enter">
                        Guess
                    </button>
                </div>
                <div className="page-other-games-game-cell">
                    <img src={Roulette} className="img-game-enter"/>
                    <button type="button" onClick={() => navigate("/roulette")} className="btn-game-enter">
                        Roulette
                    </button>
                </div>
            </div>
        </div>
    </>
}

export default Games;