const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const musicBtn = document.getElementById("musicBtn");

let gameRunning = false;
let score = 0;
let speed = 5;

const player = {
  x: 230,
  y: 600,
  width: 50,
  height: 80,
  img: new Image()
};
player.img.src = "https://i.imgur.com/9U8zv3b.png"; // car

const enemies = [];
function spawnEnemy() {
  const enemy = {
    x: Math.random() * 450,
    y: -80,
    width: 50,
    height: 80,
    img: new Image()
  };
  enemy.img.src = "https://i.imgur.com/ts8N8jQ.png";
  enemies.push(enemy);
}

let musicOn = true;
const bgMusic = new Audio("https://actions.google.com/sounds/v1/ambiences/busy_city.ogg");
bgMusic.loop = true;
bgMusic.volume = 0.4;

let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function movePlayer() {
  if (keys["ArrowLeft"] && player.x > 0) player.x -= speed;
  if (keys["ArrowRight"] && player.x < canvas.width - player.width) player.x += speed;
  if (keys["ArrowUp"] && player.y > 0) player.y -= speed;
  if (keys["ArrowDown"] && player.y < canvas.height - player.height) player.y += speed;
}

function crash(a,b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

function update() {
  if (!gameRunning) return;

  ctx.clearRect(0,0,canvas.width,canvas.height);

  movePlayer();
  ctx.drawImage(player.img, player.x, player.y, player.width, player.height);

  if (Math.random() < 0.03) spawnEnemy();

  enemies.forEach(enemy => {
    enemy.y += speed;
    ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);

    if (crash(player, enemy)) {
      gameOver();
    }
  });

  enemies.forEach((enemy, i) => {
    if (enemy.y > 750) {
      enemies.splice(i, 1);
      score++;
    }
  });

  ctx.fillStyle = "#0ff";
  ctx.font = "22px monospace";
  ctx.fillText("Score: " + score, 10, 30);

  requestAnimationFrame(update);
}

function startGame() {
  score = 0;
  enemies.length = 0;
  gameRunning = true;
  startBtn.style.display = "none";
  restartBtn.style.display = "none";
  if (musicOn) bgMusic.play();
  update();
}

function gameOver() {
  gameRunning = false;
  bgMusic.pause();
  restartBtn.style.display = "inline-block";
  ctx.fillStyle = "red";
  ctx.font = "40px monospace";
  ctx.fillText("GAME OVER", 130, 350);
}

function restartGame() {
  startGame();
}

startBtn.onclick = startGame;
restartBtn.onclick = restartGame;

musicBtn.onclick = () => {
  musicOn = !musicOn;
  if (musicOn) {
    musicBtn.textContent = "Music: On";
    bgMusic.play();
  } else {
    musicBtn.textContent = "Music: Off";
    bgMusic.pause();
  }
};
