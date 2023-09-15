let canvasElement = document.getElementById("gameCanvas");
let ctx = canvasElement.getContext("2d");
console.log("Test");
const constants = {
  PLAYER_WIDTH: 50,
  PLAYER_HEIGHT: 50,
  PLATFORM_WIDTH: 100,
  PLATFORM_HEIGHT: 20,
  GRAVITY: 1,
  JUMP_FORCE: 15,
  PLAYER_SPEED: 5,
}

const gamestate = {
  Player: {
    x: canvasElement.width / 2 - constants.PLAYER_WIDTH / 2,
    y: canvasElement.height - constants.PLAYER_HEIGHT,
    xSpeed: 0,
    ySpeed: 0,
    isJumping: false,
    isWinning: false
  },
  Platforms: [],
  ScoreKeeping: {
    lowestJumpCount: 1000,
    currentJumpCount: 0,
  }
}

function AddPlatform(xmod, ymod) {
  let platform = {
    x: 0 + xmod,
    y: canvasElement.height - constants.PLATFORM_HEIGHT + ymod,
    width: constants.PLATFORM_WIDTH,
    height: constants.PLATFORM_HEIGHT,
  }
  return platform;
}

gamestate.Platforms.push(AddPlatform(200, 0));
gamestate.Platforms.push(AddPlatform(50, -50));
gamestate.Platforms.push(AddPlatform(200, -200));
gamestate.Platforms.push(AddPlatform(300, -350));
gamestate.Platforms.push(AddPlatform(550, -200));
gamestate.Platforms.push(AddPlatform(700, -300));
gamestate.Platforms.push(AddPlatform(600, -460));
gamestate.Platforms.push(AddPlatform(350, -550));
gamestate.Platforms.push(AddPlatform(50, -500));

// Handle keyboard input
document.addEventListener("keydown", (event) => {
  if (event.code === "Space" && !gamestate.Player.isJumping) {
    gamestate.Player.isJumping = true;
    gamestate.Player.ySpeed = -constants.JUMP_FORCE;
    gamestate.ScoreKeeping.currentJumpCount += 1;
  }
  if (event.code === "ArrowLeft") {
    gamestate.Player.xSpeed = -constants.PLAYER_SPEED;
  }
  if (event.code === "ArrowRight") {
    gamestate.Player.xSpeed = constants.PLAYER_SPEED;
  }
});

document.addEventListener("keyup", (event) => {
  if (event.code === "ArrowLeft" || event.code === "ArrowRight") {
    gamestate.Player.xSpeed = 0;
  }
});


//Menu
let button = document.getElementById("restartbtn");

button.addEventListener("click", resetGame);

let lowestJumpCountElement = document.getElementById("lowestJumpCount");
let currentJumpCountElement = document.getElementById("currentJumpCount");

//Reset gamestate.Player and update highscore if beaten.
function resetGame() {
  button.blur();

  if (gamestate.Player.isWinning && gamestate.ScoreKeeping.currentJumpCount > 0 && gamestate.ScoreKeeping.currentJumpCount < gamestate.ScoreKeeping.lowestJumpCount) {
    gamestate.ScoreKeeping.lowestJumpCount = gamestate.ScoreKeeping.currentJumpCount;
  }
  gamestate.ScoreKeeping.currentJumpCount = 0;
  lowestJumpCountElement.innerText = "Highscore (fewest jumps to reach golden platform): " + gamestate.ScoreKeeping.lowestJumpCount;

  gamestate.Player.x = canvasElement.width / 2 - constants.PLAYER_WIDTH / 2;
  gamestate.Player.y = canvasElement.height - constants.PLAYER_HEIGHT;
  gamestate.Player.xSpeed = 0;
  gamestate.Player.ySpeed = 0;
  gamestate.Player.isJumping = false;
  gamestate.Player.isWinning = false;

}

// Update function / Game loop
function update() {
  // Apply gravity to the gamestate.Player
  gamestate.Player.ySpeed += constants.GRAVITY;

  // Update player position
  gamestate.Player.x += gamestate.Player.xSpeed;
  gamestate.Player.y += gamestate.Player.ySpeed;

  // Keep the player within bounds
  if (gamestate.Player.x < 0) {
    gamestate.Player.x = 0;
  }
  if (gamestate.Player.x + constants.PLAYER_WIDTH > canvasElement.width) {
    gamestate.Player.x = canvasElement.width - constants.PLAYER_WIDTH;
  }
  if (gamestate.Player.y + constants.PLAYER_HEIGHT > canvasElement.height) {
    gamestate.Player.y = canvasElement.height - constants.PLAYER_HEIGHT;
    gamestate.Player.isJumping = false;
    gamestate.Player.ySpeed = 0;
  }

  // Check for collision with the platform
  gamestate.Platforms.forEach((platform, index) => {
    if (
      gamestate.Player.x < platform.x + platform.width &&
      gamestate.Player.x + constants.PLAYER_WIDTH > platform.x &&
      gamestate.Player.y + constants.PLAYER_HEIGHT > platform.y &&
      gamestate.Player.y < platform.y + platform.height
    ) {

      gamestate.Player.isJumping = false;
      gamestate.Player.ySpeed = 1;

      if (index === gamestate.Platforms.length - 1) {
        gamestate.Player.isWinning = true;
        gamestate.Player.y = platform.y - constants.PLAYER_HEIGHT;
        setTimeout(() => {
          resetGame();
        }, 1000);
      }
    }

  });

  // Clear the canvasElement
  ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  // Draw the gamestate.Player
  ctx.fillStyle = "blue";
  ctx.fillRect(gamestate.Player.x, gamestate.Player.y, constants.PLAYER_WIDTH, constants.PLAYER_HEIGHT);

  // Draw the platform
  ctx.fillStyle = "green";
  gamestate.Platforms.forEach((platform, index) => {
    if (index === gamestate.Platforms.length - 1) {
      ctx.fillStyle = "gold";
    }
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  });

  currentJumpCountElement.innerText = gamestate.ScoreKeeping.currentJumpCount;

  // Request the next animation frame
  window.requestAnimationFrame(update);
}

// Start the game loop
resetGame();
update();

//future development: move the view upwards with ctx.translate(0,100);
