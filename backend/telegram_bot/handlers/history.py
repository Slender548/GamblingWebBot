from aiogram import Router, F, Bot
from aiogram.types import CallbackQuery, Message
from aiogram.fsm.context import FSMContext
import backend.database as db
from telegram_bot.states import States
from telegram_bot.keyboards import get_nav_keyboard

router = Router(name=__name__)

batch_size: int = 10


@router.callback_query(F.data.startswith("History_"))
async def history(callback: CallbackQuery, state: FSMContext, bot: Bot):
    _, page = callback.data.split("_")
    count_transactions = await db.get_count_transactions()
    if page < 0:
        await bot.answer_callback_query(callback.id, "Назад некуда")
        return
    if (start := page * batch_size + 1) > count_transactions:
        await bot.answer_callback_query(callback.id, "Дальше некуда")
        return
    transactions = await db.get_transactions(page)
    end = min(start + 9, count_transactions)
    answer = f"Транзакции {start}-{end} из {count_transactions}\n\n"
    for transaction in transactions:
        answer += f"{"Подтверждено" if transaction.confirmed_at else "Не подтверждено"}.[{transaction.created_at}:{"Вывод" if transaction.transaction_type else "Депозит"}].Пользователь ID:{transaction.telegram_id}.{transaction.amount}\n"
    answer += "\n(если вам нужна конкретная страница, введите номер транзакции на этой странице)"
    await state.set_state(States.History)
    await callback.message.edit_text(answer, reply_markup=get_nav_keyboard("History", page, count_transactions))


@router.message(States.History)
async def search_history(message: Message, state: FSMContext):
    if message.text.isdigit():
        page = int(message.text)
        if page < 0:
            await message.answer("Номер транзакции не может быть ниже нуля.")
            return
    else:
        await message.answer(
            text="Сообщение состоит не только из цифр. Введите число")
        return
    count_transactions = await db.get_count_transactions()
    transactions = await db.get_transactions(page := page // 10)
    start = page * batch_size + 1
    end = min(start + 9, count_transactions)
    answer = f"Транзакции {start}-{end} из {count_transactions}\n\n"
    for transaction in transactions:
        answer += f"{"Подтверждено" if transaction.confirmed_at else "Не подтверждено"}.[{transaction.created_at}:{"Вывод" if transaction.transaction_type else "Депозит"}].Пользователь ID:{transaction.telegram_id}.{transaction.amount}\n"
    answer += "\n(если вам нужна конкретная страница, введите номер транзакции на этой странице)"
    await state.set_state(States.History)
    await message.answer(answer, reply_markup=get_nav_keyboard("History", page, count_transactions))



@router.callback_query(F.data.startswith("Histor_"))
async def search_histor(callback: CallbackQuery):
    query = callback.data.split("_")[1]
    if query.isdigit():
        page = int(query)
    else:
        page = 0
    count_transactions = await db.get_count_transactions()
    transactions = await db.get_transactions_like(query, page=page)
    start = page * batch_size + 1
    end = min(start + 9, count_transactions)
    answer = f"Транзакции {start}-{end} из {count_transactions}\n\n"
    for transaction in transactions:
        answer += f"{"Подтверждено" if transaction.confirmed_at else 'Не подтверждено'}.[{transaction.created_at}:{'Вывод' if transaction.transaction_type else 'Депозит'}].Пользователь ID:{transaction.telegram_id}.{transaction.amount}\n"
    answer += "\n(если вам нужна конкретная страница, введите номер транзакции на этой странице)"
