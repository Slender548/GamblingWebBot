from aiogram.utils.keyboard import InlineKeyboardBuilder
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup


def get_keyboard() -> InlineKeyboardMarkup:
    keyboard = InlineKeyboardBuilder()
    keyboard.add(
        InlineKeyboardButton(text="Закрыть бота на технические работы",
                             callback_data="TechWorks"),
        InlineKeyboardButton(text="🏠", callback_data="Main"),
    )
    return keyboard.as_markup()


def sure_keyboard(date: str) -> InlineKeyboardMarkup:
    keyboard = InlineKeyboardBuilder()
    keyboard.add(
        InlineKeyboardButton(text="Да", callback_data=f"TechYes_{date}"),
        InlineKeyboardButton(text="Нет", callback_data="TechWorks"),
    )
    return keyboard.as_markup()
