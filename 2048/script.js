const GRID_SIZE = 4;
const WINNING_TILE = 2048;

const gridContainer = document.getElementById("grid-container");
const scoreDisplay = document.getElementById("score");
const newGameButton = document.getElementById("new-game");

let grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
let score = 0;

// Initialize the game
function initializeGame() {
  grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
  score = 0;
  updateUI();
  addRandomTile();
  addRandomTile();
}

// Helper function to generate a random tile (2 or 4)
function generateRandomTile() {
  return Math.random() < 0.9 ? 2 : 4;
}

// Helper function to add a new tile to a random empty cell
function addRandomTile() {
  const emptyCells = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === 0) {
        emptyCells.push({ row, col });
      }
    }
  }
  if (emptyCells.length > 0) {
    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    grid[randomCell.row][randomCell.col] = generateRandomTile();
    updateUI();
  }
}

// Function to update the game UI
function updateUI() {
  gridContainer.innerHTML = "";
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const cellValue = grid[row][col];
      const cell = document.createElement("div");
      cell.className = `grid-cell value-${cellValue}`;
      cell.textContent = cellValue !== 0 ? cellValue : "";
      gridContainer.appendChild(cell);
    }
  }
  scoreDisplay.textContent = `Score: ${score}`;
}

// Initialize the game
initializeGame();

newGameButton.addEventListener("click", () => {
  initializeGame();
});

// Handle user input (arrow keys)
document.addEventListener("keydown", (event) => {
  if (isGameOver()) return;

  let moved = false;

  switch (event.key) {
    case "ArrowUp":
      moved = moveUp();
      break;
    case "ArrowDown":
      moved = moveDown();
      break;
    case "ArrowLeft":
      moved = moveLeft();
      break;
    case "ArrowRight":
      moved = moveRight();
      break;
  }

  if (moved) {
    addRandomTile();
    updateUI();

    if (hasWon()) {
      alert("Congratulations! You've won the game!");
    }

    if (isGameOver()) {
      alert("Game over! Try again.");
    }
  }
});

let isDragging = false;
let startX, startY;

gridContainer.addEventListener("mousedown", (event) => {
  isDragging = true;
  startX = event.clientX;
  startY = event.clientY;
});

gridContainer.addEventListener("mousemove", (event) => {
  if (isGameOver()) return;

  let moved = false;

  if (!isDragging) return;

  const currentX = event.clientX;
  const currentY = event.clientY;
  const dx = currentX - startX;
  const dy = currentY - startY;
  const threshold = 20; // Adjust as needed

  if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
    isDragging = false;
    console.log(dx, dy);

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) {
        // Right swipe
        moved = moveRight();
      } else {
        // Left swipe
        moved = moveLeft();
      }
    } else {
      if (dy > 0) {
        // Down swipe
        moved = moveDown();
      } else {
        // Up swipe
        moved = moveUp();
      }
    }
  }

  if (moved) {
    addRandomTile();
    updateUI();

    if (hasWon()) {
      alert("Congratulations! You've won the game!");
    }

    if (isGameOver()) {
      alert("Game over! Try again.");
    }
  }
});

gridContainer.addEventListener("mouseup", () => {
  isDragging = false;
});

gridContainer.addEventListener("touchstart", (event) => {
  isDragging = true;
  startX = event.touches[0].clientX;
  startY = event.touches[0].clientY;
});

gridContainer.addEventListener("touchmove", (event) => {
  event.preventDefault();
  if (!isDragging) return;

  if (isGameOver()) return;

  let moved = false;

  const currentX = event.touches[0].clientX;
  const currentY = event.touches[0].clientY;
  const dx = currentX - startX;
  const dy = currentY - startY;
  const threshold = 20; // Adjust as needed

  if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
    isDragging = false;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) {
        // Right swipe
        moved = moveRight();
      } else {
        // Left swipe
        moved = moveLeft();
      }
    } else {
      if (dy > 0) {
        // Down swipe
        moved = moveDown();
      } else {
        // Up swipe
        moved = moveUp();
      }
    }
  }
  if (moved) {
    addRandomTile();
    updateUI();

    if (hasWon()) {
      alert("Congratulations! You've won the game!");
    }

    if (isGameOver()) {
      alert("Game over! Try again.");
    }
  }
});

gridContainer.addEventListener("touchend", () => {
  isDragging = false;
});

// Implement the game logic for moving tiles and checking win/game over conditions here
// Function to move tiles up
function moveUp() {
  let moved = false;

  for (let col = 0; col < GRID_SIZE; col++) {
    for (let row = 1; row < GRID_SIZE; row++) {
      if (grid[row][col] !== 0) {
        let newRow = row;
        while (newRow > 0) {
          const currentTile = grid[newRow][col];
          const tileAbove = grid[newRow - 1][col];
          if (tileAbove === 0) {
            grid[newRow][col] = 0;
            grid[newRow - 1][col] = currentTile;
            newRow--;
            moved = true;
          } else if (tileAbove === currentTile) {
            grid[newRow][col] = 0;
            grid[newRow - 1][col] = currentTile * 2;
            score += currentTile * 2;
            moved = true;
            break;
          } else {
            break;
          }
        }
      }
    }
  }

  return moved;
}

// Function to move tiles down
function moveDown() {
  let moved = false;

  for (let col = 0; col < GRID_SIZE; col++) {
    for (let row = GRID_SIZE - 2; row >= 0; row--) {
      if (grid[row][col] !== 0) {
        let newRow = row;
        while (newRow < GRID_SIZE - 1) {
          const currentTile = grid[newRow][col];
          const tileBelow = grid[newRow + 1][col];

          if (tileBelow === 0) {
            grid[newRow][col] = 0;
            grid[newRow + 1][col] = currentTile;
            newRow++;
            moved = true;
          } else if (tileBelow === currentTile) {
            grid[newRow][col] = 0;
            grid[newRow + 1][col] = currentTile * 2;
            score += currentTile * 2;
            moved = true;
            break;
          } else {
            break;
          }
        }
      }
    }
  }

  return moved;
}

// Function to move tiles left
function moveLeft() {
  let moved = false;

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 1; col < GRID_SIZE; col++) {
      if (grid[row][col] !== 0) {
        let newCol = col;
        while (newCol > 0) {
          const currentTile = grid[row][newCol];
          const tileLeft = grid[row][newCol - 1];

          if (tileLeft === 0) {
            grid[row][newCol] = 0;
            grid[row][newCol - 1] = currentTile;
            newCol--;
            moved = true;
          } else if (tileLeft === currentTile) {
            grid[row][newCol] = 0;
            grid[row][newCol - 1] = currentTile * 2;
            score += currentTile * 2;
            moved = true;
            break;
          } else {
            break;
          }
        }
      }
    }
  }

  return moved;
}

// Function to move tiles right
function moveRight() {
  let moved = false;

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = GRID_SIZE - 2; col >= 0; col--) {
      if (grid[row][col] !== 0) {
        let newCol = col;
        while (newCol < GRID_SIZE - 1) {
          const currentTile = grid[row][newCol];
          const tileRight = grid[row][newCol + 1];

          if (tileRight === 0) {
            grid[row][newCol] = 0;
            grid[row][newCol + 1] = currentTile;
            newCol++;
            moved = true;
          } else if (tileRight === currentTile) {
            grid[row][newCol] = 0;
            grid[row][newCol + 1] = currentTile * 2;
            score += currentTile * 2;
            moved = true;
            break;
          } else {
            break;
          }
        }
      }
    }
  }

  return moved;
}

function isGameOver() {
  // Check if there are any empty cells
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === 0) {
        return false;
      }
    }
  }

  // Check if there are any adjacent tiles with the same value
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const currentTile = grid[row][col];

      // Check above
      if (row > 0 && grid[row - 1][col] === currentTile) {
        return false;
      }

      // Check below
      if (row < GRID_SIZE - 1 && grid[row + 1][col] === currentTile) {
        return false;
      }

      // Check left
      if (col > 0 && grid[row][col - 1] === currentTile) {
        return false;
      }

      // Check right
      if (col < GRID_SIZE - 1 && grid[row][col + 1] === currentTile) {
        return false;
      }
    }
  }

  // If no empty cells or adjacent tiles with the same value are found, the game is over
  return true;
}

function hasWon() {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === WINNING_TILE) {
        return true;
      }
    }
  }
  return false;
}
