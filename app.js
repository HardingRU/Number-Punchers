

// the initial game state, number represents the number you are finding multiples of.
// number should be randomly set as part of board creation
// gameType is multiples (1), factors (2), and prime (3)

// ****NOTE TO SELF do I need to ever pass the gameState to other functions, or can I just reference this one?
let gameState = {
  level: 0,
  score: 0,
  lives: 4,
  number: 2,
  gameType: 3,
  xPos: 0,
  yPos: 0
}

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

// create first board
let $start = $("#startButton");
let board;
$start.on('click', function(){
  board = newGame(gameState);
  $("#startButton").remove();
  $("#instructButton").remove();
  $("#intro").remove();
})

// this runs to create a new game board on level completion
function newGame(state) {
  gameState = state;
  gameState.level += 1;
  gameState.xPos = 0;
  gameState.yPos = 0;
  let board = createBoard();
  return board;
}


// this function creates a new gameboard
function createBoard() {
  let board = new Gameboard(6, 5);
  for (let i = 0; i <= board.width; i++) {
    for (let j = 0; j <= board.height; j++) {
      board.set(i, j, randInt());
    }
  }
  placeBoard(board);
  return board;
}

// write board to the dom
function placeBoard(board) {
    $("header").append("<h1 class=heading>Find all of the Prime Numbers!</h1>");
    $("header").append("<h2 class=levels>Level: " + gameState.level + "</h2>");
    $("footer").append("<span id=score>Score: " + gameState.score + "</span> <span id=lives>Lives: " + gameState.lives + "</span>");
    for (let i = 0; i < 6; i++) {

      $("main").append("<article id=art"+i+">");
      for (let j = 0; j < 5; j++) {
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
  //console.log(num);
  $("#"+id+" > img").remove();
  $("#"+id).text("" + num);
  $("#"+id).css("padding","42px 0 42px 0");
}


// this function creates random integers, and is used to create the board
function randInt() {
  randDec = Math.random();
  randWhole = Math.floor(randDec * 20) + 1;
  return randWhole;
}

// this function is called when the user munchers a number, to see if it is correct or not
function checkAnswer(state, inboard) {
  let answer = board.get(state.xPos, state.yPos);
  console.log(answer);
  // checking for empty space, nothing should happen here
  if (answer === null) {
    return;
  }

  // logic to proceed on correct answer
  switch(state.gameType) {
    // check answer against multiple algorithm
    case(1):
    if (answer % state.number === 0) {
      state.score += 50;
      board.set(state.xPos, state.yPos, "");
      let levelClear = checkBoard(state, inboard);
      // if the game is over create a new level
      if(levelClear === true) {
        newGame(state);
      }
    }
    // logic to proceed on wrong answer
    else {
      wrongAnswer();
    }
    break;

    // check answer against factor algorithm
    case(2):
    if (state.number % answer === 0) {
      state.score += 50;
      board.set(state.xPos, state.yPos, null);
      let levelClear = checkBoard(state, inboard);
      // if the game is over create a new level
      if(levelClear === true) {
        newGame(state);
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
      console.log(board.get(gameState.xPos, gameState.yPos));
      let levelClear = checkBoard(state, inboard);
      // if the game is over create a new level
      if(levelClear === true) {
      //  newGame(state);
      }
    }
    else {
      wrongAnswer();
    }
    break;
  }

  gameState = state;
  board = inboard;
  return;
}

function wrongAnswer() {
  gameState.lives -= 1;
  $("#lives").text("Lives: " + gameState.lives);
  alert("incorrect answer!");
  if(gameState.lives === 0) {
    alert("Sorry, game over!");
    // ****** create a fuction here to deal with game over (do this)
    return;
  }
}
// this function is called when user munchers correct number, to see if they have beaten the level
function checkBoard(state, inboard) {
  for(let i = 0; i <= board.width; i++) {
    for(let j = 0; j <= board.height; j++) {
      switch(state.gameType) {
        // checking board for any remaining multiples
        case(1):
        if(board.get(state.xPos,state.yPos) % state.number === 0) {
          return false;
        }
        break;

        // checking board for any remaining factors
        case(2):
        if(state.number % (board.get(state.xPos,state.yPos)) === 0) {
          return false;
        }
        break;

        // checking board for any remaining primes
        case(3):
        if(isPrime(board.get(state.xPos, state.yPos)) === false){
          return false;
        }
        break;
      }
    }
  }
  return true;
}

// handle movement and manipulation of xPos and yPos of gameState
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
      console.log(board.get(gameState.xPos, gameState.yPos - 1));
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

function isPrime(value) {
  for (let i = 2; i < value; i++) {
    if (value % i === 0) {
      return false;
    }
  }
  return true;
}

function rightAnswer() {

}
