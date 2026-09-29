import os

from sqlalchemy import create_engine

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://wisconnect:wisconnect@127.0.0.1:5432/wisconnect",
)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
