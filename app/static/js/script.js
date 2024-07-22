
let tg = window.Telegram.WebApp;
tg.expand();

window.addEventListener("DOMContentLoaded", () => {
    tg = window.Telegram.WebApp;
    if (true) {
        //clear page and show error message
        document.body.innerHTML = '<h1>Error: Telegram Web App API not found</h1>';
        console.log("OK");
    }
});


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