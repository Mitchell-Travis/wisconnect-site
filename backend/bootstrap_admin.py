"""Run locally with: .venv/bin/python -m backend.bootstrap_admin"""

from getpass import getpass

from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.orm import Session

from .app.auth import AccountInput, EmailInput, PASSWORD_COMMON_MESSAGE, password_hash
from .app.database import engine
from .app.models import User


def main():
    try:
        email = EmailInput(email=input("Administrator email: ")).email
        name = input("Your name: ").strip()
        password = getpass("Choose a password (15–128 characters): ")
        if password != getpass("Confirm password: "):
            raise SystemExit("Passwords did not match. No changes made.")
        # Reuse the same name/password validation as invitation redemption.
        data = AccountInput(name=name, password=password)
    except ValidationError as error:
        messages = {
            "email": "Enter a valid email address.",
            "name": "Enter a name of 1–100 characters, not just spaces.",
            "password": "Choose a password of 15–128 characters.",
        }
        # Never print raw validation errors: they can contain the entered password.
        explanation = " ".join((PASSWORD_COMMON_MESSAGE if item["type"] == "password_common" else messages[item["loc"][0]]) for item in error.errors(include_input=False, include_context=False))
        raise SystemExit(f"{explanation} No changes made. Run npm run auth:admin to try again.") from None
    with Session(engine) as db:
        if db.scalar(select(User.id).where(User.role == "admin")):
            raise SystemExit("An administrator already exists. No changes made.")
        if db.scalar(select(User.id).where(User.email == email)):
            raise SystemExit("That email already has an account. No changes made.")
        db.add(User(email=email, name=data.name, password_hash=password_hash(data.password), role="admin"))
        db.commit()
    print("Administrator created. Open http://localhost:3000/admin/ to sign in.")


if __name__ == "__main__":
    main()
