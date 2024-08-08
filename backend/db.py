
import sqlite3

con = sqlite3.connect('kick_the_doll_db_base', autocommit=True)

cur = con.cursor()

def __init__() -> None:
    cur.executescript("""
        CREATE TABLE IF NOT EXISTS Users (
        user_id SERIAL PRIMARY KEY,
        telegram_id VARCHAR(64) UNIQUE NOT NULL,
        username VARCHAR(64),
        wallet_address VARCHAR(128) UNIQUE NOT NULL,
        balance DECIMAL(10, 2) DEFAULT 0,
        total_transactions INTEGER DEFAULT 0,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_referral BOOLEAN DEFAULT FALSE,
        referred_by INTEGER REFERENCES Users(user_id),
        referral_bonus DECIMAL(10, 2) DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS Wallets (
        wallet_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES Users(user_id),
        blockchain VARCHAR(16) NOT NULL,
        address VARCHAR(128) UNIQUE NOT NULL,
        balance DECIMAL(10, 2) DEFAULT 0,
        total_transactions INTEGER DEFAULT 0,
        last_checked TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS Bets (
        bet_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES Users(user_id),
        game_id INTEGER REFERENCES Games(game_id),
        amount DECIMAL(10, 2) NOT NULL,
        potential_win DECIMAL(10, 2),
        status VARCHAR(16) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        resolved_at TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS Referrals (
        referral_id SERIAL PRIMARY KEY,
        referrer_id INTEGER REFERENCES Users(user_id),
        referred_id INTEGER REFERENCES Users(user_id),
        bonus DECIMAL(10, 2),
        status VARCHAR(16) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS Deposits (
        deposit_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES Users(user_id),
        amount DECIMAL(10, 2) NOT NULL,
        blockchain VARCHAR(16) NOT NULL,
        transaction_hash VARCHAR(128),
        status VARCHAR(16) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        confirmed_at TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS Withdrawals (
        withdrawal_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES Users(user_id),
        amount DECIMAL(10, 2) NOT NULL,
        blockchain VARCHAR(16) NOT NULL,
        transaction_hash VARCHAR(128),
        status VARCHAR(16) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        confirmed_at TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS GameResults (
        result_id SERIAL PRIMARY KEY,
        game_id INTEGER REFERENCES Games(game_id),
        session_id INTEGER REFERENCES GameSessions(session_id),
        result_hash VARCHAR(64),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS TaptalkaSessions (
        session_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES Users(user_id),
        clicks INTEGER DEFAULT 0,
        reward DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS Drawings (
        drawing_id SERIAL PRIMARY KEY,
        name VARCHAR(64),
        prize DECIMAL(10, 2),
        criteria TEXT,
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS DrawingEntries (
        entry_id SERIAL PRIMARY KEY,
        drawing_id INTEGER REFERENCES Drawings(drawing_id),
        user_id INTEGER REFERENCES Users(user_id),
        entry_amount DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS Logs (
        log_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES Users(user_id),
        action TEXT,
        details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS Admins (
        admin_id SERIAL PRIMARY KEY,
        username VARCHAR(64) UNIQUE NOT NULL,
        password_hash VARCHAR(128) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS AdminActions (
        action_id SERIAL PRIMARY KEY,
        admin_id INTEGER REFERENCES Admins(admin_id),
        action TEXT,
        target_user INTEGER REFERENCES Users(user_id),
        details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

    """)