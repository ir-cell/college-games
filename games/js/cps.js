let clicks = 0;
let timeLeft = 5;
let totalTime = 5;
let active = false;
let timerInterval;
let testJustEnded = false; // НОВАЯ ПЕРЕМЕННАЯ

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
    testJustEnded = false; // СБРАСЫВАЕМ ФЛАГ
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
    testJustEnded = true; // СТАВИМ ФЛАГ ЧТО ТЕСТ ТОЛЬКО ЧТО ЗАКОНЧИЛСЯ
    clearInterval(timerInterval);
    clickArea.className = 'waiting';
    instruction.textContent = 'Нажми, чтобы начать заново';
    
    // ЧЕРЕЗ 500 МС УБИРАЕМ ФЛАГ
    setTimeout(() => {
        testJustEnded = false;
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
    testJustEnded = false;
    clicksSpan.textContent = clicks;
    timerSpan.textContent = timeLeft;
    cpsSpan.textContent = '0.0';
    resultDiv.textContent = '';
    instruction.textContent = 'Нажми, чтобы начать';
    clickArea.className = 'waiting';
}

clickArea.onclick = () => {
    // ЕСЛИ ТЕСТ ТОЛЬКО ЧТО ЗАКОНЧИЛСЯ - ИГНОРИРУЕМ КЛИК
    if (testJustEnded) {
        return;
    }
    
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