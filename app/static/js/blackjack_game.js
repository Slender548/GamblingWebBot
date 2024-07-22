let steps = 0
const cards = {
    p1: 0,
    p2: 0
}
const takeButton = document.querySelector('.take-button');
const passButton = document.querySelector('.pass-button');
const player1Result = document.getElementById('player1Result');
const player2Result = document.getElementById('player2Result');
const step = document.querySelector("#step");

const cardHandSelf = document.querySelector('.card-hand-self');
const cardHandOpponent = document.querySelector('.card-hand-opponent');

const placeCardsSelf = (cards) => {
    const totalCards = cards.length;
    const arcAngle = 90;
    const angleStep = arcAngle / (totalCards - 1);
    cards.forEach((card, index) => {
        const cardElement = document.createElement('img');
        cardElement.src = `static/img/blackjack/${card}.png`;
        const angle = -arcAngle / 2 + angleStep * index; // Calculate the angle for each card
        cardElement.style.transform = `rotate(${angle}deg) translateY(20px)`; // Adjust translateY for fan effect
        cardHandSelf.appendChild(cardElement);
    })
};

const addCardSelf = (card) => {
    const cards = document.querySelectorAll('.card-hand-self img');
    const totalCards = cards.length+1;
    const arcAngle = 90;
    const angleStep = arcAngle / (totalCards - 1);
    cards.forEach((card, index) => {
        const angle = -arcAngle / 2 + angleStep * index; // Calculate the angle for each card
        card.style.transform = `rotate(${angle}deg) translateY(20px)`; // Adjust translateY for fan effect
    });
    const newCard = document.createElement('img');
    newCard.src = `static/img/blackjack/${card}.png`;
    const angle = -arcAngle / 2 + angleStep * cards.length;
    newCard.style.transform = `rotate(${angle}deg) translateY(20px)`; // Adjust translateY for fan effect
    cardHandSelf.appendChild(newCard);
};

const addCardOpponent = () => {
    // opponent`s cards are unknown and their source is "back"
    const cards = document.querySelectorAll('.card-hand-opponent img');
    const totalCards = cards.length+1;
    const arcAngle = 90;
    const angleStep = arcAngle / (totalCards - 1);
    cards.forEach((card, index) => {
        const angle = -arcAngle / 2 + angleStep * index; // Calculate the angle for each card
        card.style.transform = `rotate(${180+angle}deg) translateY(20px)`; // Adjust translateY for fan effect
    });
    const newCard = document.createElement('img');
    newCard.src = "static/img/blackjack/back.png";
    const angle = -arcAngle / 2 + angleStep * cards.length;
    newCard.style.transform = `rotate(${180+angle}deg) translateY(20px)`; // Adjust translateY for fan effect
    cardHandOpponent.appendChild(newCard);
}


const clearCards = (selfCards) => {
    const myCards = document.querySelectorAll('.card-hand-self img');
    myCards.forEach(card => card.remove());
    const opponentCards = document.querySelectorAll('.card-hand-opponent img');
    opponentCards.forEach(card => card.remove());
    cards.p1 = 2;
    cards.p2 = 2;
    const totalCards = 2;
    const arcAngle = 75;
    const angleStep = arcAngle / (totalCards - 1);
    selfCards.forEach((card, index) => {
        const cardElement = document.createElement('img');
        cardElement.src = `static/img/blackjack/${card}.png`;
        const angle = -arcAngle / 2 + angleStep * index; // Calculate the angle for each card
        cardElement.style.transform = `rotate(${angle}deg) translateY(20px)`; // Adjust translateY for fan effect
        cardHandSelf.appendChild(cardElement);
    });
    for (let idx = 0; idx < 2; idx++) {
        const cardElement = document.createElement('img');
        cardElement.src = "static/img/blackjack/back.png";
        const angle = -arcAngle / 2 + angleStep * idx; // Calculate the angle for each card
        cardElement.style.transform = `rotate(${180+angle}deg) translateY(20px)`; // Adjust translateY for fan effect
        cardHandOpponent.appendChild(cardElement);
    }
};

const getBlackjackUpdates = () => {
    fetch('/get_blackjack_updates?room=${room_id}')
    .then(response => response.json())
    .then(data => {
        if (playerId === "p1") {
            player1Result.innerHTML = data.blackjack_results.p1;
            player2Result.innerHTML = data.blackjack_results.p2;
        }
        else {
            player1Result.innerHTML = data.blackjack_results.p2;
            player2Result.innerHTML = data.blackjack_results.p1;
        }
        const button_disabled = playerId !== data.active_player;
        takeButton.disabled = button_disabled;
        passButton.disabled = button_disabled;
        // TODO: game logic
        if (playerId === "p1"&&data.blackjack_hands.p2.length > cards.p2) {
            addCardOpponent(data.blackjack_hands.p2[cards.p2]);
            cards.p2 += 1;
        } 
        else if (playerId === "p2"&&data.blackjack_hands.p1.length > cards.p1) {
            addCardOpponent(data.blackjack_hands.p1[cards.p1]);
            cards.p1 += 1;
        }
        if (data.blackjack_count.p1 === data.blackjack_count.p2 !== steps) {
            steps = data.blackjack_count.p1;
            clearCards();
            if (playerId === "p1") {
                checkWinner(data.blackjack_hands.p1, data.blackjack_hands.p2);
            } else {
                checkWinner(data.blackjack_hands.p2, data.blackjack_hands.p1);
            }
            steps += 1;
        }
        if (data.active_player === playerId) {
            step.innerHTML = "Ваш ход";
        } else {
            step.innerHTML = "Ход противника";
        }
    })
};


rollButton.addEventListener('click', () => {
    fetch(`/take_card?room_id=${roomId}&player=${playerId}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                showNotifyPopup(data.error);
            } else {
                addCardSelf(data.card);
            }
        });
});

passButton.addEventListener('click', () => {
    fetch(`/pass_turn?room_id=${roomId}&player=${playerId}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                showNotifyPopup(data.error);
            } else {
                step.innerHTML = "Ход противника";
            }
        });
});

const parseCard = (card) => {
    const rank = card.slice(0, 2).replace("_", "");
    return rank === "a" ? 11 : parseInt(rank.replace("q", "10").replace("k", "10").replace("j", "10"));
};

const parseHand = (hand) => {
    let total = 0;
    let aces = 0;
  
    for (const card of hand) {
      total += parseCard(card);
      if (card.slice(0, 2) === "a_") {
        aces++;
      }
    }
  
    // Adjust ace value if total exceeds 21
    while (total > 21 && aces > 0) {
      total -= 10;
      aces--;
    }
  
    return total;
  };

getBlackjackUpdates()
setInterval(getBlackjackUpdates, 3000);
//Notification Popup Logic
const notifyPopup = document.getElementById('dice-popup');
const notifyMessage = document.getElementById('dice-title');
const showNotifyPopup = (message) => {
    notifyMessage.innerHTML = message;
    setTimeout(() => {
        notifyPopup.classList.remove('show');
    }, 1000);
}

// Leave Confirmation Popup Logic
const leavePopup = document.getElementById('leave-popup');
const confirmLeaveButton = document.getElementById('confirm-leave');
const cancelLeaveButton = document.getElementById('cancel-leave');
let navigateAwayUrl = '';
let targetElement = null;
function showLeavePopup(url, element) {
    navigateAwayUrl = url;
    targetElement = element;
    leavePopup.classList.add('show');
}
function hideLeavePopup() {
    leavePopup.classList.remove('show');
    navigateAwayUrl = '';
    targetElement = null;
}
confirmLeaveButton.addEventListener('click', () => {
    window.location.replace(navigateAwayUrl);
    hideLeavePopup();
});
cancelLeaveButton.addEventListener('click', hideLeavePopup);
// Modified Navigation Functions
toRef = () => {
    let ref = document.getElementById("Ref");
    showLeavePopup("ref", ref);
}
toBal = () => {
    let bal = document.getElementById("Bal");
    showLeavePopup("balance", bal);
}
toGame = () => {
    let game = document.getElementById("Game");
    showLeavePopup("game", game);
}
toGames = () => {
    let games = document.getElementById("Games");
    showLeavePopup("games", games);
}
toLottery = () => {
    let lottery = document.getElementById("Lottery");
    showLeavePopup("lottery", lottery);
}
diceEnter = () => {
    let games = document.getElementById("Games");
    showLeavePopup("dice", games);
}