from typing import List
from uuid import uuid4
from hmac import new, compare_digest
from hashlib import sha256
from urllib import parse
from dotenv import load_dotenv
from os import environ

load_dotenv()

bot_token = environ["bot_token"]


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
