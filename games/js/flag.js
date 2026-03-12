const flagsDB = [
    // Европа
    { code: 'ru', country: 'Россия' },
    { code: 'gb', country: 'Великобритания' },
    { code: 'fr', country: 'Франция' },
    { code: 'de', country: 'Германия' },
    { code: 'it', country: 'Италия' },
    { code: 'es', country: 'Испания' },
    { code: 'pt', country: 'Португалия' },
    { code: 'nl', country: 'Нидерланды' },
    { code: 'be', country: 'Бельгия' },
    { code: 'se', country: 'Швеция' },
    { code: 'no', country: 'Норвегия' },
    { code: 'fi', country: 'Финляндия' },
    { code: 'dk', country: 'Дания' },
    { code: 'pl', country: 'Польша' },
    { code: 'cz', country: 'Чехия' },
    { code: 'sk', country: 'Словакия' },
    { code: 'hu', country: 'Венгрия' },
    { code: 'at', country: 'Австрия' },
    { code: 'ch', country: 'Швейцария' },
    { code: 'gr', country: 'Греция' },
    { code: 'tr', country: 'Турция' },
    { code: 'ua', country: 'Украина' },
    { code: 'by', country: 'Беларусь' },
    { code: 'ro', country: 'Румыния' },
    { code: 'bg', country: 'Болгария' },
    { code: 'rs', country: 'Сербия' },
    { code: 'hr', country: 'Хорватия' },
    { code: 'ie', country: 'Ирландия' },
    
    // Азия
    { code: 'jp', country: 'Япония' },
    { code: 'cn', country: 'Китай' },
    { code: 'kr', country: 'Южная Корея' },
    { code: 'in', country: 'Индия' },
    { code: 'id', country: 'Индонезия' },
    { code: 'th', country: 'Таиланд' },
    { code: 'vn', country: 'Вьетнам' },
    { code: 'my', country: 'Малайзия' },
    { code: 'sg', country: 'Сингапур' },
    { code: 'ph', country: 'Филиппины' },
    { code: 'pk', country: 'Пакистан' },
    { code: 'bd', country: 'Бангладеш' },
    { code: 'ir', country: 'Иран' },
    { code: 'iq', country: 'Ирак' },
    { code: 'il', country: 'Израиль' },
    { code: 'sa', country: 'Саудовская Аравия' },
    { code: 'ae', country: 'ОАЭ' },
    
    // Америка
    { code: 'us', country: 'США' },
    { code: 'ca', country: 'Канада' },
    { code: 'mx', country: 'Мексика' },
    { code: 'br', country: 'Бразилия' },
    { code: 'ar', country: 'Аргентина' },
    { code: 'cl', country: 'Чили' },
    { code: 'co', country: 'Колумбия' },
    { code: 'pe', country: 'Перу' },
    { code: 've', country: 'Венесуэла' },
    { code: 'cu', country: 'Куба' },
    
    // Африка
    { code: 'za', country: 'ЮАР' },
    { code: 'eg', country: 'Египет' },
    { code: 'ma', country: 'Марокко' },
    { code: 'ng', country: 'Нигерия' },
    { code: 'ke', country: 'Кения' },
    { code: 'et', country: 'Эфиопия' },
    { code: 'gh', country: 'Гана' },
    { code: 'tz', country: 'Танзания' },
    
    // Океания
    { code: 'au', country: 'Австралия' },
    { code: 'nz', country: 'Новая Зеландия' }
];

let currentFlag = null;
let score = 0;
let answered = false;
let lastFlagCode = ''; // Запоминаем последний флаг

const flagImage = document.getElementById('flagImage');
const optionsElement = document.getElementById('options');
const messageElement = document.getElementById('message');
const scoreSpan = document.getElementById('score');

function nextFlag() {
    // Выбираем случайный флаг, но не тот же самый что в прошлый раз
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * flagsDB.length);
    } while (flagsDB[randomIndex].code === lastFlagCode && flagsDB.length > 1);
    
    currentFlag = flagsDB[randomIndex];
    lastFlagCode = currentFlag.code;
    
    flagImage.src = `https://flagcdn.com/w320/${currentFlag.code}.png`;
    
    answered = false;
    messageElement.innerHTML = '';
    
    // Создаем варианты ответов
    let options = [currentFlag.country];
    
    while (options.length < 4) {
        let randomFlag = flagsDB[Math.floor(Math.random() * flagsDB.length)].country;
        if (!options.includes(randomFlag)) {
            options.push(randomFlag);
        }
    }
    
    options = shuffleArray(options);
    renderOptions(options);
}

function renderOptions(options) {
    optionsElement.innerHTML = '';
    
    options.forEach(country => {
        let btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = country;
        btn.onclick = () => checkAnswer(country);
        optionsElement.appendChild(btn);
    });
}

function checkAnswer(answer) {
    if (answered) return;
    answered = true;
    
    const buttons = document.querySelectorAll('.option-btn');
    
    if (answer === currentFlag.country) {
        score++;
        scoreSpan.textContent = score;
        messageElement.innerHTML = '✅ <span class="correct">Правильно! Молодец!</span>';
        
        buttons.forEach(btn => {
            if (btn.textContent === currentFlag.country) {
                btn.style.background = '#00c851';
                btn.style.color = 'white';
                btn.style.borderColor = '#00c851';
            }
            btn.disabled = true;
        });
    } else {
        messageElement.innerHTML = `❌ <span class="wrong">Неправильно! Это ${currentFlag.country}</span>`;
        
        buttons.forEach(btn => {
            if (btn.textContent === answer) {
                btn.style.background = '#ff4444';
                btn.style.color = 'white';
                btn.style.borderColor = '#ff4444';
            }
            if (btn.textContent === currentFlag.country) {
                btn.style.background = '#00c851';
                btn.style.color = 'white';
                btn.style.borderColor = '#00c851';
            }
            btn.disabled = true;
        });
    }
}

function resetGame() {
    nextFlag();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

nextFlag();