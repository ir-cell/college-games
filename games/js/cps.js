let clicks = 0;
let timeLeft = 5;
let totalTime = 5;
let active = false;
let timerInterval;
let canClick = true; // НОВАЯ ПЕРЕМЕННАЯ для блокировки кликов

let clickArea = document.getElementById('click-area');
let clicksSpan = document.getElementById('clicks');
let timerSpan = document.getElementById('timer');
let cpsSpan = document.getElementById('cps');
let resultDiv = document.getElementById('result');
let instruction = document.getElementById('instruction');
let timeButtons = document.querySelectorAll('.time-btn');

function setTime(seconds) {
    if (active) return;
    
    totalTime = seconds;
    timeLeft = seconds;
    timerSpan.textContent = timeLeft;
    
    timeButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    timeButtons.forEach(btn => {
        if (parseInt(btn.dataset.time) === seconds) {
            btn.classList.add('active');
        }
    });
    
    resetTest();
}

function startTest() {
    clicks = 0;
    timeLeft = totalTime;
    active = true;
    canClick = true; // РАЗРЕШАЕМ КЛИКИ
    clicksSpan.textContent = clicks;
    timerSpan.textContent = timeLeft;
    cpsSpan.textContent = '0.0';
    resultDiv.textContent = '';
    instruction.textContent = 'КЛИКАЙ БЫСТРЕЕ!';
    clickArea.className = 'active';
    
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerSpan.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endTest();
        }
    }, 1000);
}

function endTest() {
    active = false;
    canClick = false; // ЗАПРЕЩАЕМ КЛИКИ СРАЗУ ПОСЛЕ ОКОНЧАНИЯ
    clearInterval(timerInterval);
    clickArea.className = 'waiting';
    instruction.textContent = 'Нажми, чтобы начать заново';
    
    // РАЗРЕШАЕМ КЛИКИ ЧЕРЕЗ 500 МС
    setTimeout(() => {
        canClick = true;
    }, 500);
    
    let cps = (clicks / totalTime).toFixed(1);
    cpsSpan.textContent = cps;
    
    let message = '';
    if (cps < 3) message = '🐢 Черепашка...';
    else if (cps < 5) message = '👍 Нормально';
    else if (cps < 7) message = '⚡ Быстрый!';
    else if (cps < 9) message = '🔥 Огонь!';
    else message = '🤖 Ты робот?';
    
    resultDiv.textContent = `Твой CPS: ${cps} — ${message}`;
}

function resetTest() {
    clearInterval(timerInterval);
    clicks = 0;
    timeLeft = totalTime;
    active = false;
    canClick = true;
    clicksSpan.textContent = clicks;
    timerSpan.textContent = timeLeft;
    cpsSpan.textContent = '0.0';
    resultDiv.textContent = '';
    instruction.textContent = 'Нажми, чтобы начать';
    clickArea.className = 'waiting';
}

clickArea.onclick = () => {
    // ЕСЛИ НЕЛЬЗЯ КЛИКАТЬ - НИЧЕГО НЕ ДЕЛАЕМ
    if (!canClick) return;
    
    if (!active) {
        startTest();
    } else {
        clicks++;
        clicksSpan.textContent = clicks;
        let currentCps = (clicks / (totalTime - timeLeft)).toFixed(1);
        if (timeLeft < totalTime && timeLeft > 0) {
            cpsSpan.textContent = currentCps;
        }
    }
};

clickArea.oncontextmenu = (e) => {
    e.preventDefault();
    return false;
};

setTime(5);