from aiogram import Router, F, Bot
from aiogram.types import CallbackQuery, Message
from aiogram.fsm.context import FSMContext
import backend.database as db
from telegram_bot.states import States
from telegram_bot.keyboards import get_nav_keyboard, get_lottery_keyboard, get_create_lottery_keyboard, get_manage_lottery_keyboard, get_home_keyboard, get_sure_close_keyboard
from backend.lottery import get_current_lottery, create_lottery, close_lottery, change_date_lottery

router = Router(name=__name__)

batch_size: int = 10


@router.callback_query(F.data == "Lottery")
async def history_main(callback: CallbackQuery):
    await callback.message.edit_text(f'Всего внесено: {await db.get_sum_lottery_transactions()}$. Выберите действие:', reply_markup=get_lottery_keyboard())

@router.callback_query(F.data == "ManageLottery")
async def manage_lottery(callback: CallbackQuery):
    lottery = get_current_lottery()
    if lottery is None:
        await callback.message.edit_text("Активного розыгрыша нет", reply_markup=get_create_lottery_keyboard())
        return
    await callback.message.edit_text("Управление розыгрышем", reply_markup=get_manage_lottery_keyboard())


@router.callback_query(F.data == "CreateLottery")
async def create_lottery_suggest(callback: CallbackQuery, state: FSMContext):
    await state.set_state(States.CreateLottery)
    await callback.message.edit_text(text="Введите через сколько часов должен закончиться розыгрыш.", reply_markup=get_home_keyboard())

@router.message(States.CreateLottery)
async def create_lottery(message: Message, state: FSMContext):
    if not message.isdigit():
        await message.answer(text="Введите число.")
        return
    await state.clear()
    create_lottery(int(message.text))

@router.callback_query(F.data == "ChangeLotteryDate")
async def change_lottery_date(callback: CallbackQuery, state: FSMContext):
    await state.set_state(States.ChangeLotteryDate)
    await callback.message.edit_text(text="Введите через сколько часов должен закончиться розыгрыш.", reply_markup=get_home_keyboard())

@router.message(States.ChangeLotteryDate)
async def change_lottery_date(message: Message, state: FSMContext):
    if not message.isdigit():
        await message.answer(text="Введите число.")
        return
    await state.clear()
    change_date_lottery(int(message.text))

@router.callback_query(F.data == "CloseLottery")
async def close_lottery_suggest(callback: CallbackQuery, state: FSMContext):
    await callback.message.edit_text(text="Вы точно хотите закрыть розыгрыш прям сейчас?", reply_markup=get_sure_close_keyboard())

@router.callback_query(F.data == "SureCloseLottery")
async def sure_close_lottery(callback: CallbackQuery, state: FSMContext):
    close_lottery()
    await callback.message.edit_text(text="Вы успешно завершили розыгрыш. Награды начислены.", reply_markup=get_home_keyboard())


@router.callback_query(F.data.startswith("Lottery_"))
async def history(callback: CallbackQuery, state: FSMContext, bot: Bot):
    _, page = callback.data.split("_")
    count_transactions = await db.get_count_lottery_transactions()
    if page < 0:
        await bot.answer_callback_query(callback.id, "Назад некуда")
        return
    if (start := page * batch_size + 1) > count_transactions:
        await bot.answer_callback_query(callback.id, "Дальше некуда")
        return
    transactions = await db.get_lottery_transactions(page)
    end = min(start + 9, count_transactions)
    answer = f"Транзакции {start}-{end} из {count_transactions}\n\n"
    data = list()
    for idx, transaction in enumerate(transactions, start=1):
        data.append(transaction.id)
        answer += f"{idx}.{"Подтверждено" if transaction.confirmed_at else "Не подтверждено"}.[{transaction.created_at}].Пользователь ID:{transaction.telegram_id}.{transaction.amount}\n"
    answer += "\n(если вам нужна конкретная страница, введите номер транзакции на этой странице)"
    await state.set_state(States.LotteryHistory)
    await callback.message.edit_text(answer, reply_markup=get_nav_keyboard("Lottery", page, count_transactions, data))


@router.message(States.LotteryHistory)
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
    count_transactions = await db.get_count_lottery_transactions()
    transactions = await db.get_lottery_transactions(page := page // 10)
    start = page * batch_size + 1
    end = min(start + 9, count_transactions)
    answer = f"Транзакции {start}-{end} из {count_transactions}\n\n"
    data = list()
    for idx, transaction in enumerate(transactions, start=1):
        data.append(transaction.id)
        answer += f"{idx}.{"Подтверждено" if transaction.confirmed_at else "Не подтверждено"}.[{transaction.created_at}].Пользователь ID:{transaction.telegram_id}.{transaction.amount}\n"
    answer += "\n(если вам нужна конкретная страница, введите номер транзакции на этой странице)"
    await state.set_state(States.LotteryHistory)
    await message.answer(answer, reply_markup=get_nav_keyboard("Lottery", page, count_transactions, data))

