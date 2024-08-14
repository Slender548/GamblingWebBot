from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse

from starlette.templating import Jinja2Templates
from starlette.staticfiles import StaticFiles

from random import randint, choice

from backend.request_models import *
from backend.utils import *
import backend.database as db

app: FastAPI = FastAPI(debug=True)
app.mount('/assets',
          StaticFiles(directory="assets", check_dir=False),
          name="assets")

dice_rooms: dict = dict()
blackjack_rooms: dict = dict()

cards_52: List[str] = [
    '2_h', '2_d', '2_c', '2_s', '3_h', '3_d', '3_c', '3_s', '4_h', '4_d',
    '4_c', '4_s', '5_h', '5_d', '5_c', '5_s', '6_h', '6_d', '6_c', '6_s',
    '7_h', '7_d', '7_c', '7_s', '8_h', '8_d', '8_c', '8_s', '9_h', '9_d',
    '9_c', '9_s', 'j_h', 'j_d', 'j_c', 'j_s', 'q_h', 'q_d', 'q_c', 'q_s',
    'k_h', 'k_d', 'k_c', 'k_s'
]

templates: Jinja2Templates = Jinja2Templates(directory='templates')


@app.post('/api/initdata/check', response_class=JSONResponse)
async def check_init_data(request: DefaultRequest):
    if is_telegram(request.initData):
        return {"msg": "Данные инициализации корректны", "ok": True}
    else:
        return {"msg": "Данные инициализации некорректны", "ok": False}


@app.get('/api/player/{id}', response_class=JSONResponse)
async def get_player_by_id(id: str, request: DefaultRequest):
    if not is_telegram(request.initData):
        return {"msg": "Как ты сюда попал", "ok": False, "status": 401}
    player = await db.get_user(id)
    if player:
        return {
            "msg": "Игрок успешно найден",
            "ok": True,
            "status": 200,
            "player": {
                "wallet_address": player.wallet_address,
                "dollar_balance": player.dollar_balance,
                "money_balance": player.money_balance,
                "total_transactions": player.total_transactions
            }
        }
    else:
        return {"ok": False, "status": 404, "msg": "Игрок не найден"}


@app.post('/api/player', response_class=JSONResponse)
async def create_player(request: CreateUserRequest):
    if not is_telegram(request.initData):
        return {"msg": "Как ты сюда попал", "ok": False, "status": 401}
    wallet_address = request.wallet_address
    username = request.username
    telegram_id = request.telegram_id
    if db.create_user(telegram_id=telegram_id,
                      username=username,
                      wallet_address=wallet_address):
        return {"msg": "Игрок успешно создан", "ok": True, "status": 201}
    else:
        return {"ok": False, "status": 400, "msg": "Ошибка создания игрока"}


@app.post('/api/transaction', response_class=JSONResponse)
async def create_transaction(request: TransactionRequest):
    if not is_telegram(request.initData):
        return {"msg": "Как ты сюда попал", "ok": False, "status": 401}
    amount = request.amount
    transaction_type = request.transaction_type
    transaction_data = request.transaction_data

    if db.create_transaction(request.telegram_id, amount, transaction_type,
                             transaction_data):
        return {"msg": "Транзакция успешно создана", "ok": True, "status": 201}
    else:
        return {
            "ok": False,
            "status": 400,
            "msg": "Ошибка создания транзакции"
        }


@app.post('/api/game/finish', response_class=JSONResponse)
async def create_finished_game(request: FinishedGameRequest):
    if not is_telegram(request.initData):
        return {"msg": "Как ты сюда попал", "ok": False, "status": 401}
    game_type = request.game_type
    amount = request.amount
    first_user_id = request.first_user_idw
    second_user_id = request.second_user_id
    if db.mark_finished_game(game_type, amount, first_user_id, second_user_id):
        return {"msg": "Игра успешно завершена", "ok": True, "status": 201}
    else:
        return {"ok": False, "status": 400, "msg": "Ошибка завершения игры"}


@app.get('/api/dice/rooms', response_class=JSONResponse)
async def get_dice_rooms(request: Request):
    available_rooms = [{
        "room_id": room_id,
        "name": details["name"],
        "reward": details["reward"]
    } for room_id, details in dice_rooms.items() if not details["going"]]
    return {"ok": True, "status": 200, "rooms": available_rooms}


@app.post('/api/dice/create', response_class=JSONResponse)
async def create_dice_room(request: CreateRoomRequest):
    if not is_telegram(request.initData):
        return {"msg": "Как ты сюда попал", "ok": False, "status": 401}
    new_room_id = generate_room_id()
    name = request.name
    reward = request.reward
    dice_rooms[new_room_id] = {
        "name": name,
        "reward": int(reward),
        "going": False,
        "active_player": f"p{randint(1,2)}",
        "dice_hands": {
            "p1": 0,
            "p2": 0
        },
        "dice_count": {
            "p1": 0,
            "p2": 0
        },
        "dice_results": {
            "p1": 0,
            "p2": 0
        },
    }
    return {
        "ok": True,
        "status": 200,
        "msg": "Комната успешно создана",
        "room_id": new_room_id,
        "name": name,
        "reward": reward
    }


@app.post('/api/dice/join', response_class=JSONResponse)
async def join_dice_room(request: JoinRequest):
    if not is_telegram(request.initData):
        return {"msg": "Как ты сюда попал", "ok": False, "status": 401}
    room_id = request.json["room_id"]
    if room_id in dice_rooms:
        details = dice_rooms[room_id]
        if not details["going"]:
            details["going"] = True
            details["active_player"] = f"p{randint(1,2)}"
            return {
                "ok": True,
                "status": 200,
                "msg": "Вы успешно присоединились к комнате",
                "room_id": room_id,
                "name": details["name"],
                "reward": details["reward"]
            }
        else:
            return {"ok": False, "status": 403, "msg": "Комната уже играется"}
    else:
        return {"ok": False, "status": 404, "msg": "Комната не найдена"}


@app.post('api/dice/roll_dice', response_class=JSONResponse)
async def roll_dice(request: TurnRequest):
    if not is_telegram(request.initData):
        return {"msg": "Как ты сюда попал", "ok": False, "status": 401}


@app.post('api/dice/get_updates', response_class=JSONResponse)
async def get_dice_updates(request: GetUpdatesRequest):
    pass


@app.post('api/blackjack/create', response_class=JSONResponse)
async def create_blackjack_room(request: CreateRoomRequest):
    if not is_telegram(request.initData):
        return {"msg": "Как ты сюда попал", "ok": False, "status": 401}
    name: str = request.name
    reward: int = request.reward
    new_room_id: int = generate_room_id()
    blackjack_rooms[new_room_id] = {
        "name": name,
        "reward": int(reward),
        "going": False,
        "active_player": randint(0, 1),
        "players": [request.player_id],
        "hands": [
            [choice(cards_52), choice(cards_52)],
        ],
        "count": [0],
        "results": [0],
    }
    return {
        "msg": "Комната успешно создана!",
        "ok": True,
        "status": 200,
        "room_id": new_room_id,
        "name": name,
        "reward": reward
    }


@app.post('api/blackjack/join', response_class=JSONResponse)
async def join_blackjack_room(request: JoinRequest):
    if not is_telegram(request.initData):
        return {"msg": "Как ты сюда попал", "ok": False, "status": 401}
    if request.room_id not in blackjack_rooms:
        return {"msg": "Комнаты не существует.", "ok": False, "status": 404}
    current_room: dict = blackjack_rooms[request.room_id]
    if len(current_room["players"]) > 1:
        return {"msg": "Комната заполнена.", "ok": False, "status": 403}
    current_room["going"] = True
    current_room["players"].append(request.player_id)
    current_room["hands"].append([choice(cards_52), choice(cards_52)])
    current_room["count"].append(0)
    current_room["results"].append(0)
    return {
        "msg": "Вы успешно присоединились к комнате!",
        "ok": True,
        "status": 200,
        "room_id": request.room_id,
        "name": current_room["name"],
        "reward": current_room["reward"]
    }


@app.post('api/blackjack/pass', response_class=JSONResponse)
async def pass_card(request: TurnRequest):
    if not is_telegram(request.initData):
        return {"msg": "Как ты сюда попал", "ok": False, "status": 401}
    if request.room_id not in blackjack_rooms:
        return {"msg": "Комната не найдена!", "ok": False, "status": 404}
    current_room: dict = blackjack_rooms[request.room_id]
    player_idx: int = current_room["players"].index(request.player_id)
    if current_room["active_player"] != player_idx:
        return {"msg": "Не ваш ход.", "ok": False, "status": 401}
    current_room["active_player"] = int(not player_idx)  #Reverse active player
    current_room["count"][player_idx] += 1
    return {"msg": "Вы оставили карты", "ok": True, "status": 200}


@app.post('api/blackjack/take', response_class=JSONResponse)
async def take_card(request: TurnRequest):
    if not is_telegram(request.initData):
        return {"msg": "Как ты сюда попал", "ok": False, "status": 401}
    if request.room_id not in blackjack_rooms:
        return {"msg": "Комната не найдена!", "ok": False, "status": 404}
    current_room: dict = blackjack_rooms[request.room_id]
    player_idx: int = current_room["players"].index(request.player_id)
    if current_room["active_player"] != player_idx:
        return {"msg": "Не ваш ход.", "ok": False, "status": 401}
    card: str = choice(cards_52)
    current_room["hands"][player_idx].append()
    if calculate_hand_value(current_room["hands"][player_idx]) > 21:
        return {
            "msg": "У вас перебор.",
            "ok": True,
            "status": 202,
            "card": card
        }
    return {"msg": "Вы взяли карту.", "ok": True, "status": 200, "card": card}


@app.get('api/blackjack/get_updates', response_class=JSONResponse)
async def get_blackjack_updates(request: GetUpdatesRequest):
    if request.room_id not in blackjack_rooms:
        return {"msg": "Комната не найдена!", "ok": False, "status": 404}
    current_room: dict = blackjack_rooms[request.room_id]
    if any(item == 3 for item in current_room["results"].values()):
        self_idx: int = current_room["players"].index(request.player_id)
        self: int = current_room["results"][self_idx]
        opponent: int = current_room["results"][int(not self_idx)]
        if self > opponent:
            return {"msg": "Вы выиграли!", "ok": True, "status": 200}
        elif self < opponent:
            return {"msg": "Вы проиграли!", "ok": True, "status": 200}
        else:
            return {"msg": "Ничья!", "ok": True, "status": 200}
    if len(current_room["players"]) < 2:
        return {
            "msg": "Противник вышел из игры! Вы выиграли!",
            "ok": True,
            "status": 200
        }
    self_idx: int = current_room["players"].index(request.player_id)
    opponent_idx: int = int(not self_idx)
    data = {
        "active_player": current_room["active_player"],
        "self": {
            "hands": current_room["hands"][self_idx],
            "count": current_room["count"][self_idx],
            "results": current_room["results"][self_idx]
        },
        "opponent": {
            "hands": current_room["hands"][opponent_idx],
            "count": current_room["count"][opponent_idx],
            "results": current_room["results"][opponent_idx]
        }
    }
    return {
        "msg": "Обновления успешно получены.",
        "ok": True,
        "status": 200,
        "data": data
    }


@app.get("/referal", response_class=HTMLResponse)
async def referal():
    return templates.TemplateResponse("index.html", {})


@app.get("/", response_class=HTMLResponse)
async def home():
    return templates.TemplateResponse("index.html", {})


@app.get("/balance", response_class=HTMLResponse)
async def balance():
    return templates.TemplateResponse("index.html", {})


@app.get("/games", response_class=HTMLResponse)
async def games():
    return templates.TemplateResponse("index.html", {})


@app.get("/game", response_class=HTMLResponse)
async def game():
    return templates.TemplateResponse("index.html", {})


@app.get("/lottery", response_class=HTMLResponse)
async def lottery():
    return templates.TemplateResponse("index.html", {})


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app=app, host="localhost", port=8002)
