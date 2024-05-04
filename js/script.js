// Define constants
const BOARD_SIZE = 10; // Adjust based on your grid size
const NUM_MINES = 10; // Adjust based on the number of mines you want

// Initialize game board
let board = [];
let gameOver = false;

// Create game board
function createBoard() {
    for (let i = 0; i < BOARD_SIZE; i++) {
        board[i] = [];
        for (let j = 0; j < BOARD_SIZE; j++) {
            board[i][j] = {
                isMine: false,
                revealed: false,
                flagged: false,
                nearbyMines: 0
            };
        }
    }
}

// Place mines randomly on the board
function placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < NUM_MINES) {
        const row = Math.floor(Math.random() * BOARD_SIZE);
        const col = Math.floor(Math.random() * BOARD_SIZE);
        if (!board[row][col].isMine) {
            board[row][col].isMine = true;
            minesPlaced++;
        }
    }
}

// Calculate the number of nearby mines for each cell
function calculateNearbyMines() {
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (!board[i][j].isMine) {
                board[i][j].nearbyMines = countNearbyMines(i, j);
            }
        }
    }
}

// Count nearby mines for a given cell
function countNearbyMines(row, col) {
    let count = 0;
    for (let i = Math.max(0, row - 1); i <= Math.min(row + 1, BOARD_SIZE - 1); i++) {
        for (let j = Math.max(0, col - 1); j <= Math.min(col + 1, BOARD_SIZE - 1); j++) {
            if (board[i][j].isMine) {
                count++;
            }
        }
    }
    return count;
}

// Initialize the game
function initGame() {
    createBoard();
    placeMines();
    calculateNearbyMines();
    // Add event listeners to each cell
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', handleClick);
            cell.addEventListener('contextmenu', handleRightClick);
            document.getElementById('board').appendChild(cell);
        }
    }
}

// Handle left click (revealing cells)
function handleClick(event) {
    if (gameOver) return;
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    if (!board[row][col].revealed && !board[row][col].flagged) {
        revealCell(row, col);
    }
}

// Handle right click (flagging cells)
function handleRightClick(event) {
    event.preventDefault();
    if (gameOver) return;
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    const cell = board[row][col];
    if (!cell.revealed) {
        cell.flagged = !cell.flagged;
        event.target.classList.toggle('flagged');
    }
}

// Reveal cell and adjacent cells recursively
function revealCell(row, col) {
    const cell = board[row][col];
    if (cell.isMine) {
        gameOver = true;
        revealAllMines();
        document.getElementById('game-status').innerText = 'Game Over!';
        return;
    }
    cell.revealed = true;
    const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    cellElement.classList.add('revealed');
    if (cell.nearbyMines === 0) {
        for (let i = Math.max(0, row - 1); i <= Math.min(row + 1, BOARD_SIZE - 1); i++) {
            for (let j = Math.max(0, col - 1); j <= Math.min(col + 1, BOARD_SIZE - 1); j++) {
                if (!board[i][j].revealed && !board[i][j].flagged) {
                    revealCell(i, j);
                }
            }
        }
    } else {
        // Display number indicating nearby mines
        cellElement.textContent = cell.nearbyMines;
        cellElement.classList.add('number');
    }
    checkGameOver(); // Check for game over conditions after each cell is revealed
}

// Function to check for game over conditions
function checkGameOver() {
    let allCellsRevealed = true;
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (!board[i][j].isMine && !board[i][j].revealed) {
                allCellsRevealed = false;
                break;
            }
        }
    }
    if (allCellsRevealed) {
        gameOver = true;
        document.getElementById('game-status').innerText = 'Congratulations! You won!';
    }
}

// Reveal all mines on the board
function revealAllMines() {
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (board[i][j].isMine) {
                const cellElement = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
                cellElement.classList.add('revealed', 'mine');
            }
        }
    }
}

// Function to restart the game
function restartGame() {
    gameOver = false;
    document.getElementById('game-status').innerText = '';
    document.getElementById('board').innerHTML = ''; // Clear the board
    initGame(); // Initialize a new game
}

// Event listener for the restart button
document.getElementById('restart-button').addEventListener('click', restartGame);

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initGame);