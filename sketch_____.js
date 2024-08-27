let cardImage;
let startButtonImage;
let backgroundImage;

let cards = new Array(100);
let selectedCards = new Array(30);
let gameStarted = false;
let gameFinished = false;
let isSorted = false; // 정렬 상태 확인 변수
let startTime;
let endTime;

let firstSelected = -1;
let secondSelected = -1;

let cardWidth = 80;
let cardHeight = 100;
let spacing = 20;
let gridCols = 6;
let gridRows = 5;
let totalWidth = gridCols * cardWidth + (gridCols - 1) * spacing;
let totalHeight = gridRows * cardHeight + (gridRows - 1) * spacing;
let offsetX;
let offsetY;

let cardPositions = new Array(30);

function preload() {
  cardImage = loadImage("card_image.png");
  startButtonImage = loadImage("시작버튼.png");
  backgroundImage = loadImage("배경.jpg");
}

function setup() {
  createCanvas(800, 700);
  offsetX = (width - totalWidth) / 2;
  offsetY = (height - totalHeight) / 2;
  
  for (let i = 0; i < 100; i++) {
    cards[i] = i + 1;
  }
  
  shuffleArray(cards);
  for (let i = 0; i < 30; i++) {
    let x = offsetX + (i % gridCols) * (cardWidth + spacing);
    let y = offsetY + (i / gridCols) * (cardHeight + spacing);
    cardPositions[i] = createVector(x, y);
    selectedCards[i] = cards[i];
  }
  
  startTime = millis();
}

function draw() {
  image(backgroundImage, 0, 0, width, height);

  if (!gameStarted) {
    drawStartScreen();
  } else if (gameFinished) {
    drawSuccessScreen();
  } else {
    drawCards();
    if (isSorted) { // 정렬 확인
      gameFinished = true;
      endTime = millis();
      fill(0);
      textSize(32);
      textAlign(CENTER, CENTER);
      text("Success! Time: " + (endTime - startTime) / 1000.0 + "s", width / 2, height / 2);
    }
  }
}

function drawStartScreen() {
  fill(0);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Card Sorting Game", width / 2, height / 2 - 60);
  image(startButtonImage, width / 2 - startButtonImage.width / 2, height / 2);
}

function drawSuccessScreen() {
  fill(0);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Success!", width / 2, height / 2 - 20);
  textSize(24);
  text("Time: " + (endTime - startTime) / 1000.0 + "s", width / 2, height / 2 + 20);
}

function mousePressed() {
  if (!gameStarted) {
    if (mouseX > width / 2 - startButtonImage.width / 2 && mouseX < width / 2 + startButtonImage.width / 2 &&
        mouseY > height / 2 && mouseY < height / 2 + startButtonImage.height) {
      startGame();
    }
  } else if (!gameFinished) {
    let index = getCardIndex(mouseX, mouseY);
    if (index != -1) {
      if (firstSelected == -1) {
        firstSelected = index;
      } else if (secondSelected == -1) {
        secondSelected = index;
        swapCards(firstSelected, secondSelected); // 카드 교환
        firstSelected = -1;
        secondSelected = -1;
        checkSorted(); // 정렬 여부 확인
      }
    }
  }
}

function startGame() {
  shuffleArray(cards);
  for (let i = 0; i < 30; i++) {
    selectedCards[i] = cards[i];
  }
  gameStarted = true;
  startTime = millis();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let index = Math.floor(random(i + 1));
    let temp = array[index];
    array[index] = array[i];
    array[i] = temp;
  }
}

function drawCards() {
  for (let i = 0; i < 30; i++) {
    let w = cardWidth;
    let h = cardHeight;
    if (i == firstSelected || i == secondSelected) {
      w *= 1.2; // 선택된 카드를 20% 확대
      h *= 1.2;
    }
    let x = cardPositions[i].x - (w - cardWidth) / 2;
    let y = cardPositions[i].y - (h - cardHeight) / 2;
    image(cardImage, x, y, w, h);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(20);
    text(selectedCards[i], x + w / 2, y + h / 2);
  }
}

function getCardIndex(x, y) {
  for (let i = 0; i < 30; i++) {
    if (x > cardPositions[i].x && x < cardPositions[i].x + cardWidth &&
        y > cardPositions[i].y && y < cardPositions[i].y + cardHeight) {
      return i;
    }
  }
  return -1;
}

// 카드 교환 함수
function swapCards(i, j) {
  let temp = selectedCards[i];
  selectedCards[i] = selectedCards[j];
  selectedCards[j] = temp;
}

// 정렬 확인 함수
function checkSorted() {
  isSorted = true;
  for (let i = 0; i < selectedCards.length - 1; i++) {
    if (selectedCards[i] > selectedCards[i + 1]) {
      isSorted = false;
      break;
    }
  }
}
