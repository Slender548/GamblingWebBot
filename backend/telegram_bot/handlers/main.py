from aiogram import Router, F
from aiogram.filters import Command
from aiogram.types import Message, InlineKeyboardButton, CallbackQuery
from aiogram.utils.keyboard import InlineKeyboardBuilder
from telegram_bot.keyboards import get_main_keyboard

router = Router(name=__name__)


@router.callback_query(F.data == "Main")
async def callback_main_panel(callback: CallbackQuery):
    """
    This handler is an entry point for the bot. It shows the main panel with all the available sections.

    :param message: The message that triggered this handler
    """
    # Send the message with the keyboard
    await callback.message.edit_text("Главное меню",
                                     reply_markup=get_main_keyboard())


@router.message(Command("/admin"))
async def main_panel(message: Message):
    """
    This handler is an entry point for the bot. It shows the main panel with all the available sections.

    :param message: The message that triggered this handler
    """
    # Send the message with the keyboard
    await message.answer("Главное меню", reply_markup=get_main_keyboard())
