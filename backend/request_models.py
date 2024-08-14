from pydantic import BaseModel


class DefaultRequest(BaseModel):
    initData: str


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
