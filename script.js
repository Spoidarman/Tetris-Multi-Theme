// Game Constants
const COLS_MOIN = 10;
const ROWS_MOIN = 20;
const BLOCK_SIZE_MOIN = 20;

// Themes
const THEMES_MOIN = {
  CYBERPUNK: {
    COLORS: [
      null,
      "#FF00FF", // I - Magenta
      "#00F3FF", // J - Cyan
      "#FF6BFF", // L - Light Magenta
      "#FFD700", // O - Gold
      "#00FF7F", // S - Spring Green
      "#FF8C00", // T - Dark Orange
      "#9370DB", // Z - Medium Purple
      "#555555", // Garbage
    ],
    GHOST_ALPHA: 0.3,
    BG_COLOR: "rgba(0, 0, 20, 0.7)",
    NEXT_BG: "rgba(0, 0, 20, 0.7)",
  },
  MINIMALIST: {
    COLORS: [
      null,
      "#FF5252", // I - Red
      "#2196F3", // J - Blue
      "#FF9800", // L - Orange
      "#FFEB3B", // O - Yellow
      "#4CAF50", // S - Green
      "#9C27B0", // T - Purple
      "#607D8B", // Z - Gray
      "#E0E0E0", // Garbage
    ],
    GHOST_ALPHA: 0.2,
    BG_COLOR: "#ffffff",
    NEXT_BG: "#f8f9fa",
  },
};

let CURRENT_THEME_MOIN = "CYBERPUNK";
let COLORS_MOIN = THEMES_MOIN.CYBERPUNK.COLORS;
let GHOST_ALPHA_MOIN = THEMES_MOIN.CYBERPUNK.GHOST_ALPHA;
let BG_COLOR_MOIN = THEMES_MOIN.CYBERPUNK.BG_COLOR;
let NEXT_BG_MOIN = THEMES_MOIN.CYBERPUNK.NEXT_BG;

// Tetromino Shapes
const SHAPES_MOIN = [
  null,
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ], // I
  [
    [2, 0, 0],
    [2, 2, 2],
    [0, 0, 0],
  ], // J
  [
    [0, 0, 3],
    [3, 3, 3],
    [0, 0, 0],
  ], // L
  [
    [0, 4, 4],
    [0, 4, 4],
    [0, 0, 0],
  ], // O
  [
    [0, 5, 5],
    [5, 5, 0],
    [0, 0, 0],
  ], // S
  [
    [0, 6, 0],
    [6, 6, 6],
    [0, 0, 0],
  ], // T
  [
    [7, 7, 0],
    [0, 7, 7],
    [0, 0, 0],
  ], // Z
];

// Game Variables
let canvas_MOIN = document.getElementById("tetris-canvas_MOIN");
let ctx_MOIN = canvas_MOIN.getContext("2d");
let nextCanvas_MOIN = document.getElementById("next-canvas_MOIN");
let nextCtx_MOIN = nextCanvas_MOIN.getContext("2d");
let holdCanvas_MOIN = document.getElementById("hold-canvas_MOIN");
let holdCtx_MOIN = holdCanvas_MOIN.getContext("2d");
let scoreElement_MOIN = document.getElementById("score_MOIN");
let levelElement_MOIN = document.getElementById("level_MOIN");
let linesElement_MOIN = document.getElementById("lines_MOIN");
let speedElement_MOIN = document.getElementById("speed_MOIN");
let startButton_MOIN = document.getElementById("start-btn_MOIN");
let pauseButton_MOIN = document.getElementById("pause-btn_MOIN");
let themeButton_MOIN = document.getElementById("theme-btn_MOIN");
let minimalButton_MOIN = document.getElementById("minimal-btn_MOIN");

let SCORE_MOIN = 0;
let LEVEL_MOIN = 1;
let LINES_MOIN = 0;
let GAME_OVER_MOIN = false;
let IS_PAUSED_MOIN = false;
let DROP_COUNTER_MOIN = 0;
let DROP_INTERVAL_MOIN = 800;
let LAST_TIME_MOIN = 0;
let BOARD_MOIN = createBoard_MOIN();
let PLAYER_MOIN = {
  pos: { x: 0, y: 0 },
  matrix: null,
  next: null,
  hold: null,
  canHold: true,
};

// Scale canvas
ctx_MOIN.scale(BLOCK_SIZE_MOIN, BLOCK_SIZE_MOIN);
nextCtx_MOIN.scale(BLOCK_SIZE_MOIN / 2, BLOCK_SIZE_MOIN / 2);
holdCtx_MOIN.scale(BLOCK_SIZE_MOIN / 2, BLOCK_SIZE_MOIN / 2);

// Initialize the game
init_MOIN();

function init_MOIN() {
  resetGame_MOIN();
  startButton_MOIN.addEventListener("click", startGame_MOIN);
  pauseButton_MOIN.addEventListener("click", togglePause_MOIN);
  document.addEventListener("keydown", keyHandler_MOIN);

  // Theme switching
  themeButton_MOIN.addEventListener("click", () =>
    switchTheme_MOIN("CYBERPUNK")
  );
  minimalButton_MOIN.addEventListener("click", () =>
    switchTheme_MOIN("MINIMALIST")
  );
}

function switchTheme_MOIN(theme) {
  CURRENT_THEME_MOIN = theme;
  COLORS_MOIN = THEMES_MOIN[theme].COLORS;
  GHOST_ALPHA_MOIN = THEMES_MOIN[theme].GHOST_ALPHA;
  BG_COLOR_MOIN = THEMES_MOIN[theme].BG_COLOR;
  NEXT_BG_MOIN = THEMES_MOIN[theme].NEXT_BG;

  document.body.className = theme.toLowerCase() + "-theme_MOIN";

  if (theme === "CYBERPUNK") {
    themeButton_MOIN.classList.add("cyberpunk-active_MOIN");
    minimalButton_MOIN.classList.remove("cyberpunk-active_MOIN");
  } else {
    minimalButton_MOIN.classList.add("cyberpunk-active_MOIN");
    themeButton_MOIN.classList.remove("cyberpunk-active_MOIN");
  }

  draw_MOIN();
  drawNext_MOIN();
  drawHold_MOIN();
}

function startGame_MOIN() {
  if (GAME_OVER_MOIN) {
    resetGame_MOIN();
  }
  IS_PAUSED_MOIN = false;
  document
    .querySelector(".game-container_MOIN")
    .classList.remove("paused_MOIN");
  startButton_MOIN.textContent = "RESTART";
  pauseButton_MOIN.style.display = "block";
  window.requestAnimationFrame(update_MOIN);
}

function resetGame_MOIN() {
  SCORE_MOIN = 0;
  LEVEL_MOIN = 1;
  LINES_MOIN = 0;
  DROP_INTERVAL_MOIN = 800;
  updateScore_MOIN();

  BOARD_MOIN = createBoard_MOIN();
  PLAYER_MOIN.next = createPiece_MOIN();
  PLAYER_MOIN.hold = null;
  PLAYER_MOIN.canHold = true;
  resetPlayer_MOIN();

  GAME_OVER_MOIN = false;
  document
    .querySelector(".game-container_MOIN")
    .classList.remove("game-over_MOIN");
  pauseButton_MOIN.style.display = "none";
}

function createBoard_MOIN() {
  return Array.from(Array(ROWS_MOIN), () => Array(COLS_MOIN).fill(0));
}

function createPiece_MOIN() {
  const RAND_MOIN = Math.floor(Math.random() * 7) + 1;
  const PIECE_MOIN = SHAPES_MOIN[RAND_MOIN];
  return {
    matrix: PIECE_MOIN,
    color: COLORS_MOIN[RAND_MOIN],
  };
}

function resetPlayer_MOIN() {
  if (!PLAYER_MOIN.next) {
    PLAYER_MOIN.next = createPiece_MOIN();
  }

  PLAYER_MOIN.matrix = PLAYER_MOIN.next.matrix;
  PLAYER_MOIN.color = PLAYER_MOIN.next.color;
  PLAYER_MOIN.next = createPiece_MOIN();
  PLAYER_MOIN.pos.y = 0;
  PLAYER_MOIN.pos.x = Math.floor(
    (COLS_MOIN - PLAYER_MOIN.matrix[0].length) / 2
  );
  PLAYER_MOIN.canHold = true;

  if (collide_MOIN()) {
    GAME_OVER_MOIN = true;
    document
      .querySelector(".game-container_MOIN")
      .classList.add("game-over_MOIN");
    startButton_MOIN.textContent = "GAME OVER - PLAY AGAIN";
    pauseButton_MOIN.style.display = "none";
  }

  drawNext_MOIN();
  drawHold_MOIN();
}

function drawMatrix_MOIN(matrix, offset, color, context) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = color;
        context.fillRect(x + offset.x, y + offset.y, 1, 1);

        if (CURRENT_THEME_MOIN === "CYBERPUNK") {
          context.shadowBlur = 8;
          context.shadowColor = color;
          context.strokeStyle = "#fff";
          context.lineWidth = 0.05;
          context.strokeRect(x + offset.x, y + offset.y, 1, 1);
          context.shadowBlur = 0;
        }
      }
    });
  });
}

function draw_MOIN() {
  // Clear the canvas
  ctx_MOIN.fillStyle = BG_COLOR_MOIN;
  ctx_MOIN.fillRect(0, 0, canvas_MOIN.width, canvas_MOIN.height);

  // Draw the board
  drawBoard_MOIN();

  // Draw the current piece
  drawMatrix_MOIN(
    PLAYER_MOIN.matrix,
    PLAYER_MOIN.pos,
    PLAYER_MOIN.color,
    ctx_MOIN
  );

  // Draw ghost piece
  drawGhost_MOIN();
}

function drawGhost_MOIN() {
  if (IS_PAUSED_MOIN || GAME_OVER_MOIN) return;

  const GHOST_MOIN = {
    pos: { x: PLAYER_MOIN.pos.x, y: PLAYER_MOIN.pos.y },
    matrix: PLAYER_MOIN.matrix,
  };

  while (!collideGhost_MOIN(GHOST_MOIN)) {
    GHOST_MOIN.pos.y++;
  }
  GHOST_MOIN.pos.y--;

  ctx_MOIN.globalAlpha = GHOST_ALPHA_MOIN;
  drawMatrix_MOIN(
    GHOST_MOIN.matrix,
    GHOST_MOIN.pos,
    PLAYER_MOIN.color,
    ctx_MOIN
  );
  ctx_MOIN.globalAlpha = 1.0;
}

function collideGhost_MOIN(ghost) {
  const [MATRIX_MOIN, POS_MOIN] = [ghost.matrix, ghost.pos];
  for (let y = 0; y < MATRIX_MOIN.length; ++y) {
    for (let x = 0; x < MATRIX_MOIN[y].length; ++x) {
      if (
        MATRIX_MOIN[y][x] !== 0 &&
        (BOARD_MOIN[y + POS_MOIN.y] === undefined ||
          BOARD_MOIN[y + POS_MOIN.y][x + POS_MOIN.x] === undefined ||
          BOARD_MOIN[y + POS_MOIN.y][x + POS_MOIN.x] !== 0)
      ) {
        return true;
      }
    }
  }
  return false;
}

function drawBoard_MOIN() {
  BOARD_MOIN.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        ctx_MOIN.fillStyle = COLORS_MOIN[value];
        ctx_MOIN.fillRect(x, y, 1, 1);

        if (CURRENT_THEME_MOIN === "CYBERPUNK") {
          ctx_MOIN.shadowBlur = 10;
          ctx_MOIN.shadowColor = COLORS_MOIN[value];
          ctx_MOIN.strokeStyle = "#fff";
          ctx_MOIN.lineWidth = 0.05;
          ctx_MOIN.strokeRect(x, y, 1, 1);
          ctx_MOIN.shadowBlur = 0;
        }
      }
    });
  });
}

function drawNext_MOIN() {
  // Clear the next canvas
  nextCtx_MOIN.fillStyle = NEXT_BG_MOIN;
  nextCtx_MOIN.fillRect(0, 0, nextCanvas_MOIN.width, nextCanvas_MOIN.height);

  // Draw the next piece centered
  const OFFSET_MOIN = {
    x:
      (nextCanvas_MOIN.width / (BLOCK_SIZE_MOIN / 2) -
        PLAYER_MOIN.next.matrix[0].length) /
      2,
    y:
      (nextCanvas_MOIN.height / (BLOCK_SIZE_MOIN / 2) -
        PLAYER_MOIN.next.matrix.length) /
      2,
  };

  drawMatrix_MOIN(
    PLAYER_MOIN.next.matrix,
    OFFSET_MOIN,
    PLAYER_MOIN.next.color,
    nextCtx_MOIN
  );
}

function drawHold_MOIN() {
  // Clear the hold canvas
  holdCtx_MOIN.fillStyle = NEXT_BG_MOIN;
  holdCtx_MOIN.fillRect(0, 0, holdCanvas_MOIN.width, holdCanvas_MOIN.height);

  if (PLAYER_MOIN.hold) {
    // Draw the hold piece centered
    const OFFSET_MOIN = {
      x:
        (holdCanvas_MOIN.width / (BLOCK_SIZE_MOIN / 2) -
          PLAYER_MOIN.hold.matrix[0].length) /
        2,
      y:
        (holdCanvas_MOIN.height / (BLOCK_SIZE_MOIN / 2) -
          PLAYER_MOIN.hold.matrix.length) /
        2,
    };

    drawMatrix_MOIN(
      PLAYER_MOIN.hold.matrix,
      OFFSET_MOIN,
      PLAYER_MOIN.hold.color,
      holdCtx_MOIN
    );
  }
}


function collide_MOIN() {
  const [MATRIX_MOIN, POS_MOIN] = [PLAYER_MOIN.matrix, PLAYER_MOIN.pos];
  for (let y = 0; y < MATRIX_MOIN.length; ++y) {
    for (let x = 0; x < MATRIX_MOIN[y].length; ++x) {
      if (
        MATRIX_MOIN[y][x] !== 0 &&
        (BOARD_MOIN[y + POS_MOIN.y] === undefined ||
          BOARD_MOIN[y + POS_MOIN.y][x + POS_MOIN.x] === undefined ||
          BOARD_MOIN[y + POS_MOIN.y][x + POS_MOIN.x] !== 0)
      ) {
        return true;
      }
    }
  }
  return false;
}

function merge_MOIN() {
  PLAYER_MOIN.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        BOARD_MOIN[y + PLAYER_MOIN.pos.y][x + PLAYER_MOIN.pos.x] = value;
      }
    });
  });
}

function rotate_MOIN() {
  const MATRIX_MOIN = PLAYER_MOIN.matrix;
  const N_MOIN = MATRIX_MOIN.length;
  const ROTATED_MOIN = Array(N_MOIN)
    .fill()
    .map(() => Array(N_MOIN).fill(0));

  for (let y = 0; y < N_MOIN; ++y) {
    for (let x = 0; x < N_MOIN; ++x) {
      ROTATED_MOIN[x][N_MOIN - 1 - y] = MATRIX_MOIN[y][x];
    }
  }

  const ORIGINAL_MOIN = PLAYER_MOIN.matrix;
  PLAYER_MOIN.matrix = ROTATED_MOIN;

  // Wall kicks
  const OFFSETS_MOIN = [
    [0, 0],
    [1, 0],
    [-1, 0],
    [0, -1],
    [1, -1],
    [-1, -1],
  ];

  for (let i = 0; i < OFFSETS_MOIN.length; i++) {
    PLAYER_MOIN.pos.x += OFFSETS_MOIN[i][0];
    PLAYER_MOIN.pos.y += OFFSETS_MOIN[i][1];

    if (!collide_MOIN()) {
      return;
    }

    PLAYER_MOIN.pos.x -= OFFSETS_MOIN[i][0];
    PLAYER_MOIN.pos.y -= OFFSETS_MOIN[i][1];
  }

  PLAYER_MOIN.matrix = ORIGINAL_MOIN;
}

function playerDrop_MOIN() {
  PLAYER_MOIN.pos.y++;
  if (collide_MOIN()) {
    PLAYER_MOIN.pos.y--;
    merge_MOIN();
    clearLines_MOIN();
    resetPlayer_MOIN();
  }
  DROP_COUNTER_MOIN = 0;
}

function playerMove_MOIN(dir) {
  PLAYER_MOIN.pos.x += dir;
  if (collide_MOIN()) {
    PLAYER_MOIN.pos.x -= dir;
  }
}

function playerHardDrop_MOIN() {
  while (!collide_MOIN()) {
    PLAYER_MOIN.pos.y++;
  }
  PLAYER_MOIN.pos.y--;
  merge_MOIN();
  clearLines_MOIN();
  resetPlayer_MOIN();
  DROP_COUNTER_MOIN = 0;
}

function holdPiece_MOIN() {
  if (!PLAYER_MOIN.canHold) return;

  if (PLAYER_MOIN.hold) {
    // Swap current piece with hold piece
    const TEMP_MOIN = {
      matrix: PLAYER_MOIN.matrix,
      color: PLAYER_MOIN.color,
    };

    PLAYER_MOIN.matrix = PLAYER_MOIN.hold.matrix;
    PLAYER_MOIN.color = PLAYER_MOIN.hold.color;
    PLAYER_MOIN.hold = TEMP_MOIN;
  } else {
    // First hold
    PLAYER_MOIN.hold = {
      matrix: PLAYER_MOIN.matrix,
      color: PLAYER_MOIN.color,
    };
    PLAYER_MOIN.next = createPiece_MOIN();
    resetPlayer_MOIN();
  }

  PLAYER_MOIN.canHold = false;
  drawHold_MOIN();
}

function clearLines_MOIN() {
  let LINES_CLEARED_MOIN = 0;

  outer: for (let y = BOARD_MOIN.length - 1; y >= 0; --y) {
    for (let x = 0; x < BOARD_MOIN[y].length; ++x) {
      if (BOARD_MOIN[y][x] === 0) {
        continue outer;
      }
    }

    // Remove the line
    const ROW_MOIN = BOARD_MOIN.splice(y, 1)[0].fill(0);
    BOARD_MOIN.unshift(ROW_MOIN);
    ++y;

    LINES_CLEARED_MOIN++;
  }

  if (LINES_CLEARED_MOIN > 0) {
    updateScore_MOIN(LINES_CLEARED_MOIN);

    // Add garbage lines for difficulty (every 5 lines cleared)
    if (LINES_CLEARED_MOIN > 1 && LEVEL_MOIN > 3 && Math.random() > 0.7) {
      addGarbageLine_MOIN();
    }
  }
}

function addGarbageLine_MOIN() {
  // Remove bottom line
  BOARD_MOIN.pop();

  // Add new line at top with one gap
  const NEW_LINE_MOIN = Array(COLS_MOIN).fill(8); // Gray color for garbage
  const GAP_MOIN = Math.floor(Math.random() * COLS_MOIN);
  NEW_LINE_MOIN[GAP_MOIN] = 0;
  BOARD_MOIN.unshift(NEW_LINE_MOIN);
}

function updateScore_MOIN(lines = 0) {
  if (lines > 0) {
    // Scoring system: 40, 100, 300, 1200 for 1, 2, 3, 4 lines respectively
    const POINTS_MOIN = [0, 40, 100, 300, 1200];
    SCORE_MOIN += POINTS_MOIN[lines] * LEVEL_MOIN;
    LINES_MOIN += lines;

    // Level up every 5 lines (faster progression)
    LEVEL_MOIN = Math.floor(LINES_MOIN / 5) + 1;
    DROP_INTERVAL_MOIN = Math.max(100, 800 - (LEVEL_MOIN - 1) * 70); // Faster speed increase
  }

  scoreElement_MOIN.textContent = SCORE_MOIN;
  levelElement_MOIN.textContent = LEVEL_MOIN;
  linesElement_MOIN.textContent = LINES_MOIN;
  speedElement_MOIN.textContent = LEVEL_MOIN + "x";
}

function keyHandler_MOIN(e) {
  if (GAME_OVER_MOIN) return;

  if (e.keyCode === 80) {
    // P key
    togglePause_MOIN();
    return;
  }

  if (IS_PAUSED_MOIN) return;

  switch (e.keyCode) {
    case 37: // Left arrow
      playerMove_MOIN(-1);
      break;
    case 39: // Right arrow
      playerMove_MOIN(1);
      break;
    case 40: // Down arrow
      playerDrop_MOIN();
      break;
    case 38: // Up arrow
      rotate_MOIN();
      break;
    case 32: // Space
      playerHardDrop_MOIN();
      break;
    case 72: // H key
      holdPiece_MOIN();
      break;
  }

  draw_MOIN();
}

function togglePause_MOIN() {
  IS_PAUSED_MOIN = !IS_PAUSED_MOIN;
  if (IS_PAUSED_MOIN) {
    document
      .querySelector(".cyber-container_MOIN")
      .classList.add("paused_MOIN");
    pauseButton_MOIN.textContent = "RESUME";
  } else {
    document
      .querySelector(".cyber-container_MOIN")
      .classList.remove("paused_MOIN");
    pauseButton_MOIN.textContent = "PAUSE";
    window.requestAnimationFrame(update_MOIN);
  }
}

function update_MOIN(time = 0) {
  if (GAME_OVER_MOIN || IS_PAUSED_MOIN) return;

  const DELTA_TIME_MOIN = time - LAST_TIME_MOIN;
  LAST_TIME_MOIN = time;

  DROP_COUNTER_MOIN += DELTA_TIME_MOIN;
  if (DROP_COUNTER_MOIN > DROP_INTERVAL_MOIN) {
    playerDrop_MOIN();
  }

  draw_MOIN();
  window.requestAnimationFrame(update_MOIN);
}

// Theme Switching
themeButton_MOIN.addEventListener("click", () => {
  document.body.className = "cyberpunk-theme_MOIN";
  CURRENT_THEME_MOIN = "CYBERPUNK";
  COLORS_MOIN = THEMES_MOIN.CYBERPUNK.COLORS;
  GHOST_ALPHA_MOIN = THEMES_MOIN.CYBERPUNK.GHOST_ALPHA;
  themeButton_MOIN.classList.add("cyberpunk-active_MOIN");
  minimalButton_MOIN.classList.remove("cyberpunk-active_MOIN");
  draw_MOIN();
});

minimalButton_MOIN.addEventListener("click", () => {
  document.body.className = "minimalist-theme_MOIN";
  CURRENT_THEME_MOIN = "MINIMALIST";
  COLORS_MOIN = THEMES_MOIN.MINIMALIST.COLORS;
  GHOST_ALPHA_MOIN = THEMES_MOIN.MINIMALIST.GHOST_ALPHA;
  minimalButton_MOIN.classList.add("cyberpunk-active_MOIN");
  themeButton_MOIN.classList.remove("cyberpunk-active_MOIN");
  draw_MOIN();
});
