from typing import List
from sqlalchemy import update, delete, select
import asyncio
from .models import *

from uuid import uuid4
from pytz import timezone, utc


async def select_users():
    """
    Retrieves all users from the database and prints their details.

    This function uses an asynchronous database connection to execute a SELECT query on the Users table.
    It then fetches all the results and prints each user's details in a comma-separated format.

    Args:
        None

    Returns:
        None

    Example:
        >>> await select_users()
        1, 123456789, john_doe, 0x1234567890abcdef, 100.00, 500.00, 10, 2022-01-01 12:00:00
        2, 987654321, jane_doe, 0x9876543210fedcba, 50.00, 200.00, 5, 2022-01-15 14:30:00

    Note:
        This function assumes that the `new_session` function returns an asynchronous database connection object.
        It also assumes that the `Users` table has the following columns: `user_id`, `telegram_id`, `username`, `wallet_address`, `dollar_balance`, `money_balance`, `total_transactions`, and `joined_at`.
    """
    async with new_session() as conn:
        query = select(Users)
        result = await conn.execute(query)
        curr = result.scalars()
        for user in curr.fetchall():
            user: Users
            print(user.user_id,
                  user.telegram_id,
                  user.username,
                  user.wallet_address,
                  user.dollar_balance,
                  user.money_balance,
                  user.total_transactions,
                  user.joined_at,
                  sep=", ")


async def create_user(telegram_id: str | int, username: str,
                      wallet_address: str) -> bool:
    """
    Creates a new user in the database.

    Args:
        telegram_id (str): The Telegram ID of the user.
        username (str): The username of the user.
        wallet_address (str): The wallet address of the user.

    Returns:
        bool: True if the user is created successfully, False otherwise.
    """
    logger.info(f"Создан новый пользователь: Telegram ID: {telegram_id}, Никнейм: {username}, Адресс кошелька: {wallet_address}")
    
    async with new_session() as session:
        try:
            model = Users(telegram_id=telegram_id,
                          username=username,
                          wallet_address=wallet_address)
            session.add(model)
            await session.commit()
            return True  # User created successfully
        except Exception as e:
            print(f"Error creating user: {e.__class__.__name__}: {e}")
            return False  # Error creating user


async def get_user(telegram_id: str | int) -> Users:
    """
    Retrieves a user from the database based on their Telegram ID.

    Args:
        telegram_id (str): The Telegram ID of the user to retrieve.

    Returns:
        Users: The user object if found, otherwise None.

    Example:
        >>> await get_user("1234567890")
        Users(id=1, telegram_id="1234567890", username="JohnDoe")
    """
    async with new_session() as session:
        query = select(Users).where(Users.telegram_id == telegram_id)
        result = await session.execute(query)
        curr = result.scalars()
        return curr.first()


async def clear_user(telegram_id: str | int) -> bool:
    """
    Deletes a user from the database based on their Telegram ID.

    Args:
        telegram_id (str): The Telegram ID of the user to delete.

    Returns:
        bool: True if the user was found and deleted successfully, False otherwise.

    Example:
        >>> await clear_user("1234567890")
        True
    """
    logger.info(f"Пользователь {telegram_id} был удален")
    async with new_session() as session:
        async with session.begin():
            statement = delete(Users).where(Users.telegram_id == telegram_id)
            result = await session.execute(statement)
            return result.rowcount > 0


async def add_user_money(telegram_id: str, money: int) -> bool:
    """
    Adds a specified amount of money to a user's balance.

    Args:
        telegram_id (str): The Telegram ID of the user.
        money (int): The amount of money to add to the user's balance.

    Returns:
        bool: True if the user was found and their balance was updated successfully, False otherwise.

    Example:
        >>> await add_user_money("123456789", 100)  # Add 100 units of money to user with Telegram ID "123456789"
        True
    """
    logger.info(f"На баланс пользователя {telegram_id} было добавлено {money} монет")
    async with new_session() as session:
        async with session.begin():
            statement = update(Users).where(
                Users.telegram_id == telegram_id).values(
                    money_balance=Users.money_balance + money)
            result = await session.execute(statement)
            if result.rowcount > 0:
                return True  # User found and updated successfully
            else:
                return False  # User not found


async def subtract_user_money(telegram_id: str, money: int) -> bool:
    """
    Subtract a specified amount of money from a user's balance.

    Args:
        telegram_id (str): The Telegram ID of the user.
        money (int): The amount of money to subtract.

    Returns:
        bool: True if the user was found and the balance was updated successfully, False otherwise.

    Example:
        >>> await subtract_user_money("123456789", 100)
        True  # User with Telegram ID "123456789" had 100 units of money subtracted from their balance.

    Notes:
        This function uses a database transaction to ensure atomicity.
    """
    logger.info(f"С баланса пользователя {telegram_id} было вычтено {money} монет")
    async with new_session() as session:
        async with session.begin():
            statement = update(Users).where(
                Users.telegram_id == telegram_id).values(
                    money_balance=Users.money_balance - money)
            result = await session.execute(statement)
            if result.rowcount > 0:
                return True  # User found and updated successfully
            else:
                return False  # User not found


async def delete_user(telegram_id: str) -> bool:
    """Functions that deletes user based on their telegram ID

    Args:
        telegram_id (str): Telegram ID of the user who will be deleted

    Returns:
        bool: True if the user was deleted, False otherwise
    """
    logger.info(f"Удалён пользователь: {telegram_id}")
    async with new_session() as session:
        async with session.begin():
            statement = delete(Users).where(Users.telegram_id == telegram_id)
            result = await session.execute(statement)
            return result.rowcount > 0  # True if deletion was successful, False otherwise.


async def select_transactions():
    """
    Retrieves all transactions from the database and prints their details.

    This function uses an asynchronous database connection to execute a SELECT query on the Transactions table.
    It then fetches all the results and prints each transaction's details in a comma-separated format.

    Args:
        None

    Returns:
        None

    Example:
        >>> await select_transactions()
        1, 1, 123456789, 2022-01-01 12:00:00, 100.00, 500.00, 'deposit'
        2, 1, 123456789, 2022-01-05 14:30:00, 50.00, 200.00, 'withdrawal'
        3, 2, 987654321, 2022-01-10 16:00:00, 20.00, 100.00, 'transfer'

    Note:
        This function assumes that the `new_session` function returns an asynchronous database connection object.
        It also assumes that the `Transactions` table has the following columns: `transaction_id`, `user_id`, `telegram_id`, `timestamp`, `dollar_amount`, `money_amount`, and `type`.
    """
    async with new_session() as conn:
        query = select(Transactions)
        result = await conn.execute(query)
        curr = result.scalars()
        for transaction in curr.fetchall():
            transaction: Transactions
            created_at = transaction.created_at.replace(tzinfo=utc)
            moscow_tz = timezone('Europe/Moscow')
            new_created_at = (
                created_at.astimezone(moscow_tz)).strftime("%Y-%m-%d %H:%M:%S")
            print(transaction.transaction_id,
                  transaction.transaction_hash,
                  transaction.transaction_data,
                  transaction.transaction_type,
                  transaction.user_id,
                  new_created_at,
                  transaction.amount,
                  sep=", ")


async def create_transaction(user_id: str, amount: int, transaction_type: int) -> bool:
    """
    Creates a new transaction.

    Args:
        telegram_id (str): The Telegram ID of the user.
        amount (int): The amount of the transaction.
        transaction_type (int): The type of the transaction (e.g. 1 for deposit, 2 for withdrawal).
        transaction_data (str): Additional data about the transaction (e.g. payment method, description).

    Returns:
        bool: True if the transaction is created successfully, False otherwise.

    Example:
        >>> await create_transaction("123456789", 100, 1, "Paid via credit card")
    """
    logger.info(f"Создана транзакция: Пользователь: {user_id}, Сумма: {amount}, Тип: {"Вывод" if transaction_type else "Депозит"}")
    async with new_session() as session:
        try:
            model = Transactions(user_id=user_id,
                                 amount=amount,
                                 transaction_type=transaction_type)
            session.add(model)
            await session.commit()
            return True
        except Exception as e:
            print(f"Error creating transaction: {e.__class__.__name__}: {e}")
            return False


async def create_bet(user_id: int, amount: int, shift_days: int) -> bool:
    logger.info(
        f"Сделана ставка: Пользователь: {user_id}, Сумма: {amount}, На время: {shift_days} д вперёд"
    )
    async with new_session() as session:
        try:
            created_at = datetime.utcnow()
            supposed_at = created_at + timedelta(hours=shift_days)
            model = Bets(user_id=user_id,
                         amount=amount,
                         created_at=created_at,
                         supposed_at=supposed_at)
            session.add(model)
            await session.commit()
            return True
        except Exception as e:
            print(f"Error creating bet: {e.__class__.__name__}: {e}")
            return False


async def get_bets(user_id: int) -> List[Bets]:
    async with new_session() as session:
        query = select(Bets).where(Bets.user_id == user_id)
        result = await session.execute(query)
        bets = result.scalars().fetchall()
        return bets


async def mark_finished_game(game_type: int,
                             amount: int,
                             first_user_id: int,
                             second_user_id: int | None = None) -> bool:
    """
        Create finished game model and add it to database
    """
    logger.info(
        f"Игра помечена завершённой: Тип игры: {game_type}, Сумма: {amount}, ID 1-го игрока: {first_user_id}, ID 2-го игрока: {second_user_id}"
    )
    async with new_session() as session:
        try:
            model = FinishedGame(game_type=game_type,
                                 amount=amount,
                                 first_user_id=first_user_id,
                                 second_user_id=second_user_id)
            session.add(model)
            await session.commit()
            return True
        except Exception as e:
            print(f"Error creating finished game: {e.__class__.__name__}: {e}")
            return False


async def get_finished_games() -> List[FinishedGame]:
    """
        Get all finished games
    """
    async with new_session() as session:
        query = select(FinishedGame)
        result = await session.execute(query)
        games = result.scalars().all()
        return games


async def get_count_users() -> int:
    """
        Get count of all users
    """
    async with new_session() as session:
        query = select(db.func.count()).select_from(Users.user_id)
        result = await session.execute(query)
        count = result.scalar()
        return count


async def get_users(page: int = 1) -> List[Users]:
    """
        Get list of users

        Args:
            page (int): Page number

        Returns:
            List[Users]: List of users
    """
    async with new_session() as session:
        query = select(Users).offset((page - 1) * 10).limit(10)
        result = await session.execute(query)
        users = result.scalars().all()
        return users


async def edit_money_balance(telegram_id: str | int,
                             money_balance: float | int):
    logger.info(
        f"Был изменён монетный баланс пользователя {telegram_id} на {money_balance}"
    )
    async with new_session() as session:
        query = select(Users).where(Users.telegram_id == telegram_id)
        result = await session.execute(query)
        user = result.scalar()
        user.money_balance = money_balance
        await session.commit()
        return True


async def edit_dollar_balance(telegram_id: str | int,
                              dollar_balance: float | int):
    logger.info(
        f"Был изменён долларовый баланс пользователя {telegram_id} на {dollar_balance}"
    )
    async with new_session() as session:
        query = select(Users).where(Users.telegram_id == telegram_id)
        result = await session.execute(query)
        user = result.scalar()
        user.dollar_balance = dollar_balance
        await session.commit()
        return True


async def get_count_transactions() -> int:
    """
        Get count of all transactions
    """
    async with new_session() as session:
        query = select(db.func.count()).select_from(
            Transactions.transaction_id)
        result = await session.execute(query)
        count = result.scalar()
        return count


async def get_transactions(page: int = 1) -> List[Transactions]:
    """
        Get list of transactions

        Args:
            page (int): Page number

        Returns:
            List[Transactions]: List of transactions
    """
    async with new_session() as session:
        query = select(Transactions).offset((page - 1) * 10).limit(10)
        result = await session.execute(query)
        transactions = result.scalars().all()
        return transactions


async def get_transaction(transaction_id: int):
    async with new_session() as session:
        query = select(Transactions).where(
            Transactions.transaction_id == transaction_id)
        result = await session.execute(query)
        transaction = result.scalars().first()
        return transaction


async def confirm_transaction(transaction_id: int):
    logger.info(f"Подтверждена транзакция: {transaction_id}")
    async with new_session() as session:
        query = select(Transactions).where(
            Transactions.transaction_id == transaction_id)
        result = await session.execute(query)
        transaction = result.scalars().first()
        transaction.confirmed_at = datetime.utcnow()
        await session.commit()
        return True


async def get_count_referrals() -> int:
    """
        Get count of all referalls
    """
    async with new_session() as session:
        query = select(db.func.count()).select_from(Referrals.referral_id)
        result = await session.execute(query)
        count = result.scalar()
        return count


async def get_referral(id) -> Referrals:
    """
        Get referral

        Args:
            id (int): User id

        Returns:
            Referrals: Referral
    """
    async with new_session() as session:
        query = select(Referrals).where(Referrals.referrer_id == id)
        result = await session.execute(query)
        referral = result.scalars().first()
        return referral


async def get_referrals(page: int = 1) -> List[Referrals]:
    """
        Get list of referrals

        Args:
            page (int): Page number

        Returns:
            List[Referrals]: List of referrals
    """
    async with new_session() as session:
        #TODO: REMADE
        query = select(Referrals).offset((page - 1) * 10).limit(10)
        result = await session.execute(query)
        referrals = result.scalars().all()
        return referrals


async def get_sum_lottery_transactions() -> float:
    async with new_session() as session:
        query = select(db.func.sum(
            LotteryTransactions.amount)).select_from(LotteryTransactions)
        result = await session.execute(query)
        sum = result.scalar()
        return sum


async def get_count_lottery_transactions() -> int:
    async with new_session() as session:
        query = select(db.func.count()).select_from(LotteryTransactions)
        result = await session.execute(query)
        count = result.scalar()
        return count


async def get_lottery_transactions(page: int = 1) -> List[LotteryTransactions]:
    """
        Get list of lottery transactions

        Args:
            page (int): Page number

        Returns:
            List[LotteryTransactions]: List of lottery transactions
    """
    async with new_session() as session:
        query = select(LotteryTransactions).offset((page - 1) * 10).limit(10)
        result = await session.execute(query)
        transactions = result.scalars().all()
        return transactions


async def check_admin(telegram_id: str | int) -> bool:
    async with new_session() as session:
        query = select(Users).where(Users.telegram_id == telegram_id).where(
            Users.admin == True)
        result = await session.execute(query)
        user = result.scalars().first()
        return bool(user)


async def delete_referral(referral_id: int | str):
    logger.info(f"Удалена рефералка: {referral_id}")
    async with new_session() as session:
        query = select(Referrals).where(Referrals.referral_id == referral_id)
        result = await session.execute(query)
        referral = result.scalars().first()
        await session.delete(referral)
        await session.commit()
        return True


async def catch_sum():
    async with new_session() as session:
        query = select(db.func.sum(
            Transactions.amount)).select_from(Transactions)
        result = await session.execute(query)
        sum = result.scalar()
        print(sum)
