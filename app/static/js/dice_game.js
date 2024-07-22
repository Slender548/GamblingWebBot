const dices = {
    p1: 0,
    p2: 0
}
const rollButton = document.getElementById('rollButton');
const player1Result = document.getElementById('player1Result');
const player2Result = document.getElementById('player2Result');
const cube1 = document.querySelector(".cube1");
const cube2 = document.querySelector(".cube2");
const step = document.querySelector("#step")
rollButton.addEventListener('click', function() {
    fetch(`/roll_dice?room_id=${roomId}&player=${playerId}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                showNotifyPopup(data.error);
            } else {
                rollDiceSelf(data.dice_value);
                if (playerId === "p1") {
                    dices.p1 += 1;
                } else {
                    dices.p2 += 1;
                }
            }
        });
});
const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
const rollDiceSelf = (result) => {
    let rotations = [];
    for (let i = 0; i < 20; i++) { // 20 rotations for a more realistic roll
      rotations.push({
        x: getRandomInt(-90, 90),
        y: getRandomInt(-180, 180),
        z: getRandomInt(-180, 180)
      });
    }
    let finalRotation = {
      x: 0,
      y: 0,
      z: 0
    };
    if (result === 1) { finalRotation.y = 0; }
    if (result === 2) { finalRotation.y = 180; }
    if (result === 3) { finalRotation.y = -90; }
    if (result === 4) { finalRotation.y = 90; }
    if (result === 5) { finalRotation.x = -90; }
    if (result === 6) { finalRotation.x = 90; }

    let rotationIndex = 0;
    var animate = function () {
      if (rotationIndex < rotations.length) {
        cube1.style.transform = 'translateZ(-100px) rotateX(' + rotations[rotationIndex].x + 'deg) rotateY(' + rotations[rotationIndex].y + 'deg) rotateZ(' + rotations[rotationIndex].z + 'deg)';
        rotationIndex++;
        requestAnimationFrame(animate);
      } else {
        // Final rotation
        cube1.style.transform = 'translateZ(-100px) rotateX(' + finalRotation.x + 'deg) rotateY(' + finalRotation.y + 'deg) rotateZ(' + finalRotation.z + 'deg)';
      }
    };
    animate();
}
const rollDiceOpponent = (result) => {
    let rotations = [];
    for (let i = 0; i < 20; i++) { // 20 rotations for a more realistic roll
      rotations.push({
        x: getRandomInt(-90, 90),
        y: getRandomInt(-180, 180),
        z: getRandomInt(-180, 180)
      });
    }
    let finalRotation = {
      x: 0,
      y: 0,
      z: 0
    };
    if (result === 1) { finalRotation.y = 0; }
    if (result === 2) { finalRotation.y = 180; }
    if (result === 3) { finalRotation.y = -90; }
    if (result === 4) { finalRotation.y = 90; }
    if (result === 5) { finalRotation.x = -90; }
    if (result === 6) { finalRotation.x = 90; }

    let rotationIndex = 0;
    var animate = function () {
      if (rotationIndex < rotations.length) {
        cube2.style.transform = 'translateZ(-100px) rotateX(' + rotations[rotationIndex].x + 'deg) rotateY(' + rotations[rotationIndex].y + 'deg) rotateZ(' + rotations[rotationIndex].z + 'deg)';
        rotationIndex++;
        requestAnimationFrame(animate);
      } else {
        // Final rotation
        cube2.style.transform = 'translateZ(-100px) rotateX(' + finalRotation.x + 'deg) rotateY(' + finalRotation.y + 'deg) rotateZ(' + finalRotation.z + 'deg)';
      }
    };
    animate();
}
const getDiceUpdates = () => {
    fetch(`/get_dice_updates?room_id=${roomId}`)
        .then(response => response.json())
        .then(data => {
            if (playerId === "p1") {
                player1Result.innerHTML = data.dice_results.p1;
                player2Result.innerHTML = data.dice_results.p2;
            }
            else {
                player1Result.innerHTML = data.dice_results.p2;
                player2Result.innerHTML = data.dice_results.p1;
            }
            rollButton.disabled = playerId !== data.active_player;
            if (playerId === "p1"&&data.dice_count.p2 !== dices.p2) {
                rollDiceOpponent(data.dice_hands.p2);
                dices.p2 += 1;
            }  else if (playerId === "p2"&&data.dice_count.p1 !== dices.p1) {
                rollDiceOpponent(data.dice_hands.p1);
                dices.p1 += 1;
            }
            if (data.active_player === playerId) {
                step.innerHTML = "Ваш ход";
            } else {
                step.innerHTML = "Ход противника";
            }
        });
}
getDiceUpdates()
setInterval(getDiceUpdates, 3000);
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