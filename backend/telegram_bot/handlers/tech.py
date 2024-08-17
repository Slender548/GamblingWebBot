from aiogram import Router, F
from aiogram.types import CallbackQuery, Message
from aiogram.fsm.context import FSMContext

from telegram_bot.keyboards import get_tech_keyboard, get_tech_sure_keyboard, get_home_keyboard
from telegram_bot.states import States

from backend.tech import start_works

from datetime import datetime, UTC

router = Router(name=__name__)


@router.callback_query(F.data == "Tech")
async def tech(callback: CallbackQuery):
    await callback.message.edit_text("Выберите опцию:",
                                     reply_markup=get_tech_keyboard())


@router.callback_query(F.data == "TechWorks")
async def tech_works_enter(callback: CallbackQuery, state: FSMContext):
    await state.set_state(States.Tech)
    await callback.message.edit_text(
        "Введите время и дату окончания технических работ по часовому поясу UTC(0+) в формате: {день:месяц:год.час:минута:секунда}. Пример: 30:09:2024.10:20:00",reply_markup=get_home_keyboard()
    )


@router.message(States.Tech)
async def tech_works_check(message: Message, state: FSMContext):
    try:
        tech_works_date = message.text.split(".")
        if len(tech_works_date) != 2:
            await message.answer("Неверный формат. пример: 30:09:2024.10:20:00"
                                 )
            return
        date = tech_works_date[0].split(":")
        time = tech_works_date[1].split(":")
        if len(date) != 3 or len(time) != 3:
            await message.answer("Неверный формат. пример: 30:09:2024.10:20:00"
                                 )
            return
        day, month, year = map(int, date)
        hour, minute, second = map(int, time)
        date_time = datetime(year, month, day, hour, minute, second)
        now = datetime.now(UTC)
        if date_time < now:
            await message.answer(
                f"Дата не может быть раньше, чем сейчас. пример: 30:09:2024.10:20:00. Сейчас: {now.strftime("%d:%m:%Y.%H:%M:%S")}"
            )
    except ValueError:
        await message.answer("Неверный формат. пример: 30:09:2024.10:20:00")
        return
    await state.update_data(tech_works_date=message.text)
    await message.answer(f"Вы выбрали: {message.text} по часовому поясу UTC (+0)",
                         reply_markup=get_tech_sure_keyboard(message.text))


@router.callback_query(F.data.startswith("TechYes_"))
async def tech_works_confirm(callback: CallbackQuery):
    text = callback.data.split("_")[1]
    if start_works(text):
        await callback.message.edit_text(f"Вы начали технические работы, которые закончатся {text} по часовому поясу 0+", reply_markup=get_home_keyboard())
    else:
        await callback.message.edit_text("Невозможно начать работы.", reply_markup=get_home_keyboard())
