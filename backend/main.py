from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from starlette.templating import Jinja2Templates
from models import *
from utils import *
from random import randint, choice
import sqlite3
import db

app = FastAPI(debug=True)
app.mount('/assets', StaticFiles(directory="assets"))

con = sqlite3.connect('kick_the_doll_db_base',
                      autocommit=True,
                      check_same_thread=False)
cur = con.cursor()

dice_rooms = dict()
blackjack_rooms = dict()

cards_52 = [
    '2_h', '2_d', '2_c', '2_s', '3_h', '3_d', '3_c', '3_s', '4_h', '4_d',
    '4_c', '4_s', '5_h', '5_d', '5_c', '5_s', '6_h', '6_d', '6_c', '6_s',
    '7_h', '7_d', '7_c', '7_s', '8_h', '8_d', '8_c', '8_s', '9_h', '9_d',
    '9_c', '9_s', 'j_h', 'j_d', 'j_c', 'j_s', 'q_h', 'q_d', 'q_c', 'q_s',
    'k_h', 'k_d', 'k_c', 'k_s'
]
db.__init__()
templates = Jinja2Templates(directory='templates')

#cur.execute("INSERT INTO Users (telegram_id, username, wallet_address, balance, total_transactions) VALUES (?, ?, ?, ?, ?)",
#            (1331282319, "iseewhoyouareyouaremyenemyy", "UQDA2P3uUIalGSarEbf6jTflEW_Z8W4O8CgJp5ylJvyEtHpz", 514, 0))


@app.get('/', response_class=HTMLResponse)
def index(request: Request):
    return templates.TemplateResponse('index.html',
                                      context={'request': request})


@app.get('/api/player/{id}', response_class=JSONResponse)
def get_player_by_id(id: str, request: Request):
    cur.execute("SELECT * FROM Users WHERE telegram_id = ?", (id, ))
    player = cur.fetchone()
    if player:
        return {"ok": True, "status": 200, "player": player}
    else:
        return {"ok": False, "status": 404, "msg": "Player not found"}


@app.get('/api/dice/rooms', response_class=JSONResponse)
def get_dice_rooms(request: Request):
    available_rooms = [{
        "room_id": room_id,
        "name": details["name"],
        "reward": details["reward"]
    } for room_id, details in dice_rooms.items() if not details["going"]]
    return {"ok": True, "status": 200, "rooms": available_rooms}


@app.post('/api/dice/create', response_class=JSONResponse)
def create_dice_room(request: CreateRoomRequest):
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
def join_dice_room(request: Request):
    #need to differentiate between creator and joiner
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
def roll_dice(request: TurnRequest):
    pass


@app.post('api/dice/get_updates', response_class=JSONResponse)
def get_dice_updates(request: GetUpdatesRequest):
    pass


@app.post('api/blackjack/create', response_class=JSONResponse)
def create_blackjack_room(request: CreateRoomRequest):
    name: str = request.name
    reward: int = request.reward
    new_room_id: int = generate_room_id()
    blackjack_rooms[new_room_id] = {
        "name": name,
        "reward": int(reward),
        "going": False,
        "active_player": {randint(0, 1)},
        "players": [request.player_id],
        "blackjack_hands": {
            request.player_id: [choice(cards_52),
                                choice(cards_52)],
        },
        "blackjack_count": {
            request.player_id: 0
        },
        "blackjack_results": {
            request.player_id: 0
        },
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
def join_blackjack_room(request: JoinRequest):
    if request.room_id not in blackjack_rooms:
        return {"msg": "Комнаты не существует.", "ok": False, "status": 404}
    current_room: dict = blackjack_rooms[request.room_id]
    if len(current_room["players"]) > 1:
        return {"msg": "Комната заполнена.", "ok": False, "status": 403}
    current_room["going"] = True
    current_room["players"].append(request.player_id)
    current_room["blackjack_hands"][request.player_id] = [
        choice(cards_52), choice(cards_52)
    ]
    current_room["blackjack_count"][request.player_id] = 0
    current_room["blackjack_results"][request.player_id] = 0
    return {
        "msg": "Вы успешно присоединились к комнате!",
        "ok": True,
        "status": 200,
        "room_id": request.room_id,
        "name": current_room["name"],
        "reward": current_room["reward"]
    }


@app.post('api/blackjack/pass', response_class=JSONResponse)
def pass_card(request: TurnRequest):
    if request.room_id not in blackjack_rooms:
        return {"msg": "Комната не найдена!", "ok": False, "status": 404}
    current_room: dict = blackjack_rooms[request.room_id]
    player_idx: int = current_room["players"].index(request.player_id)
    if current_room["active_player"] != player_idx:
        return {"msg": "Не ваш ход.", "ok": False, "status": 401}
    current_room["active_player"] = int(not player_idx)  #Reverse active player
    current_room["blackjack_count"][request.player_id] += 1
    return {"msg": "Вы оставили карты", "ok": True, "status": 200}


@app.post('api/blackjack/take', response_class=JSONResponse)
def take_card(request: TurnRequest):
    if request.room_id not in blackjack_rooms:
        return {"msg": "Комната не найдена!", "ok": False, "status": 404}
    current_room: dict = blackjack_rooms[request.room_id]
    player_idx: int = current_room["players"].index(request.player_id)
    if current_room["active_player"] != player_idx:
        return {"msg": "Не ваш ход.", "ok": False, "status": 401}
    card: str = choice(cards_52)
    current_room["blackjack_hands"][request.player_id].append()
    if calculate_hand_value(
            current_room["blackjack_hands"][request.player_id]) > 21:
        return {
            "msg": "У вас перебор.",
            "ok": True,
            "status": 202,
            "card": card
        }
    return {"msg": "Вы взяли карту.", "ok": True, "status": 200, "card": card}


@app.get('api/blackjack/get_updates', response_class=JSONResponse)
def get_blackjack_updates(request: GetUpdatesRequest):
    pass


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app=app, host="localhost", port=8002)
