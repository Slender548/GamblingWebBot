from aiogram import Router, F, Bot
from aiogram.types import CallbackQuery, Message
from aiogram.fsm.context import FSMContext
import backend.database as db
from telegram_bot.states import States
from telegram_bot.keyboards import get_nav_keyboard

router = Router(name=__name__)

batch_size: int = 10


@router.callback_query(F.data.startswith("Balances_"))
async def balances(callback: CallbackQuery, state: FSMContext, bot: Bot):
    _, page = callback.data.split("_")
    count_balances = await db.get_count_users()
    if page < 0:
        await bot.answer_callback_query(callback.id, "Назад некуда")
        return
    if (start := page * batch_size + 1) > count_balances:
        await bot.answer_callback_query(callback.id, "Дальше некуда")
        return
    balances = await db.get_balances(page)
    end = min(start + 9, count_balances)
    answer = f"Балансы {start}-{end} из {count_balances}\n\n"
    data = list()
    for balance in balances:
        data.append(balance.)
        answer += f"[{balance[0]}]{balance[1]}: {balance[2]}\n"
    answer += "\n(если вам нужна конкретная страница, введите номер баланса на этой странице)"
    await state.set_state(States.Balances)
    await callback.message.edit_text(answer,
                                     reply_markup=get_nav_keyboard(
                                         "Balances", page, count_balances))


@router.message(States.Balances)
async def search_balances(message: Message, state: FSMContext):
    if message.text.isdigit():
        page = int(message.text)
        if page < 0:
            await message.answer(text="Номер баланса не может быть ниже нуля.")
            return
    else:
        await message.answer(
            text="Сообщение состоит не только из цифр. Введите число")
        return
    count_balances = await db.get_count_users()
    balances = await db.get_balances(page := page // 10)
    start = page * batch_size + 1
    end = min(start + 9, count_balances)
    answer = f"Балансы {start}-{end} из {count_balances}\n\n"
    for balance in balances:
        answer += f"[{balance[0]}]{balance[1]}: {balance[2]}\n"
    answer += "\n(если вам нужна конкретная страница, введите номер баланса на этой странице)"
    await state.set_state(States.Balances)
    await message.answer(answer,
                         reply_markup=get_nav_keyboard("Balances", page,
                                                       count_balances))
