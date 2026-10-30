"""Local exercise only. Not a real-money wallet or authentication service."""
import sqlite3
from contextlib import closing

MAX_INT = 2**63 - 1


def positive_int(value):
    if type(value) is not int or not 0 < value <= MAX_INT:
        raise ValueError("expected positive SQLite integer")


def connect(path):
    db = sqlite3.connect(path, timeout=10, isolation_level=None)
    db.execute("PRAGMA foreign_keys = ON")
    return db


def initialize(path):
    with closing(connect(path)) as db:
        db.executescript("""
            CREATE TABLE wallets (
                id INTEGER PRIMARY KEY,
                owner INTEGER NOT NULL,
                active INTEGER NOT NULL CHECK(active IN (0, 1)),
                balance INTEGER NOT NULL
                    CHECK(typeof(balance) = 'integer' AND balance >= 0)
            );
            CREATE TABLE transfers (
                id INTEGER PRIMARY KEY,
                user_id INTEGER NOT NULL,
                request_key TEXT NOT NULL,
                source INTEGER NOT NULL REFERENCES wallets(id),
                target INTEGER NOT NULL REFERENCES wallets(id),
                amount INTEGER NOT NULL CHECK(typeof(amount) = 'integer' AND amount > 0),
                CHECK(source != target),
                UNIQUE(user_id, request_key)
            );
        """)


def transfer(path, user_id, key, source, target, amount):
    # ponytail: caller supplies trusted identity; an HTTP adapter must authenticate it.
    for value in (user_id, source, target, amount):
        positive_int(value)
    if type(key) is not str or not key.strip() or len(key) > 128:
        raise ValueError("invalid idempotency key")
    if source == target:
        raise ValueError("distinct wallets required")
    with closing(connect(path)) as db:
        db.execute("BEGIN IMMEDIATE")
        try:
            previous = db.execute(
                "SELECT id, source, target, amount FROM transfers WHERE user_id=? AND request_key=?",
                (user_id, key),
            ).fetchone()
            if previous:
                if previous[1:] != (source, target, amount):
                    raise ValueError("idempotency conflict")
                db.commit()
                return previous[0]
            sender = db.execute("SELECT owner, active, balance FROM wallets WHERE id=?", (source,)).fetchone()
            receiver = db.execute("SELECT active, balance FROM wallets WHERE id=?", (target,)).fetchone()
            if not sender or sender[0] != user_id or sender[1] != 1:
                raise ValueError("source unavailable")
            if not receiver or receiver[0] != 1:
                raise ValueError("target unavailable")
            if sender[2] < amount:
                raise ValueError("insufficient funds")
            if receiver[1] > MAX_INT - amount:
                raise ValueError("target balance overflow")
            db.execute("UPDATE wallets SET balance=balance-? WHERE id=?", (amount, source))
            db.execute("UPDATE wallets SET balance=balance+? WHERE id=?", (amount, target))
            result = db.execute(
                "INSERT INTO transfers(user_id, request_key, source, target, amount) VALUES (?, ?, ?, ?, ?)",
                (user_id, key, source, target, amount),
            ).lastrowid
            db.commit()
            return result
        except BaseException:
            db.rollback()
            raise


def history(path, user_id, wallet_id):
    positive_int(user_id)
    positive_int(wallet_id)
    with closing(connect(path)) as db:
        owner = db.execute("SELECT owner FROM wallets WHERE id=?", (wallet_id,)).fetchone()
        if owner != (user_id,):
            raise ValueError("wallet unavailable")
        return db.execute(
            "SELECT id, source, target, amount FROM transfers WHERE source=? OR target=? ORDER BY id",
            (wallet_id, wallet_id),
        ).fetchall()
