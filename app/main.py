
# A very simple Flask Hello World app for you to get started with...

from flask import Flask, render_template, request, jsonify, redirect, url_for
from random import randint, choice
import time
from uuid import uuid4

app = Flask(__name__)

def generate_room_id():
    return str(uuid4())

dice_rooms = {
    
}
blackjack_rooms = {
    "002343a5-3202-4ff7-8a83-6b5b04e53739":
        {"name": "Через блокировку",
           "reward": 130,
           "active_time": 15,
           "going": False,
           "active_player": 1,
           "blackjack_hands": {
                1: 3,
                2: 0   
            },
           "blackjack_count": {
               1: 0,
               2: 0
           }
        },
}

cards_52 = ['2_h', '2_d', '2_c', '2_s', '3_h', '3_d', '3_c', '3_s', '4_h', '4_d', '4_c', '4_s', '5_h', '5_d', '5_c', '5_s', '6_h', '6_d', '6_c', '6_s', '7_h', '7_d', '7_c', '7_s', '8_h', '8_d', '8_c', '8_s', '9_h', '9_d', '9_c', '9_s', 'j_h', 'j_d', 'j_c', 'j_s', 'q_h', 'q_d', 'q_c', 'q_s', 'k_h', 'k_d', 'k_c', 'k_s']

#print([{"room_id": str(room_id), "name": details["name"], "reward": details["reward"]} for room_id, details in rooms.items()])

def parse_card(card):
  rank = card[:2].replace("_", "")
  if rank == "a":
    return 11
  else:
    return int(rank.replace("q", "10").replace("k", "10").replace("j", "10"))

def parse_hand(hand):
  total = 0
  aces = 0
  for card in hand:
    total += parse_card(card)
    if card[:2] == "a_":
      aces += 1

  while total > 21 and aces > 0:
    total -= 10
    aces -= 1

  return total

@app.route('/get_dice_rooms')
def get_dice_rooms():
    available_rooms = [{"room_id": room_id, "name": details["name"], "reward": details["reward"]}
                       for room_id, details in dice_rooms.items() if not details["going"]]
    return jsonify({"rooms": available_rooms})

@app.route('/try_join_dice_game')
def try_join_dice_game():
    room_id = request.args.get('room_id')
    if room_id in dice_rooms:
        if not dice_rooms[room_id]['going']:
            return jsonify({"message": "Успешно"}), 200
        else:
            return jsonify({"error": "Комната уже запущена"}), 400
    return jsonify({"error": "Комната не найдена"}), 404

@app.route('/join_dice_game')
def join_dice_game():
    room_id = request.args.get('room_id')
    player_id = request.args.get('player_id')
    reward = request.args.get('reward')
    creator = request.args.get('creator')
    if not creator:
        dice_rooms[room_id]['going'] = True
    return render_template('dice_game.html', room_id=room_id, player_id=player_id, reward=reward)

@app.route('/roll_dice')
def roll_dice():
    room_id = request.args.get('room_id')
    player = request.args.get('player')
    if room_id in dice_rooms:
        if player == dice_rooms[room_id]["active_player"]:
            dice_rooms[room_id]["dice_count"][player] += 1
            dice_value = randint(1, 6)
            dice_rooms[room_id]['dice_hands'][player] = dice_value
            dice_rooms[room_id]["active_player"] = "p1" if player == "p2" else "p2"
            if dice_rooms[room_id]["dice_count"]["p1"] == dice_rooms[room_id]["dice_count"]["p2"]:
                first = dice_rooms[room_id]["dice_hands"]["p1"]
                second = dice_rooms[room_id]["dice_hands"]["p2"]
                if first > second:
                    dice_rooms[room_id]["dice_results"]["p1"] += 1
                elif first < second:
                    dice_rooms[room_id]["dice_results"]["p2"] += 1
            return jsonify({"dice_value": dice_value})
        else:
            return jsonify({"error": "It's not your turn"})
    return "Invalid request", 400

@app.route('/get_dice_updates')
def get_dice_updates():
    room_id = request.args.get('room_id')
    if room_id in dice_rooms:
        if any(item == 3 for item in dice_rooms[room_id]["dice_results"].values()):
            first = dice_rooms[room_id]["dice_results"]["p1"]
            second = dice_rooms[room_id]["dice_results"]["p2"]
            if first>second:
                return jsonify({"winner": "p1"})
            else:
                return jsonify({"winner": "p2"})
        if any(item == -1 for item in dice_rooms[room_id]["dice_results"].values()):
            return jsonify({"left": True})
        return jsonify(dice_rooms[room_id])
    return "Room not found", 404

@app.route('/create_dice_game')
def create_dice_game():
    name = request.args.get('name')
    reward = request.args.get('reward')
    new_room_id = generate_room_id()
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
    return jsonify({"hash": new_room_id, "reward": int(reward)}), 200

@app.route('/get_blackjack_rooms')
def get_blackjack_rooms():
    available_rooms = [{"room_id": room_id, "name": details["name"], "reward": details["reward"]}
                       for room_id, details in blackjack_rooms.items() if not details["going"]]
    return jsonify({"rooms": available_rooms})

@app.route('/join_blackjack_game')
def join_blackjack_game():
    room_id = request.args.get('room_id')
    player_id = request.args.get('player_id')
    reward = request.args.get('reward')
    creator = request.args.get('creator')
    if not creator:
        blackjack_rooms[room_id]['going'] = True
    return render_template('blackjack_game.html', room_id=room_id, player_id=player_id, reward=reward)

@app.route('/try_join_blackjack_game')
def try_join_blackjack_game():
    room_id = request.args.get('room_id')
    if room_id in blackjack_rooms:
        if not blackjack_rooms[room_id]['going']:
            return jsonify({"message": "Успешно"}), 200
        else:
            return jsonify({"error": "Комната уже запущена"}), 400
    return jsonify({"error": "Комната не найдена"}), 404

@app.route('/get_blackjack_updates')
def get_blackjack_updates():
    room_id = request.args.get('room_id')
    if room_id in blackjack_rooms:
        if any(item == 3 for item in blackjack_rooms[room_id]["blackjack_results"].values()):
            first = blackjack_rooms[room_id]["blackjack_results"]["p1"]
            second = blackjack_rooms[room_id]["blackjack_results"]["p2"]
            if first>second:
                return jsonify({"winner": "p1"})
            else:
                return jsonify({"winner": "p2"})
        if any(item == -1 for item in blackjack_rooms[room_id]["blackjack_results"].values()):
            return jsonify({"left": True})
        return jsonify(blackjack_rooms[room_id])
    return "Room not found", 404

@app.route('/create_blackjack_game')
def create_blackjack_game():
    name = request.args.get('name')
    reward = request.args.get('reward')
    new_room_id = generate_room_id()
    blackjack_rooms[new_room_id] = {
        "name": name,
        "reward": int(reward),
        "going": False,
        "active_player": f"p{randint(1,2)}",
        "blackjack_hands": {
            "p1": 0,
            "p2": 0
        },
        "blackjack_count": {
            "p1": 0,
            "p2": 0
        },
        "blackjack_results": {
            "p1": 0,
            "p2": 0
        },
    }
    return jsonify({"hash": new_room_id, "reward": int(reward)}), 200

@app.route('/pass_turn')
@app.route('/take_card')
def take_card():
    room_id = request.args.get('room_id')
    player = request.args.get('player')
    card = choice(cards_52)
    if room_id in blackjack_rooms:
        blackjack_rooms[room_id]["blackjack_hands"][player].append(card)
        if sum(card[:1].replace("_","") for card in blackjack_rooms[room_id]["blackjack_hands"][player]) > 21:
            clear_cards(room_id)
            return jsonify({"error": "Вы проиграли", "balance": blackjack_rooms[room_id]["reward"]})


@app.route('/')
def main_page():
    return render_template("base.html")

@app.route('/ref')
def ref_page():
    return render_template("index.html", ref=21, ref_ending="ь", reward=1234, reward_ending="ы")

@app.route('/balance')
def wallet_page():
    return render_template("bal.html", balance=1642, balance_ending="ы")

@app.route('/games')
def games_page():
    return render_template("games.html")

@app.route('/dice')
def dice_game_page():
    return render_template("dice_start.html")

@app.route('/blackjack')
def blackjack_game_page():
    return render_template("blackjack_start.html")

if __name__ == "__main__":
    app.run(debug=True)