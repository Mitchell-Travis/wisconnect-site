"""Run .venv/bin/python -m backend.check_passwords; no database or network needed."""
from pydantic import ValidationError
from .app.auth import AccountInput, Credentials, password_hash, password_matches


def main():
    for secret in ["short-password", "z" * 129, " " * 15, "x" * 15,
                   "12345678901234567890", " PASSWORDPASSWORD ", "WisConnect123456!", "🔑" * 14]:
        try:
            AccountInput(name="Test member", password=secret)
        except ValidationError as error:
            assert secret not in str(error), "Never echo a rejected password"
        else:
            raise AssertionError("Weak or invalid-length password accepted")
    for secret in ["maple river fog", "maple river fog " + "🌿" * 112,
                   "📚☀️ meadow river lantern", "  quiet meadow river canoe  "]:
        data = AccountInput(name="Test member", password=secret)
        assert data.password == secret, "Never trim or truncate passwords"
    assert len("maple river fog") == 15
    assert len("maple river fog " + "🌿" * 112) == 128
    secret = "maple river fog " + "🌿" * 112
    stored = password_hash(secret)
    assert password_matches(secret, stored)
    assert not password_matches(secret[:-1], stored), "All 128 characters affect the hash"
    assert Credentials(email="member@example.test", password="passwordpassword").password == "passwordpassword", "New-account rules must not lock out existing accounts"
    print("PASS: length boundaries, Unicode, common/context passwords, whitespace preservation, full-length hashing and existing login compatibility.")


if __name__ == "__main__":
    main()
