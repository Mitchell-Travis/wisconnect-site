"""Atomic, expiring PostgreSQL limits shared by every API worker."""
import hashlib
import logging

from fastapi import HTTPException
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

from .database import DATABASE_URL

# Separate pool: routes may already hold their business transaction's connection.
# Never let limiter work exhaust/wait on that same pool while retaining its locks.
rate_limit_engine = create_engine(
    DATABASE_URL, pool_pre_ping=True, pool_size=5, max_overflow=0,
    pool_timeout=2, connect_args={"connect_timeout": 3},
)
logger = logging.getLogger(__name__)

CONSUME = text("""
    INSERT INTO rate_limit_buckets (key_hash, count, expires_at)
    VALUES (:key_hash, 1, statement_timestamp() + :window * interval '1 second')
    ON CONFLICT (key_hash) DO UPDATE SET
      count = CASE WHEN rate_limit_buckets.expires_at <= statement_timestamp()
                   THEN 1 ELSE LEAST(rate_limit_buckets.count + 1, :limit + 1) END,
      expires_at = CASE WHEN rate_limit_buckets.expires_at <= statement_timestamp()
                        THEN EXCLUDED.expires_at ELSE rate_limit_buckets.expires_at END
    RETURNING count, GREATEST(1, CEIL(EXTRACT(EPOCH FROM expires_at - statement_timestamp()))) AS retry_after
""")

CLEANUP = text("""
    DELETE FROM rate_limit_buckets WHERE key_hash IN (
        SELECT key_hash FROM rate_limit_buckets
        WHERE expires_at <= statement_timestamp()
        ORDER BY expires_at LIMIT 32 FOR UPDATE SKIP LOCKED
    )
""")


def bucket_key(key: str, window: int = 900) -> str:
    # Avoid storing raw IP addresses, account identifiers or emails in counters.
    return hashlib.sha256(f"{window}:{key}".encode()).hexdigest()


def throttle(key: str, limit: int, window: int = 900):
    if limit < 1 or window < 1:
        raise ValueError("Rate limit and window must be positive.")
    try:
        with rate_limit_engine.begin() as connection:
            connection.execute(text("SET LOCAL statement_timeout = '1500ms'"))
            connection.execute(text("SET LOCAL lock_timeout = '750ms'"))
            row = connection.execute(CONSUME, {
                "key_hash": bucket_key(key, window), "limit": limit, "window": window,
            }).one()
            # Bounded indexed maintenance; skip rows another worker is using.
            connection.execute(CLEANUP)
    except SQLAlchemyError:
        # No permissive in-memory fallback and no credentials/SQL in user output.
        logger.warning("Rate limiting is temporarily unavailable.")
        raise HTTPException(503, "Service temporarily unavailable. Try again shortly.",
                            headers={"Retry-After": "5"}) from None
    # Commit denied attempts as well; raising inside the transaction would undo them.
    if row.count > limit:
        retry_after = int(row.retry_after)
        raise HTTPException(429, f"Too many requests. Try again in {retry_after} seconds.",
                            headers={"Retry-After": str(retry_after)})
