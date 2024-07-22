// Global variables
let playerIndex;
 // Replace with your actual room ID

// Join the game (send POST request to /join_game)
fetch('/join_dice_game', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ room_id: roomId })
})
.then(response => response.json())
.then(data => {
  // Handle joining the game
  playerIndex = data.player_index;
  console.log("Joined game:", data);
  // Start polling for updates
  pollForUpdates();
})
.catch(error => console.error('Error joining game:', error));

// Function to roll the dice
function rollDice() {
  fetch('/roll_dice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ room_id: roomId, player_index: playerIndex })
  })
  .then(response => response.json())
  .then(data => {
    console.log("Dice rolled:", data.message);
    // Handle dice roll response (e.g., update UI, etc.)
  })
  .catch(error => console.error('Error rolling dice:', error));
  return;
}

// Function to signal readiness to act
function readyToAct() {
  fetch('/ready_to_act', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ room_id: roomId, player_index: playerIndex })
  })
  .then(response => response.json())
  .then(data => {
    console.log("Ready to act:", data.message);
    // Handle ready to act response (e.g., update UI, etc.)
  })
  .catch(error => console.error('Error signaling ready to act:', error));
}


// Event listeners for buttons (replace 'your-button-ids' with actual IDs from your HTML)
document.getElementById('btn-dice').addEventListener('click', rollDice);
document.getElementById('btn-ready').addEventListener('click', readyToAct);

// Define pollForUpdates function
function pollForUpdates() {
  fetch(`/get_updates?room_id=${roomId}&player_index=${playerIndex}`)
    .then(response => response.json())
    .then(data => {
      if (data.message === 'dice_result') {
        console.log(`Player ${playerIndex} rolled: ${data.number}`);
        // Update UI with the dice result (e.g., change the dice image)
        document.getElementById('dice').src = `dice/${data.number}.png`; // Assuming your image files are named 1.png, 2.png, etc.
      } else if (data.message === 'round_complete') {
        console.log('Round complete!');
        // Handle round completion (e.g., update scores, etc.)
      } else if (data.message === 'opponent_left') {
        console.log('Opponent has left the game.');
        // Handle opponent leaving (e.g., display a message, stop polling)
        clearInterval(intervalID); // Stop polling
      } else if (data.message === 'no_updates') {
        // No updates, do nothing
      }
    })
    .catch(error => console.error('Error fetching updates:', error));
}

// Set up polling interval (adjust interval as needed)
const intervalID = setInterval(pollForUpdates, 2000); // Poll every 2 seconds

// Start polling immediately
pollForUpdates();

