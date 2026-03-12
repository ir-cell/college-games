const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    {x: 10, y: 10},
    {x: 9, y: 10},
    {x: 8, y: 10}
];
let direction = {x: 0, y: 0}; // ТЕПЕРЬ СТОИТ НА МЕСТЕ
let food = {};
let score = 0;
let gameRunning = true;
let gameOverMessage = ''; // Сообщение о проигрыше

// Создаем первую еду
placeFood();

function gameLoop() {
    if (!gameRunning) return;
    
    // Если направление нулевое - не двигаемся (ждем первого нажатия)
    if (direction.x === 0 && direction.y === 0) {
        draw();
        return;
    }
    
    // Запоминаем позицию головы до движения
    let head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
    
    // Проверяем столкновение со стенами
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver('стену');
        return;
    }
    
    // Проверяем столкновение с собой
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            gameOver('себя');
            return;
        }
    }
    
    // Двигаем змейку
    snake.unshift(head);
    
    // Проверяем, съели ли еду
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = score;
        placeFood();
    } else {
        // Убираем хвост
        snake.pop();
    }
    
    draw();
}

function placeFood() {
    let validPosition = false;
    let attempts = 0;
    let maxAttempts = 1000;
    
    while (!validPosition && attempts < maxAttempts) {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        
        validPosition = true;
        for (let segment of snake) {
            if (segment.x === food.x && segment.y === food.y) {
                validPosition = false;
                break;
            }
        }
        attempts++;
    }
}

function gameOver(reason) {
    gameRunning = false;
    gameOverMessage = `💥 Врезался в ${reason}! Счет: ${score}`;
    draw(); // Перерисовываем с сообщением
    
    // 👇 ДОБАВЛЕННЫЕ 2 СТРОЧКИ ДЛЯ СТАТИСТИКИ
    if (window.updateStats) {
        window.updateStats('snake', { score: score });
    }
    
    setTimeout(resetGame, 1500); // Автоматический рестарт через 1.5 сек
}

function resetGame() {
    snake = [
        {x: 10, y: 10},
        {x: 9, y: 10},
        {x: 8, y: 10}
    ];
    direction = {x: 0, y: 0}; // Снова СТОИТ НА МЕСТЕ
    score = 0;
    gameRunning = true;
    gameOverMessage = '';
    scoreElement.textContent = score;
    placeFood();
    draw();
}

function draw() {
    // Очищаем поле
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Рисуем змейку
    snake.forEach((segment, index) => {
        if (index === 0) {
            ctx.fillStyle = '#4285F4'; // Голова
        } else {
            ctx.fillStyle = '#1959d1'; // Тело
        }
        ctx.fillRect(
            segment.x * gridSize, 
            segment.y * gridSize, 
            gridSize - 2, 
            gridSize - 2
        );
    });

    // Рисуем еду
    ctx.fillStyle = '#ff4444';
    ctx.fillRect(
        food.x * gridSize, 
        food.y * gridSize, 
        gridSize - 2, 
        gridSize - 2
    );
    
    // Рисуем сообщение о проигрыше прямо на канвасе (БЕЗ ALERT)
    if (gameOverMessage) {
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText(gameOverMessage, 50, 200);
    }
    
    // Подсказка
    if (direction.x === 0 && direction.y === 0 && gameRunning) {
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '14px Arial';
        ctx.fillText('Нажми стрелки, чтобы начать', 100, 380);
    }
}

// Управление
document.addEventListener('keydown', e => {
    if (e.key.startsWith('Arrow')) {
        e.preventDefault();
    }
    
    // Не меняем направление если игра не активна
    if (!gameRunning) return;
    
    switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (direction.y === 0) direction = {x: 0, y: -1};
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (direction.y === 0) direction = {x: 0, y: 1};
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (direction.x === 0) direction = {x: -1, y: 0};
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (direction.x === 0) direction = {x: 1, y: 0};
            break;
    }
});

// Запускаем игру
setInterval(gameLoop, 100);
draw();