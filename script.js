
let letter = document.getElementById("letter");


function changeLetter() {
    let randomLetter = "Let's say wtf";
    letter.textContent = randomLetter;
}

function games_exit() {
    // exit to #index.html
    window.location.replace("index.html");
}

function dice_enter() {
    // change game page to dice.html
    window.location.replace("dice.html");
}

function blackjack_enter() {
    // change game page to blackjack.html
    window.location.replace("blackjack.html");
}

function mines_enter() {
    // change game page to mines.html
    window.location.replace("mines.html");
}

function crash_enter() {
    // change game page to crash.html
    window.location.replace("crash.html");
}

function guesser_enter() {
    // change game page to guesser.html
    window.location.replace("guesser.html");
}

function roulette_enter() {
    // change game page to roulette.html
    window.location.replace("roulette.html");
}