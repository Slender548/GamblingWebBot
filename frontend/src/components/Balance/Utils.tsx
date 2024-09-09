/**
* Fetches player data from the API and updates the dollar and money balances.
*
* @return {Promise<number[]>}
*/
const fetchData = async (initDataRaw: string | undefined, userId: number | undefined): Promise<number[]> => {
    const response = await fetch("/api/player/get", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            initData: initDataRaw,
            player_id: userId,
        }),
    });
    const data = await response.json();
    if (data.ok) {
        return [data.player.dollar_balance, data.player.money_balance]
    } else {
        return [-1, -1]
    }
};

interface Transaction {
    id: string;
    transaction_type: string;
    amount: number;
    created_at: string;
    transaction_hash: string;
    confirmed: boolean;
}

/**
* Fetches the transaction history from the API and updates the transactions state.
*
* @return {Promise<Transaction[]>}
*/
const fetchHistory = async (initDataRaw: string | undefined, userId: number | undefined): Promise<Transaction[]> => {
    const response = await fetch("/api/transactions/get", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            initData: initDataRaw,
            player_id: userId,
        }),
    });
    const data = await response.json();
    if (data.ok) {
        return data.data;
    } else {
        return [];
    }
};



export { fetchData, fetchHistory };