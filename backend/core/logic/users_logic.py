from passlib.hash import pbkdf2_sha256
from datetime import datetime, timedelta
import re
from secrets import token_urlsafe
from typing import TYPE_CHECKING, Tuple, Dict
from copy import copy

if TYPE_CHECKING:
    from ..shared.transaction import Transaction

from .sessions_logic import SessionsLogic
from ..shared.models import User, Session
from ..db.users_db import UsersDB
from ..db.reset_password_db import ResetPasswordDB
from ..shared.config import SECRET_KEY, HASH_ALGORITHM, CONFIG


class UsersLogic:
    def __init__(self, transaction: "Transaction"):
        self.transaction = transaction
        self.pattern = re.compile(r'^[^\s\t]+$')
        self.db: UsersDB = UsersDB(transaction)
        self.reset_password: ResetPasswordDB = ResetPasswordDB(transaction)

    def add(self, user: User) -> Tuple[User, Session]:
        new_user = copy(user)
        new_user.user_id = None

        self.db.add(new_user)

        self.transaction.current_user = new_user

        sessions_logic = SessionsLogic(self.transaction)
        session = sessions_logic.create(new_user.user_id)
        self.transaction.current_session = session

        return new_user, session

    def get(self, user_id: int) -> User:
        user = self.db.get(user_id)
        if user is None:
            raise Exception("User not found")

        return user

    def update(self, user: User) -> User:
        self.db.update(user)
        return user

    def login(self, username: str, password: str) -> Tuple[User, Session]:
        user = self.db.get_by_username(username)
        if not user or not (self._check_password(password, user.password)):
            raise Exception("Username is not found or password is incorrect")

        self.transaction.current_user = user

        sessions_logic = SessionsLogic(self.transaction)
        session = sessions_logic.create(user.user_id)
        self.transaction.current_session = session

        return user, session

    def forgot_password(self, username: str) -> Dict[str, int]:
        data = {}

        user = self.db.get_by_username(username)
        if not user:
            raise Exception("Username is not found")

        token = token_urlsafe(CONFIG.token_length)
        expiration_time = int(
            datetime.timestamp(datetime.now() + timedelta(minutes=15))
        )

        data["user_id"] = user.user_id
        data["expiration_time"] = expiration_time
        data["token"] = token
        self.reset_password.add(data)

        return token

    def change_password(self, data: dict) -> None:
        try:
            if data["password"] != data["confirmPassword"]:
                raise Exception("Passwords mismatch")

            if not (data["password"] and data["confirmPassword"]):
                raise Exception("Password missed")

            if not self.pattern.search(data["password"]):
                raise Exception("Password contains spaces, don't try to break this project!")

            token_data = self.reset_password.get(token=data["token"])

            if token_data.used:
                raise Exception("Token is already used")

            current_time = datetime.timestamp(datetime.now())
            if current_time > token_data.expiration_time:
                raise Exception("Token is expired")

            self.db.update_password(token_data.user_id, data["password"])
            self.reset_password.mark_as_used(token_data.token)

        except Exception as e:
            raise Exception(f"An error occurred during execution: {e}")

    @staticmethod
    def _check_password(password: str, hashed_password: str) -> bool:
        return pbkdf2_sha256.verify(password, hashed_password)
