from TonTools import TonCenterClient, Wallet, Contract, Jetton
import asyncio

# from pytonapi import AsyncTonapi


async def main():
    client = TonCenterClient(
        "0d7538e18bc61865ad01c859e12e90dcfdf72e4b348621c8db01996f78041ecf"
    )

    print(await client.get_balance("UQBl44aKy53MaV3dTa9nKaKxetO5-t87b56OqUZVkbQdd6Qm"))
    # client.get_balance(address="UQBl44aKy53MaV3dTa9nKaKxetO5-t87b56OqUZVkbQdd6Qm")
    # wallet = Wallet(
    #     provider=client,
    #     address="UQCzfQZ6jYOUrHd1WF2YNTJ63vAKdSxlzL52SWQhiYKF999y",
    # )
    # balance = await wallet.get_balance()
    # print(balance)
    # trs = await wallet.get_transactions(limit=31)
    # owner = Wallet(
    #     provider=client, address="UQBl44aKy53MaV3dTa9nKaKxetO5-t87b56OqUZVkbQdd6Qm"
    # )

    # len(await owner.get_transactions(limit=31))


async def ton():
    tonapi = AsyncTonapi(
        "AGPH2N54SISAMDYAAAACE6YGNJ6XJL2RYKZ2XQGF2PVL4RJLMARXRCWB4F7QPUY63ZDMMFI", True
    )
    account_id = "UQBl44aKy53MaV3dTa9nKaKxetO5-t87b56OqUZVkbQdd6Qm"
    trs = await tonapi.blockchain.get_account_transactions(
        account_id=account_id, limit=31
    )
    count = 0
    for tr in trs.transactions:
        count += 1
    print(count)


asyncio.run(main())
