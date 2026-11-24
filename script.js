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
  const parentElemen = document.querySelector(parent);
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
const winMessage = createElement('p', 'div.wrapper', 'winMessage');
const levelSelect = createElement('select', '.wrapper', 'level');
const easyOption = createElement('option', 'select.level', null, 'Легкий');
easyOption.value = 4;
const mediumOption = createElement('option', 'select.level', null, 'Средний');
mediumOption.value = 8;
const hardOption = createElement('option', 'select.level', null, 'Сложный');
hardOption.value = 12;

//выбор уровня сложности
levelSelect.addEventListener('change', (e) => {
  pairsCount = Number(e.target.value);
  cards.classList.remove('easy', 'medium', 'hard');
  if (pairsCount === 4) {
    cards.classList.add('easy');
  } else if (pairsCount === 8) {
    cards.classList.add('medium');
  } else if (pairsCount === 12) {
    cards.classList.add('hard');
  }
  resetGame();
});

//функция создание карточек
const arrayOfUniqCards = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
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

const movesElement = createElement(
  'p',
  'div.wrapper',
  'moves',
  `Количество ходов: ${moves}`,
);

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
  card.textContent = card.dataset.symbol;
  card.classList.add('opened');
}

//функция закрытия карточек
function closeCard(card) {
  card.textContent = '?';
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
        winMessage.textContent = 'You Win!';
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
