from typing import TYPE_CHECKING, Union, cast
from ..shared.models import ResetPassword, ResetPasswordSchema

if TYPE_CHECKING:
    from ..shared.transaction import Transaction

from ..shared.models import ResetPassword


class ResetPasswordDB:
    def __init__(self, transaction: "Transaction"):
        self.transaction = transaction

    def get(self, token: str) -> Union[ResetPassword, None]:
        query = (
            "SELECT user_id, token, expiration_time, used "
            "FROM password_reset_tokens "
            "WHERE token = ?"
        )

        cursor = self.transaction.cursor()
        cursor.execute(query, (token,))
        row = cursor.fetchone()
        cursor.close()

        if row:
            schema = ResetPasswordSchema()
            return cast(ResetPassword, schema.load(row))

        return None

    def add(self, data: ResetPassword):
        query = (
            "INSERT INTO password_reset_tokens (user_id, token, expiration_time)"
            "VALUES (?, ?, ?)"
        )
        cursor = self.transaction.cursor()
        cursor.execute(
            query,
            (
                data["user_id"],
                data["token"],
                data["expiration_time"],
            ),
        )

        cursor.close()

    def mark_as_used(self, token: str):
        query = "UPDATE password_reset_tokens SET used = ? WHERE token = ?"
        cursor = self.transaction.cursor()
        cursor.execute(query, (True, token))

        cursor.close()
