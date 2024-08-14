from dotenv import load_dotenv
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from os import environ

load_dotenv()

DATABASE_URL = environ['database_url']

engine = create_async_engine(DATABASE_URL, echo=True)
