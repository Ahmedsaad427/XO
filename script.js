const board = document.getElementById("board");
const restartButton = document.getElementById("restartButton");
const startButton = document.getElementById("startButton");
const message = document.getElementById("message");
const difficultySelect = document.getElementById("difficulty");
const intro = document.getElementById("intro");
const gameSection = document.getElementById("gameSection");

let currentPlayer = "X";
let boardState = ["", "", "", "", "", "", "", "", ""];
let gameActive = false;

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Start the game
const startGame = () => {
  const difficulty = difficultySelect.value;
  gameActive = true;
  currentPlayer = "X";
  intro.classList.add("d-none");
  gameSection.classList.remove("d-none");
  message.textContent = `Player ${currentPlayer}'s turn`;

  // Initialize the board
  initializeBoard();
};

// Initialize the game board
const initializeBoard = () => {
  board.innerHTML = ""; // Clear any existing cells (if any)
  boardState = ["", "", "", "", "", "", "", "", ""]; // Reset the board state

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("data-index", i);
    cell.addEventListener("click", handleClick);
    board.appendChild(cell);
  }
};

// Handle click on a cell
const handleClick = (event) => {
  const cell = event.target;
  const index = cell.getAttribute("data-index");

  if (boardState[index] !== "" || !gameActive || currentPlayer !== "X") return;

  makeMove(index, "X");

  if (gameActive) {
    currentPlayer = "O";
    message.textContent = `Player O's turn...`;

    // Delay computer move
    setTimeout(computerMove, 500);
  }
};

// Computer move logic
const computerMove = () => {
    if (!gameActive) return; // If the game is not active, stop the computer move
  
    const difficulty = difficultySelect.value;
    let index;
  
    if (difficulty === "easy") {
      index = getRandomMove();
    } else if (difficulty === "medium") {
      index = getBlockingMove() ?? getRandomMove();
    } else {
      index = getBestMove();
    }
  
    if (index !== undefined) {
      makeMove(index, "O");
  
      // Check if "O" has won after its move
      if (checkWin("O")) {
        message.textContent = `O wins! 🎉`;
        gameActive = false; // Stop the game after O wins
        return;
      }
  
      currentPlayer = "X"; // Switch back to player
      message.textContent = `Player X's turn...`;
    }
  };

// Make a move
const makeMove = (index, player) => {
  boardState[index] = player;
  const cells = board.querySelectorAll(".cell");
  cells[index].textContent = player;

  if (checkWin(player)) {
    message.textContent = `${player} wins! 🎉`;
    gameActive = false;  // Stop the game after a win
  } else if (boardState.every((cell) => cell !== "")) {
    message.textContent = "It's a tie! 🤝";
    gameActive = false;  // Stop the game if it's a tie
  }
};

// Check for a win
const checkWin = (player) => {
  return winningCombinations.some((combination) =>
    combination.every((index) => boardState[index] === player)
  );
};

// Get random move for easy difficulty
const getRandomMove = () => {
  const availableMoves = boardState
    .map((cell, index) => (cell === "" ? index : null))
    .filter((index) => index !== null);

  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
};

// Get blocking move for medium difficulty
const getBlockingMove = () => {
  return (
    findWinningMove("O") || findWinningMove("X") // Try to block opponent or win
  );
};

// Find a winning move for a given player
const findWinningMove = (player) => {
  for (let i = 0; i < 9; i++) {
    if (boardState[i] === "") {
      boardState[i] = player;
      if (checkWin(player)) {
        boardState[i] = "";
        return i; // Return the index of the winning move
      }
      boardState[i] = "";
    }
  }
  return null; // No winning move found
};

// Get the best move for hard difficulty
const getBestMove = () => {
  // For simplicity, let's use blocking and winning logic in hard mode
  return getBlockingMove() ?? getRandomMove();
};

// Restart the game
const restartGame = () => {
  gameActive = false;
  intro.classList.remove("d-none");
  gameSection.classList.add("d-none");
};

// Initialize the game
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);
