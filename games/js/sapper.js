const boardElement = document.getElementById('board');
const messageElement = document.getElementById('message');
const flagsCountElement = document.getElementById('flags-count');
let board = [];
const size = 8;
const mines = 8;
let flagsLeft = mines;
let gameOver = false;
let win = false;

function initGame() {
    board = [];
    flagsLeft = mines;
    gameOver = false;
    win = false;
    flagsCountElement.textContent = flagsLeft;
    messageElement.textContent = '';
    
    for (let i = 0; i < size; i++) {
        board[i] = [];
        for (let j = 0; j < size; j++) {
            board[i][j] = { mine: false, count: 0, open: false, flag: false };
        }
    }

    let minesPlaced = 0;
    while (minesPlaced < mines) {
        let x = Math.floor(Math.random() * size);
        let y = Math.floor(Math.random() * size);
        if (!board[x][y].mine) {
            board[x][y].mine = true;
            minesPlaced++;
        }
    }

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j].mine) continue;
            let count = 0;
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    let ni = i + dx, nj = j + dy;
                    if (ni >= 0 && ni < size && nj >= 0 && nj < size && board[ni][nj].mine) count++;
                }
            }
            board[i][j].count = count;
        }
    }

    renderBoard();
}

function openCell(x, y) {
    if (gameOver) return;
    if (x < 0 || x >= size || y < 0 || y >= size) return;
    if (board[x][y].open) return;
    if (board[x][y].flag) return;
    
    board[x][y].open = true;
    
    if (board[x][y].mine) {
        gameOver = true;
        messageElement.textContent = '💥 Ты взорвался!';
        showAllMines();
        renderBoard();
        return;
    }
    
    if (board[x][y].count === 0) {
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                openCell(x + dx, y + dy);
            }
        }
    }
    
    renderBoard();
    checkWin();
}

function toggleFlag(x, y) {
    if (gameOver) return;
    if (board[x][y].open) return;
    
    if (!board[x][y].flag && flagsLeft <= 0) {
        messageElement.textContent = '❌ Нет флагов!';
        return;
    }
    
    board[x][y].flag = !board[x][y].flag;
    flagsLeft += board[x][y].flag ? -1 : 1;
    flagsCountElement.textContent = flagsLeft;
    
    renderBoard();
    checkWin();
}

function checkWin() {
    let opened = 0;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j].open) opened++;
        }
    }
    if (opened === size * size - mines) {
        gameOver = true;
        win = true;
        messageElement.textContent = '🎉 ПОБЕДА! Ты гений!';
        
        // СОХРАНЯЕМ СТАТИСТИКУ
        if (window.updateStats) {
            window.updateStats('sapper', { win: true });
        }
    }
}

function showAllMines() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j].mine) {
                board[i][j].open = true;
            }
        }
    }
}

function renderBoard() {
    boardElement.innerHTML = '';
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            
            if (board[i][j].open) {
                cell.classList.add('open');
                if (board[i][j].mine) {
                    cell.classList.add('mine');
                    cell.textContent = '💣';
                } else if (board[i][j].count > 0) {
                    cell.textContent = board[i][j].count;
                }
            } else if (board[i][j].flag) {
                cell.classList.add('flagged');
                cell.textContent = '🚩';
            }
            
            cell.onclick = (x, y) => () => openCell(x, y);
            cell.onclick = cell.onclick(i, j);
            
            cell.oncontextmenu = (x, y) => (e) => {
                e.preventDefault();
                toggleFlag(x, y);
            };
            cell.oncontextmenu = cell.oncontextmenu(i, j);
            
            boardElement.appendChild(cell);
        }
    }
}

initGame();