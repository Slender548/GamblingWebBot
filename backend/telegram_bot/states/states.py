from aiogram.fsm.state import State, StatesGroup


class States(StatesGroup):
    Main = State()
    History = State()
    Users = State()
    Referrals = State()
    Balances = State()
    Tech = State()
    Lottery = State()
