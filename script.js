const bingoBoard = document.getElementById('bingo-board');
const startButton = document.getElementById('start-game');
const resetButton = document.getElementById('reset-game');
const drawnImage = document.getElementById('drawn-image');
const countDisplay = document.getElementById('count');
const historyDisplay = document.getElementById('history');

let drawnImages = [];
let userBoard = [];
let currentDrawnImage = null;
let drawCount = 0;
let drawInterval;
let countdownInterval;
let countdownTime = 5;

// Image paths (12 images in total)
const imagePaths = [
    'images/ag.jpg', 'images/anand.jpg', 'images/anis.jpg',
    'images/asim.jpg', 'images/bibek.jpg', 'images/himal.jpg',
    'images/pris.jpg', 'images/resmi.jpg', 'images/shisir.png',
    'images/haha.png', 'images/gay.jpg', 'images/runche.jpeg'
];

// Create a timer display element
const timerDisplay = document.createElement('p');
timerDisplay.id = 'timer';
timerDisplay.innerText = countdownTime;
document.getElementById('drawn-number-container').appendChild(timerDisplay);

// Generate shuffled array of image indices
function generateShuffledArray(size, maxNumber) {
    const indices = Array.from({ length: maxNumber }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices.slice(0, size);
}

// Generate a 3x3 Bingo board with 9 random images
function generateBoard() {
    bingoBoard.innerHTML = '';
    userBoard = [];
    const shuffledImages = generateShuffledArray(9, imagePaths.length).map(index => imagePaths[index]);

    shuffledImages.forEach((imagePath, index) => {
        let cell = document.createElement('div');
        cell.classList.add('bingo-cell');

        // Create an image element
        let img = document.createElement('img');
        img.src = imagePath;
        img.alt = `Image ${index + 1}`;
        img.classList.add('bingo-image');

        // Set up click event for the cell
        cell.addEventListener('click', () => handleCellClick(cell, imagePath, index));

        cell.appendChild(img);
        bingoBoard.appendChild(cell);
        userBoard.push(false);
    });
}

// Draw a random image from the full list of 12 images
function drawImage() {
    if (drawnImages.length >= imagePaths.length) {
        alert('All images have been drawn!');
        clearInterval(drawInterval);
        clearInterval(countdownInterval);
        return;
    }

    let imagePath;
    do {
        imagePath = imagePaths[Math.floor(Math.random() * imagePaths.length)];
    } while (drawnImages.includes(imagePath));

    drawnImages.push(imagePath);
    currentDrawnImage = imagePath;

    // Update the drawn image display
    drawnImage.src = imagePath;
    drawnImage.alt = 'Drawn Image';

    drawCount++;
    countDisplay.innerText = drawCount;
    historyDisplay.innerText = drawnImages.map(img => img.split('/').pop()).join(', ');

    resetCountdown();
}

// Handle cell click for marking
function handleCellClick(cell, imagePath, index) {
    // Allow marking if the cell's image matches the drawn image
    if (imagePath === currentDrawnImage) {
        if (!cell.classList.contains('marked')) {
            cell.classList.add('marked');

            // Create an overlay element for ink mark
            const overlay = document.createElement('div');
            overlay.classList.add('mark-overlay');
            cell.appendChild(overlay);

            userBoard[index] = true;
            checkForBingo();
        }
    } else {
        alert('This image hasn\'t been drawn yet!');
    }
}

// Check for Bingo (all cells must be marked)
function checkForBingo() {
    if (userBoard.every(cell => cell === true)) {
        clearInterval(drawInterval);
        clearInterval(countdownInterval);
       
        window.location.href = 'congratulations.html';
    }
}

// Reset game
function resetGame() {
    drawnImages = [];
    currentDrawnImage = null;
    drawnImage.src = '';
    drawCount = 0;
    countDisplay.innerText = drawCount;
    historyDisplay.innerText = 'None';
    clearInterval(drawInterval);
    clearInterval(countdownInterval);
    countdownTime = 5;
    timerDisplay.innerText = countdownTime;
    generateBoard();
}

// Start the game and draw images automatically
function startDrawing() {
    if (drawInterval) {
        clearInterval(drawInterval);
    }
    generateBoard();
    drawImage();
    drawInterval = setInterval(drawImage, 5000);
    resetCountdown();
}

// Reset Countdown
function resetCountdown() {
    clearInterval(countdownInterval);
    countdownTime = 5;
    timerDisplay.innerText = countdownTime;
    countdownInterval = setInterval(() => {
        countdownTime--;
        timerDisplay.innerText = countdownTime;
        if (countdownTime <= 0) {
            alert("Time's up! Drawing a new image.");
            drawImage();
            resetCountdown();
        }
    }, 1000);
}

// Event Listeners
startButton.addEventListener('click', startDrawing);
resetButton.addEventListener('click', resetGame);

// Initialize Board
generateBoard();
