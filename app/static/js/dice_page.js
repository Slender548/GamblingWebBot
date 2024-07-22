let parent = document.querySelector('.dice-table');

//Show messages
const alertPopup = document.getElementById('popup');
const alertMessage = document.getElementById('alert-message');
const closeAlert = document.getElementById('close-popup');
const showAlertPopup = (message) => {
    alertMessage.innerHTML = message;
    alertPopup.classList.add('show');
}
const hideAlertPopup = () => {
    alertPopup.classList.remove('show');
}
closeAlert.addEventListener('click', hideAlertPopup);
    

//Fetching rooms
const popup = document.getElementById('create-game-popup');
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const data = await fetchDiceRooms();
        if (data) {
            const rooms = data.rooms;
            if (rooms.length == 0) {
                const label = document.createElement('p');
                label.innerHTML = 'Пусто, можете создать свою игру.'
                label.style.marginLeft = "5%";
                label.classList.add('cell');
                parent.appendChild(label);
            }
            rooms.forEach(room => {
                // Create a new button element
                const button = document.createElement('button');
                button.innerHTML = `
                        <div class="dice-join-title">${room.name}</div>
                        <div class="dice-join-reward">${room.reward}$</div>`;
                button.classList.add('dice-join');
                // Add a click event listener to the button for redirection
                button.addEventListener('click', () => {
                    // Redirect to a new page with room ID as a parameter
                    fetch(`/try_join_dice_game?room_id=${room.room_id}`)
                    .then(response => {
                        return response.json();
                    })
                    .then(data => {
                        if (data.error) {
                            showAlertPopup(data.error);
                        } else {
                            window.location.href = `/join_dice_game?room_id=${room.room_id}&player_id=p2&reward=${room.reward}`;
                        }
                    })
                });
                parent.appendChild(button);
            });
        }
    } catch (error) {
        showAlertPopup(error);
    }
});

async function fetchDiceRooms() {
    try {
        const response = await fetch('/get_dice_rooms');
        if (!response.ok) {
            showAlertPopup("Ошибка");
        }
        return await response.json();
    } catch (error) {
        showAlertPopup(error);
    }
}

async function createDiceGame(name, reward) {
    const response = await fetch(`/create_dice_game?name=${name}&reward=${reward}`);
    if (response.ok) {
        return await response.json();
    } else {
        showAlertPopup("Произошла ошибка при создании игры.")
    }
}

function createDice() {
    popup.classList.add('show');
}

function closePopup() {
    popup.classList.remove('show');
}

document.getElementById('createForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const name = document.getElementById('game-name').value;
    const reward = document.getElementById('game-reward').value;

    if (name.length > 20) {
        showAlertPopup('Название не должно превышать 20 символов.');
        return;
    }

    if (!/^\d+$/.test(reward)) {
        showAlertPopup('Награда должна содержать только цифры.');
        return;
    }

    try {
        const data = await createDiceGame(name, reward);
        window.location.href = `/join_dice_game?room_id=${data.hash}&player_id=p1&reward=${data.reward}&creator=y`;
    } catch (error) {
        showAlertPopup("Произошла ошибка при создании игры");
    }
});

document.getElementById('cancel-button').addEventListener('click', closePopup);

document.getElementById('game-reward').addEventListener('input', function(event) {
    this.value = this.value.replace(/\D/g, ''); // Удаляем все нецифровые символы
});
    let games = document.getElementById('Games');
    games.style.color = 'black';