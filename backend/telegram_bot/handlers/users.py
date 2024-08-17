from aiogram import Router, F, Bot
from aiagram.types import CallbackQuery, InlineKeyboardButton, Message
from aiagram.utils.keyboard import InlineKeyboardBuilder
from aiagram.fsm.context import FSMContext
import backend.database as db
from backend.telegram_bot.states import States

router = Router(name=__name__)

batch_size: int = 10


@router.callback_query(F.data.startswith("Users_"))
async def users(callback: CallbackQuery, state: FSMContext, bot: Bot):
    _, page = callback.data.split("_")
    keyboard = InlineKeyboardBuilder()
    count_users = await db.get_count_users()
    keyboard.add(
        InlineKeyboardButton(
            text="⬅️", callback_data=f"Users_{0 if page < 1 else page-1}"),
        InlineKeyboardButton(text="🏠", callback_data="Main"),
        InlineKeyboardButton(
            text="🏠", callback_data=f"Users_{min(page+1, count_users//10)}"))
    if page < 0:
        await bot.answer_callback_query(callback.id, "Назад некуда")
        return
    if (start := page * batch_size + 1) > count_users:
        await bot.answer_callback_query(callback.id, "Дальше некуда")
        return
    users = await db.get_users(page)
    end = min(start + 9, count_users)
    answer = f"Пользователи {start}-{end} из {count_users}\n\n"
    for user in users:
        answer += f"{user[0]}: {user[1]}\n"
    answer += "\n(если вам нужна конкретная страница, введите номер пользователя на этой странице)"
    await state.set_state(States.Users)
    await callback.message.edit_text(answer, reply_markup=keyboard.as_markup())


@router.message(States.Users)
async def search_users(message: Message, state: FSMContext):
    if message.text.isdigit():
        page = int(message.text)
    else:
        await message.answer(
            text="Сообщение состоит не только из цифр. Введите число")
        return
    count_users = await db.get_count_users()
    users = await db.get_users(page := page // 10)
    keyboard = InlineKeyboardBuilder()
    keyboard.add(
        InlineKeyboardButton(
            text="⬅️", callback_data=f"Users_{0 if page < 1 else page-1}"),
        InlineKeyboardButton(text="🏠", callback_data="Main"),
        InlineKeyboardButton(
            text="🏠", callback_data=f"Users_{min(page+1, count_users//10)}"))
    start = page * batch_size + 1
    end = min(start + 9, count_users)
    answer = f"Пользователи {start}-{end} из {count_users}\n\n"
    for user in users:
        answer += f"{user[0]}: {user[1]}\n"
    answer += "\n(если вам нужна конкретная страница, введите номер пользователя на этой странице)"
    await state.set_state(States.Users)
    await message.answer(answer, reply_markup=keyboard.as_markup())
