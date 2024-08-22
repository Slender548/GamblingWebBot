import sqlalchemy as db
from sqlalchemy import String, ForeignKey
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

import asyncio
from dotenv import load_dotenv
from os import environ
from datetime import datetime, UTC, timedelta
from uuid import uuid4

load_dotenv()

engine = create_async_engine(environ["database_url"],
                             isolation_level="AUTOCOMMIT")
new_session = async_sessionmaker(engine, expire_on_commit=False)


class Model(DeclarativeBase):
    pass


class Users(Model):
    __tablename__ = "users"

    user_id: Mapped[int] = mapped_column(primary_key=True)
    telegram_id: Mapped[str] = mapped_column(unique=True)
    username: Mapped[str] = mapped_column(String(30))
    wallet_address: Mapped[str] = mapped_column(String(128),
                                                nullable=False,
                                                unique=True)
    admin: Mapped[bool] = mapped_column(nullable=True, default=None)
    dollar_balance: Mapped[float] = mapped_column(default=0)
    money_balance: Mapped[float] = mapped_column(default=0)
    total_transactions: Mapped[float] = mapped_column(default=0)
    joined_at: Mapped[datetime] = mapped_column(
        default=db.func.current_timestamp())


class Wallets(Model):
    __tablename__ = "wallets"

    wallet_id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.telegram_id'))
    blockchain: Mapped[str] = mapped_column(String(16), nullable=False)
    address: Mapped[str] = mapped_column(String(128),
                                         unique=True,
                                         nullable=False)
    balance: Mapped[float] = mapped_column(default=0)


class Bets(Model):
    __tablename__ = "bets"

    bet_id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.telegram_id'))
    amount: Mapped[float] = mapped_column(nullable=False)
    status: Mapped[bool] = mapped_column(default=False)
    created_at: Mapped[datetime]
    supposed_at: Mapped[datetime]
    resolved_at: Mapped[datetime] = mapped_column(default=None, nullable=True)


class FinishedGame(Model):
    __tablename__ = "finished_games"

    game_id: Mapped[int] = mapped_column(primary_key=True)
    game_type: Mapped[int] = mapped_column(nullable=False)
    first_user_id: Mapped[int] = mapped_column(ForeignKey('users.telegram_id'))
    second_user_id: Mapped[int | None] = mapped_column(
        ForeignKey('users.telegram_id'), nullable=True)
    amount: Mapped[int] = mapped_column(nullable=False)
    game_hash: Mapped[int] = mapped_column(nullable=False)
    resolved_at: Mapped[datetime] = mapped_column(
        nullable=False, default=db.func.current_timestamp())


class Referrals(Model):
    __tablename__ = "referrals"

    referral_id: Mapped[int] = mapped_column(primary_key=True)
    referrer_id: Mapped[int] = mapped_column(ForeignKey('users.telegram_id'),
                                             nullable=False)
    referred_id: Mapped[int] = mapped_column(ForeignKey('users.telegram_id'),
                                             nullable=False)
    bonus: Mapped[float] = mapped_column(default=0)
    status: Mapped[bool] = mapped_column(nullable=True, default=None)


class Transactions(Model):
    __tablename__ = "transactions"

    transaction_id: Mapped[int] = mapped_column(primary_key=True)
    telegram_id: Mapped[int] = mapped_column(ForeignKey('users.telegram_id'))
    amount: Mapped[float] = mapped_column(nullable=False)
    transaction_hash: Mapped[str] = mapped_column(str(uuid4()))
    transaction_type: Mapped[int] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        default=db.func.current_timestamp())
    confirmed_at: Mapped[datetime] = mapped_column(nullable=True, default=None)


class LotteryTransactions(Model):
    __tablename__ = "lottery_transactions"

    id: Mapped[int] = mapped_column(primary_key=True)
    telegram_id: Mapped[int] = mapped_column(ForeignKey('users.telegram_id'))
    amount: Mapped[float] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        default=db.func.current_timestamp())
    confirmed_at: Mapped[datetime] = mapped_column(nullable=True)


async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Model.metadata.create_all)


if __name__ == "backend.models":
    asyncio.run(create_tables())
