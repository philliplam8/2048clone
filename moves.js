class Tile {
  constructor(value, position) {
    this.value = value;
    this.position = position;
  }
}


// Method 1: Manipulate DOM
/* -------------------------------
TODO:
1. [x] single moves go to edge
2. Edge Cases (TBD)
- Obstacles...
--> [x] If Wall (do nothing)
--> Else (Another Tile)...
----> If same value, merge
----> [x] else, do nothing
3. Use RNG to create new 2 pieces
4. Win condition
5. Lose condition (will be hard)
5. Scoring
6. Undo?

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
function myMove(direction) {
  var movingPiecesList = document.querySelectorAll("#animate"); // Get all moving pieces
  var numMovingPieces = movingPiecesList.length; // Number of moving piece

  if (direction == "Down" || direction == "Right") {

    for (i = numMovingPieces - 1; i >= 0; i--) { // One action will move every piece
      var currentCell = movingPiecesList[i].parentElement; // Position of the moving piece on the board
      while (isFreeToMove(currentCell, direction)) {
        currentCell = nextCell(currentCell, direction)
      }
      currentCell.appendChild(movingPiecesList[i]);

      if (isNextToTile(currentCell, direction)) {
        console.log("check if merge is possible");
        if (isNextTileSame(currentCell, direction)) {
          console.log("merge possible");

          let mergedTile = new Tile("4", nextCell(currentCell, direction)); //TODO
          // need to remove tiles

        } else {
          console.log("cannot merge");
        }
      }
    }

  } else { // (direction == "Up" || direction == "Left")

    for (i = 0; i < numMovingPieces; i++) {
      var currentCell = movingPiecesList[i].parentElement;
      while (isFreeToMove(currentCell, direction)) {
        currentCell = nextCell(currentCell, direction)
      }
      currentCell.appendChild(movingPiecesList[i]);

      if (isNextToTile(currentCell, direction)) {
        console.log("check if merge is possible");
        if (isNextTileSame(currentCell, direction)) {
          console.log("merge possible");

        } else {
          console.log("cannot merge");
        }
      }

    }
  }
}

// Method 2: Use relative positioning
function myMove2() {
  var id = null;
  var elem = document.getElementById("animate");
  var pos = 0;
  clearInterval(id); //clears timer
  id = setInterval(frame, 5);

  function frame() {
    if (pos == 400) {
      clearInterval(id);
    } else {
      pos++
      elem.style.left = pos + "px";
    }
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
  console.log(result);
  return result;
}

function createTile() { // add parameters later "value, position"
  const testValue = "2";
  var allCellsList = document.querySelectorAll(".cell");
  var filledCellsList = document.querySelectorAll(".filled"); // Currently there is no need for any "filled" related thing anymore (FLAWED == doesn't account for movement)
  var emptyCellsList = [];

  for (i = 0; i < 16; i++) {
    if (allCellsList[i].childElementCount == 0) {
      emptyCellsList.push(allCellsList[i]);
    }
  }

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
  testPosition.setAttribute("class", testPosition.getAttribute("class") + " filled");
  return newTile;

}

function removeFilledAttribute(currentCell) {
  var classAttribute = currentCell.getAttribute("class");
  const total = classAttribute.length;
  var newClassAttribute = classAttribute.substring(0, total - 7);
  currentCell.setAttribute("class", newClassAttribute);
  return;
}

function removeCurrentTile(currentCell) {
  removeFilledAttribute(currentCell);
  currentCell.firstElementChild.remove();
}

function removeNextTile(currentCell, direction) {
  removeFilledAttribute(nextCell(currentCell, direction));
  nextCell(currentCell, direction).firstElementChild.remove();
}

function resetBOM() { //
  window.location.reload(); // reload the page from cache
}

// Detect arrow keys
window.addEventListener("keydown", function(event) {
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
      //myMove()
      myMove("Down");
      createTile();
      break;

    case "ArrowUp":
    case "KeyW":
      // Do something for "up arrow" or "W" key press
      myMove("Up");
      createTile();
      break;

    case "ArrowLeft":
    case "KeyA":
      // Do something for "Left arrow" or "A" key press
      myMove("Left");
      createTile();
      break;

    case "ArrowRight":
    case "KeyD":
      // Do something for "Right arrow" or "D" key press
      myMove("Right");
      createTile();
      break;

    default:
      return; // Quit when this doesn't handle a key event
  }

  // Cancel the default acttion to avoid it being handled twice
  event.preventDefault();
}, true);
