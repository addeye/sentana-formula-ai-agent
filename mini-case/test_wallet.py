import os
import tempfile
import threading
import unittest
import sqlite3
from contextlib import closing

from wallet import connect, history, initialize, transfer


class WalletTest(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.db_path = os.path.join(self.temp_dir.name, "wallet.db")
        initialize(self.db_path)
        with closing(connect(self.db_path)) as db:
            db.execute("INSERT INTO wallets(id, owner, active, balance) VALUES (1, 10, 1, 100000)")
            db.execute("INSERT INTO wallets(id, owner, active, balance) VALUES (2, 20, 1, 50000)")
            db.execute("INSERT INTO wallets(id, owner, active, balance) VALUES (3, 10, 0, 100000)")
            db.execute("INSERT INTO wallets(id, owner, active, balance) VALUES (4, 30, 0, 50000)")
            db.commit()

    def tearDown(self):
        self.temp_dir.cleanup()

    # AC01: Integer IDR positive validation, reject booleans, floats, invalid amounts
    def test_amount_type_validation(self):
        invalid_amounts = [True, False, 100.5, "1000", None, 0, -5000, 2**63]
        for bad in invalid_amounts:
            with self.subTest(amount=bad):
                with self.assertRaises(ValueError):
                    transfer(self.db_path, user_id=10, key=f"k-{bad}", source=1, target=2, amount=bad)

    # AC02: Source wallet owned by user and active
    def test_source_ownership_and_active(self):
        # Caller is user 99, but wallet 1 belongs to user 10
        with self.assertRaises(ValueError):
            transfer(self.db_path, user_id=99, key="k1", source=1, target=2, amount=1000)
        # Wallet 3 belongs to user 10, but is inactive (active = 0)
        with self.assertRaises(ValueError):
            transfer(self.db_path, user_id=10, key="k2", source=3, target=2, amount=1000)

    # AC03: Target wallet active and distinct from source
    def test_target_active_and_distinct(self):
        # Same source and target
        with self.assertRaises(ValueError):
            transfer(self.db_path, user_id=10, key="k3", source=1, target=1, amount=1000)
        # Target wallet 4 is inactive (active = 0)
        with self.assertRaises(ValueError):
            transfer(self.db_path, user_id=10, key="k4", source=1, target=4, amount=1000)

    # AC04: Balance nonnegative and insufficient funds rejected
    def test_insufficient_funds(self):
        with self.assertRaises(ValueError):
            transfer(self.db_path, user_id=10, key="k5", source=1, target=2, amount=100001)

    # AC05: Atomic debit credit ledger execution
    def test_atomic_transfer(self):
        tx_id = transfer(self.db_path, user_id=10, key="tx-success", source=1, target=2, amount=30000)
        self.assertIsInstance(tx_id, int)
        with closing(connect(self.db_path)) as db:
            s_bal = db.execute("SELECT balance FROM wallets WHERE id=1").fetchone()[0]
            t_bal = db.execute("SELECT balance FROM wallets WHERE id=2").fetchone()[0]
            ledger = db.execute("SELECT id, source, target, amount FROM transfers WHERE id=?", (tx_id,)).fetchone()
        self.assertEqual(s_bal, 70000)
        self.assertEqual(t_bal, 80000)
        self.assertEqual(ledger, (tx_id, 1, 2, 30000))

    # AC06: Idempotency replay with same payload returns cached transfer id
    def test_idempotency_same_payload(self):
        tx_id_1 = transfer(self.db_path, user_id=10, key="idem-1", source=1, target=2, amount=25000)
        tx_id_2 = transfer(self.db_path, user_id=10, key="idem-1", source=1, target=2, amount=25000)
        self.assertEqual(tx_id_1, tx_id_2)
        with closing(connect(self.db_path)) as db:
            s_bal = db.execute("SELECT balance FROM wallets WHERE id=1").fetchone()[0]
            t_bal = db.execute("SELECT balance FROM wallets WHERE id=2").fetchone()[0]
            count = db.execute("SELECT COUNT(*) FROM transfers WHERE request_key='idem-1'").fetchone()[0]
        self.assertEqual(s_bal, 75000)
        self.assertEqual(t_bal, 75000)
        self.assertEqual(count, 1)

    # AC07: Idempotency with different payload rejected
    def test_idempotency_conflicting_payload(self):
        transfer(self.db_path, user_id=10, key="idem-2", source=1, target=2, amount=25000)
        with self.assertRaises(ValueError):
            transfer(self.db_path, user_id=10, key="idem-2", source=1, target=2, amount=50000)

    # AC08: Idempotency scoped by user_id
    def test_idempotency_scoped_by_user(self):
        # User 10 uses key "shared-key" from wallet 1 to 2
        tx_1 = transfer(self.db_path, user_id=10, key="shared-key", source=1, target=2, amount=10000)
        # User 20 uses same key "shared-key" from wallet 2 to 1
        tx_2 = transfer(self.db_path, user_id=20, key="shared-key", source=2, target=1, amount=5000)
        self.assertNotEqual(tx_1, tx_2)

    # AC09: Concurrency: two 80,000 from 100,000 using barrier, file DB, independent connections
    def test_concurrent_transfers_only_one_wins(self):
        barrier = threading.Barrier(2)
        results = []
        errors = []

        def worker(client_key):
            try:
                barrier.wait(timeout=5)
                # Independent connection per function call to SQLite file DB
                tx = transfer(self.db_path, user_id=10, key=client_key, source=1, target=2, amount=80000)
                results.append(tx)
            except Exception as e:
                errors.append(e)

        t1 = threading.Thread(target=worker, args=("concurrent-k1",))
        t2 = threading.Thread(target=worker, args=("concurrent-k2",))
        t1.start()
        t2.start()
        t1.join()
        t2.join()

        self.assertEqual(len(results), 1, f"Expected exactly one success, got: {results}")
        self.assertEqual(len(errors), 1, f"Expected exactly one error, got: {errors}")
        self.assertIsInstance(errors[0], ValueError)
        self.assertEqual(str(errors[0]), "insufficient funds")
        with closing(connect(self.db_path)) as db:
            self.assertEqual(db.execute("SELECT COUNT(*) FROM transfers").fetchone()[0], 1)
        with closing(connect(self.db_path)) as db:
            s_bal = db.execute("SELECT balance FROM wallets WHERE id=1").fetchone()[0]
            t_bal = db.execute("SELECT balance FROM wallets WHERE id=2").fetchone()[0]
        self.assertEqual(s_bal, 20000)
        self.assertEqual(t_bal, 130000)

    # AC10: History ownership isolation and fail injection rollback
    def test_history_ownership(self):
        transfer(self.db_path, user_id=10, key="tx-h1", source=1, target=2, amount=10000)
        # Owner 10 reads wallet 1
        records = history(self.db_path, user_id=10, wallet_id=1)
        self.assertEqual(len(records), 1)
        self.assertEqual(records[0][1:], (1, 2, 10000))
        # Non-owner user 99 reading wallet 1 is rejected
        with self.assertRaises(ValueError):
            history(self.db_path, user_id=99, wallet_id=1)

    def test_fail_injection_rollback(self):
        # Test-only trigger fails after both balance updates, before ledger insertion.
        with closing(connect(self.db_path)) as db:
            db.execute("""CREATE TRIGGER fail_ledger BEFORE INSERT ON transfers
                        BEGIN SELECT RAISE(ABORT, 'injected ledger failure'); END""")
        with self.assertRaisesRegex(sqlite3.IntegrityError, "injected ledger failure"):
            transfer(self.db_path, user_id=10, key="fail-tx", source=1, target=2, amount=15000)

        # Confirm balances were rolled back and no transfer recorded
        with closing(connect(self.db_path)) as db:
            s_bal = db.execute("SELECT balance FROM wallets WHERE id=1").fetchone()[0]
            t_bal = db.execute("SELECT balance FROM wallets WHERE id=2").fetchone()[0]
            count = db.execute("SELECT COUNT(*) FROM transfers").fetchone()[0]
        self.assertEqual(s_bal, 100000)
        self.assertEqual(t_bal, 50000)
        self.assertEqual(count, 0)


if __name__ == "__main__":
    unittest.main()
