const grid = document.getElementById("sudoku-grid");
let inputs = [];

// Create grid
for (let i = 0; i < 81; i++) {
  const input = document.createElement("input");
  input.type = "text";
  input.maxLength = 1;
  input.inputMode = "numeric";

  // Allow only 1–9
  input.addEventListener("input", () => {
    if (!/^[1-9]$/.test(input.value)) {
      input.value = "";
    }
  });

  // 🔥 Keyboard navigation
  input.addEventListener("keydown", (e) => {
    const index = inputs.indexOf(input);
    let targetIndex = null;

    switch (e.key) {
      case "ArrowLeft":
        if (index % 9 !== 0) targetIndex = index - 1;
        break;

      case "ArrowRight":
        if (index % 9 !== 8) targetIndex = index + 1;
        break;

      case "ArrowUp":
        if (index >= 9) targetIndex = index - 9;
        break;

      case "ArrowDown":
        if (index < 72) targetIndex = index + 9;
        break;

      default:
        return;
    }

    if (targetIndex !== null) {
      e.preventDefault(); // 🚫 stop cursor movement
      inputs[targetIndex].focus();
    }
  });

  grid.appendChild(input);
  inputs.push(input);
}

// Read board
function getBoard() {
  let board = [];
  for (let i = 0; i < 9; i++) {
    board.push([]);
    for (let j = 0; j < 9; j++) {
      const val = inputs[i * 9 + j].value;
      board[i][j] = val === "" ? 0 : parseInt(val);
    }
  }
  return board;
}

// Solver logic (backtracking)
function solve(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solve(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function isValid(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) return false;
    if (board[i][col] === num) return false;

    const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
    const boxCol = 3 * Math.floor(col / 3) + (i % 3);
    if (board[boxRow][boxCol] === num) return false;
  }
  return true;
}

// Solve button
function solveSudoku() {
  let board = getBoard();

  inputs.forEach(input => {
    if (input.value !== "") {
      input.classList.add("given");
      input.disabled = true;
    }
  });

  if (solve(board)) {
    board.flat().forEach((num, i) => {
      if (inputs[i].value === "") {
        inputs[i].value = num;
        inputs[i].classList.add("solved");
      }
    });
  } else {
    alert("No solution exists!");
  }
}

// Clear button
function clearGrid() {
  inputs.forEach(input => {
    input.value = "";
    input.disabled = false;
    input.classList.remove("given", "solved");
  });
}