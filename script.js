
let letter = this.document.getElementById("letter");

let button = this.document.getElementById("button");

button.addEventListener("click", function() {
  let randomLetter = "Let`s say phew";
  letter.textContent = randomLetter;
});