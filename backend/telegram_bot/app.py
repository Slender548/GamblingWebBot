import aiogram
from aiogram import Bot, Dispatcher

from dotenv import load_dotenv
from os import environ
import asyncio

from handlers import get_routers

load_dotenv()

try:
    bot = Bot(environ["bot_token"])
    dp = Dispatcher(bot)
except KeyError:
    raise Exception("Please set your bot token in .env file")


def start_bot() -> None:
    dp.include_router(get_routers())
    asyncio.get_event_loop().run_until_complete(dp.start_polling(bot))
