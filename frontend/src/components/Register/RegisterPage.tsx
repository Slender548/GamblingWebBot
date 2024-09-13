import { useTonAddress, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { toast } from "react-toastify";
import { retrieveLaunchParams } from "@telegram-apps/sdk";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



const RegisterPage: React.FC = (): JSX.Element => {
    const [registered, setRegistered] = useState<boolean>(false);
    const tonAddress = useTonAddress(true);
    const [tonConnectUI] = useTonConnectUI();
    const { initData, initDataRaw } = retrieveLaunchParams();
    const wallet = useTonWallet();
    const navigate = useNavigate();


    tonConnectUI.onStatusChange((wallet) => {
        if (wallet?.connectItems?.tonProof && 'proof' in wallet.connectItems.tonProof) {
            toast("YES")
            console.log(wallet.connectItems.tonProof.name)
            console.log(wallet.provider)
            console.log(wallet.account.chain)
            setRegistered(true);
        }
    });
    useEffect(() => {
        const fetchRegister = () => {
            fetch('/api/player/post', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    wallet_address: tonAddress,
                    telegram_id: initData?.user?.id,
                    username: initData?.user?.username,
                    initData: initDataRaw
                })
            }).then((response) => response.json()).then(data => {
                if (data.ok) {
                    toast.success("Вы успешно зарегистрированы")
                    navigate("/referal")
                } else {
                    toast.error(data.msg)
                }
            })
        }
        if (registered) fetchRegister();
    }, [registered, initData, initDataRaw, tonAddress, navigate])

    return <><div className="page-title">
        <div className="page-title-cell">
            <b className="page-title-cell-title">Регистрация</b>
        </div>
        <div className="page-title-cell" style={{ textAlign: "center" }}>
            <b className="page-title-cell-title" >Условие: </b>на вашем кошельке должно быть более 30 транзакций
        </div>
    </div>
        <div className="page-other">
            <button
                className="cell btn-money"
                onClick={() => tonConnectUI.openModal()}
            >
                Привязать TON Кошёлёк
            </button>

        </div>
    </>
}

export default RegisterPage;