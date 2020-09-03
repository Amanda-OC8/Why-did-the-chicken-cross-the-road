window.onload = () => {
    // Game.initialScreen() create a provisional game board until the game start
    Game.initialScreen()
    // Check if the player is selected or no and toggle the class "unselected" in each case.
    player1 = document.querySelector(".player1")
    player1.onclick = () => player1.classList.toggle("unselected")
    player2 = document.querySelector(".player2")
    player2.onclick = () => player2.classList.toggle("unselected")

    // Start the game clicking in the start-button.
    start = document.querySelector(".start-button")
    start.onclick = () => Game.startGame()
   
}
