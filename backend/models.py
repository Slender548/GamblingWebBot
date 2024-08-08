from pydantic import BaseModel


class CreateRoomRequest(BaseModel):
    name: str
    reward: int
    player_id: int


class TurnRequest(BaseModel):
    room_id: str
    player_id: int


class GetUpdatesRequest(BaseModel):
    room_id: str
    player_id: int


class JoinRequest(BaseModel):
    room_id: str
    player_id: int
