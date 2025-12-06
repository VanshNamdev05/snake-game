const board = document.querySelector('.board');
const startButton = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");
const restartButton = document.querySelector(".btn-restart");

const highScoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");

let highScore = localStorage.getItem("highscore") || 0;
let score = 0;
let time = `00:00`;

highScoreElement.innerText = highScore;


const blockHeight = 50;
const blockWidth = 50;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let intervalId = null;
let timerIntervalId = null;

let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }

const blocks = [];

let snake = [{
    x: 1, y: 3
}];

let direction = 'down';

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement('div');
        block.classList.add("block");
        board.appendChild(block);
        blocks[`${row}-${col}`] = block;
    }
}

function render() {

    let head = null;
    blocks[`${food.x}-${food.y}`].classList.add("food");

    if (direction === 'left') {
        head = { x: snake[0].x, y: snake[0].y - 1 }
    }
    else if (direction === 'right') {
        head = { x: snake[0].x, y: snake[0].y + 1 }
    }
    else if (direction === 'down') {
        head = { x: snake[0].x + 1, y: snake[0].y }
    } else {
        head = { x: snake[0].x - 1, y: snake[0].y }
    }

    if(head.x >= rows){
        head.x = 0;
    }
    if(head.x < 0){
        head.x = rows - 1;
    }
    if(head.y < 0){
        head.y = cols - 1;
    }
    if(head.y >= cols){
        head.y = 0;
    }
    

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    })

    let collided = snake.some(segment => 
        segment.x === head.x && segment.y === head.y
    );

    if(collided){
        clearInterval(intervalId);
        clearInterval(timerIntervalId);

        modal.style.display = "flex";
        gameOverModal.style.display = "flex";
        startGameModal.style.display = "none";

        return;
    }

    snake.unshift(head);
    snake.pop();

    if (head.x == food.x && head.y == food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }
        blocks[`${food.x}-${food.y}`].classList.add("food");
        snake.unshift(head);

        score += 1;
        scoreElement.innerText = score;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highscore", highScore.toString());
        }

        setSpeed();

    }


    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    })
}

// intervalId = setInterval(() => {

//     render();

// }, 300);

startButton.addEventListener("click", () => {
    modal.style.display = "none";
    intervalId = setInterval(() => {
        render();
    }, 300)
    timerIntervalId = setInterval(() => {
        let [min, sec] = time.split(":").map(Number);

        sec++;
        if (sec === 60) {
            min++;
            sec = 0;
        }

        let mm = min < 10 ? "0" + min : min;
        let ss = sec < 10 ? "0" + sec : sec;

        time = `${mm}:${ss}`;
        timeElement.innerText = time;

    }, 1000);

})

addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
        direction = "up";
    }
    else if (e.key === "ArrowDown") {
        direction = "down";
    }
    else if (e.key === "ArrowLeft") {
        direction = "left";
    }
    else if (e.key === "ArrowRight") {
        direction = "right";
    }
})

restartButton.addEventListener("click", restartGame);

function restartGame() {

    clearInterval(intervalId);
    clearInterval(timerIntervalId);

    blocks[`${food.x}-${food.y}`].classList.remove("food");
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    });

    score = 0;
    time = "00:00";

    scoreElement.innerText = score;
    timeElement.innerText = time;
    highScoreElement.innerText = highScore;

    direction = "down";
    modal.style.display = "none";

    snake = [{ x: 1, y: 3 }];
    food = {
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * cols)
    };

    intervalId = setInterval(render, 300);

    timerIntervalId = setInterval(() => {
        let [min, sec] = time.split(":").map(Number);

        sec++;
        if (sec === 60) {
            min++;
            sec = 0;
        }

        let mm = min < 10 ? "0" + min : min;
        let ss = sec < 10 ? "0" + sec : sec;

        time = `${mm}:${ss}`;
        timeElement.innerText = time;

    }, 1000);
}

function setSpeed(){
    clearInterval(intervalId);

    let speed = 300;

    if(score > 20){
        speed = 140;
    }
    else if(score >= 15){
        speed = 180;
    }
    else if(score >= 10){
        speed = 220;
    }
    else if(score >= 5){
        speed = 260;
    }

    intervalId = setInterval(render, speed);
}