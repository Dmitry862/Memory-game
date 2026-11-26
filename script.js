const body = document.querySelector('body');
// состояния карточек
let firstCard = null,
  secondCard = null,
  isLocked = false,
  matched = 0,
  moves = 0,
  isGameOver = false,
  pairsCount = 4;
const FLIP_DELAY = 800;

function createElement(tag, parent, classlist = null, text = '') {
  const newElement = document.createElement(tag);
  if (Array.isArray(classlist)) {
    newElement.classList.add(...classlist);
  } else {
    newElement.classList.add(classlist);
  }
  newElement.textContent = text;
  const parentElemen =
    typeof parent === 'string' ? document.querySelector(parent) : parent;
  if (!parentElemen) {
    console.warn(`Родительский элемент "${parent}" не найден`);
    return null;
  } else {
    parentElemen.appendChild(newElement);
    return newElement;
  }
}

// создание элементов
createElement('div', 'body', 'wrapper');
createElement('div', 'div.wrapper', 'cardPlace');
const modalWindow = createElement('div', 'div.wrapper', 'modal');
const modalContent = createElement('div', '.modal', 'modal_content');
const modalTitle = createElement('p', '.modal_content', 'title_text');
const modalMemoryText = createElement('p', '.modal_content', 'memory_text');
const modalText = createElement('p', '.modal_content', 'modal_content_text');
const modalSignOff = createElement('p', '.modal_content', 'sign_off');
const startButton = createElement('button', '.modal_content', 'start_btn');
const winWindow = createElement('div', 'div.wrapper', 'win_window');
const winContent = createElement('div', '.win_window', 'win_content');
const winTitle = createElement('p', '.win_content', 'win_title');
const winMessage = createElement('p', '.win_content', 'win_message');
const winByeMessage = createElement('p', '.win_content', 'win_bye_message');
const winButton = createElement('p', '.win_content', 'win_btn');
const levelSelect = createElement('select', '.wrapper', 'level');
const easyOption = createElement('option', 'select.level', null, 'Легкий');
easyOption.value = 4;
const mediumOption = createElement('option', 'select.level', null, 'Средний');
mediumOption.value = 8;
const hardOption = createElement('option', 'select.level', null, 'Сложный');
hardOption.value = 12;
createElement('div', '.wrapper', 'moves_container');
const movesElement = createElement(
  'p',
  '.moves_container',
  'moves',
  `Количество ходов: ${moves}`,
);

//содержимое модального окна
modalTitle.textContent = 'Привет, Друзья!';
modalMemoryText.textContent =
  'Помните наши поездки на RK3T! Долгие разговоры, азарт охоты за дальними корреспондентами, крики и стуки по клавиатуре во время CONTESTов, голоса в эфире и незабываемые моменты, которые нас объединяли.С тех пор прошло много времени, но хорошие воспоминания остаются с нами.';
modalText.textContent =
  'Эта небольшая игра - повод снова встретиься, пусть даже виртуально, вспомнить те дни и улыбнуться.';
modalSignOff.textContent = 'Удачи в игре и приятных воспоминаний!';
startButton.textContent = 'Вспомним те времена';

//содержимое окна win
winTitle.textContent = 'You Win!';
winMessage.textContent =
  'Отличная работа! Поздравляю! Все пары найдены! Память не подвела. Как и в эфире здесь важны терпение, внимание и немного удачи. Здорово, что мы снова встретились, пусть и за карточной игрой. ';
winByeMessage.textContent =
  'Ну а если все уровни пройдены или просто надоели рожи на фото, то 73!Удачи!Пока ;-)';
winButton.textContent = 'Сыграем еще раз?';

// клик на кнопке начала и конца игры
modalWindow.style.display = 'flex';
startButton.addEventListener('click', (e) => {
  modalWindow.style.display = 'none';
});
winButton.addEventListener('click', (e) => {
  winWindow.style.display = 'none';
});

//выбор уровня сложности

levelSelect.addEventListener('change', (e) => {
  pairsCount = Number(e.target.value);
  if (pairsCount === 12) {
    cards.style.gridTemplateColumns = 'repeat(6,1fr)';
    cards.style.maxWidth = '1062px';
  } else {
    cards.style.gridTemplateColumns = 'repeat(4,1fr)';
    cards.style.maxWidth = '708px';
  }

  resetGame();
});

//функция создание карточек
const arrayOfUniqCards = [
  'cat.jpg',
  'r3tig.jpg',
  'r3tm_Ksusha.jpg',
  'r3tm.jpg',
  'r3tw.jpg',
  'r3tzl.jpg',
  'rc3t.jpg',
  'rj3t.jpg',
  'rk3tt.jpg',
  'ru3t.jpg',
  'rw3tn_u3t_tig_j3t_tfg.jpg',
  'rw3tn.jpg',
];
const gameCards = [];

const cards = document.querySelector('.cardPlace');

function createGameCards() {
  gameCards.length = 0;
  arrayOfUniqCards.slice(0, pairsCount).forEach((el) => {
    if (el) {
      gameCards.push(el, el);
    } else return;
  });
  shuffle(gameCards);
  gameCards.forEach((symbol) => {
    const card = document.createElement('button');
    card.textContent = '?';
    card.dataset.symbol = symbol;
    card.classList.add('BTN');
    cards.appendChild(card);
    const cardBack = createElement('div', card, 'card-back');
    const cardFront = createElement('div', card, 'card-front');
    const frontImage = document.createElement('img');
    frontImage.src = `./images/friends/${symbol}`;
    console.log(frontImage.src);
    cardFront.appendChild(frontImage);
  });
  return;
}

// Перемешивание карточек
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}
createGameCards();
showAllCards();

//функция показа всех карточек
function showAllCards() {
  const allCards = cards.querySelectorAll('.BTN');
  isLocked = true;
  allCards.forEach((el) => {
    openCard(el);
  });
  setTimeout(() => {
    allCards.forEach((el) => {
      closeCard(el);
    });
    isLocked = false;
  }, 3000);
}

//функция обработчик событий клик на доску с карточками
function handleCardClick(event) {
  const card = event.target.closest('.BTN');
  if (!card) return;
  if (card.classList.contains('matched')) return;
  if (card === firstCard) return;
  if (isLocked) return;
  if (isGameOver) return;
  openCard(card);
  if (firstCard === null) {
    firstCard = card;
  } else {
    secondCard = card;
    moves++;
    movesElement.textContent = `Количество ходов: ${moves}`;
    console.log(moves);
    checkMatch();
  }
}
cards.addEventListener('click', handleCardClick);

//функция открытия карточки
function openCard(card) {
  card.classList.add('opened');
  const front = card.querySelector('.card-front');
}

//функция закрытия карточек
function closeCard(card) {
  card.classList.remove('opened');
}

//функция проверки совпадения
function checkMatch() {
  if (firstCard && secondCard) {
    isLocked = true;
    if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
      matched++;
      firstCard.classList.add('matched');
      secondCard.classList.add('matched');
      firstCard = null;
      secondCard = null;
      isLocked = false;
      if (matched === pairsCount) {
        isGameOver = true;
        winWindow.style.display = 'flex';
      }
    } else {
      timerId();
    }
  }
}

//функция задержки
function timerId() {
  setTimeout(() => {
    closeCard(firstCard);
    closeCard(secondCard);
    firstCard = null;
    secondCard = null;
    isLocked = false;
  }, FLIP_DELAY);
}

//функция сброса игры
function resetGame() {
  firstCard = null;
  secondCard = null;
  isLocked = false;
  matched = 0;
  moves = 0;
  isGameOver = false;
  movesElement.textContent = `Количество ходов: ${moves}`;
  cards.textContent = '';
  shuffle(gameCards);
  createGameCards();
  console.log(gameCards);
  console.log(cards);
  console.log(cards.children.length);
  winMessage.textContent = '';
  showAllCards();
}
