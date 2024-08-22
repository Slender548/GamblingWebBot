import json
import pathlib
import time
from typing import List
from uuid import uuid4
from hmac import new, compare_digest
from hashlib import sha256
from urllib import parse
from dotenv import load_dotenv
from os import environ

import numpy as np

load_dotenv()

bot_token = environ["bot_token"]
bot_username = environ["bot_username"]


def get_invitation_link(telegram_id):
    return f"https://t.me/{bot_username}?start=sparc({telegram_id}"


def is_telegram(init_data: str) -> bool:
    vals = {}

    for item in init_data.split('&'):
        if '=' in item:
            key, value = item.split('=', 1)
            vals[key] = value

    hash_received = vals.pop('hash', None)

    if hash_received is None:
        return False

    data_check_string = '\n'.join(f"{k}={parse.unquote(v)}"
                                  for k, v in sorted(vals.items()))

    secret_key = new(b"WebAppData", bot_token.encode(), sha256).digest()
    computed_hash = new(secret_key, data_check_string.encode(),
                        sha256).hexdigest()

    return compare_digest(computed_hash, hash_received)


def generate_room_id() -> str:
    return str(uuid4())


def calculate_hand_value(hand: List[str]) -> int:
    hand_value = sum(parse_card(card) for card in hand)
    hand_value = adjust_for_ace(hand, hand_value)
    return hand_value


def parse_card(card: str) -> int:
    rank = card.split('_')[0]
    if rank == 'a':
        return 11
    elif rank in ['k', 'q', 'j']:
        return 10
    else:
        return int(rank)


def adjust_for_ace(hand: List[str], hand_value: int) -> int:
    aces = [card for card in hand if card.startswith('a')]
    while hand_value > 21 and aces:
        hand_value -= 10
        aces.pop()
    return hand_value


class RegistrationPredictor:

    def __init__(self, data_path="dates.json", order=3):
        self.data_path = pathlib.Path.cwd().joinpath(data_path)
        self.order = order
        self.x, self.y = self._load_data()
        self._fit_model()

    def _load_data(self):
        try:
            with open(self.data_path) as f:
                data = json.load(f)
        except FileNotFoundError:
            return [], []

        x_data = np.array(list(map(int, data.keys())))
        y_data = np.array(list(map(float, data.values())))
        return x_data, y_data

    def _fit_model(self):
        self.model = np.poly1d(np.polyfit(self.x, self.y, self.order))

    def predict_registration_date(self, tg_id):
        predicted_date = self.model(tg_id)
        current_time = time.time()

        if predicted_date > current_time:
            return current_time
        else:
            return predicted_date

    def is_ok_referal(self, tg_id):
        data = self.predict_registration_date(tg_id)
        diff = data - time.time()
        return diff < 12 * 30 * 24 * 60 * 60
        if diff > 12 * 30 * 24 * 60 * 60:
            return False
        else:
            return True
