import { useNavigate } from "react-router-dom";

const NavBar = () => {
    const navigate = useNavigate();
    
    return <>
        <div className="nav">
        <button type="button" id="Ref" onClick={()=>navigate('/referal')} className="btn btn-nav">
            Referal
        </button>
        <button type="button" id="Bal" onClick={()=>navigate("/balance")} className="btn btn-nav">
            Balance
        </button>
        <button type="button" id="Game" onClick={()=>navigate("/game")} className="btn btn-nav">
            Game
        </button>
        <button type="button" id="Games" onClick={()=>navigate("/games")} className="btn btn-nav">
            Games
        </button>
        <button type="button" id="Lottery" onClick={()=>navigate("/lottery")} className="btn btn-nav">
            Lottery
        </button>
    </div>
    </>
};

export default NavBar;