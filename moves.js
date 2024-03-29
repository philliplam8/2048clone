class Tile {
  constructor(value, position) {
    this.value = value;
    this.position = position;
  }
}

const devmode = document.getElementById("devmode");

// Method 1: Manipulate DOM
/* -------------------------------
TODO:
1. [x] single moves go to edge
2. Edge Cases (TBD)
- Obstacles...
--> [x] If Wall (do nothing)
--> Else (Another Tile)...
----> [x] If same value, merge
----> [x] else, do nothing
3. [x] Use RNG to create new 2 pieces
-> [x] Start game with random 2's
-> [x] limit createTile logic if there are no more possible moves (needs to be before/during while loop)
-> limit merge logic (16 8 8 in a row, hit right)
4. [x] Win condition
5. [x] Lose condition (will be hard)
6. Animate movements 
-> [x] new tiles
-> [x] merging
-> moving tiles across board 
7. Refactor to use a Tile Class structure 
8. Scoring
- any tile that is removed, add the value of the tile to the score
9. Undo?
10. [x] Mobile support
11. Dark Theme button

If direction... (check wall first tho)
- Right, plus 1
- Left, minus 1
- Down, plus 4
- Up, minus 4

[x] Instead of using a loop to go through actions UP and Down, rename all the
cell id's by a single Number

[x] you can use the JS function parseInt() to convert STR -> INT

and then you can generalize movements using
document.getElementById("gameCells").children[0] etc.

[x] REFACTOR and make function isNextCellEmpty do more heavy lifting
*/
var movesThisTurn;

function moveAllPieces(direction) {
  movesThisTurn = 0;
  var movingPiecesList = document.querySelectorAll("#animate"); // Get all moving pieces
  var numMovingPieces = movingPiecesList.length; // Number of moving piece

  switch (direction) {
    case ("Down"):
    case ("Right"):
      for (i = numMovingPieces - 1; i >= 0; i--) { // Loop through each tile on the board
        var currentCell = movingPiecesList[i].parentElement; // Position of the moving piece on the board
        moveOnePiece(movingPiecesList[i], currentCell, direction);
      }

    case ("Up"):
    case ("Left"):
      for (i = 0; i < numMovingPieces; i++) { // Loop through each tile on the board
        var currentCell = movingPiecesList[i].parentElement; // Position of the moving piece on the board
        moveOnePiece(movingPiecesList[i], currentCell, direction);
      }
  }

  // Only create new tile if at least 1 tile has moved
  if (movesThisTurn !== 0) {
    createTile();
  }

  // Check for lose condition
  if (!document.querySelector(".tile--twozerofoureight")) {
    loseCondition(); // must go after createTile() for scenario where board needs 1 more to be full & loses;
  }
}

function moveOnePiece(movingPiece, currentCell, direction) {
  const initialPosition = currentCell;
  while (isFreeToMove(currentCell, direction)) {
    currentCell = nextCell(currentCell, direction) // Find position in furthest direction
  }
  // NEW ANIMATION CODE ***********************
  // by now, currentCell is the destination
  //
  /*
  var destination = currentCell;
  var tileDistance = Math.abs(destination.getBoundingClientRect().y - movingPiece.parentElement.getBoundingClientRect().y);
  const oneUnit = currentCell.getBoundingClientRect().height;
  var id;
  var pos = 0;
  clearInterval(id);
  id = setInterval(frame, 10);

  function frame() {
    if (pos >= tileDistance) { // Exit condition
      clearInterval(id);
      movingPiece.style.top = 0;
      currentCell.appendChild(movingPiece); // place in destination

    } else {
      //pos ++;
      pos += (oneUnit * 0.25); // move fast
      movingPiece.style.top = pos + 'px';
    }
  }
*/
  // ******************************************
  // To revert, uncomment the next line and remove the same line from the if loop above
  currentCell.appendChild(movingPiece); // currentCell is now the destination of the moving tile

  // If merge is possible, merge tiles
  if (isNextToTile(currentCell, direction)) {
    if (isNextTileSame(currentCell, direction)) {
      mergeTile(currentCell, direction);
    }
  }

  // Detect if successful tile move was made
  if (initialPosition !== currentCell) {
    movesThisTurn++;
  }
}

// cell is the html object of the cell positioning
// direction is the user input value
function hasEdge(currentCell, direction) {
  const edgeDown = "edge-down";
  const edgeUp = "edge-up";
  const edgeLeft = "edge-left";
  const edgeRight = "edge-right";
  var cellEdge;

  switch (direction) {
    case "Down":
      cellEdge = edgeDown;
      break;
    case "Up":
      cellEdge = edgeUp;
      break;
    case "Left":
      cellEdge = edgeLeft;
      break;
    case "Right":
      cellEdge = edgeRight;
      break;
  }
  return $(currentCell).hasClass(cellEdge); // use jQuery hasClass() method
}

function nextCell(currentCell, direction) {
  var result;

  switch (direction) {
    case "Down":
      result = document.getElementById(parseInt(currentCell.id) + 4);
      break;
    case "Up":
      result = document.getElementById(parseInt(currentCell.id) - 4);
      break;
    case "Right":
      result = currentCell.nextElementSibling;
      break;
    case "Left":
      result = currentCell.previousElementSibling;
      break;
  }
  return result;
}

function isNextCellEmpty(currentCell, direction) {
  var result = nextCell(currentCell, direction);
  return (result.childElementCount) ? false : true; // Ternary (conditional operator)
}

function isFreeToMove(currentCell, direction) {
  return hasEdge(currentCell, direction) == false && isNextCellEmpty(currentCell, direction);
}

function isNextToTile(currentCell, direction) {
  return hasEdge(currentCell, direction) == false && isNextCellEmpty(currentCell, direction) == false;
}

function isNextTileSame(currentCell, direction) {
  var result = currentCell.firstElementChild.innerHTML == nextCell(currentCell, direction).firstElementChild.innerHTML;
  return result;
}

function areNeighboursSame(currentCell) {
  if (!currentCell.classList.contains("edge-down")) {
    if (isNextTileSame(currentCell, "Down")) {
      return true;
    }
  }
  if (!currentCell.classList.contains("edge-up")) {
    if (isNextTileSame(currentCell, "Up")) {
      return true;
    }
  }
  if (!currentCell.classList.contains("edge-left")) {
    if (isNextTileSame(currentCell, "Left")) {
      return true;
    }
  }
  if (!currentCell.classList.contains("edge-right")) {
    if (isNextTileSame(currentCell, "Right")) {
      return true;
    }
  }

  return false;
}

function createTile() { // add parameters later "value, position"
  const testValue = "2";
  var allCellsList = document.querySelectorAll(".cell");
  var emptyCellsList = [];

  for (i = 0; i < 16; i++) {
    if (allCellsList[i].childElementCount == 0) {
      emptyCellsList.push(allCellsList[i]);
    }
  }

  // Randomized Position for New Tile
  var testRNG = Math.floor(Math.random() * emptyCellsList.length);
  var testPosition = emptyCellsList[testRNG];

  // Create the Tile Element
  var newTile = document.createElement("div")

  // Set Attributes to Element
  newTile.innerHTML = testValue;
  newTile.setAttribute("id", "animate");
  newTile.setAttribute("class", "col tile--two");

  // Insert Tile In
  testPosition.appendChild(newTile);

  // Animation
  anime({
    targets: newTile,

    // Properties
    scale: [0, 1],
    borderRadius: {
      value: 5,
      duration: 500
    },
    duration: 300,
    easing: 'linear'
  })

  return newTile;
}

function mergeTile(currentCell, direction) {
  // need to add tile in the position of nextTile
  // need to remove currentTile and nextTile
  var currentTile = currentCell.firstElementChild;

  // Create the Tile Element
  var newTile = document.createElement("div");
  newTile.setAttribute("id", "animate");
  var unmergedTileValue = currentTile.innerHTML;
  var mergedTileValue = (parseInt(unmergedTileValue) * 2).toString();
  newTile.innerHTML = mergedTileValue;

  switch (mergedTileValue) {
    case "4":
      newTile.setAttribute("class", "col tile--four");
      break;
    case "8":
      newTile.setAttribute("class", "col tile--eight");
      break;
    case "16":
      newTile.setAttribute("class", "col tile--onesix");
      break;
    case "32":
      newTile.setAttribute("class", "col tile--threetwo");
      break;
    case "64":
      newTile.setAttribute("class", "col tile--sixfour");
      break;
    case "128":
      newTile.setAttribute("class", "col tile--onetwoeight");
      break;
    case "256":
      newTile.setAttribute("class", "col tile--twofivesix");
      break;
    case "512":
      newTile.setAttribute("class", "col tile--fiveonetwo");
      break;
    case "1024":
      newTile.setAttribute("class", "col tile--onezerotwofour");
      break;
    case "2048":
      newTile.setAttribute("class", "col tile--twozerofoureight");
      winCondition();
      break;
  }

  nextCell(currentCell, direction).appendChild(newTile);
  removeCurrentTile(currentCell);
  removeNextTile(currentCell, direction);

  // Animation: Keep merged tiles rounded square shaped & highlight action
  anime({
    targets: newTile,
    borderRadius: [0, 5],
    scale: {
      value: [1.2, 1],
      duration: 500,
      easing: 'easeInOutQuart'
    }
  })
}

function removeCurrentTile(currentCell) {
  currentCell.firstElementChild.remove();
}

function removeNextTile(currentCell, direction) {
  nextCell(currentCell, direction).firstElementChild.remove();
}

function resetBOM() { //
  window.location.reload(); // reload the page from cache
}

// User chooses to restart game
function restartGame(decision) {
  document.getElementById("overlayText").innerHTML = "Are you sure?";
  document.getElementById("overlay").style.display = "block";
  var restartButtonsList = document.querySelectorAll(".overlayRestartButton");
  for (i = 0; i < restartButtonsList.length; i++) {
    restartButtonsList[i].style.display = "block"; // Turn On Overlay
  }
  if (decision) {
    document.getElementById("overlay").style.display = "none";
  }
}

function winCondition() {
  var overlayScreen = document.getElementById("overlay");
  var overlayText = document.getElementById("overlayText");
  var playAgainButton = document.getElementById("overlayPlayAgainButton");
  overlayText.innerHTML = "You Win!";
  playAgainButton.style.display = "block";
  overlayScreen.style.display = "block"; // Turn On Overlay
}

function loseCondition() {
  // Only run if all cells are filled
  // Lose if there is no neighbour with the same value

  // Check if all cells are filled
  var isGameOver;
  var isBoardFull;
  var allCellsList = document.querySelectorAll(".cell");

  for (i = 0; i < 16; i++) {
    if (allCellsList[i].childElementCount == 0) { // check if each cell has a tile
      isBoardFull = false;
      return false; // Stop the loop, we found empty cell. Impossible to lose
    }
  }

  isBoardFull = true;

  // Check if there are any neighbours with same value
  if (isBoardFull) {
    for (i = 0; i < 16; i++) {
      var currentCell = allCellsList[i];
      // TODO : cannot do the following since there are edges (rewrite a more robust neightbours check)
      if (areNeighboursSame(currentCell)) {
        isGameOver = false;
        return false;
      }
    } isGameOver = true;
  }


  if (isGameOver) {
    var overlayScreen = document.getElementById("overlay");
    var overlayText = document.getElementById("overlayText");
    var playAgainButton = document.getElementById("overlayPlayAgainButton");
    overlayText.innerHTML = "Game Over!";
    playAgainButton.style.display = "block";
    overlayScreen.style.display = "block"; // Turn On Overlay
  }
}

// Start game
window.onload = function () {
  createTile();
  createTile();
}

// Detect keyboard arrow keys
window.addEventListener("keydown", function (event) {

  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }

  switch (event.code) {

    case "Escape":
      resetBOM();
      break;

    case "ArrowDown":
    case "KeyS":
      // Do something for "down arrow" or "S" key press
      //moveAllPieces()
      moveAllPieces("Down");
      break;

    case "ArrowUp":
    case "KeyW":
      // Do something for "up arrow" or "W" key press
      moveAllPieces("Up");
      break;

    case "ArrowLeft":
    case "KeyA":
      // Do something for "Left arrow" or "A" key press
      moveAllPieces("Left");
      break;

    case "ArrowRight":
    case "KeyD":
      // Do something for "Right arrow" or "D" key press
      moveAllPieces("Right");
      break;

    default:
      return; // Quit when this doesn't handle a key event
  }

  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
}, true);

// Detect mobile swipe gestures
var initialX;
var initialY;

function touchStart(event) {
  initialX = event.touches[0].clientX;
  initialY = event.touches[0].clientY;
  //document.getElementById("initial").innerHTML = "Press Down at " + initialX + ", " + initialY;
}

function touchMove(event) {
  var x = event.touches[0].clientX;
  var y = event.touches[0].clientY;

  //document.getElementById("position").innerHTML = x + ", " + y;

  var xDist = Math.abs(x - initialX);
  var yDist = Math.abs(y - initialY);

  if (xDist > yDist) {
    if (initialX < x) { // Right
      //document.getElementById("direction").innerHTML = "RIGHT";
      moveAllPieces("Right");
    } else { // Left
      //document.getElementById("direction").innerHTML = "LEFT";
      moveAllPieces("Left");
    }
  } else {
    if (initialY < y) { // Down
      //document.getElementById("direction").innerHTML = "DOWN";
      moveAllPieces("Down");
    } else { // Up
      //document.getElementById("direction").innerHTML = "UP";
      moveAllPieces("Up");
    }
  }
}

function toggleDevMode() {
  // enable Add Tile and Reset buttons
  const DEV_MODE_ELEMENTS = document.getElementsByClassName("devmode");
  for (let i = 0; i < DEV_MODE_ELEMENTS.length; i++) {
    let isVisible = DEV_MODE_ELEMENTS[i].style.visibility;
    if (isVisible == "visible") {
      DEV_MODE_ELEMENTS[i].style.visibility = "hidden";
    } else {
      DEV_MODE_ELEMENTS[i].style.visibility = "visible";
    }
  }
}

document.addEventListener('touchstart', touchStart, false);
document.addEventListener('touchmove', touchMove, false);