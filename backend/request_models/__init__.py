from pydantic import BaseModel


class DefaultRequest(BaseModel):
    initData: str


class PlayerRequest(DefaultRequest):
    player_id: int


class TransactionRequest(DefaultRequest):
    amount: float
    transaction_type: int


class FinishedGameRequest(DefaultRequest):
    game_type: int
    amount: float
    first_user_id: int
    second_user_id: int | None


class LeaveRequest(DefaultRequest):
    room_id: str
    player_id: int


class RoomRequest(DefaultRequest):
    room_id: str


class CreateUserRequest(DefaultRequest):
    username: str
    telegram_id: str
    wallet_address: str


class CreateRoomRequest(DefaultRequest):
    name: str
    reward: int
    player_id: int


class TurnRequest(DefaultRequest):
    room_id: str
    player_id: int


class GetUpdatesRequest(BaseModel):
    room_id: str
    player_id: int


class JoinRequest(DefaultRequest):
    room_id: str
    player_id: int
