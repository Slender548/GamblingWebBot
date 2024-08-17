import aiogram
from aiogram import Bot, Dispatcher

from dotenv import load_dotenv
from os import environ

load_dotenv()

try:
    bot = Bot(environ["bot_token"])
    dp = Dispatcher(bot)
except KeyError:
    raise Exception("Please set your bot token in .env file")
