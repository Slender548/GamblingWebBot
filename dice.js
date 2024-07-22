const dice = document.getElementById('dice');
const btn = document.getElementById('btn-dice');

function rollDice() {
    const number = Math.ceil(Math.random() * 6);
    let frame = 1;
    dice.src = `dice/${frame}.png`;

    // Create an interval to update the dice image
    const intervalId = setInterval(() => {
        frame++; // Increment the frame counter

        // Check if the animation is complete
        if (frame > 6) {
            clearInterval(intervalId); // Stop the interval
            dice.src = `dice/${number}.png`; // Set the final dice image
        } else {
            dice.src = `dice/${frame}.png`; // Update the dice image
        }
    }, 100); // Update the image every 100 milliseconds
    btn.disabled = true;
}

// Store the player index (returned from /join_game)
let playerIndex;

function pollForUpdates() {
    const roomId = 'your_room_id';
    fetch(/get_updates?room_id=${roomId}&player_index=${playerIndex})
        .then(response => response.json())
        .then(data => {
            if (data.message === 'dice_result') {
                console.log(Player ${playerIndex} rolled: ${data.number});
                // Update UI with the dice result
            } else if (data.message === 'round_complete') {
                console.log('Round complete!');
                // Handle round completion
            } else if (data.message === 'opponent_left') {
                console.log('Opponent has left the game.');
                // Handle opponent leaving
            } else if (data.message === 'no_updates') {
                // No updates, do nothing
            } 
        })
        .catch(error => console.error('Error fetching updates:', error));

    setTimeout(pollForUpdates, 2000); // Poll every 2 seconds (adjust as needed)
}