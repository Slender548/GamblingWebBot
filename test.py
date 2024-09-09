import aiohttp
from bs4 import BeautifulSoup


async def fetch(session, url):
    async with session.get(url) as response:
        return await response.text()


async def main():
    async with aiohttp.ClientSession(
        headers={
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
        }
    ) as session:
        html = await fetch(session, "https://coinmarketcap.com")
        soup = BeautifulSoup(html, "html.parser")
        table = soup.find("tbody")
        trs = table.find_all("tr", limit=20)
        coins = []
        for tr in trs:
            tds = tr.find_all("td")
            price = tds[3].get_text()
            value, rate = tds[2].get_text(" ", strip=True).rsplit(" ", maxsplit=1)
            coins.append({"value": value, "rate": rate, "price": price})
        print(coins)


async def coin(id: int):
    async with aiohttp.ClientSession(
        headers={
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
        }
    ) as session:
        html = await fetch(session, "https://coinmarketcap.com")
        soup = BeautifulSoup(html, "html.parser")
        table = soup.find("tbody")
        tr = table.find_all("tr", limit=20)[id - 1]
        tds = tr.find_all("td")
        price = tds[3].get_text()
        value, rate = tds[2].get_text(" ", strip=True).rsplit(" ", maxsplit=1)
        print(value, rate, price)


if __name__ == "__main__":
    import asyncio

    loop = asyncio.get_event_loop()
    loop.run_until_complete(coin(20))
    # loop.run_until_complete(main())
