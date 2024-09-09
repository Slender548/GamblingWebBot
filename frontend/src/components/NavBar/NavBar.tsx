import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface NavBarProps {
    stricted: boolean;
}

const NavBar = ({ stricted }: NavBarProps) => {
    const [navigateAwayUrl, setNavigateAwayUrl] = useState<string>("");
    const [showClass, setShowClass] = useState<boolean>(false);
    const navigate = useNavigate();

    const defaultNavigate = (path: string) => {
        navigate(path);
    };

    if (stricted) {
        const showLeavePopup = () => {
            setTimeout(() => {
                setShowClass(true);
            }, 50);
        };

        const sureLeave = () => {
            navigate(navigateAwayUrl);
            closeLeavePopup();
        };

        const closeLeavePopup = () => {
            setShowClass(false);
            setTimeout(() => setNavigateAwayUrl(""), 500);
        };

        const strictedNavigate = (path: string) => {
            setNavigateAwayUrl(path);
            showLeavePopup();
        };
        return (
            <>
                <div className="nav">
                    <button
                        type="button"
                        id="Ref"
                        onClick={() => strictedNavigate("/referal")}
                        className="btn btn-nav"
                    >
                        Referal
                    </button>
                    <button
                        type="button"
                        id="Bal"
                        onClick={() => strictedNavigate("/balance")}
                        className="btn btn-nav"
                    >
                        Balance
                    </button>
                    <button
                        type="button"
                        id="Game"
                        onClick={() => strictedNavigate("/game")}
                        className="btn btn-nav"
                    >
                        Game
                    </button>
                    <button
                        type="button"
                        id="Games"
                        onClick={() => strictedNavigate("/games")}
                        className="btn btn-nav"
                    >
                        Games
                    </button>
                    <button
                        type="button"
                        id="Lottery"
                        onClick={() => strictedNavigate("/lottery")}
                        className="btn btn-nav"
                    >
                        Lottery
                    </button>
                </div>
                {navigateAwayUrl && (
                    <div id="leave-popup" className={`popup ${showClass ? "show" : ""}`}>
                        <div className="popup-content">
                            <h2>Подтвердите выход</h2>
                            <p>Вы уверены, что хотите уйти?</p>
                            <div className="popup-buttons">
                                <button className="btn-cancel" onClick={sureLeave}>
                                    Да
                                </button>
                                <button className="btn-create" onClick={closeLeavePopup}>
                                    Нет
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    } else {
        return (
            <div className="nav">
                <button
                    type="button"
                    id="Ref"
                    onClick={() => defaultNavigate("/referal")}
                    className="btn btn-nav"
                >
                    Referal
                </button>
                <button
                    type="button"
                    id="Bal"
                    onClick={() => defaultNavigate("/balance")}
                    className="btn btn-nav"
                >
                    Balance
                </button>
                <button
                    type="button"
                    id="Game"
                    onClick={() => defaultNavigate("/game")}
                    className="btn btn-nav"
                >
                    Game
                </button>
                <button
                    type="button"
                    id="Games"
                    onClick={() => defaultNavigate("/games")}
                    className="btn btn-nav"
                >
                    Games
                </button>
                <button
                    type="button"
                    id="Lottery"
                    onClick={() => defaultNavigate("/lottery")}
                    className="btn btn-nav"
                >
                    Lottery
                </button>
            </div>
        );
    }
};

export default NavBar;
