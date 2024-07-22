function toRef() {
    window.location.replace("ref.html");
    let ref = document.getElementById("Ref");
    ref.style.backgroundColor = "#b9b6b6";
}

function toBal() {
    window.location.replace("balance.html");
    let bal = document.getElementById("Bal");
    bal.style.backgroundColor = "#b9b6b6";
}

function toGame() {
    window.location.replace("game.html");
    let game = document.getElementById("Game");
    game.style.backgroundColor = "#b9b6b6";
}

function toGames() {
    window.location.replace("games.html");
    let games = document.getElementById("Games");
    games.style.backgroundColor = "#b9b6b6";
}

function toLottery() {
    window.location.replace("lottery.html");
    let lottery = document.getElementById("Lottery");
    lottery.style.backgroundColor = "#b9b6b6";
}
//onclick 

let games = document.getElementById("Games");

games.addEventListener("click", function() {
    games.style.backgroundColor = "#b9b6b6";
});

