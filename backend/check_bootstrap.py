"""Run: .venv/bin/python -m backend.check_bootstrap (no database required)."""

import contextlib
import io
from unittest.mock import patch

from pydantic import ValidationError

from . import bootstrap_admin
from .app.auth import AccountInput, password_matches


def main():
    password = "synthetic-test-passphrase-only"
    cases = [
        ("admin@example.test", "Test admin", "passwordpassword", "passwordpassword", "too common"),
        ("admin@example.test", "Test admin", "short-test", "short-test", "15–128"),
        ("admin@example.test", "Test admin", "x" * 129, "x" * 129, "15–128"),
        ("admin@example.test", "   ", password, password, "name"),
        ("not-an-email", "Test admin", password, password, "email"),
        ("admin@example.test", "Test admin", password, "different", "did not match"),
    ]
    for email, name, secret, confirmation, expected in cases:
        with patch("builtins.input", side_effect=[email, name]), \
                patch.object(bootstrap_admin, "getpass", side_effect=[secret, confirmation]), \
                patch.object(bootstrap_admin, "Session") as session, \
                contextlib.redirect_stdout(io.StringIO()) as output:
            try:
                bootstrap_admin.main()
            except SystemExit as error:
                message = str(error)
                assert expected in message and "No changes made" in message
                assert secret not in message + output.getvalue()
                assert "input_value" not in message and "Traceback" not in message
                assert error.__context__ is None or error.__suppress_context__
            else:
                raise AssertionError("Invalid setup input was accepted")
            session.assert_not_called()

    # Defense in depth if another caller accidentally formats a validation error.
    try:
        AccountInput(name="Test admin", password="short-test")
    except ValidationError as error:
        assert "short-test" not in str(error) and "input_value" not in str(error)
    else:
        raise AssertionError("Password requirement was weakened")

    with patch("builtins.input", side_effect=[" ADMIN@example.test ", " Test admin "]), \
            patch.object(bootstrap_admin, "getpass", side_effect=[password, password]), \
            patch.object(bootstrap_admin, "Session") as session, \
            contextlib.redirect_stdout(io.StringIO()) as output:
        db = session.return_value.__enter__.return_value
        db.scalar.return_value = None
        bootstrap_admin.main()
        user = db.add.call_args.args[0]
        assert (user.email, user.name, user.role) == ("admin@example.test", "Test admin", "admin")
        assert password_matches(password, user.password_hash)
        db.commit.assert_called_once()
        assert password not in output.getvalue()
    print("PASS: setup validation is safe, invalid inputs never reach the database, and valid setup still works.")


if __name__ == "__main__":
    main()
