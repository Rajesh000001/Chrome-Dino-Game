const dino = document.querySelector("#dino");
const game = document.querySelector(".game");
const gameOverText = document.querySelector("#gameOver");
const scoreElement = document.querySelector("#score");
const speedDisplay = document.querySelector("#speedDisplay");
const gameMusic = new Audio("game.mp3");
const jumpMusic = new Audio("jump.mp3");
const gameOverMusic = new Audio("gameOver.mp3");

let isJumping = false;
let gamePaused = false;
let obstacleSpeed = 2;

gameMusic.loop = true;
gameMusic.volume = 0.2;

function jump () {
  if (isJumping || gamePaused) return;

  jumpMusic.currentTime = 0;
  jumpMusic.play();

  dino.style.backgroundImage = "url('dinoJump.gif')";
  isJumping = true;
  dino.classList.add("jump");

  setTimeout(() => {
    dino.classList.remove("jump");
    isJumping = false;
    dino.style.backgroundImage = "url('dinoidle.gif')";
  }, 1000);
}

function createObstacle() {
  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");

  const height = Math.floor(Math.random() * 40) + 20;
  const width = Math.floor(Math.random() * 30) + 20;

  obstacle.style.height = `${height}px`;
  obstacle.style.width = `${width}px`;
  obstacle.style.animation = `moveObstacle ${obstacleSpeed}s linear forwards`;

  game.appendChild(obstacle);

  obstacle.addEventListener("animationend", () => {
    obstacle.remove();
  });
}

setInterval(() => {
  if (gamePaused) return;

  const dinoRect = dino.getBoundingClientRect();
  const obstacles = document.querySelectorAll(".obstacle");

  obstacles.forEach((obstacle) => {
    const obstacleRect = obstacle.getBoundingClientRect();

    const overlap = !(
      dinoRect.top > obstacleRect.bottom ||
      dinoRect.bottom < obstacleRect.top ||
      dinoRect.right < obstacleRect.left ||
      dinoRect.left > obstacleRect.right
    );

    if (overlap) {
      gameMusic.pause();
      gameOverMusic.play();
      gamePaused = true;
      gameOverText.style.display = "block";
      dino.style.backgroundImage = "url('dinoJump.gif')";
      obstacles.forEach(obs => obs.style.animationPlayState = 'paused');
    }
  });
}, 10);

// Score System
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
document.querySelector("#highScore").innerText = `High Score: ${highScore}`;

setInterval(() => {
  if (!gamePaused) {
    score++;
    scoreElement.innerText = `Score: ${score}`;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      document.querySelector("#highScore").innerText = `High Score: ${highScore}`;
    }
  }
}, 200);

// Speed increase
setInterval(() => {
  if (!gamePaused && obstacleSpeed > 1) {
    obstacleSpeed -= 0.1;
    speedDisplay.innerText = `Speed: ${obstacleSpeed.toFixed(2)}s`;
  }
}, 1000);

// Obstacle generation
setInterval(() => {
  if (!gamePaused) {
    createObstacle();
  }
}, 1500);

// Game Reset
function resetGame() {
  gameMusic.play();
  gameOverMusic.pause();
  gameOverMusic.currentTime = 0;
  jumpMusic.pause();
  jumpMusic.currentTime = 0;

  document.querySelectorAll(".obstacle").forEach(ob => ob.remove());
  obstacleSpeed = 2;
  dino.style.backgroundImage = "url('dinoidle.gif')";
  gameOverText.style.display = "none";
  gamePaused = false;
  score = 0;
  scoreElement.innerText = `Score: ${score}`;
  speedDisplay.innerText = `Speed: ${obstacleSpeed.toFixed(2)}s`;
}

// Controls
function handleJump(e) {
  if (e.code === "Space") {
    if (!gameMusic.played.length) {
      gameMusic.play();
    }

    if (gamePaused) {
      resetGame();
    } else {
      jump();
    }
  }
}

// Events
document.addEventListener("keydown", handleJump);

// Mobile touch
game.addEventListener("touchstart", () => {
  if (gamePaused) {
    resetGame();
  } else {
    jump();
  }
});
