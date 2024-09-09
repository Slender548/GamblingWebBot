
interface LotteryData {
    currentValue: number,
    endTime: string
}

/**
 * Fetches the current lottery data and updates the state
 * with the current lottery object and its end time.
 *
 * @return {Promise<LotteryData>} A promise that resolves when the data is fetched and updated.
 */
const fetchLottery = async (initDataRaw: string | undefined): Promise<LotteryData> => {
    const response = await fetch("/api/lottery", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            initData: initDataRaw,
        }),
    });
    const data = await response.json();
    if (data.ok) {
        return { currentValue: data.lottery, endTime: data.time }
    } else {
        return { currentValue: -1, endTime: "" }
    }
};

export { fetchLottery };