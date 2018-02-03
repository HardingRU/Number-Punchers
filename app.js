

// our gamestate initialization
// number is the target they are trying to get (i.e. factors of X, multiples of Y); does not apply to primes
// gameType is multiples (1), factors (2), and prime (3)
let gameState = {
  level: 0,
  score: 0,
  lives: 4,
  number: 2,
  gameType: 0,
  xPos: 0,
  yPos: 0
}

//these are the potential target numbers (see: gameState) for level 1-5 (factors1/multiples1) and 6-10 (f2/m2)
let factors1 = [15, 20, 30];
let factors2 = [18, 24, 42];
let multiples1 = [2, 3, 4];
let multiples2 = [5, 6, 8];

// create initial (empty) board;
let board;

// this class defines a Gameboard, and was borrowed from eloquent javascript chap 5
class Gameboard {
  constructor(width, height, content = () => undefined) {
    this.width = width;
    this.height = height;
    this.content = [];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        this.content[y * width + x] = content(x, y);
      }
    }
  }

  get(x, y) {
    return this.content[y * this.width + x];
  }
  set(x, y, value) {
    this.content[y * this.width + x] = value;
  }
}

// create first board, remove landing screen
let $start = $("#startButton");
$start.on('click', function(){
  board = newGame(gameState);
  $("#startButton").remove();
  $("#intro").remove();
  $("instructions").remove();
  $("h3").remove();
  $("br").remove();
})


// function to create gameBoard, select gameType (see gameState)
function newGame() {
  $("article").remove();
  $("span").remove();
  $("div").remove();
  $("h1").remove();
  $("h2").remove();
  gameState.level += 1;
  gameState.xPos = 0;
  gameState.yPos = 0;
  gameState.gameType = randInt(3);
  board = createBoard();
  return board;

}

//logic to create gameboards for levels 1-5
//notice that the board.setting is limiting the board number options to predefined windows
//these predefined windows are in coordination with the target number for a given level / gameType
function createLevel1(board, i, j) {
  switch(gameState.gameType) {
    case(1):
    gameState.number = multiples1[randInt(3)-1];
    board.set(i, j, (randInt(27) + 3));
    break;

    case(2):
    gameState.number = factors1[randInt(3)-1];
    board.set(i, j, randInt(6));
    break;

    case(3):
    board.set(i, j, randInt(20));
    break;
  }
}

//logic to create gameboards for levels 6-10
function createLevel6(board, i, j) {
  switch(gameState.gameType) {
    case(1):
    gameState.number = multiples2[randInt(3)-1];
    board.set(i, j, (randInt(21) + 19));
    break;

    case(2):
    gameState.number = factors2[randInt(3)-1];
    board.set(i, j, (randInt(9) + 3));
    break;

    case(3):
    board.set(i, j, (randInt(26)+23));
    break;
  }
}

// this function creates a new gameboard, depending on the level and gameType
function createBoard() {
  board = new Gameboard(6,5);
  for (let i = 0; i < board.width; i++) {
    for (let j = 0; j < board.height; j++) {
      if (gameState.level < 6 )
      {
        createLevel1(board, i, j);
      }
      else {
        createLevel6(board, i, j);
      }
    }
  }
  placeBoard(board, gameState.gameType);
  return board;
}

// determine keystrokes (found this function on stackoverflow)
$(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
        move("l");
        break;

        case 38: // up
        move("u");
        break;

        case 39: // right
        move("r");
        break;

        case 40: // down
        move("d");
        break;

        case 32:
        checkAnswer(gameState, board);

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action
});

// write board to the dom
function placeBoard(board, gameType) {
    switch(gameType) {
      case 1:
      $("header").append("<h1 class=heading>Find all of the Multiples of " + gameState.number +"!</h1>")
      break;

      case 2:
      $("header").append("<h1 class=heading>Find all of the Factors of " + gameState.number +"!</h1>")

      break;

      case 3:
      $("header").append("<h1 class=heading>Find all of the Prime Numbers!</h1>");
      break;
    }
    $("header").append("<h2 class=levels>Level: " + gameState.level + "</h2>");
    $("footer").append("<span id=score>Score: " + gameState.score + "</span> <span id=lives>Lives: " + gameState.lives + "</span>");
    for (let i = 0; i < board.width; i++) {

      $("main").append("<article id=art"+i+">");
      for (let j = 0; j < board.height; j++) {
        // console.log(board.get(i, j));
          $("#art"+i).append("<div id="+i+"_"+j+" class=col"+j+">"+board.get(i, j)+"</div>");
      }
    }
    replaceDiv("0_0");
}

// add the Rock to div as he moves around
function replaceDiv(id) {
  $("#"+id).text("");
  $("#"+id).html('<img src="https://image.ibb.co/cWWYKR/Webp_net_resizeimage.jpg">');
  $("#"+id).css("padding", "17px 0 17px 0")
}

// remove the Rock from div as he moves to next, and replace the value as needed
function fixDiv(id, num) {
  $("#"+id+" > img").remove();
  $("#"+id).text("" + num);
  $("#"+id).css("padding","42px 0 42px 0");
}

// this function creates random integers, used to create board, as well as select gameType, and target numbers
function randInt(ceiling) {
  randDec = Math.random();
  randWhole = Math.floor(randDec * ceiling) + 1;
  return randWhole;
}

// this function is called when the user munchers a number, to see if it is correct or not
function checkAnswer() {
  let answer = board.get(gameState.xPos, gameState.yPos);
  // checking for empty space, nothing should happen here
  if (answer === "_") {
    return;
  }

  // logic to proceed on correct answer
  switch(gameState.gameType) {
    // check answer against multiple algorithm
    case(1):
    if (answer % gameState.number === 0) {
      gameState.score += 50;
      $("#score").text("Score: " + gameState.score);
      board.set(gameState.xPos, gameState.yPos, "_");
      let levelClear = checkBoard(gameState, board);
      // if the game is over create a new level
      if(levelClear === true) {
        newGame(gameState);
      }
    }
    // logic to proceed on wrong answer
    else {
      wrongAnswer();
    }
    break;

    // check answer against factor algorithm
    case(2):
    if (gameState.number % answer === 0) {
      gameState.score += 50;
      $("#score").text("Score: " + gameState.score);
      board.set(gameState.xPos, gameState.yPos, "_");
      let levelClear = checkBoard(gameState, board);
      // if the game is over create a new level
      if(levelClear === true) {
        newGame(gameState);
      }
    }
    else {
      wrongAnswer();
    }
    break;

    // check answer against prime algorithm
    case(3):
    if(isPrime(answer) === true) {
      gameState.score += 50;
      $("#score").text("Score: " + gameState.score);
      board.set(gameState.xPos, gameState.yPos, "_");
      let levelClear = checkBoard(gameState, board);
      // if the game is over create a new level
      if(levelClear === true) {
      newGame();
      }
    }
    else {
      wrongAnswer();
    }
    break;
  }
  return;
}

// process wrong answers
function wrongAnswer() {
  gameState.lives -= 1;
  $("#lives").text("Lives: " + gameState.lives);
  alert("That answer is incorrect!");
  if(gameState.lives === 0) {
    gameOver();
    return;
  }
}
// this function is called when user munches correct number, to see if they have beaten the level
function checkBoard() {
  for(let i = 0; i < board.width; i++) {
    for(let j = 0; j < board.height; j++) {
      //ignore _ strings, those are correct previous answers
      if(board.get(i, j) === "_") {
      }
      else {
        switch(gameState.gameType) {
          // checking board for any remaining multiples
          case(1):
          if(board.get(i,j) % gameState.number === 0) {
            return false;
          }
          break;

          // checking board for any remaining factors
          case(2):
          if(gameState.number % (board.get(i,j)) === 0) {
            return false;
          }
          break;

          // checking board for any remaining primes
          case(3):
          if(isPrime(board.get(i, j)) === true) {
            return false;
          }
          break;
        }
      }
    }
  }
  alert("Level complete!");
  return true;
}

// handle movement and manipulation of xPos and yPos of gameState
// handle manipulating the DOM to move character around / replace values that he moves off of
function move(direction) {
  switch(direction) {
    case("l"):
      if(gameState.yPos != 0) {
      gameState.yPos -= 1;
      replaceDiv(gameState.xPos + "_" + gameState.yPos);
      fixDiv((gameState.xPos + "_" + (gameState.yPos + 1)), (board.get(gameState.xPos, (gameState.yPos + 1))));
      }
      break;
    case("r"):
      if(gameState.yPos != 4) {
      gameState.yPos += 1;
      replaceDiv(gameState.xPos + "_" + gameState.yPos);
      fixDiv((gameState.xPos + "_" + (gameState.yPos - 1)), (board.get(gameState.xPos,(gameState.yPos - 1))));
      }
      break;
    case("u"):
      if(gameState.xPos != 0) {
      gameState.xPos -= 1;
      replaceDiv(gameState.xPos + "_" + gameState.yPos);
      fixDiv(((gameState.xPos + 1 ) + "_" + gameState.yPos), (board.get((gameState.xPos + 1 ), gameState.yPos)));
      }
      break;
    case("d"):
      if(gameState.xPos != 5) {
      gameState.xPos += 1;
      replaceDiv(gameState.xPos + "_" + gameState.yPos);
      fixDiv(((gameState.xPos - 1 ) + "_" + gameState.yPos), (board.get((gameState.xPos + - 1 ), gameState.yPos)));
      }
      break;
  }
}

// function to check for primes in prime game mode
function isPrime(value) {
  for (let i = 2; i < value; i++) {
    if (value % i === 0) {
      return false;
    }
  }
  return true;
}

// handle gameOver when lives hits 0
function gameOver() {
  let input = prompt("Game over!  Your score is " +gameState.score+ " -- great job!  Would you like to play again? (y/n)");
  if (input === "y") {
    gameState.level = 0;
    gameState.score = 0;
    gameState.lives = 4;
    newGame();
  }
  if (input === "n") {
    location.reload();
  }
}
